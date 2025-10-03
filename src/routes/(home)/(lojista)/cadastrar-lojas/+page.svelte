<script lang='ts'>
    import { goto } from "$app/navigation";
    import Avatar from "$components/assets/avatar/Avatar.svelte";
    import Botao from "$components/assets/buttons/Botao.svelte";
    import Input from "$components/assets/input/Input.svelte";
  import Share from "$components/assets/input/Share.svelte";
  import Site from "$components/assets/input/Site.svelte";
    import TextArea from "$components/assets/input/TextArea.svelte";
    import FillText from "$components/assets/limiter/FillText.svelte";
    import SvgDiscord from "$components/assets/svg/SvgDiscord.svelte";
    import PhotoManager from "$components/elements/media/PhotoManager.svelte";
    import PhotoManagerMin from "$components/elements/media/PhotoManagerMin.svelte";
  import { LojaController } from "$lib/api/modules/lojas/lojas.controller";
    import { lojaCadForm } from "$lib/api/modules/lojas/lojas.dto";
  import validateInputs from "$lib/sanitizers/validateFormats";
  import validacaoInputNormalizada from "$lib/utils/input.svelte";
  import sinalizador from "$lib/utils/signal.svelte";
  import toast from "$lib/utils/toast.svelte";
  import ShortUniqueId from "short-unique-id";
  import { onMount } from "svelte";

    let form = $state(lojaCadForm)
    let formImage = $state({
        file:null,
        data64:""
    })
    
    let sugestoes = $state<string[]>([])

    let loading = $state(false)
    
    const lojaC = new LojaController()

    async function urlMaker(e: Event) {
        const target = e.target as HTMLInputElement;
        const value = target.value;
        const formatedValue = value.toLowerCase().normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, "-")
            .replace(/[^a-z0-9\s-]/g, "").replace(/^-|-$/g, '');
        form.subdominio = formatedValue
        validarDominio()
    }

    async function validarDominio(){
        if(!form.subdominio) return
        const disponivel = await lojaC.validarDominio(form.subdominio)
        if(disponivel){
             sugestoes = []
             return
        }
        const uuidGen = new ShortUniqueId({
            dictionary:['1','2','3','4','5','6','7','8','9','10']
        })

        sugestoes = [
            form.subdominio+uuidGen.rnd(3),
            form.subdominio+uuidGen.rnd(3),
            form.subdominio+uuidGen.rnd(3),
        ]
    }


    async function cadastrar(){
        if(validarTodos()){
            sinalizador.sendSignal("validarInputs")
            toast.alert("Notificação do sistema","Resolva as pendencias do formulario para prosseguir")
            return
        }
        loading=true
        const [data,error] = await lojaC.cadastrar(form)
        loading=false
        if(error){
            return toast.error("Erro no cadastro da loja",error.message)
        }
        if(formImage.file){
           lojaC.salvarAvatar(data.id,formImage.file)
        }
        setTimeout(()=>{
            form = lojaCadForm
            formImage = {
                file:null,
                data64:""
            }
            const btn  = document.getElementById("goLoja")
            btn!.addEventListener("click",()=>{
                    goto("/gestao-de-lojas")
            })


        },100)
        return toast.success("Loja criada com sucesso!",`
        <div class="flex flex-col gap-1">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas fringilla.
            <button class="underline text-strong-950 text-left font-medium" id='goLoja'>
                 Ir para o painel da loja
            </button>
        </div>
        `)
    }

    function validarTodos(){
        return (
            validacaoInputNormalizada.NaoVazio(form.descricao) ||
            validacaoInputNormalizada.NaoVazio(form.subdominio) ||
            sugestoes.length>0)
    }

</script>

<div class="flex flex-col gap-6 h-full">
    <div class="border-b border-soft-200 pb-5 flex items-center justify-between">
        {@render secaoTop()}
    </div>
    <div class="flex items-center justify-center w-full">
        <div class="w-[440px] max-w-[440px] border border-soft-200 rounded-2xl flex flex-col">
            {@render conteudo()}
        </div>
    </div>
</div>

{#snippet secaoTop()}
    <span class="text-[18px] font-medium">
        Cadastrar Loja
    </span> 
    <div class="flex items-center gap-2 whitespace-nowrap text-sub-600 font-normal">
        Precisa de ajuda?
        <div class="grid w-[109px] h-[40px]">
            <Botao tema="gray-transparent" onClick={()=> goto("")}>
                <SvgDiscord/>
                Suporte
            </Botao>    
        </div>
    </div>
{/snippet}

{#snippet conteudo()}
    <div class="flex items-center gap-3.5 p-4 w-full">
        <PhotoManagerMin bind:formImage/>
        <div class="flex flex-col">
            <p class="text-strong-950 font-medium text-16">Logo da loja</p>
            <p class="text-sub-600 font-normal text-14">400x400 px, PNG ou JPEG</p>
        </div>
    </div>
    <FillText texto="OUTROS" />
    <div class="p-4 flex flex-col gap-3 border-b border-soft-200 pb-4">
        <Input sanitize={(v)=> v.replace(/[@#$%&*(){}![\];]/g, "")} 
        extraTip="Uma vez cadastrado, o nome da loja não podera ser alterado" label={'Nome da loja'}
        validate={()=>validacaoInputNormalizada.NaoVazio(form.nome,"Insira o nome da loja")}
        mandatory={true} placeholder={'Digite o nome da loja'} bind:value={form.nome}
        onChange={urlMaker}/>

        <div class="flex flex-col gap-1">
            <Site extraTip="Uma vez cadastrado, o dominio da loja não podera ser alterado" label={'URL'} viewOnly={true} comPrefixo={false} dominio="/astronfy.com.br" mandatory={true} 
            placeholder={'nomedasualoja'} bind:value={form.subdominio}/>
            {#if sugestoes.length>0}
                <div class="flex flex-col gap-1 leading-3.5 text-[12px] shrink-0  text-error-base">
                    Dominio não disponivel, algumas sugestões: 
                    <div class="flex items-center gap-2">
                        {#each  sugestoes as  sugestao}
                                <button class="text-success-base hover:text-success-dark underline bg-success-lighter p-1 rounded-md" onclick={()=>{
                                    form.subdominio = sugestao
                                    validarDominio()
                                }}>
                                    {sugestao}
                                </button>
                        {/each}

                    </div>
                </div>
            {/if}
        </div>
        
        <TextArea label={'Descrição'} mandatory={true} 
        placeholder={'Descreva brevemente sua loja...'} 
        validate={()=>validacaoInputNormalizada.NaoVazio(form.descricao,"Insira a descrição da loja")}
        limit={200} bind:value={form.descricao}/>
    </div>
    <div class="m-4 grid h-[36px]">
        <Botao tema="primary" onClick={cadastrar} {loading}>
            Criar Loja
        </Botao>
    </div>
{/snippet}