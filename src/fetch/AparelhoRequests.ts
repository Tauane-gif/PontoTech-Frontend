import type { AparelhoDTO } from "../dto/AparelhoDTO";

class AparelhoRequests {
    private readonly serverURL = "http://localhost:3333";
    private readonly endpointAparelho = "/api/aparelhos";

    private paraDTO(raw: any): AparelhoDTO {
        return {
            idAparelho: raw.idAparelho ?? raw.id_aparelho,
            idCliente: raw.idCliente ?? raw.id_cliente,
            tipo: raw.tipo,
            marca: raw.marca,
            modelo: raw.modelo
        };
    }

    async obterListaDeAparelhos(): Promise<AparelhoDTO[]> {
        try {
            const token = localStorage.getItem("token");
            const respostaAPI = await fetch(`${this.serverURL}${this.endpointAparelho}`, {
                headers: {
                    "Content-Type": "application/json",
                    "x-access-token": `${token}`
                }
            });

            if (!respostaAPI.ok) {
                throw new Error(
                    `Não foi possível listar os aparelhos. Erro ${respostaAPI.status}: ${respostaAPI.statusText}`
                );
            }

            const lista: unknown = await respostaAPI.json();
            if (!Array.isArray(lista)) {
                throw new Error("A API retornou uma lista de aparelhos inválida.");
            }

            return lista.map((raw: any) => this.paraDTO(raw));
        } catch (error) {
            console.error("Erro ao buscar a lista de aparelhos.", error);
            return [];
        }
    }

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
            return this.paraDTO(raw);
        } catch (error) {
            console.error("Erro ao buscar aparelho por ID.", error);
            return undefined;
        }
    }
}

export default new AparelhoRequests();
