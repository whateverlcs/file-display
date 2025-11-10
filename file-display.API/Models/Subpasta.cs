namespace filedisplay.API.Models
{
    public class Subpasta
    {
        public string Nome { get; set; }
        public string Caminho { get; set; }
        public List<Arquivo> Arquivos { get; set; }
    }
}
