import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { PagamentoDTO } from "../../../dto/PagamentoDTO";
import PagamentoRequests from "../../../fetch/PagamentoRequests";

interface DetalhesPagamentoProps {
    idPagamento: number;
}

interface ResultadoPagamento {
    id: number;
    pagamento?: PagamentoDTO;
    erro?: string;
}

function DetalhesPagamento({ idPagamento }: DetalhesPagamentoProps) {
    const [resultado, setResultado] = useState<ResultadoPagamento>();
    const navigate = useNavigate();
    const idValido = Number.isSafeInteger(idPagamento) && idPagamento > 0;

    useEffect(() => {
        let cancelado = false;

        if (!idValido) return () => {
            cancelado = true;
        };

        async function buscarPagamento() {
            try {
                const pagamento = await PagamentoRequests.obterPagamentoPorId(idPagamento);
                if (cancelado) return;

                setResultado(pagamento
                    ? { id: idPagamento, pagamento }
                    : { id: idPagamento, erro: "Pagamento não encontrado." });
            } catch (error) {
                console.error("Erro ao carregar detalhes do pagamento:", error);
                if (!cancelado) {
                    setResultado({
                        id: idPagamento,
                        erro: "Ocorreu um erro ao buscar as informações do pagamento."
                    });
                }
            }
        }

        void buscarPagamento();

        return () => {
            cancelado = true;
        };
    }, [idPagamento, idValido]);

    const pagamento = resultado?.id === idPagamento ? resultado.pagamento : undefined;
    const carregando = idValido && resultado?.id !== idPagamento;
    const erro = !idValido
        ? "ID do pagamento inválido."
        : resultado?.id === idPagamento
            ? resultado.erro
            : undefined;

    if (carregando) {
        return (
            <main
                role="status"
                style={{
                    minHeight: "100vh",
                    backgroundColor: "#f3f4f6",
                    display: "flex",
                    alignItems: "flex-start",
                    justifyContent: "center",
                    padding: "40px 16px"
                }}
            >
                <div style={{ width: "100%", maxWidth: "900px" }}>
                    <p>Carregando detalhes do pagamento...</p>
                </div>
            </main>
        );
    }

    if (erro || !pagamento) {
        return (
            <main
                style={{
                    minHeight: "100vh",
                    backgroundColor: "#f3f4f6",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "16px"
                }}
            >
                <section
                    role="alert"
                    style={{
                        backgroundColor: "#ffffff",
                        borderRadius: "16px",
                        padding: "40px",
                        maxWidth: "400px",
                        width: "100%",
                        textAlign: "center"
                    }}
                >
                    <h2 style={{ fontSize: "1.1rem", fontWeight: "bold", color: "#000000", marginBottom: "8px" }}>
                        Erro ao carregar pagamento
                    </h2>
                    <p style={{ fontSize: "0.875rem", color: "#666666", marginBottom: "24px" }}>
                        {erro ?? "Pagamento não encontrado."}
                    </p>
                    <button
                        type="button"
                        onClick={() => navigate("/lista/pagamentos")}
                        style={{
                            padding: "10px 24px",
                            backgroundColor: "#ff7300",
                            color: "#ffffff",
                            border: "none",
                            borderRadius: "10px",
                            fontWeight: "bold",
                            cursor: "pointer",
                            fontSize: "0.875rem"
                        }}
                    >
                        Voltar para a lista
                    </button>
                </section>
            </main>
        );
    }

    const valorFormatado = Number.isFinite(pagamento.valor)
        ? new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(pagamento.valor)
        : "Não informado";

    return (
        <main style={{ minHeight: "100vh", backgroundColor: "#f3f4f6", padding: "32px 16px" }}>
            <div style={{ width: "100%", maxWidth: "900px", margin: "0 auto" }}>
                <nav aria-label="Navegação estrutural" style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "0.875rem", marginBottom: "24px" }}>
                    <button
                        type="button"
                        onClick={() => navigate("/lista/pagamentos")}
                        style={{
                            color: "#ff7300",
                            fontWeight: "600",
                            background: "none",
                            border: "none",
                            cursor: "pointer",
                            fontSize: "0.875rem"
                        }}
                    >
                        Pagamentos
                    </button>
                    <span aria-hidden="true" style={{ color: "#999999" }}>/</span>
                    <span style={{ color: "#666666", fontWeight: "500" }}>
                        Pagamento #{pagamento.idPagamento ?? idPagamento}
                    </span>
                </nav>

                <section
                    aria-labelledby="titulo-pagamento"
                    style={{
                        backgroundColor: "#ffffff",
                        borderRadius: "16px",
                        border: "1px solid #f0f0f0",
                        padding: "24px"
                    }}
                >
                    <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "24px" }}>
                        <div
                            aria-hidden="true"
                            style={{
                                width: "44px",
                                height: "44px",
                                borderRadius: "12px",
                                backgroundColor: "#ff7300",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                color: "#ffffff",
                                fontWeight: "bold"
                            }}
                        >
                            R$
                        </div>
                        <div>
                            <h1 id="titulo-pagamento" style={{ fontSize: "1.25rem", color: "#000000", margin: 0 }}>
                                Detalhes do pagamento
                            </h1>
                            <p style={{ color: "#666666", fontSize: "0.875rem" }}>
                                Pagamento #{pagamento.idPagamento ?? idPagamento}
                            </p>
                        </div>
                    </div>

                    <dl style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "16px", margin: 0 }}>
                        <Campo label="ID do pagamento" valor={String(pagamento.idPagamento ?? idPagamento)} />
                        <Campo label="ID da ordem de serviço" valor={String(pagamento.idOrdem)} />
                        <Campo label="Valor" valor={valorFormatado} />
                        <Campo label="Forma de pagamento" valor={pagamento.formaPagamento || "Não informado"} />
                        <Campo label="Status" valor={pagamento.status || "Não informado"} />
                    </dl>

                    <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "24px" }}>
                        <button
                            type="button"
                            onClick={() => navigate("/lista/pagamentos")}
                            style={{
                                backgroundColor: "#ffffff",
                                color: "#000000",
                                border: "1px solid #e0e0e0",
                                borderRadius: "10px",
                                padding: "10px 24px",
                                fontWeight: "bold",
                                cursor: "pointer"
                            }}
                        >
                            Voltar para a lista
                        </button>
                    </div>
                </section>
            </div>
        </main>
    );
}

interface CampoProps {
    label: string;
    valor: string;
}

function Campo({ label, valor }: CampoProps) {
    return (
        <div style={{ padding: "14px", borderRadius: "10px", backgroundColor: "#f9f9f9" }}>
            <dt style={{ fontSize: "0.7rem", color: "#777777", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                {label}
            </dt>
            <dd style={{ margin: "6px 0 0", fontSize: "0.9rem", fontWeight: "600", color: "#000000" }}>
                {valor}
            </dd>
        </div>
    );
}

export default DetalhesPagamento;