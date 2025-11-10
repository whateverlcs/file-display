import React from "react";
import { Worker, Viewer as PDFViewer } from "@react-pdf-viewer/core";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";
import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";

export default function Viewer({ file }) {
    if (!file) return <div>Selecione um arquivo para visualizar</div>;

    const url = `${process.env.REACT_APP_API_URL}${file.caminho}`;
    const defaultLayoutPluginInstance = defaultLayoutPlugin({
        sidebarTabs: () => [], 
    });

    if (file.tipo === "pdf") {
        return (
            <div style={{ width: "100%", height: "100%", display: "flex" }}>
                <Worker workerUrl="/pdf.worker.min.js">
                    <PDFViewer
                        fileUrl={url}
                        plugins={[defaultLayoutPluginInstance]}
                        theme="dark"
                    />
                </Worker>
            </div>
        );
    }

    if (file.tipo === "video") {
        return (
            <video key={url} controls style={{ width: "100%", height: "100%" }}>
                <source src={url} type={`video/${file.caminho.split(".").pop()}`} />
                Seu navegador não suporta vídeo.
            </video>
        );
    }

    return null;
}
