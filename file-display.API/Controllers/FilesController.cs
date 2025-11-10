using Microsoft.AspNetCore.Mvc;
using filedisplay.API.Models;
using System.IO;

namespace filedisplay.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class FilesController : ControllerBase
    {
        // Definição das pastas principais, podem ser varias, dentro de dois caminhos fixos
        private readonly string[] pastasPrincipais = new string[]
        {
            @"",
        };

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

        // Função auxiliar para criar objeto Arquivo
        private Arquivo CriarArquivo(string f)
        {
            string urlPrefix;
            string rootPath;

            // é verificado duas pastas principais
            if (f.StartsWith(@"", StringComparison.OrdinalIgnoreCase)) //pasta principal 1
            {
                urlPrefix = ""; //prefixo de URL para acessar arquivos dessa pasta, como é disco D: então o prefixo é /arquivos/d/
                rootPath = @""; //pasta principal 1
            }
            else if (f.StartsWith(@"", StringComparison.OrdinalIgnoreCase)) //pasta principal 2
            {
                urlPrefix = ""; //prefixo de URL para acessar arquivos dessa pasta, como é disco E: então o prefixo é /arquivos/e/
                rootPath = @""; //pasta principal 2
            }
            else
            {
                urlPrefix = "/";
                rootPath = Path.GetDirectoryName(f) + "\\";
            }

            string caminhoPublico = urlPrefix + f.Substring(rootPath.Length).Replace("\\", "/");

            return new Arquivo
            {
                Nome = Path.GetFileName(f),
                Caminho = caminhoPublico,
                Tipo = Path.GetExtension(f).ToLower() == ".pdf" ? "pdf" : "video"
            };
        }
    }
}
