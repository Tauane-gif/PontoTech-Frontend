
import { useEffect, useState, type JSX } from "react";
import { useNavigate } from "react-router-dom";
import AparelhoRequests from "../../../fetch/AparelhoRequests";
import type { AparelhoDTO } from "../../../dto/AparelhoDTO";

interface DetalhesAparelhoProps {
    idAparelho: number;
}

function DetalhesAparelho({ idAparelho }: DetalhesAparelhoProps): JSX.Element {
    const [aparelho, setAparelho] = useState<AparelhoDTO | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (!idAparelho || isNaN(idAparelho)) {
            setError("ID do aparelho inválido.");
            setLoading(false);
            return;
        }

        async function buscarDados() {
            setLoading(true);
            setError(null);

            try {
                const dados = await AparelhoRequests.obterAparelhoPorId(idAparelho);

                if (dados) {
                    setAparelho(dados);
                } else {
                    setError("Aparelho não encontrado.");
                }
            } catch (err) {
                console.error("Erro ao carregar detalhes do aparelho:", err);
                setError("Ocorreu um erro ao buscar as informações do aparelho.");
            } finally {
                setLoading(false);
            }
        }

        buscarDados();
    }, [idAparelho]);

    if (loading) {
        return (
            <div style={{ minHeight: "100vh", backgroundColor: "#f3f4f6", display: "flex", alignItems: "flex-start", justifyContent: "center", padding: "40px 16px" }}>
                <div style={{ width: "100%", maxWidth: "900px" }}>
                    <div style={{ display: "flex", gap: "24px" }}>
                        <div style={{ width: "256px", backgroundColor: "#ffffff", borderRadius: "16px", height: "320px", flexShrink: 0 }} />
                        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "16px" }}>
                            <div style={{ backgroundColor: "#ffffff", borderRadius: "16px", height: "176px" }} />
                            <div style={{ backgroundColor: "#ffffff", borderRadius: "16px", height: "176px" }} />
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (error || !aparelho) {
        return (
            <div style={{ minHeight: "100vh", backgroundColor: "#f3f4f6", display: "flex", alignItems: "center", justifyContent: "center", padding: "16px" }}>
                <div style={{ backgroundColor: "#ffffff", borderRadius: "16px", padding: "40px", maxWidth: "400px", width: "100%", textAlign: "center" }}>
                    <h2 style={{ fontSize: "1.1rem", fontWeight: "bold", color: "#000000", marginBottom: "8px" }}>
                        Erro ao carregar aparelho
                    </h2>

                    <p style={{ fontSize: "0.875rem", color: "#999999", marginBottom: "24px" }}>
                        {error || "Erro desconhecido."}
                    </p>

                    <button
                        onClick={() => navigate("/lista/aparelhos")}
                        style={{ padding: "10px 24px", backgroundColor: "#ff7300", color: "#ffffff", border: "none", borderRadius: "10px", fontWeight: "bold", cursor: "pointer", fontSize: "0.875rem" }}
                    >
                        Voltar para a lista
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div style={{ minHeight: "100vh", backgroundColor: "#f3f4f6", padding: "32px 16px" }}>
            <div style={{ width: "100%", maxWidth: "900px", margin: "0 auto" }}>

                {/* Navegação */}
                <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "0.875rem", marginBottom: "24px" }}>
                    <button
                        onClick={() => navigate("/lista/aparelhos")}
                        style={{ color: "#ff7300", fontWeight: "600", background: "none", border: "none", cursor: "pointer", fontSize: "0.875rem" }}
                    >
                        Aparelhos
                    </button>

                    <span style={{ color: "#999999" }}>/</span>

                    <span style={{ color: "#666666", fontWeight: "500" }}>
                        Aparelho #{aparelho.idAparelho}
                    </span>
                </div>

                <div style={{ display: "flex", gap: "24px", flexWrap: "wrap" }}>

                    {/* Card lateral */}
                    <div style={{ width: "256px", flexShrink: 0, backgroundColor: "#ffffff", borderRadius: "16px", border: "1px solid #f0f0f0", padding: "24px", display: "flex", flexDirection: "column", alignItems: "center", gap: "16px" }}>

                        <div style={{ width: "80px", height: "80px", borderRadius: "50%", backgroundColor: "#ff7300", display: "flex", alignItems: "center", justifyContent: "center", color: "#ffffff", fontSize: "1.5rem", fontWeight: "bold" }}>
                            <i className="pi pi-mobile" />
                        </div>

                        <div style={{ textAlign: "center" }}>
                            <h2 style={{ fontSize: "1rem", fontWeight: "bold", color: "#000000", margin: 0 }}>
                                {aparelho.modelo}
                            </h2>

                            <span style={{ fontSize: "0.8rem", color: "#999999" }}>
                                {aparelho.marca}
                            </span>
                        </div>

                        <div style={{ width: "100%", borderTop: "1px solid #f0f0f0", marginTop: "8px" }} />

                        <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: "8px" }}>
                            <button
                                onClick={() => navigate(`/atualizar/aparelho/${aparelho.idAparelho}`)}
                                style={{ width: "100%", backgroundColor: "#ff7300", color: "#ffffff", border: "none", borderRadius: "10px", padding: "10px", fontWeight: "bold", cursor: "pointer", fontSize: "0.875rem" }}
                            >
                                Editar Aparelho
                            </button>

                            <button
                                onClick={() => navigate("/lista/aparelhos")}
                                style={{ width: "100%", backgroundColor: "#ffffff", color: "#000000", border: "1px solid #e0e0e0", borderRadius: "10px", padding: "10px", fontWeight: "bold", cursor: "pointer", fontSize: "0.875rem" }}
                            >
                                Voltar
                            </button>
                        </div>
                    </div>

                    {/* Informações do aparelho */}
                    <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "16px", minWidth: "280px" }}>

                        <div style={{ backgroundColor: "#ffffff", borderRadius: "16px", border: "1px solid #f0f0f0", padding: "24px" }}>

                            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "20px" }}>
                                <div style={{ width: "28px", height: "28px", borderRadius: "8px", backgroundColor: "#ff7300", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                    <i className="pi pi-mobile" style={{ color: "#ffffff", fontSize: "0.75rem" }} />
                                </div>

                                <h3 style={{ fontSize: "0.875rem", fontWeight: "bold", color: "#000000", textTransform: "uppercase", letterSpacing: "0.05em", margin: 0 }}>
                                    Dados do Aparelho
                                </h3>
                            </div>

                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                                <Campo label="ID do Aparelho" valor={String(aparelho.idAparelho ?? "—")} icone="pi-hashtag" />

                                <Campo label="Tipo" valor={aparelho.tipo} icone="pi-tag" />

                                <Campo label="Marca" valor={aparelho.marca} icone="pi-mobile" />

                                <Campo label="Modelo" valor={aparelho.modelo} icone="pi-box" />
                            </div>
                        </div>

                        <div style={{ backgroundColor: "#ffffff", borderRadius: "16px", border: "1px solid #f0f0f0", padding: "24px" }}>

                            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "20px" }}>
                                <div style={{ width: "28px", height: "28px", borderRadius: "8px", backgroundColor: "#ff7300", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                    <i className="pi pi-user" style={{ color: "#ffffff", fontSize: "0.75rem" }} />
                                </div>

                                <h3 style={{ fontSize: "0.875rem", fontWeight: "bold", color: "#000000", textTransform: "uppercase", letterSpacing: "0.05em", margin: 0 }}>
                                    Dados do Cliente
                                </h3>
                            </div>

                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                                <Campo label="ID do Cliente" valor={String(aparelho.idCliente)} icone="pi-user" />
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}

interface CampoProps {
    label: string;
    valor: string;
    icone: string;
}

function Campo({ label, valor, icone }: CampoProps) {
    return (
        <div style={{ display: "flex", alignItems: "flex-start", gap: "12px", padding: "12px", borderRadius: "10px", backgroundColor: "#f9f9f9" }}>
            <div style={{ width: "32px", height: "32px", borderRadius: "8px", backgroundColor: "#ffffff", border: "1px solid #f0f0f0", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <i className={`pi ${icone}`} style={{ color: "#ff7300", fontSize: "0.875rem" }} />
            </div>

            <div style={{ display: "flex", flexDirection: "column" }}>
                <span style={{ fontSize: "0.7rem", color: "#999999", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                    {label}
                </span>

                <span style={{ fontSize: "0.875rem", fontWeight: "600", color: "#000000", marginTop: "2px" }}>
                    {valor}
                </span>
            </div>
        </div>
    );
}

export default DetalhesAparelho;