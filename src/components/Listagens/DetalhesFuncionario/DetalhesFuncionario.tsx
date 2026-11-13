// requests/FuncionarioRequests.ts
import type { FuncionarioDTO } from "../../../dto/FuncionarioDTo";
// Classe responsável por fazer requisições à API - funcionário
class FuncionarioRequests {
    private serverURL;
    private endpointFuncionario;

    constructor() {
        this.serverURL = `http://localhost:3333`;
        this.endpointFuncionario = `/api/funcionarios`;
    }

    async obterListaDeFuncionarios(): Promise<FuncionarioDTO[]> {
        try {
            const token = localStorage.getItem('token');
            const respostaAPI = await fetch(`${this.serverURL}${this.endpointFuncionario}`, {
                headers: {
                    'Content-Type': 'application/json',
                    'x-access-token': `${token}`
                }
            });

            if (respostaAPI.ok) {
                const lista = await respostaAPI.json();
                return lista.map((raw: any) => ({
                    idFuncionario: raw.idFuncionario ?? raw.id_funcionario,
                    nome: raw.nome,
                    email: raw.email,
                    cargo: raw.cargo,
                }));
            } else {
                throw new Error("Não foi possível listar os funcionários.");
            }
        } catch (error) {
            console.error(`Erro ao fazer a consulta de funcionários. ${error}`);
            return [];
        }
    }

    async enviarFormularioFuncionario(formFuncionario: FuncionarioDTO): Promise<boolean> {
        try {
            const token = localStorage.getItem('token');
            const respostaAPI = await fetch(`${this.serverURL}${this.endpointFuncionario}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-access-token': `${token}`
                },
                body: JSON.stringify(formFuncionario)
            });

            if (!respostaAPI.ok) throw new Error(`Erro ${respostaAPI.status}: ${respostaAPI.statusText}`);

            console.info(`${respostaAPI.status}: ${respostaAPI.statusText}`);

            return true;
        } catch (error) {
            console.error(`Erro ao fazer consulta à API. ${error}`);
            return false;
        }
    }

    async obterFuncionarioPorId(id_funcionario: number): Promise<FuncionarioDTO | undefined> {
        try {
            const token = localStorage.getItem('token');
            const respostaAPI = await fetch(`${this.serverURL}${this.endpointFuncionario}/${id_funcionario}`, {
                headers: {
                    'Content-Type': 'application/json',
                    'x-access-token': `${token}`
                }
            });

            if (respostaAPI.ok) {
                const raw = await respostaAPI.json();
                const funcionario: FuncionarioDTO = {
                    idFuncionario: raw.idFuncionario ?? raw.id_funcionario,
                    nome: raw.nome,
                    email: raw.email,
                    cargo: raw.cargo
                };
                return funcionario;
            } else {
                throw new Error("Não foi possível buscar o funcionário.");
            }
        } catch (error) {
            console.error(`Erro ao fazer a consulta de funcionário por ID. ${error}`);
            return;
        }
    }

    async atualizarFuncionario(id: number, formFuncionario: FuncionarioDTO): Promise<boolean> {
        try {
            const token = localStorage.getItem('token');
            const respostaAPI = await fetch(`${this.serverURL}${this.endpointFuncionario}/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'x-access-token': `${token}`
                },
                body: JSON.stringify(formFuncionario)
            });

            if (!respostaAPI.ok) throw new Error(`Erro ${respostaAPI.status}: ${respostaAPI.statusText}`);

            console.info(`${respostaAPI.status}: ${respostaAPI.statusText}`);
            return true;
        } catch (error) {
            console.error(`Erro ao fazer consulta à API. ${error}`);
            return false;
        }
    }
}
export default new FuncionarioRequests;