using filedisplay.API.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using System.IO;

namespace filedisplay.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class FilesController : ControllerBase
    {
        private readonly FileStorageConfig _config;

        public FilesController(IOptions<FileStorageConfig> config)
        {
            _config = config.Value;
        }

        private string[] pastasPrincipais => _config.ContentFolders.ToArray();

        [HttpPost("mark-assistido")]
        public async Task<IActionResult> MarkAssistido([FromBody] AssistidoRequest request)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(request.PastaPrincipal))
                    return BadRequest("Pasta principal não informada.");

                var pastaPrincipal = pastasPrincipais
                    .FirstOrDefault(p =>
                        p.Equals(request.PastaPrincipal, StringComparison.OrdinalIgnoreCase));

                if (pastaPrincipal == null)
                    return BadRequest("Pasta principal inválida.");

                string nomeParaSalvar;
                if (request.Tipo?.ToLower() == "video")
                    nomeParaSalvar = request.ArquivoOuSubpasta;
                else
                    nomeParaSalvar = request.Subpasta;

                if (string.IsNullOrEmpty(nomeParaSalvar))
                    return BadRequest("Nome inválido para salvar.");

                var caminhoTxt = Path.Combine(pastaPrincipal, "assistidos.txt");

                if (!System.IO.File.Exists(caminhoTxt))
                {
                    using (var stream = System.IO.File.Create(caminhoTxt)) { }
                }

                await System.IO.File.AppendAllTextAsync(caminhoTxt, nomeParaSalvar + System.Environment.NewLine);

                return Ok(new { message = "Marcado como assistido com sucesso." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Erro ao salvar: {ex.Message}");
            }
        }

        [HttpGet("pastas")]
        public IActionResult GetPastasPrincipais()
        {
            var pastas = pastasPrincipais.Select(p => new
            {
                Nome = Path.GetFileName(p),
                Caminho = p
            });

            return Ok(pastas);
        }

        [HttpGet("subpastas")]
        public IActionResult GetSubpastas([FromQuery] string pastaPrincipal)
        {
            if (!Directory.Exists(pastaPrincipal))
                return BadRequest("Pasta principal não existe.");

            var subpastas = Directory.GetDirectories(pastaPrincipal)
                .Select(sub => CriarSubpastaComArquivos(sub))
                .ToList();

            // Adiciona arquivos da pasta principal (raiz) como uma subpasta especial
            var arquivosDaRaiz = Directory.GetFiles(pastaPrincipal, "*.*")
                .Where(f => f.EndsWith(".pdf") || f.EndsWith(".mp4") || f.EndsWith(".mov") || f.EndsWith(".avi"))
                .Select(f => CriarArquivo(f))
                .ToList();

            if (arquivosDaRaiz.Any())
            {
                subpastas.Insert(0, new Subpasta
                {
                    Nome = "(Raiz)",
                    Caminho = pastaPrincipal,
                    Arquivos = arquivosDaRaiz
                });
            }

            return Ok(subpastas);
        }

        // Função auxiliar para criar subpasta
        private Subpasta CriarSubpastaComArquivos(string sub)
        {
            var arquivos = Directory.GetFiles(sub, "*.*", SearchOption.AllDirectories)
                .Where(f => f.EndsWith(".pdf") || f.EndsWith(".mp4") || f.EndsWith(".mov") || f.EndsWith(".avi"))
                .Select(f => CriarArquivo(f))
                .ToList();

            return new Subpasta
            {
                Nome = Path.GetFileName(sub),
                Caminho = sub,
                Arquivos = arquivos
            };
        }

        private Arquivo CriarArquivo(string filePath)
        {
            string urlPrefix = "/";
            string rootPath = Path.GetDirectoryName(filePath) + "\\";

            // Encontra a raiz configurada que corresponde ao arquivo
            var matchingRoot = _config.RootPaths
                .FirstOrDefault(r => filePath.StartsWith(r.PhysicalPath, StringComparison.OrdinalIgnoreCase));

            if (matchingRoot != null)
            {
                urlPrefix = matchingRoot.UrlPrefix + "/";
                rootPath = matchingRoot.PhysicalPath;
            }

            string caminhoPublico = urlPrefix + filePath.Substring(rootPath.Length).Replace("\\", "/");

            return new Arquivo
            {
                Nome = Path.GetFileName(filePath),
                Caminho = caminhoPublico,
                Tipo = Path.GetExtension(filePath).ToLower() == ".pdf" ? "pdf" : "video"
            };
        }
    }
}
