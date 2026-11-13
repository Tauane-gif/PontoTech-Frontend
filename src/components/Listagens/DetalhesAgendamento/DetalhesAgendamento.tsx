import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { AgendamentoDTO } from "../../../dto/AgendamentoDTO";
import AgendamentoRequests from "../../../fetch/Agendamento";

interface DetalhesAgendamentoProps {
    idAgendamento: number;
}

interface ResultadoAgendamento {
    id: number;
    agendamento?: AgendamentoDTO;
    erro?: string;
}

function DetalhesAgendamento({ idAgendamento }: DetalhesAgendamentoProps) {
    const [resultado, setResultado] = useState<ResultadoAgendamento>();
    const navigate = useNavigate();
    const idValido = Number.isSafeInteger(idAgendamento) && idAgendamento > 0;

    useEffect(() => {
        let cancelado = false;

        if (!idValido) {
            return () => {
                cancelado = true;
            };
        }

        async function buscarAgendamento() {
            try {
                const agendamento = await AgendamentoRequests.obterAgendamentoPorId(idAgendamento);
                if (cancelado) return;

                setResultado(agendamento
                    ? { id: idAgendamento, agendamento }
                    : { id: idAgendamento, erro: "Agendamento não encontrado." });
            } catch (error) {
                console.error("Erro ao carregar detalhes do agendamento:", error);
                if (!cancelado) {
                    setResultado({
                        id: idAgendamento,
                        erro: "Ocorreu um erro ao buscar as informações do agendamento."
                    });
                }
            }
        }

        void buscarAgendamento();

        return () => {
            cancelado = true;
        };
    }, [idAgendamento, idValido]);

    const agendamento = resultado?.id === idAgendamento ? resultado.agendamento : undefined;
    const carregando = idValido && resultado?.id !== idAgendamento;
    const erro = !idValido
        ? "ID do agendamento inválido."
        : resultado?.id === idAgendamento
            ? resultado.erro
            : undefined;

    if (carregando) {
        return (
            <main
                role="status"
                style={{
                    minHeight: "100vh",
                    backgroundColor: "#ffffff",
                    display: "flex",
                    justifyContent: "center",
                    padding: "40px 16px"
                }}
            >
                <div style={{ width: "100%", maxWidth: "900px" }}>
                    <p>Carregando detalhes do agendamento...</p>
                </div>
            </main>
        );
    }

    if (erro || !agendamento) {
        return (
            <main
                style={{
                    minHeight: "100vh",
                    backgroundColor: "#ffffff",
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
                        border: "1px solid rgba(226, 117, 199, 0.35)",
                        borderRadius: "16px",
                        padding: "40px",
                        maxWidth: "400px",
                        width: "100%",
                        textAlign: "center"
                    }}
                >
                    <h2 style={{ fontSize: "1.1rem", fontWeight: "bold", color: "#000000", marginBottom: "8px" }}>
                        Erro ao carregar agendamento
                    </h2>
                    <p style={{ fontSize: "0.875rem", color: "#cc5f80", marginBottom: "24px" }}>
                        {erro ?? "Agendamento não encontrado."}
                    </p>
                    <button
                        type="button"
                        onClick={() => navigate("/lista/agendamentos")}
                        style={{
                            padding: "10px 24px",
                            backgroundColor: "#e275c7",
                            color: "#cc5f80",
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

    const dataFormatada = formatarData(agendamento.dataAgendamento);

    return (
        <main style={{ minHeight: "100vh", backgroundColor: "#ffffff", padding: "32px 16px" }}>
            <div style={{ width: "100%", maxWidth: "900px", margin: "0 auto" }}>
                <nav
                    aria-label="Navegação estrutural"
                    style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "0.875rem", marginBottom: "24px" }}
                >
                    <button
                        type="button"
                        onClick={() => navigate("/lista/agendamentos")}
                        style={{
                            color: "#e275c7",
                            fontWeight: "600",
                            background: "none",
                            border: "none",
                            cursor: "pointer",
                            fontSize: "0.875rem"
                        }}
                    >
                        Agendamentos
                    </button>
                    <span aria-hidden="true" style={{ color: "#7a5961" }}>/</span>
                    <span style={{ color: "#cc5f80", fontWeight: "500" }}>
                        Agendamento #{agendamento.idAgendamento ?? idAgendamento}
                    </span>
                </nav>

                <section
                    aria-labelledby="titulo-agendamento"
                    style={{
                        backgroundColor: "#ffffff",
                        border: "1px solid rgba(226, 117, 199, 0.35)",
                        borderRadius: "16px",
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
                                backgroundColor: "#e275c7",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                color: "#cc5f80",
                                fontWeight: "bold",
                                fontSize: "1.2rem"
                            }}
                        >
                            <i className="pi pi-calendar" />
                        </div>
                        <div>
                            <h1 id="titulo-agendamento" style={{ fontSize: "1.25rem", color: "#000000", margin: 0 }}>
                                Detalhes do agendamento
                            </h1>
                            <p style={{ color: "#cc5f80", fontSize: "0.875rem" }}>
                                Agendamento #{agendamento.idAgendamento ?? idAgendamento}
                            </p>
                        </div>
                    </div>

                    <dl style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "16px", margin: 0 }}>
                        <Campo label="ID do agendamento" valor={String(agendamento.idAgendamento ?? idAgendamento)} />
                        <Campo label="ID do cliente" valor={formatarIdentificador(agendamento.idCliente)} />
                        <Campo label="ID do aparelho" valor={formatarIdentificador(agendamento.idAparelho)} />
                        <Campo label="Data" valor={dataFormatada} />
                        <Campo label="Horário" valor={agendamento.horario || "Não informado"} />
                        <Campo label="Status" valor={agendamento.status || "Não informado"} />
                        {agendamento.descricao && (
                            <Campo label="Descrição" valor={agendamento.descricao} />
                        )}
                    </dl>

                    <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "24px" }}>
                        <button
                            type="button"
                            onClick={() => navigate("/lista/agendamentos")}
                            style={{
                                backgroundColor: "#ffffff",
                                color: "#cc5f80",
                                border: "1px solid rgba(226, 117, 199, 0.35)",
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
        <div style={{ padding: "14px", borderRadius: "10px", backgroundColor: "#ffffff" }}>
            <dt style={{ fontSize: "0.7rem", color: "#777777", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                {label}
            </dt>
            <dd style={{ margin: "6px 0 0", fontSize: "0.9rem", fontWeight: "600", color: "#000000", overflowWrap: "anywhere" }}>
                {valor}
            </dd>
        </div>
    );
}

function formatarIdentificador(valor?: number): string {
    return valor === undefined || valor === null ? "Não informado" : String(valor);
}

function formatarData(valor?: string): string {
    if (!valor) return "Não informado";

    const data = new Date(`${valor.slice(0, 10)}T00:00:00`);
    return Number.isNaN(data.getTime())
        ? valor
        : new Intl.DateTimeFormat("pt-BR").format(data);
}

export default DetalhesAgendamento;