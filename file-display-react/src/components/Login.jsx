// Login.jsx
import React, { useState } from "react";

export default function Login({ onLogin }) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [erro, setErro] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        if (username === "" && password === "") { //adicione um username e password para o admin
            onLogin(true);
        } else {
            setErro("Usuário ou senha inválidos");
        }
    };

    return (
        <div style={{ display: "flex", height: "100vh", justifyContent: "center", alignItems: "center", backgroundColor: "#1e1e1e", color: "#fff" }}>
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                <h2>Login</h2>
                <input
                    type="text"
                    placeholder="Usuário"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
                <input
                    type="password"
                    placeholder="Senha"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button type="submit">Entrar</button>
                {erro && <span style={{ color: "red" }}>{erro}</span>}
            </form>
        </div>
    );
}
