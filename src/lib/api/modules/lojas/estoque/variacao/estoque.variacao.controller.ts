import api from "$lib/api/api";
import type { AxiosError } from "axios";

export class EstoqueVariacaoController{

    private idLoja:number=0;
    private idVariacao:number=0;

    constructor(idLoja:number,idVariacao:number){
        this.idLoja=idLoja
        this.idVariacao=idVariacao
    }

    
    async criar(body:{
        tipoEstoque:"lista" | "mensagem",
        mensagem:string,
    }):Promise<[any,AxiosError]>{
        return await api.post(`/loja/${this.idLoja}/estoque/variacao/${this.idVariacao}`,body)
    }


    async atualizarImagem(){

    }
    

}