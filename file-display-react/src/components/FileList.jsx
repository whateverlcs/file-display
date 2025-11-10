import React from "react";

export default function FileList({ subpasta, onSelectFile }) {
  if (!subpasta || !subpasta.arquivos.length) return null;

  return (
    <div style={{ marginBottom: "20px" }}>
      <h3>Arquivos:</h3>
      <ul>
        {subpasta.arquivos.map(file => (
          <li key={file.caminho} style={{ marginBottom: "5px" }}>
            <button onClick={() => onSelectFile(file)}>{file.nome}</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
