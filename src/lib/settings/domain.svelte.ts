import { goto } from "$app/navigation"
import { PUBLIC_BACKEND } from "$env/static/public"
import type { DataLojaDto } from "$lib/api/modules/lojas/lojas.dto"

class Domain{

    lojaId = $state<number | undefined>()
    ultimoDominioAcessado = $state<string>()
    lojainfo = $state<DataLojaDto|undefined>()

    async definirDominio(dominio:string):Promise<boolean>{
        	const urlRequest = `${PUBLIC_BACKEND}/l/${dominio}`
            try{
                const data = await (await fetch(urlRequest)).json()
                if(data.statusCode===200){
                    this.lojaId = data.data.loja.id
                    this.ultimoDominioAcessado = dominio
                    this.lojainfo = data.data
                    return true
                }
                this.lojaId = undefined
                this.ultimoDominioAcessado = ''
                this.lojainfo = undefined
                return false
            }
            catch(err){
                return false
            }
    }


}

const domainManager = new Domain()
export default domainManager