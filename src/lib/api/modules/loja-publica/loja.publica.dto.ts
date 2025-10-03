export type FiltrosLojaPublica = {
    pagina?:number,
    quantidade?: number; // Opcional, com valor padrão "10"
    pesquisa?: string; // Opcional, para buscas genéricas
    categoriaId?: string; // Opcional, para filtrar por categoria
    valorMaximo?: string | number; // Opcional, para limitar o valor máximo
    avaliacaoMinima?: string | number; // Opcional, para limitar a avaliação mínima
    ordenacao?: "desc" | "asc"; // Opcional, para definir a ordenação (descendente ou ascendente)
    tipoOrdenacao?: "vendas" | "avaliacoes"; // Opcional, para definir o critério de ordenação
    apenasDisponiveis?: string; // Opcional, possivelmente um flag para itens disponíveis
}