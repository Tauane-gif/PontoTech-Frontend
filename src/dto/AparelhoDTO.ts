export interface CriarAparelhoDTO {
  id_cliente: number;
  tipo: string;
  marca: string;
  modelo: string;
}


export interface AtualizarAparelhoDTO {
  id_cliente: number;
  tipo: string;
  marca: string;
  modelo: string;
}

export interface AparelhoResponseDTO {
  id_aparelho: number;
  id_cliente: number;
  tipo: string;
  marca: string;
  modelo: string;
}