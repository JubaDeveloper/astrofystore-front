<script lang="ts">
    import Botao from "$components/assets/buttons/Botao.svelte";
    import TipTapEditor from "$components/elements/texts/TipTapEditor.svelte";
    import { PoliticasController } from "$lib/api/modules/politicas/politicas.controller";
    import handleDate from "$lib/sanitizers/time";
    import { idLoja } from "$lib/utils/rotas.svelte";
    import toast from "$lib/utils/toast.svelte";
    import { onMount } from "svelte";

    const politicasC = new PoliticasController()

    let politicaId = $state<number>()
    let loadingText = $state(true)
    let loading = $state(false)
    let editing = $state(false)
    let updatedAt = $state('')
    let conteudo = $state("")

    async function salvar(){
        loading=true
        if(politicaId){
            await politicasC.editar(parseInt($idLoja),politicaId,{
                nome:"semnomenofigmaporhora",
                conteudo
            })
        }
        else{
            await politicasC.criar(parseInt($idLoja),{
                nome:"semnomenofigmaporhora",
                conteudo
            })
        }
        loading=false
        toast.success("Notificação do sistema","Politica atualizada com sucesso!")
        setTimeout(()=>{editing=false}, 1500)
    }

    onMount(async()=>{
        const [data,_] = await politicasC.listar(parseInt($idLoja))
        if(data.politicas.length===0) return loadingText=false
        updatedAt = data.politicas[0].atualizadoEm
        conteudo = data.politicas[0].conteudo
        politicaId = data.politicas[0].id
        loadingText=false
    })
</script>

{#snippet blocoEdicao()}
    <div class="w-full border border-soft-200 rounded-2xl flex flex-col py-2">
        <div class="self-stretch inline-flex flex-col px-3 justify-start items-start gap-0.5 mb-4 mt-1">
            <div class="self-stretch justify-center text-strong-950 text-[14px] font-medium leading-normal">Adicione as políticas de privacidade da sua loja</div>
            <div class="self-stretch justify-center text-sub-600 text-[12px] font-normal leading-tight">Escreva e edite os termos de condições e políticas de privacidade da sua loja.</div>
        </div>
        <div class="self-stretch justify-center text-strong-950 px-3 text-[14px] font-medium leading-normal">
            Política de Privacidade
        </div>
        {#if !loadingText}
            <div class="p-3 relative">
                {#if updatedAt}
                <div class="absolute right-3 top-[20px]">
                    <div class="bg-faded-lighter text-faded-base text-[12px] font-medium p-1 px-2 rounded-lg">ATUALIZADA EM {handleDate.formatDate(new Date(updatedAt))}</div>
                </div>
                {/if}
                <TipTapEditor bind:conteudo/>
            </div>
        {/if}
        <div class="w-full h-[1px] bg-soft-200"></div>
        <div class="grid h-[40px] m-3 mb-0">
            <Botao tema="primary" onClick={salvar} {loading}>
                Salvar alterações
            </Botao>
        </div>
    </div>
{/snippet}

{#snippet blocoVisualizacao()}
    <div class="w-full border border-soft-200 rounded-2xl flex flex-col py-4">
        <span class="flex justify-between w-full item-center px-4 pb-4 border-b border-soft-200">
            <span class="flex flex-col">
                <p class="text-strong-950 text-16 font-medium">Políticas de Privacidade</p>
                <p class="text-14 text-sub-600">Escreva e edite os termos de condições e políticas de privacidade da sua loja.</p>
            </span>
            <div class="grid h-[40px] m-3 mb-0">
                <Botao tema="primary" onClick={()=>editing=true} {loading}>
                    Editar Conteúdo
                </Botao>
            </div>
        </span>
        <div class="p-4">
            {@html conteudo}
        </div>
    </div>
{/snippet}

{#if editing}
    {@render blocoEdicao()}
{:else}
    {@render blocoVisualizacao()}
{/if}