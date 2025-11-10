import React, { useEffect, useState } from "react";

export default function FolderSelector({ onSelectPastaPrincipal, onSelectSubpasta }) {
  const [pastas, setPastas] = useState([]);
  const [subpastas, setSubpastas] = useState([]);
  const [pastaSelecionada, setPastaSelecionada] = useState("");
  const [subpastaSelecionada, setSubpastaSelecionada] = useState("");

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/api/files/pastas`)
      .then(res => res.json())
      .then(data => setPastas(data))
      .catch(err => console.error("Erro ao carregar pastas:", err));
  }, []);

  const handlePastaChange = (e) => {
    const pasta = pastas.find(p => p.caminho === e.target.value);
    setPastaSelecionada(e.target.value);
    setSubpastas([]);
    setSubpastaSelecionada("");
    onSelectPastaPrincipal(pasta);   
    onSelectSubpasta(null);           

    if (pasta) {
      fetch(`${process.env.REACT_APP_API_URL}/api/files/subpastas?pastaPrincipal=${encodeURIComponent(pasta.caminho)}`)
        .then(res => res.json())
        .then(data => setSubpastas(data))
        .catch(err => console.error("Erro ao carregar subpastas:", err));
    }
  };

  const handleSubpastaChange = (e) => {
    const subpasta = subpastas.find(s => s.caminho === e.target.value);
    setSubpastaSelecionada(e.target.value);
    onSelectSubpasta(subpasta);  
  };

  return (
    <div style={{ marginBottom: "20px" }}>
      <select onChange={handlePastaChange} value={pastaSelecionada}>
        <option value="">Selecione a pasta principal</option>
        {pastas.map(p => (
          <option key={p.caminho} value={p.caminho}>{p.nome}</option>
        ))}
      </select>

      {subpastas.length > 0 && (
        <select
          style={{ marginLeft: "10px" }}
          onChange={handleSubpastaChange}
          value={subpastaSelecionada}
        >
          <option value="">Selecione a subpasta</option>
          {subpastas.map(s => (
            <option key={s.caminho} value={s.caminho}>{s.nome}</option>
          ))}
        </select>
      )}
    </div>
  );
}
