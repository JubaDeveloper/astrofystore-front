import axios from "axios";
import type { EnderecoCepApi } from "./external.dto";


export class ExternalController{

    async enderecoPorCep(cep:string):Promise<[EnderecoCepApi | null,any]>{

        try{
            const response = await axios.get(`https://viacep.com.br/ws/${cep}/json/`);
            const dados = response.data
            if(dados.erro) return [null,dados.erro]
            return [dados,null]
        }
        catch(err){
        
            return [null,err]
        }

    }

}