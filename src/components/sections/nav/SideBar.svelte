<script lang="ts">
    import BotaoMenuSuspenso from "$components/assets/buttons/BotaoMenuSuspenso.svelte";
    import SvgCaret from "$components/assets/svg/SvgCaret.svelte";
    import Avatar from "$components/assets/avatar/Avatar.svelte";
    import storageService from "$lib/utils/storageService";
    import toast from "$lib/utils/toast.svelte";

    import { idLoja, rotasAdmin, rotasLojasRestrito, rotasLojista, type rotasCommom } from "$lib/utils/rotas.svelte";
    import { goto } from "$app/navigation";
    import { page } from "$app/state";

    const opcoes = [
        { label: "Configurações de perfil", action: () => toast.alert("Notificação do sistema","Ainda em implementação")},
        { label: "Sair", action: () => logout()},
    ]

    let user = $state(storageService.getStoredData("astronfy-user"))

    let rotasAtual = $derived.by(()=>{
        const id = page.route.id
        if(!id) return []

        if(id.includes("/loja/")){
            return rotasLojasRestrito
        }
        if(id.includes("/admin")){
            return rotasAdmin
        }
            return rotasLojista
        
    })

    let params = $derived(Object.keys(page.params).map((obj)=>{
            return page.params[obj]
    }))

    function logout(){
        toast.alert("Notificação do sistema","Você foi deslogado com sucesso")
        goto("/login")
    }

    function rotaSelecionada(rota:rotasCommom){
        const link = rota.link;
        let linkPuro = ""
        if(typeof link==="string"){
            if(link===page.url.pathname) return true
            linkPuro = link
        }
        else{
            if(link($idLoja) === page.url.pathname) return true
            linkPuro = link($idLoja)
        }

        const filhos = rota.filhos;
        if(typeof filhos ==="function"){
            const arrayLinks = filhos(params);
            if(arrayLinks.some((obj)=>obj.includes(page.url.pathname))){
                return true
            }
        }
        if (Array.isArray(filhos) && filhos.every(item => typeof item === "string")) {    
            if(filhos.some((obj)=>obj.includes(page.url.pathname))){
                return true
            }
        }
        
        return false
        
    }
    function rotaRedirect(rota:rotasCommom){
        if(typeof rota.link==="string"){
            return rota.link
        }
        else{
            return rota.link($idLoja)
        }
    }
</script>

<aside class="border-r border-soft-200 w-[272px] shrink-0 grow-0  h-full flex flex-col justify-between bg-white-0 p-6 gap-6">
    <div class="flex flex-col gap-6">
        <div class="flex items-center gap-3 border-b border-soft-200 pb-6">
            <button onclick={()=> goto('/gestao-de-lojas')}>
                <img src="/images/astronfy.png" class="w-[40px]" alt="">
            </button>
            <div class="flex flex-col">
                <p class="text-[14px] font-medium text-strong-950">astrofystore</p>
                <p class="text-[12px] font-normal text-sub-600">Painel do 
                    {#if user.perfil==="ADMIN"}
                        administrador
                    {:else if user.perfil==="USUARIO"}
                        lojista
                    {/if}
                </p>
            </div>
        </div>
        <div class="flex flex-col gap-3">
            <p class="font-normal text-[12px] text-soft-400">MENU</p>
            <div class="flex flex-col gap-1">
                {#each rotasAtual as rota,i}
                    {@const active = rotaSelecionada(rota)}
                    {@const redirect = rotaRedirect(rota)}
                    {@const Icon = rota.Icon}
                        <div class="flex flex-col justify-center relative w-full">
                            <div 
                            class="absolute h-[36px] w-1 left-[-23px] rounded-r-[4px] data-[ativo]:bg-primary-base 
                            translate-x-[-4px] data-[ativo]:translate-x-0" 
                            data-ativo={active ? true : null}>
                            </div>
                            <button 
                            onclick={()=>goto(redirect)} 
                            class="flex items-center h-[36px] px-3 gap-2 group hover:text-strong-950 {active ? 'text-strong-950 bg-weak-50 rounded-lg' : 'text-sub-600'}" >
                                <Icon  props={{
                                class: `group-hover:fill-primary-base ${active ? "fill-primary-base" : "fill-sub-600"}`
                                }}/>
                                <p class="font-content text-sm font-medium">{rota.label}</p>
                            </button>
                        </div>
                {/each}
            </div>
        </div>
    </div>

    <div class="flex items-center justify-between  border-t border-soft-200 w-full pt-6">
        <div class="flex items-center gap-3">
             <Avatar name={user.nome} placeholder="icon" src={"/images/astronfy.png"}/> 
            <div class="flex flex-col  grow">
                <p class="text-[14px] font-medium text-strong-950">{user?.nome ?? "Não Informado"}</p>
                <p class="text-[12px] font-normal text-sub-600 truncate w-[130px] ">{user?.email ?? "Não Informado"}</p>
            </div>
        </div>
        <BotaoMenuSuspenso posicao="bottom-[0px] right-[-168px]" {opcoes}>
            <SvgCaret props={{ width:12, height:12, class:"rotate-[-90deg] group-hover:fill-[#1DAF61] fill-[#B9BAB9]" }}/>
        </BotaoMenuSuspenso>    
    </div>
</aside>