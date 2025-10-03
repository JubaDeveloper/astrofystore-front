import { PUBLIC_BACKEND } from "$env/static/public"

class Avatar{

    url(entidade:"PRODUTO" | "LOJA" | "LOCACAO" | "USUARIO",id:number){

        return `${PUBLIC_BACKEND}/avatar/${entidade}/${id}`
    }

}


const avatarController = new Avatar()
export default avatarController