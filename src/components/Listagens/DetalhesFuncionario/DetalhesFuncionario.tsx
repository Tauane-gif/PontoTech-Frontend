
import { useEffect, useState, type JSX } from "react";
import { useNavigate } from "react-router-dom";
import PagamentoRequests from "../../../fetch/PagamentoRequests";
import type { PagamentoDTO } from "../../../dto/PagamentoDTO";

interface DetalhesPagamentoProps {
    idPagamento: number;
}

function DetalhesPagamento({ idPagamento }: DetalhesPagamentoProps): JSX.Element {
    const [pagamento, setPagamento] = useState<PagamentoDTO | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (!idPagamento || isNaN(idPagamento)) {
            setError("ID do pagamento inválido.");
            setLoading(false);
            return;
        }

        async function buscarDados() {
            setLoading(true);
            setError(null);

            try {
                const dados = await PagamentoRequests.obterPagamentoPorId(idPagamento);

                if (dados) {
                    setPagamento(dados);
                } else {
                    setError("Pagamento não encontrado.");
                }
            } catch (err) {
                console.error("Erro ao carregar detalhes do pagamento:", err);
                setError("Ocorreu um erro ao buscar as informações do pagamento.");
            } finally {
                setLoading(false);
            }
        }

        buscarDados();
    }, [idPagamento]);

    const formatarValor = (valor: number) => {
        return valor.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL"
        });
    };

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

    if (error || !pagamento) {
        return (
            <div style={{ minHeight: "100vh", backgroundColor: "#f3f4f6", display: "flex", alignItems: "center", justifyContent: "center", padding: "16px" }}>
                <div style={{ backgroundColor: "#ffffff", borderRadius: "16px", padding: "40px", maxWidth: "400px", width: "100%", textAlign: "center" }}>
                    <h2 style={{ fontSize: "1.1rem", fontWeight: "bold", color: "#000000", marginBottom: "8px" }}>
                        Erro ao carregar pagamento
                    </h2>

                    <p style={{ fontSize: "0.875rem", color: "#999999", marginBottom: "24px" }}>
                        {error || "Erro desconhecido."}
                    </p>

                    <button
                        onClick={() => navigate("/lista/pagamentos")}
                        style={{ padding: "10px 24px", backgroundColor: "#ff7300", color: "#ffffff", border: "none", borderRadius: "10px", fontWeight: "bold", cursor: "pointer", fontSize: "0.875rem" }}
                    >
                        Voltar para a lista
                    </button>
                </div>
            </div>
        );
    }

    const statusPago = pagamento.status?.toUpperCase() === "PAGO";

    return (
        <div style={{ minHeight: "100vh", backgroundColor: "#f3f4f6", padding: "32px 16px" }}>
            <div style={{ width: "100%", maxWidth: "900px", margin: "0 auto" }}>

                {/* Navegação */}
                <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "0.875rem", marginBottom: "24px" }}>
                    <button
                        onClick={() => navigate("/lista/pagamentos")}
                        style={{ color: "#ff7300", fontWeight: "600", background: "none", border: "none", cursor: "pointer", fontSize: "0.875rem" }}
                    >
                        Pagamentos
                    </button>

                    <span style={{ color: "#999999" }}>/</span>

                    <span style={{ color: "#666666", fontWeight: "500" }}>
                        Pagamento #{pagamento.idPagamento}
                    </span>
                </div>

                <div style={{ display: "flex", gap: "24px", flexWrap: "wrap" }}>

                    {/* Card lateral */}
                    <div style={{ width: "256px", flexShrink: 0, backgroundColor: "#ffffff", borderRadius: "16px", border: "1px solid #f0f0f0", padding: "24px", display: "flex", flexDirection: "column", alignItems: "center", gap: "16px" }}>

                        <div style={{ width: "80px", height: "80px", borderRadius: "50%", backgroundColor: "#ff7300", display: "flex", alignItems: "center", justifyContent: "center", color: "#ffffff", fontSize: "1.5rem", fontWeight: "bold" }}>
                            <i className="pi pi-wallet" />
                        </div>

                        <div style={{ textAlign: "center" }}>
                            <h2 style={{ fontSize: "1rem", fontWeight: "bold", color: "#000000", margin: 0 }}>
                                Pagamento #{pagamento.idPagamento}
                            </h2>
                        </div>

                        <span style={{ display: "inline-flex", alignItems: "center", gap: "6px", padding: "4px 12px", borderRadius: "999px", fontSize: "0.75rem", fontWeight: "600", backgroundColor: statusPago ? "#f0fdf4" : "#fef2f2", color: statusPago ? "#15803d" : "#b91c1c" }}>
                            <span style={{ width: "6px", height: "6px", borderRadius: "50%", backgroundColor: statusPago ? "#22c55e" : "#ef4444" }} />
                            {pagamento.status ?? "Não informado"}
                        </span>

                        <div style={{ width: "100%", borderTop: "1px solid #f0f0f0", marginTop: "8px" }} />

                        <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: "8px" }}>
                            <button
                                onClick={() => navigate(`/atualizar/pagamento/${pagamento.idPagamento}`)}
                                style={{ width: "100%", backgroundColor: "#ff7300", color: "#ffffff", border: "none", borderRadius: "10px", padding: "10px", fontWeight: "bold", cursor: "pointer", fontSize: "0.875rem" }}
                            >
                                Editar Pagamento
                            </button>

                            <button
                                onClick={() => navigate("/lista/pagamentos")}
                                style={{ width: "100%", backgroundColor: "#ffffff", color: "#000000", border: "1px solid #e0e0e0", borderRadius: "10px", padding: "10px", fontWeight: "bold", cursor: "pointer", fontSize: "0.875rem" }}
                            >
                                Voltar
                            </button>
                        </div>
                    </div>

                    {/* Informações do pagamento */}
                    <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "16px", minWidth: "280px" }}>

                        <div style={{ backgroundColor: "#ffffff", borderRadius: "16px", border: "1px solid #f0f0f0", padding: "24px" }}>

                            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "20px" }}>
                                <div style={{ width: "28px", height: "28px", borderRadius: "8px", backgroundColor: "#ff7300", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                    <i className="pi pi-wallet" style={{ color: "#ffffff", fontSize: "0.75rem" }} />
                                </div>

                                <h3 style={{ fontSize: "0.875rem", fontWeight: "bold", color: "#000000", textTransform: "uppercase", letterSpacing: "0.05em", margin: 0 }}>
                                    Dados do Pagamento
                                </h3>
                            </div>

                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                                <Campo label="ID do Pagamento" valor={String(pagamento.idPagamento ?? "—")} icone="pi-hashtag" />

                                <Campo label="Status" valor={pagamento.status ?? "Não informado"} icone="pi-info-circle" />

                                <Campo label="ID da Ordem de Serviço" valor={String(pagamento.idOrdem)} icone="pi-file" />
                            </div>
                        </div>

                        <div style={{ backgroundColor: "#ffffff", borderRadius: "16px", border: "1px solid #f0f0f0", padding: "24px" }}>

                            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "20px" }}>
                                <div style={{ width: "28px", height: "28px", borderRadius: "8px", backgroundColor: "#ff7300", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                    <i className="pi pi-credit-card" style={{ color: "#ffffff", fontSize: "0.75rem" }} />
                                </div>

                                <h3 style={{ fontSize: "0.875rem", fontWeight: "bold", color: "#000000", textTransform: "uppercase", letterSpacing: "0.05em", margin: 0 }}>
                                    Informações Financeiras
                                </h3>
                            </div>

                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                                <Campo label="Valor do Pagamento" valor={formatarValor(pagamento.valor)} icone="pi-dollar" />

                                <Campo label="Forma de Pagamento" valor={pagamento.formaPagamento ?? "Não informado"} icone="pi-credit-card" />
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

export default DetalhesPagamento;
