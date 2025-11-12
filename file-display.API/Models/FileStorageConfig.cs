namespace filedisplay.API.Models
{
    public class FileStorageConfig
    {
        public List<string> ContentFolders { get; set; } = new();

        // Propriedade calculada que extrai as raízes únicas das pastas de conteúdo
        public List<RootPathConfig> RootPaths
        {
            get
            {
                var rootPaths = new List<RootPathConfig>();

                foreach (var folder in ContentFolders)
                {
                    var rootPath = ExtractRootPath(folder);

                    if (!string.IsNullOrEmpty(rootPath) &&
                        !rootPaths.Any(r => r.PhysicalPath.Equals(rootPath, StringComparison.OrdinalIgnoreCase)))
                    {
                        var driveLetter = Path.GetPathRoot(rootPath)?.TrimEnd('\\', ':');
                        var urlPrefix = $"/arquivos/{driveLetter?.ToLower()}";

                        rootPaths.Add(new RootPathConfig
                        {
                            PhysicalPath = rootPath,
                            UrlPrefix = urlPrefix,
                            DriveLetter = driveLetter ?? ""
                        });
                    }
                }

                return rootPaths;
            }
        }

        private string ExtractRootPath(string fullPath)
        {
            var directories = fullPath.Split('\\');
            if (directories.Length >= 3) // Tem pelo menos drive + 2 pastas
            {
                // Pega drive + primeira pasta
                return string.Join('\\', directories.Take(3)) + "\\";
            }

            return Path.GetDirectoryName(fullPath) + "\\";
        }
    }

    public class RootPathConfig
    {
        public string PhysicalPath { get; set; } = string.Empty;
        public string UrlPrefix { get; set; } = string.Empty;
        public string DriveLetter { get; set; } = string.Empty;
    }
}