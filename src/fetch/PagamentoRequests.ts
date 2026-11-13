// requests/PagamentoRequests.ts
import type { PagamentoDTO } from "../dto/PagamentoDTO";

// Classe responsável por fazer requisições à API - pagamento
class PagamentoRequests {
    private serverURL;
    private endpointPagamento;

    constructor() {
        this.serverURL = `http://localhost:3333`;
        this.endpointPagamento = `/api/pagamentos`;
    }

    // Converte o retorno da API para o DTO
    private paraDTO(raw: any): PagamentoDTO {
        return {
            idPagamento: raw.idPagamento ?? raw.id_pagamento,
            idOrdem: raw.idOrdem ?? raw.id_ordem,
            valor: Number(raw.valor),
            formaPagamento: raw.formaPagamento ?? raw.forma_pagamento,
            status: raw.status
        };
    }

    async obterListaDePagamentos(): Promise<PagamentoDTO[]> {
        try {
            const token = localStorage.getItem('token');
            const respostaAPI = await fetch(`${this.serverURL}${this.endpointPagamento}`, {
                headers: {
                    'Content-Type': 'application/json',
                    'x-access-token': `${token}`
                }
            });

            if (respostaAPI.ok) {
                const lista = await respostaAPI.json();
                return lista.map((raw: any) => this.paraDTO(raw));
            } else {
                throw new Error("Não foi possível listar os pagamentos.");
            }
        } catch (error) {
            console.error(`Erro ao fazer a consulta de pagamentos. ${error}`);
            return [];
        }
    }

    async obterPagamentoPorId(id_pagamento: number): Promise<PagamentoDTO | undefined> {
        try {
            const token = localStorage.getItem('token');
            const respostaAPI = await fetch(`${this.serverURL}${this.endpointPagamento}/${id_pagamento}`, {
                headers: {
                    'Content-Type': 'application/json',
                    'x-access-token': `${token}`
                }
            });

            if (respostaAPI.ok) {
                const raw = await respostaAPI.json();
                return this.paraDTO(raw);
            } else {
                throw new Error("Não foi possível buscar o pagamento.");
            }
        } catch (error) {
            console.error(`Erro ao fazer a consulta de pagamento por ID. ${error}`);
            return;
        }
    }

    async enviarFormularioPagamento(formPagamento: PagamentoDTO): Promise<boolean> {
        try {
            const token = localStorage.getItem('token');
            const respostaAPI = await fetch(`${this.serverURL}${this.endpointPagamento}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-access-token': `${token}`
                },
                body: JSON.stringify(formPagamento)
            });

            if (!respostaAPI.ok) throw new Error(`Erro ${respostaAPI.status}: ${respostaAPI.statusText}`);

            console.info(`${respostaAPI.status}: ${respostaAPI.statusText}`);
            return true;
        } catch (error) {
            console.error(`Erro ao fazer consulta à API. ${error}`);
            return false;
        }
    }

    async atualizarPagamento(id: number, formPagamento: PagamentoDTO): Promise<boolean> {
        try {
            const token = localStorage.getItem('token');
            const respostaAPI = await fetch(`${this.serverURL}${this.endpointPagamento}/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'x-access-token': `${token}`
                },
                body: JSON.stringify(formPagamento)
            });

            if (!respostaAPI.ok) throw new Error(`Erro ${respostaAPI.status}: ${respostaAPI.statusText}`);

            console.info(`${respostaAPI.status}: ${respostaAPI.statusText}`);
            return true;
        } catch (error) {
            console.error(`Erro ao fazer consulta à API. ${error}`);
            return false;
        }
    }

    async excluirPagamento(id: number): Promise<boolean> {
        try {
            const token = localStorage.getItem('token');
            const respostaAPI = await fetch(`${this.serverURL}${this.endpointPagamento}/${id}`, {
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
            console.error(`Erro ao excluir pagamento. ${error}`);
            return false;
        }
    }
}

export default new PagamentoRequests;