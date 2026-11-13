// requests/PecaRequests.ts
import type { PecaDTO } from "../dto/pecaDTO";

// Classe responsável por fazer requisições à API - peça
class PecaRequests {
    private serverURL;
    private endpointPeca;

    constructor() {
        this.serverURL = `http://localhost:3333`;
        this.endpointPeca = `/api/pecas`;
    }

    // Converte o retorno da API para o DTO
    private paraDTO(raw: any): PecaDTO {
        return {
            idPeca: raw.idPeca ?? raw.id_peca,
            nome: raw.nome,
            preco: Number(raw.preco),
            quantidade: Number(raw.quantidade)
        };
    }

    async obterListaDePecas(): Promise<PecaDTO[]> {
        try {
            const token = localStorage.getItem('token');
            const respostaAPI = await fetch(`${this.serverURL}${this.endpointPeca}`, {
                headers: {
                    'Content-Type': 'application/json',
                    'x-access-token': `${token}`
                }
            });

            if (respostaAPI.ok) {
                const lista = await respostaAPI.json();
                return lista.map((raw: any) => this.paraDTO(raw));
            } else {
                throw new Error("Não foi possível listar as peças.");
            }
        } catch (error) {
            console.error(`Erro ao fazer a consulta de peças. ${error}`);
            return [];
        }
    }

    async obterPecaPorId(id_peca: number): Promise<PecaDTO | undefined> {
        try {
            const token = localStorage.getItem('token');
            const respostaAPI = await fetch(`${this.serverURL}${this.endpointPeca}/${id_peca}`, {
                headers: {
                    'Content-Type': 'application/json',
                    'x-access-token': `${token}`
                }
            });

            if (respostaAPI.ok) {
                const raw = await respostaAPI.json();
                return this.paraDTO(raw);
            } else {
                throw new Error("Não foi possível buscar a peça.");
            }
        } catch (error) {
            console.error(`Erro ao fazer a consulta de peça por ID. ${error}`);
            return;
        }
    }

    async enviarFormularioPeca(formPeca: PecaDTO): Promise<boolean> {
        try {
            const token = localStorage.getItem('token');
            const respostaAPI = await fetch(`${this.serverURL}${this.endpointPeca}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-access-token': `${token}`
                },
                body: JSON.stringify(formPeca)
            });

            if (!respostaAPI.ok) throw new Error(`Erro ${respostaAPI.status}: ${respostaAPI.statusText}`);

            console.info(`${respostaAPI.status}: ${respostaAPI.statusText}`);
            return true;
        } catch (error) {
            console.error(`Erro ao fazer consulta à API. ${error}`);
            return false;
        }
    }

    async atualizarPeca(id: number, formPeca: PecaDTO): Promise<boolean> {
        try {
            const token = localStorage.getItem('token');
            const respostaAPI = await fetch(`${this.serverURL}${this.endpointPeca}/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'x-access-token': `${token}`
                },
                body: JSON.stringify(formPeca)
            });

            if (!respostaAPI.ok) throw new Error(`Erro ${respostaAPI.status}: ${respostaAPI.statusText}`);

            console.info(`${respostaAPI.status}: ${respostaAPI.statusText}`);
            return true;
        } catch (error) {
            console.error(`Erro ao fazer consulta à API. ${error}`);
            return false;
        }
    }

    async excluirPeca(id: number): Promise<boolean> {
        try {
            const token = localStorage.getItem('token');
            const respostaAPI = await fetch(`${this.serverURL}${this.endpointPeca}/${id}`, {
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
            console.error(`Erro ao excluir peça. ${error}`);
            return false;
        }
    }
}

export default new PecaRequests;