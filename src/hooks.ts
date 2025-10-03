import { browser } from "$app/environment";
import { PUBLIC_BACKEND, PUBLIC_DOMAIN } from "$env/static/public";
import api from "$lib/api/api";
import domainManager from "$lib/settings/domain.svelte";
import { redirect, type Reroute } from "@sveltejs/kit";
import axios from "axios";

export const reroute: Reroute = async({ url }) => {

    //Como resolver latencia?
    try{
        if(url.pathname==="/favicon.ico" || url.origin.includes('localhost')) return
        let domain = ""
        const domains = url.hostname.split(".")
        if(url.hostname===PUBLIC_DOMAIN) return
        domain = domains[0]
        if(domain===domainManager.ultimoDominioAcessado){
            const redirecionar = `/dominio/${domainManager.lojaId}${url.pathname}`
            return redirecionar
        }

        const result = await verificarDominio(domain);
        if(result===false){
           return "/loja-nao-encontrada"
        }
        const redirecionar = `/dominio/${domainManager.lojaId}${url.pathname}`
        return redirecionar

    }catch(err){
        
    }
    
};


const verificarDominio = async(d:string):Promise<boolean> =>{
    const sucess = await domainManager.definirDominio(d)
    return sucess

}

