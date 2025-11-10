import React, { useState, useEffect } from "react";
import FolderSelector from "./components/FolderSelector";
import FileList from "./components/FileList";
import Viewer from "./components/Viewer";
import Login from "./components/Login";
import "./App.css";

function App() {
  const [autenticado, setAutenticado] = useState(() => {
    const saved = localStorage.getItem("autenticado");
    return saved === "true";
  });

  const [pastaPrincipalSelecionada, setPastaPrincipalSelecionada] = useState(null);
  const [subpastaSelecionada, setSubpastaSelecionada] = useState(null);
  const [arquivoSelecionado, setArquivoSelecionado] = useState(null);
  const [menuAberto, setMenuAberto] = useState(false);

  const handleToggleMenu = () => setMenuAberto(!menuAberto);

  useEffect(() => {
    localStorage.setItem("autenticado", autenticado);
  }, [autenticado]);

  const handleLogout = () => {
    setAutenticado(false);
    localStorage.removeItem("autenticado");
    setSubpastaSelecionada(null);
    setArquivoSelecionado(null);
    setPastaPrincipalSelecionada(null);
  };

  const handleAssistido = async () => {
    if (!pastaPrincipalSelecionada) {
      alert("Selecione uma pasta principal primeiro");
      return;
    }
  
    if (!arquivoSelecionado && !subpastaSelecionada) {
      alert("Selecione um arquivo ou subpasta");
      return;
    }
  
    const tipo = arquivoSelecionado?.tipo === "video" ? "video" : "pdf";
  
    const payload = {
      PastaPrincipal: pastaPrincipalSelecionada.caminho || pastaPrincipalSelecionada.nome,
      Tipo: tipo,
      ArquivoOuSubpasta: tipo === "video" ? arquivoSelecionado.nome : "",
      Subpasta: tipo === "pdf" ? subpastaSelecionada.nome : ""
    };
  
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/api/files/mark-assistido`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
  
      if (!res.ok) {
        const msg = await res.text();
        alert(`Erro ao salvar assistido: ${msg}`);
        return;
      }
  
      alert("Marcado como assistido!");
    } catch (err) {
      console.error(err);
      alert("Erro ao salvar assistido");
    }
  };

  if (!autenticado) {
    return <Login onLogin={setAutenticado} />;
  }

  return (
    <div className="app-container">
      <button className="hamburger-btn" onClick={handleToggleMenu}>
        ☰
      </button>

      <div className={`sidebar ${menuAberto ? "aberto" : "fechado"}`}>
        <h2 style={{ marginTop: "50px" }}>File Display</h2>

        <FolderSelector
          onSelectPastaPrincipal={setPastaPrincipalSelecionada}
          onSelectSubpasta={(subpasta) => {
            setSubpastaSelecionada(subpasta);
            setArquivoSelecionado(null);
          }}
        />

        <button className="btn-assistido" onClick={handleAssistido}>
          Marcar como Visto
        </button>

        <FileList
          subpasta={subpastaSelecionada}
          onSelectFile={setArquivoSelecionado}
        />

        <button className="btn-sair" onClick={handleLogout}>
          Sair
        </button>
      </div>

      {/* Viewer */}
      <div className="viewer-area">
        <Viewer file={arquivoSelecionado} />
      </div>
    </div>
  );
}

export default App;
