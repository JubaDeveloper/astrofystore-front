export type PedidoDto = {
    id: number;
    preco: number;
    desconto: number;
    tributos: number | null;
    total: number;
    observacao: string | null;
    status: string;
    checkout: boolean;
    lojaId: number;
    clienteId: number;
    criadoEm: string;
    atualizadoEm: string;
};