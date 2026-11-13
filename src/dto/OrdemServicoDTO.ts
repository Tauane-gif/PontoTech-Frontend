// dtos/OrdemServicoDTO.ts
export interface OrdemServicoDTO {
    idOrdem?: number;
    idCliente: number;
    idAparelho: number;
    idFuncionario?: number | null;
    problema: string;
    status?: string;
    valor?: number;
}