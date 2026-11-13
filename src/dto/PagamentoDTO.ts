// dtos/PagamentoDTO.ts
export interface PagamentoDTO {
    idPagamento?: number;
    idOrdem: number;
    valor: number;
    formaPagamento: string;
    status?: string;
}