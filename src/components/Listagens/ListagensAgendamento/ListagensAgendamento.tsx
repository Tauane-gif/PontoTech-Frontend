import { useEffect, useMemo, useState, type ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";
import type { AgendamentoDTO } from "../../../dto/AgendamentoDTO";
import AgendamentoRequests from "../../../fetch/Agendamento";

const linhasPorPagina = 5;

function ListagensAgendamento() {
    const [agendamentos, setAgendamentos] = useState<AgendamentoDTO[]>([]);
    const [busca, setBusca] = useState("");
    const [paginaAtual, setPaginaAtual] = useState(1);
    const [carregando, setCarregando] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        let cancelado = false;

        async function carregarAgendamentos() {
            const lista = await AgendamentoRequests.obterListaDeAgendamentos();
            if (!cancelado) {
                setAgendamentos(lista);
                setCarregando(false);
            }
        }

        void carregarAgendamentos();

        return () => {
            cancelado = true;
        };
    }, []);

    const agendamentosFiltrados = useMemo(() => {
        const termoBusca = busca.trim().toLocaleLowerCase("pt-BR");

        return agendamentos
            .filter((agendamento) => [
                agendamento.idAgendamento,
                agendamento.idCliente,
                agendamento.idAparelho,
                agendamento.dataAgendamento,
                agendamento.horario,
                agendamento.status,
                agendamento.descricao
            ].some((valor) => String(valor ?? "").toLocaleLowerCase("pt-BR").includes(termoBusca)))
            .sort((a, b) => Number(a.idAgendamento ?? 0) - Number(b.idAgendamento ?? 0));
    }, [agendamentos, busca]);

    const totalPaginas = Math.ceil(agendamentosFiltrados.length / linhasPorPagina);
    const inicio = (paginaAtual - 1) * linhasPorPagina;
    const agendamentosPagina = agendamentosFiltrados.slice(inicio, inicio + linhasPorPagina);

    function atualizarBusca(evento: ChangeEvent<HTMLInputElement>) {
        setBusca(evento.target.value);
        setPaginaAtual(1);
    }

    const thStyle = {
        padding: "12px 16px",
        textAlign: "left" as const,
        fontSize: "0.78rem",
        color: "#cc5f80",
        fontWeight: 600,
        textTransform: "uppercase" as const,
        backgroundColor: "#ffffff"
    };

    const tdStyle = {
        padding: "14px 16px",
        borderBottom: "1px solid rgba(226, 117, 199, 0.35)",
        fontSize: "0.9rem",
        color: "#cc5f80"
    };

    return (
        <main style={{ minHeight: "88vh", backgroundColor: "#ffffff", padding: "40px" }}>
            <header style={{ marginBottom: "8px" }}>
                <h1 style={{ fontSize: "1.6rem", fontWeight: 700, margin: 0, color: "#cc5f80" }}>
                    AGENDAMENTOS
                </h1>
                <p style={{ color: "#cc5f80", fontSize: "0.9rem", marginTop: "4px" }}>
                    Consulte e gerencie os agendamentos cadastrados
                </p>
            </header>

            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "24px", marginTop: "16px", flexWrap: "wrap" }}>
                <button
                    type="button"
                    onClick={() => navigate("/cadastro/agendamento")}
                    style={{
                        backgroundColor: "#e275c7",
                        color: "#cc5f80",
                        border: "none",
                        borderRadius: "8px",
                        padding: "10px 20px",
                        fontWeight: 600,
                        cursor: "pointer",
                        fontSize: "0.9rem"
                    }}
                >
                    Novo Agendamento
                </button>

                <input
                    type="search"
                    value={busca}
                    onChange={atualizarBusca}
                    placeholder="Buscar por ID, cliente, aparelho ou status..."
                    aria-label="Buscar agendamentos"
                    style={{
                        boxSizing: "border-box",
                        padding: "10px 16px",
                        borderRadius: "999px",
                        border: "1px solid rgba(226, 117, 199, 0.55)",
                        fontSize: "0.9rem",
                        width: "min(100%, 360px)",
                        outlineColor: "#e275c7",
                        color: "#cc5f80",
                        backgroundColor: "#ffffff"
                    }}
                />
            </div>

            <div style={{ border: "1px solid rgba(226, 117, 199, 0.35)", borderRadius: "12px", overflowX: "auto" }}>
                <table style={{ width: "100%", minWidth: "760px", borderCollapse: "collapse" }}>
                    <thead>
                        <tr>
                            <th scope="col" style={thStyle}>ID</th>
                            <th scope="col" style={thStyle}>Cliente</th>
                            <th scope="col" style={thStyle}>Aparelho</th>
                            <th scope="col" style={thStyle}>Data</th>
                            <th scope="col" style={thStyle}>Horário</th>
                            <th scope="col" style={thStyle}>Status</th>
                            <th scope="col" style={{ ...thStyle, textAlign: "center" }}>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {carregando ? (
                            <tr>
                                <td colSpan={7} role="status" style={{ ...tdStyle, padding: "40px", textAlign: "center" }}>
                                    Carregando agendamentos...
                                </td>
                            </tr>
                        ) : agendamentosPagina.length > 0 ? (
                            agendamentosPagina.map((agendamento, index) => {
                                const id = agendamento.idAgendamento;
                                const status = agendamento.status?.trim() || "Não informado";

                                return (
                                    <tr
                                        key={id ?? `agendamento-${index}`}
                                        onMouseEnter={(evento) => {
                                            evento.currentTarget.style.backgroundColor = "rgba(226, 117, 199, 0.08)";
                                        }}
                                        onMouseLeave={(evento) => {
                                            evento.currentTarget.style.backgroundColor = "#ffffff";
                                        }}
                                    >
                                        <td style={tdStyle}>#{id ?? "—"}</td>
                                        <td style={tdStyle}>{formatarIdentificador(agendamento.idCliente)}</td>
                                        <td style={tdStyle}>{formatarIdentificador(agendamento.idAparelho)}</td>
                                        <td style={tdStyle}>{formatarData(agendamento.dataAgendamento)}</td>
                                        <td style={tdStyle}>{agendamento.horario || "—"}</td>
                                        <td style={tdStyle}>
                                            <span style={{
                                                backgroundColor: "rgba(226, 117, 199, 0.18)",
                                                color: "#cc5f80",
                                                padding: "3px 12px",
                                                borderRadius: "999px",
                                                fontSize: "0.78rem",
                                                fontWeight: 600,
                                                whiteSpace: "nowrap"
                                            }}>
                                                {status}
                                            </span>
                                        </td>
                                        <td style={{ ...tdStyle, textAlign: "center" }}>
                                            {id ? (
                                                <div style={{ display: "flex", gap: "8px", justifyContent: "center" }}>
                                                    <button
                                                        type="button"
                                                        onClick={() => navigate(`/detalhes/agendamento/${id}`)}
                                                        style={acaoStyle}
                                                    >
                                                        Detalhes
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => navigate(`/atualizar/agendamento/${id}`)}
                                                        style={acaoStyle}
                                                    >
                                                        Atualizar
                                                    </button>
                                                </div>
                                            ) : "—"}
                                        </td>
                                    </tr>
                                );
                            })
                        ) : (
                            <tr>
                                <td colSpan={7} style={{ ...tdStyle, padding: "40px", textAlign: "center" }}>
                                    {busca ? "Nenhum agendamento corresponde à busca." : "Nenhum agendamento encontrado."}
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "16px", marginTop: "20px", flexWrap: "wrap" }}>
                <p style={{ fontSize: "0.85rem", color: "#cc5f80", margin: 0 }}>
                    Mostrando{" "}
                    <strong>
                        {agendamentosFiltrados.length > 0
                            ? `${inicio + 1}–${Math.min(inicio + linhasPorPagina, agendamentosFiltrados.length)}`
                            : 0}
                    </strong>{" "}
                    de <strong>{agendamentosFiltrados.length}</strong> resultados
                </p>

                <nav aria-label="Paginação" style={{ display: "flex", gap: "6px", alignItems: "center" }}>
                    <button
                        type="button"
                        onClick={() => setPaginaAtual((pagina) => Math.max(1, pagina - 1))}
                        disabled={paginaAtual === 1}
                        aria-label="Página anterior"
                        style={paginacaoStyle(paginaAtual === 1)}
                    >
                        {"<"}
                    </button>

                    {Array.from({ length: totalPaginas }, (_, index) => index + 1).map((pagina) => (
                        <button
                            type="button"
                            key={pagina}
                            onClick={() => setPaginaAtual(pagina)}
                            aria-current={paginaAtual === pagina ? "page" : undefined}
                            style={paginacaoStyle(false, paginaAtual === pagina)}
                        >
                            {pagina}
                        </button>
                    ))}

                    <button
                        type="button"
                        onClick={() => setPaginaAtual((pagina) => Math.min(totalPaginas, pagina + 1))}
                        disabled={paginaAtual === totalPaginas || totalPaginas === 0}
                        aria-label="Próxima página"
                        style={paginacaoStyle(paginaAtual === totalPaginas || totalPaginas === 0)}
                    >
                        {">"}
                    </button>
                </nav>
            </div>
        </main>
    );
}

const acaoStyle = {
    padding: "5px 12px",
    borderRadius: "6px",
    border: "1px solid rgba(226, 117, 199, 0.55)",
    backgroundColor: "#ffffff",
    color: "#cc5f80",
    fontSize: "0.8rem",
    cursor: "pointer"
};

function paginacaoStyle(desabilitado: boolean, selecionado = false) {
    return {
        padding: "6px 12px",
        borderRadius: "6px",
        border: "1px solid rgba(226, 117, 199, 0.55)",
        backgroundColor: selecionado ? "#e275c7" : "#ffffff",
        color: "#cc5f80",
        cursor: desabilitado ? "not-allowed" : "pointer",
        opacity: desabilitado ? 0.5 : 1,
        fontWeight: selecionado ? 700 : 400
    };
}

function formatarIdentificador(valor?: number): string {
    return valor === undefined || valor === null ? "—" : String(valor);
}

function formatarData(valor?: string): string {
    if (!valor) return "—";

    const data = new Date(`${valor.slice(0, 10)}T00:00:00`);
    return Number.isNaN(data.getTime())
        ? valor
        : new Intl.DateTimeFormat("pt-BR").format(data);
}

export default ListagensAgendamento;