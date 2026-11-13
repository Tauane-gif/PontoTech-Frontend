// requests/AparelhoRequests.ts
import type { AparelhoDTO } from "../dto/AparelhoDTO";

// Classe responsável por fazer requisições à API - aparelho
class AparelhoRequests {
    private serverURL;
    private endpointAparelho;

    constructor() {
        this.serverURL = `http://localhost:3333`;
        this.endpointAparelho = `/api/aparelhos`;
    }

    // Converte o retorno da API para o DTO
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
            const token = localStorage.getItem('token');
            const respostaAPI = await fetch(`${this.serverURL}${this.endpointAparelho}`, {
                headers: {
                    'Content-Type': 'application/json',
                    'x-access-token': `${token}`
                }
            });

            if (respostaAPI.ok) {
                const lista = await respostaAPI.json();
                return lista.map((raw: any) => this.paraDTO(raw));
            } else {
                throw new Error("Não foi possível listar os aparelhos.");
            }
        } catch (error) {
            console.error(`Erro ao fazer a consulta de aparelhos. ${error}`);
            return [];
        }
    }

    async obterAparelhoPorId(id_aparelho: number): Promise<AparelhoDTO | undefined> {
        try {
            const token = localStorage.getItem('token');
            const respostaAPI = await fetch(`${this.serverURL}${this.endpointAparelho}/${id_aparelho}`, {
                headers: {
                    'Content-Type': 'application/json',
                    'x-access-token': `${token}`
                }
            });

            if (respostaAPI.ok) {
                const raw = await respostaAPI.json();
                return this.paraDTO(raw);
            } else {
                throw new Error("Não foi possível buscar o aparelho.");
            }
        } catch (error) {
            console.error(`Erro ao fazer a consulta de aparelho por ID. ${error}`);
            return;
        }
    }

    async enviarFormularioAparelho(formAparelho: AparelhoDTO): Promise<boolean> {
        try {
            const token = localStorage.getItem('token');
            const respostaAPI = await fetch(`${this.serverURL}${this.endpointAparelho}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-access-token': `${token}`
                },
                body: JSON.stringify(formAparelho)
            });

            if (!respostaAPI.ok) throw new Error(`Erro ${respostaAPI.status}: ${respostaAPI.statusText}`);

            console.info(`${respostaAPI.status}: ${respostaAPI.statusText}`);
            return true;
        } catch (error) {
            console.error(`Erro ao fazer consulta à API. ${error}`);
            return false;
        }
    }

    async atualizarAparelho(id: number, formAparelho: AparelhoDTO): Promise<boolean> {
        try {
            const token = localStorage.getItem('token');
            const respostaAPI = await fetch(`${this.serverURL}${this.endpointAparelho}/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'x-access-token': `${token}`
                },
                body: JSON.stringify(formAparelho)
            });

            if (!respostaAPI.ok) throw new Error(`Erro ${respostaAPI.status}: ${respostaAPI.statusText}`);

            console.info(`${respostaAPI.status}: ${respostaAPI.statusText}`);
            return true;
        } catch (error) {
            console.error(`Erro ao fazer consulta à API. ${error}`);
            return false;
        }
    }

    async excluirAparelho(id: number): Promise<boolean> {
        try {
            const token = localStorage.getItem('token');
            const respostaAPI = await fetch(`${this.serverURL}${this.endpointAparelho}/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'x-access-token': `${token}`
                }
            });

            if (!respostaAPI.ok) throw new Error(`Erro ${respostaAPI.status}: ${respostaAPI.statusText}`);

            console.info(`${respostaAPI.status}: ${respostaAPI.statusText}`);
            return true;
        } catch (error) {
            console.error(`Erro ao excluir aparelho. ${error}`);
            return false;
        }
    }
}

export default new AparelhoRequests;