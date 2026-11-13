import type { AparelhoDTO } from "../dto/AparelhoDTO";

class AparelhoRequests {
    private readonly serverURL = "http://localhost:3333";
    private readonly endpointAparelho = "/api/aparelhos";

    async obterAparelhoPorId(idAparelho: number): Promise<AparelhoDTO | undefined> {
        try {
            const token = localStorage.getItem("token");
            const respostaAPI = await fetch(
                `${this.serverURL}${this.endpointAparelho}/${idAparelho}`,
                {
                    headers: {
                        "Content-Type": "application/json",
                        "x-access-token": `${token}`
                    }
                }
            );

            if (!respostaAPI.ok) {
                throw new Error(
                    `Não foi possível buscar o aparelho. Erro ${respostaAPI.status}: ${respostaAPI.statusText}`
                );
            }

            const raw = await respostaAPI.json();
            return {
                idAparelho: raw.idAparelho ?? raw.id_aparelho,
                idCliente: raw.idCliente ?? raw.id_cliente,
                tipo: raw.tipo,
                marca: raw.marca,
                modelo: raw.modelo
            };
        } catch (error) {
            console.error("Erro ao buscar aparelho por ID.", error);
            return undefined;
        }
    }
}

export default new AparelhoRequests();
