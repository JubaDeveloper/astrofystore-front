export type ComentarioDto = {
  id: number;
  cliente:{
    clienteId:number,
    nome:string
  }
  nota: number;
  comentario: string;
  criadoEm: string;
};

export type ComentarioPostDto={
  nota:number,
  comentario:string
}