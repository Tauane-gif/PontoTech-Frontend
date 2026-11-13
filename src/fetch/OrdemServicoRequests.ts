// requests/OrdemServicoRequests.ts
import type { OrdemServicoDTO } from "../dto/OrdemServicoDTO";

// Classe responsável por fazer requisições à API - ordem de serviço
class OrdemServicoRequests {
    private serverURL;
    private endpointOrdemServico;

    constructor() {
        this.serverURL = `http://localhost:3333`;
        this.endpointOrdemServico = `/api/ordens-servico`;
    }

    // Converte o retorno da API para o DTO
    private paraDTO(raw: any): OrdemServicoDTO {
        const valor = raw.valor;

        return {
            idOrdem: raw.idOrdem ?? raw.id_ordem,
            idCliente: raw.idCliente ?? raw.id_cliente,
            idAparelho: raw.idAparelho ?? raw.id_aparelho,
            idFuncionario: raw.idFuncionario ?? raw.id_funcionario,
            problema: raw.problema,
            status: raw.status,
            valor: valor !== null && valor !== undefined ? Number(valor) : undefined
        };
    }

    async obterListaDeOrdensServico(): Promise<OrdemServicoDTO[]> {
        try {
            const token = localStorage.getItem('token');
            const respostaAPI = await fetch(`${this.serverURL}${this.endpointOrdemServico}`, {
                headers: {
                    'Content-Type': 'application/json',
                    'x-access-token': `${token}`
                }
            });

            if (respostaAPI.ok) {
                const lista = await respostaAPI.json();
                return lista.map((raw: any) => this.paraDTO(raw));
            } else {
                throw new Error("Não foi possível listar as ordens de serviço.");
            }
        } catch (error) {
            console.error(`Erro ao fazer a consulta de ordens de serviço. ${error}`);
            return [];
        }
    }

    async obterOrdemServicoPorId(id_ordem: number): Promise<OrdemServicoDTO | undefined> {
        try {
            const token = localStorage.getItem('token');
            const respostaAPI = await fetch(`${this.serverURL}${this.endpointOrdemServico}/${id_ordem}`, {
                headers: {
                    'Content-Type': 'application/json',
                    'x-access-token': `${token}`
                }
            });

            if (respostaAPI.ok) {
                const raw = await respostaAPI.json();
                return this.paraDTO(raw);
            } else {
                throw new Error("Não foi possível buscar a ordem de serviço.");
            }
        } catch (error) {
            console.error(`Erro ao fazer a consulta de ordem de serviço por ID. ${error}`);
            return;
        }
    }

    async enviarFormularioOrdemServico(formOrdem: OrdemServicoDTO): Promise<boolean> {
        try {
            const token = localStorage.getItem('token');
            const respostaAPI = await fetch(`${this.serverURL}${this.endpointOrdemServico}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-access-token': `${token}`
                },
                body: JSON.stringify(formOrdem)
            });

            if (!respostaAPI.ok) throw new Error(`Erro ${respostaAPI.status}: ${respostaAPI.statusText}`);

            console.info(`${respostaAPI.status}: ${respostaAPI.statusText}`);
            return true;
        } catch (error) {
            console.error(`Erro ao fazer consulta à API. ${error}`);
            return false;
        }
    }

    async atualizarOrdemServico(id: number, formOrdem: OrdemServicoDTO): Promise<boolean> {
        try {
            const token = localStorage.getItem('token');
            const respostaAPI = await fetch(`${this.serverURL}${this.endpointOrdemServico}/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'x-access-token': `${token}`
                },
                body: JSON.stringify(formOrdem)
            });

            if (!respostaAPI.ok) throw new Error(`Erro ${respostaAPI.status}: ${respostaAPI.statusText}`);

            console.info(`${respostaAPI.status}: ${respostaAPI.statusText}`);
            return true;
        } catch (error) {
            console.error(`Erro ao fazer consulta à API. ${error}`);
            return false;
        }
    }

    async excluirOrdemServico(id: number): Promise<boolean> {
        try {
            const token = localStorage.getItem('token');
            const respostaAPI = await fetch(`${this.serverURL}${this.endpointOrdemServico}/${id}`, {
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
            console.error(`Erro ao excluir ordem de serviço. ${error}`);
            return false;
        }
    }
}

export default new OrdemServicoRequests;