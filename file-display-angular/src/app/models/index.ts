export interface Arquivo {
  nome: string;
  caminho: string;
  tipo: string;
}

export interface Pasta {
  nome: string;
  caminho: string;
}

export interface Subpasta {
  nome: string;
  caminho: string;
  arquivos: Arquivo[];
}

export interface FileChecked {
  PastaPrincipal: string;
  Tipo: string;
  ArquivoOuSubpasta: string;
  Subpasta: string;
}

export interface AssistidoResponse {
  message: string;
}
