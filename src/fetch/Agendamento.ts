import type { AgendamentoDTO } from "../dto/AgendamentoDTO";

class AgendamentoRequests {
    private readonly serverURL = "http://localhost:3333";
    private readonly endpointAgendamento = "/api/agendamentos";

    async obterAgendamentoPorId(idAgendamento: number): Promise<AgendamentoDTO | undefined> {
        try {
            const token = localStorage.getItem("token");
            const respostaAPI = await fetch(
                `${this.serverURL}${this.endpointAgendamento}/${idAgendamento}`,
                {
                    headers: {
                        "Content-Type": "application/json",
                        "x-access-token": `${token}`
                    }
                }
            );

            if (!respostaAPI.ok) {
                throw new Error(
                    `Não foi possível buscar o agendamento. Erro ${respostaAPI.status}: ${respostaAPI.statusText}`
                );
            }

            const raw = await respostaAPI.json();
            return {
                idAgendamento: raw.idAgendamento ?? raw.id_agendamento,
                idCliente: raw.idCliente ?? raw.id_cliente,
                idAparelho: raw.idAparelho ?? raw.id_aparelho,
                dataAgendamento: raw.dataAgendamento ?? raw.data_agendamento ?? raw.data,
                horario: raw.horario ?? raw.hora,
                status: raw.status ?? raw.statusAgendamento ?? raw.status_agendamento,
                descricao: raw.descricao
            };
        } catch (error) {
            console.error("Erro ao buscar agendamento por ID.", error);
            return undefined;
        }
    }
}

export default new AgendamentoRequests();