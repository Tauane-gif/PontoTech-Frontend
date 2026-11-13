// dtos/FuncionarioDTO.ts
export interface FuncionarioDTO {
    idFuncionario?: number;
    nome: string;
    email: string;
    senha?: string;
    cargo: string;
}