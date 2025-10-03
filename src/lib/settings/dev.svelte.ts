import {PUBLIC_BACKEND} from "$env/static/public";
import { page } from "$app/state";

class Dev{
    
    public keys = {
        backend: PUBLIC_BACKEND,
    }

    public nomeProjeto = "Astronfy";

    getTitleUrl(){
        const paginaAtual = page.url.pathname;
        switch(paginaAtual){
            case "/login":
                return this.nomeProjeto+" - Pagina de Login";
            case "/cadastro":
                return this.nomeProjeto+" - Pagina de Cadastro";
            default:
                return this.nomeProjeto;
        }
    }
}

const dev = new Dev();
export default dev;