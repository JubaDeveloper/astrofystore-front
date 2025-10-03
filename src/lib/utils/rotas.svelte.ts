import SvgPredio from "$components/assets/svg/SvgPredio.svelte";
import SvgDashboard from "$components/assets/svg/SvgDashboard.svelte";
import SvgConfiguracao from "$components/assets/svg/SvgConfiguracao.svelte";
import SvgCategoria from "$components/assets/svg/SvgCategoria.svelte";
import SvgProduto from "$components/assets/svg/SvgProduto.svelte";

import type { SVGAttributes } from "svelte/elements";
import type { Component } from "svelte";
import { writable, get } from "svelte/store";
import SvgBanir from "$components/assets/svg/SvgBanir.svelte";
import SvgSirene from "$components/assets/svg/SvgSirene.svelte";
import SvgDefaultUser from "$components/assets/svg/SvgDefaultUser.svelte";
import SvgRepasse from "$components/assets/svg/SvgRepasse.svelte";
import SvgSetaLoop from "$components/assets/svg/SvgSetaLoop.svelte";
import SvgCupom from "$components/assets/svg/SvgCupom.svelte";

export const rotasPublicas = ["/login","/cadastro","/recuperar-conta","/redefinir-senha"];

export const idLoja = writable<string>('')

export type rotasCommom = {
    label:string,
    link:string | ((id:string) =>string),
    filhos?:string[] | ((v:string[]) => string[]) //Caso não seja um item de sidebar, mas é uma url que faz parte de algum fluxo, indique aqui
    Icon: Component<{ props?: SVGAttributes<SVGSVGElement> }>
}



export const rotasAdmin:rotasCommom[]  = [
    {
        label:"Dashboard",
        link:"/admin",
        filhos:[],
        Icon:SvgPredio 
    },
    {
        label:"Denuncias",
        link:"/admin/denuncias",
        filhos:[],
        Icon:SvgProduto
    },
]


export const rotasLojista:rotasCommom[]  = [
    {
        label:"Lojas",
        link:"/gestao-de-lojas",
        filhos:["/cadastrar-lojas"],
        Icon:SvgPredio 
    },
]

export const rotasLojasRestrito: rotasCommom[] = [
    {label: 'Dashboard', link: (id: string) => `/loja/${id}/dashboard`, Icon: SvgDashboard},
    {label: 'Categorias', link: (id: string) => `/loja/${id}/categorias`, Icon: SvgCategoria},
    {label: 'Produtos', link: (id: string) => `/loja/${id}/produtos`, 
        filhos: (ids: string[]) => [`/loja/${ids[0]}/cadastro-produto`, `/loja/:id/testes`,`/loja/${ids[0]}/cadastro-estoque`], 
        Icon: SvgProduto},
    {label: 'Devoluções', link: (id: string) => `/loja/${id}/devolucoes`, Icon: SvgSetaLoop},

    {label: 'Clientes', 
            link: (id: string) => `/loja/${id}/clientes`, 
            filhos: (ids:string[]) => [`/loja/${ids[0]}/clientes/${ids[1]}`],
    Icon: SvgDefaultUser},
    
    {label: 'Cupons', link: (id: string) => `/loja/${id}/cupom`, Icon: SvgCupom},
    {label: 'Denúncias', link: (id: string) => `/loja/${id}/denuncias`, Icon: SvgSirene},
    {label: 'Configurações', link: (id: string) => `/loja/${id}/configuracoes`, Icon: SvgConfiguracao},

]