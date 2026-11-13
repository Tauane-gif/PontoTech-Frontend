// requests/ServicoRequests.ts
import type { ServicoDTO } from "../dto/ServicoDTO";

// Classe responsável por fazer requisições à API - serviço
class ServicoRequests {
    private serverURL;
    private endpointServico;

    constructor() {
        this.serverURL = `http://localhost:3333`;
        this.endpointServico = `/api/servicos`;
    }

    // Converte o retorno da API para o DTO
    private paraDTO(raw: any): ServicoDTO {
        return {
            idServico: raw.idServico ?? raw.id_servico,
            idOrdem: raw.idOrdem ?? raw.id_ordem,
            descricao: raw.descricao,
            valor: Number(raw.valor)
        };
    }

    async obterListaDeServicos(): Promise<ServicoDTO[]> {
        try {
            const token = localStorage.getItem('token');
            const respostaAPI = await fetch(`${this.serverURL}${this.endpointServico}`, {
                headers: {
                    'Content-Type': 'application/json',
                    'x-access-token': `${token}`
                }
            });

            if (respostaAPI.ok) {
                const lista = await respostaAPI.json();
                return lista.map((raw: any) => this.paraDTO(raw));
            } else {
                throw new Error("Não foi possível listar os serviços.");
            }
        } catch (error) {
            console.error(`Erro ao fazer a consulta de serviços. ${error}`);
            return [];
        }
    }

    async obterServicoPorId(id_servico: number): Promise<ServicoDTO | undefined> {
        try {
            const token = localStorage.getItem('token');
            const respostaAPI = await fetch(`${this.serverURL}${this.endpointServico}/${id_servico}`, {
                headers: {
                    'Content-Type': 'application/json',
                    'x-access-token': `${token}`
                }
            });

            if (respostaAPI.ok) {
                const raw = await respostaAPI.json();
                return this.paraDTO(raw);
            } else {
                throw new Error("Não foi possível buscar o serviço.");
            }
        } catch (error) {
            console.error(`Erro ao fazer a consulta de serviço por ID. ${error}`);
            return;
        }
    }

    async enviarFormularioServico(formServico: ServicoDTO): Promise<boolean> {
        try {
            const token = localStorage.getItem('token');
            const respostaAPI = await fetch(`${this.serverURL}${this.endpointServico}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-access-token': `${token}`
                },
                body: JSON.stringify(formServico)
            });

            if (!respostaAPI.ok) throw new Error(`Erro ${respostaAPI.status}: ${respostaAPI.statusText}`);

            console.info(`${respostaAPI.status}: ${respostaAPI.statusText}`);
            return true;
        } catch (error) {
            console.error(`Erro ao fazer consulta à API. ${error}`);
            return false;
        }
    }

    async atualizarServico(id: number, formServico: ServicoDTO): Promise<boolean> {
        try {
            const token = localStorage.getItem('token');
            const respostaAPI = await fetch(`${this.serverURL}${this.endpointServico}/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'x-access-token': `${token}`
                },
                body: JSON.stringify(formServico)
            });

            if (!respostaAPI.ok) throw new Error(`Erro ${respostaAPI.status}: ${respostaAPI.statusText}`);

            console.info(`${respostaAPI.status}: ${respostaAPI.statusText}`);
            return true;
        } catch (error) {
            console.error(`Erro ao fazer consulta à API. ${error}`);
            return false;
        }
    }

    async excluirServico(id: number): Promise<boolean> {
        try {
            const token = localStorage.getItem('token');
            const respostaAPI = await fetch(`${this.serverURL}${this.endpointServico}/${id}`, {
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
            console.error(`Erro ao excluir serviço. ${error}`);
            return false;
        }
    }
}

export default new ServicoRequests;