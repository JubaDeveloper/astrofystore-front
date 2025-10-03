
export type PagamentoBodyDto = {
  tokenCartao?: string; // Token do cartão de crédito
  metodo: "pix" | "credit_card"; 
  quantidadeParcelas?: number; // Quantidade de parcelas, default: 1
  idMetodoPagamento?: "visa" | "master" | "elo" | "amex"
};
export type PixDto = {
    idExterno: number;
    metodo: string;
    plataforma: string;
    status: string;
    dados: {
        id: number;
        qrCode: string;
        qrCodeBase64: string;
        status: string;
    };
};