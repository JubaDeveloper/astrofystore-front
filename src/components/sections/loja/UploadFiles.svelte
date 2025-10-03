<script lang="ts">
    import Botao from "$components/assets/buttons/Botao.svelte";
    import BotaoDeslizante from "$components/assets/buttons/BotaoDeslizante.svelte";
    import FillText from "$components/assets/limiter/FillText.svelte";
    import SelectBlock from "$components/assets/logic/SelectBlock.svelte";
  import PopUp from "$components/assets/modals/PopUp.svelte";
    import SvgLapis from "$components/assets/svg/SvgLapis.svelte";
    import SvgTrash from "$components/assets/svg/SvgTrash.svelte";
    import SvgUpload from "$components/assets/svg/SvgUpload.svelte";
    import CardUploadFile from "$components/elements/card/CardUploadFile.svelte";
  import Pesquisa from "$components/elements/search/Pesquisa.svelte";
    import InputWrapper from "$components/elements/wrappers/InputWrapper.svelte";
    import { fileManager } from "$lib/actions/file.svelte";
    import toast from "$lib/utils/toast.svelte";
    import axios from "axios";
  import PesquisaProduto from "../search/PesquisaProduto.svelte";
  import { LojaImagensController } from "$lib/api/modules/lojas/imagens/lojas.imagens.controller";
  import { idLoja } from "$lib/utils/rotas.svelte";
  import { ProdutoController } from "$lib/api/modules/produto/produto.controller.svelte";
  import type { Produto } from "$lib/api/modules/produto/produto.dto.svelte";
  import categoriaController from "$lib/api/modules/categoria/categoria.controller";


    interface Props{
        open:boolean,

        onSalvar:VoidFunction
    }

    let {onSalvar,open = $bindable(false)}:Props = $props()
    let file = $state<File | undefined>()
    let fileUploadMode = $state<"none" | "uploading" | "uploaded">("none")
    let data64 = $state("")
    let tipo = $state("produto")
    let loading = $state(false)
    let idBanner = $state<number>()
    let modo = $state<"cadastro" | "edicao">("cadastro")
    
    let categoriaOpcoes = $state([])

    let containerPesquisa = $state<ReturnType<typeof PesquisaProduto>>()

    let form:{
        produto:Produto | undefined,
        categoria: number | undefined
    } = $state({
        produto: undefined,
        categoria: undefined
    })

    const produtoController = new ProdutoController()

    //Se eu tenho modo edição e não tenho file E data 64 => Vou para o fluxo de mudar somente a uri
    //Caso contrario, o banner é deletado e enviado um novo :D
    export const modoEdicao = async(dados:any) => {
        modo="edicao"
        idBanner=dados.id
        data64 = dados.url
        fileUploadMode="uploaded"
        const categoriaId = dados.uri.split("/")[2]
        const produtoId = dados.uri.split("/")[4]
        categoriaController.pegar(parseInt($idLoja),parseInt(categoriaId)).then((r)=>{
            const [data,e] = r
            form.categoria = data.id
        })
        produtoController.pegar(parseInt($idLoja),parseInt(produtoId)).then((r)=>{
            const [data,e] = r
            form.produto = data
            containerPesquisa?.onProduto(data)
        })
        open=true
    }

	const triggerFileUpload = () => {
		document.getElementById("fileUpload")?.click()
	}

    const salvar = async()=>{
        if(!file){
            toast.alert("Insira todas as informações","Para salvar o banner, insira uma imagem")
            return
        }
        if(!form.categoria && !form.produto){
            toast.alert("Insira todas as informações","Para salvar o banner, informe a qual produto ou categoria ele pertence")
            return
        }
        const lojaI = new LojaImagensController()
        loading=true
        const [data,e] = await lojaI.salvarBanner(parseInt($idLoja),file,form.categoria,form.produto ? form.produto.id : undefined)
        form.categoria=undefined
        form.produto=undefined
        loading=false
        if(e){
            return toast.error("Notificação do sistema",e.message)
        }
        onSalvar()
        reset()
        open=false
        toast.success("Peça adicionada com sucesso","");
    }

    const editar = async()=>{
        if(!form.categoria && !form.produto) return
        const lojaI = new LojaImagensController()

        //uri edit only!!!!
        if(!file && data64){

            const [data,e] = await lojaI.editarBanner(parseInt($idLoja),idBanner!,form.categoria,form.produto ? form.produto.id : undefined)
            loading=false
            if(e){
                return toast.error("Notificação do sistema",e.message)
            }
            onSalvar()
            open=false


            return
        }
       
        loading=true
        await lojaI.deletarBanner(parseInt($idLoja),idBanner!)
        const [data,e] = await lojaI.salvarBanner(parseInt($idLoja),file!,form.categoria,form.produto ? form.produto.id : undefined)
        loading=false

        if(e){
            return toast.error("Notificação do sistema",e.message)
        }
        onSalvar()
        open=false
        reset()
    }

    const reset = async()=>{
        fileUploadMode="none"
        file = undefined
        data64=""
    }
    const resetWithOpen = async()=>{
        fileUploadMode="none"
        file = undefined
        data64=""
        triggerFileUpload()
    }

    const loadCategorias = async()=>{
        const [r,e] = await categoriaController.listar(parseInt($idLoja),{})
        categoriaOpcoes = r.resultado.map((obj:any)=>{
            return {
                value:obj.id,
                label:obj.nome
            }
        })
    }

    loadCategorias()



</script>


<PopUp bind:open={open} withDefaultPadding={false} withCloseButton={true}>
    <div class="w-[440px] py-3 gap-2 rounded-2xl flex-col overflow-hidden">
        <div class="w-full px-4 pb-3 bg-bg-white-0 border-b border-soft-200 inline-flex justify-start items-center gap-3.5 overflow-hidden">
            <div class="flex-1 inline-flex flex-col justify-start items-start">
                <div class="justify-center text-strong-950 text-base font-medium leading-normal">Selecione a imagem para a Peça</div>
                <div class="justify-center text-sub-600 text-sm font-normal leading-tight">Faça o upload de uma imagem para o banner</div>
            </div>
        </div>
    
        <div class="mt-3 px-4 justify-center text-strong-950 text-sm font-medium leading-normal">
            {#if fileUploadMode==="uploaded"}
                Imagem Submetida
            {:else}
                Faça o upload da imagem
            {/if}
    
        </div>
              
        {#if fileUploadMode==="uploaded"}
        
            <div class="flex w-[400px] h-[204px] relative overflow-hidden rounded-md mx-4 my-2 justify-end items-start p-2 px-1">
                <div class="flex items-center gap-2 z-10">
                    <button class="px-2 py-1.5 bg-white-0 rounded-lg shadow-[0px_1px_2px_0px_rgba(10,13,20,0.03)] outline-1 outline-offset-[-1px]
                    outline-soft-200 inline-flex justify-center items-center gap-0.5 overflow-hidden"
                    onclick={resetWithOpen}>
                        <SvgLapis variacao="underline"/>
                        <div class="px-1 flex justify-center items-center">
                            <div class="justify-center text-sub-600 text-sm font-medium leading-tight tracking-wide">Trocar foto da peça</div>
                        </div>
                    </button>
    
                    <button onclick={reset}
                    class="px-1 aspect-square py-1.5 bg-white-0 rounded-lg shadow-[0px_1px_2px_0px_rgba(10,13,20,0.03)] text-sub-600 outline-1 outline-offset-[-1px] outline-soft-200 inline-flex justify-center items-center gap-0.5 overflow-hidden">
                        <SvgTrash/>
                    </button>
                </div>
                <img src={data64} alt="" class=" absolute top-0 left-0 w-full object-cover"/>
            </div>
    
        {:else}
    
    
            <div class="p-6 px-4 flex flex-col items-center justify-center gap-2 border border-dashed border-soft-200 mx-4 my-4 rounded-[12px]">
                <SvgUpload/>
                <b class="text-[14px] text-center font-medium">
                    Arraste o arquivo aqui ou faça upload do seu computador
                </b>
                <span class="text-[12px] text-sub-600">
                    Tamanho da imagem 0000px x 00000px
                </span>
                <div class="grid h-[20px] col-span-1">
                    <Botao tema="gray-transparent" onClick={triggerFileUpload}>
                        Fazer Upload
                    </Botao>    
                </div>
            </div>
        {/if}
    
        <FillText texto="TIPO"/>
        <div class="self-stretch px-4 flex flex-col w-full  mt-3 justify-start items-start gap-3">
            <div class="grid w-full">
                <BotaoDeslizante opcoes={[
                    {
                        label:"Categoria",
                        value:"categoria"
                    },
                    {
                        label:"Produto",
                        value:"produto"
                    }
                ]} onChange={()=>{

                }} bind:value={tipo}/>
        
            </div>
            <div class="self-stretch flex flex-col justify-start items-start gap-1">

                    {#if tipo==="categoria"}
                    <div class="{tipo==="categoria" ? "" : "hidden"} w-full">
                        <InputWrapper label="Selecione uma categoria" value="">
                            <SelectBlock dropCss="absolute bottom-[100%] mb-1 rounded-lg w-full bg-white-0 flex flex-col shadow-md border border-soft-200"
                            placeholder="Categorias" removableOnClick={false} 
                            bind:value={form.categoria} options={categoriaOpcoes}/>
                        </InputWrapper>
                    </div>
                    {:else}
                        <div class="{tipo==="produto" ? "" : "hidden"} w-full">
                            <PesquisaProduto bind:this={containerPesquisa} bind:produtoSelecionado={form.produto}/>
                        </div>
                    {/if}

            </div>
        </div>
    
        <div class="w-full h-[1px] bg-soft-200 my-2">
    
        </div>
    
        <div class="grid grid-cols-2 w-full  px-4 gap-x-3 h-[40px]">
            <Botao tema="gray-transparent" onClick={()=>{
                open=false
            }}>
                Fechar
            </Botao>
            <Botao tema="primary" onClick={()=>{
                if(modo==="edicao"){
                    editar()
                }
                else{
                    salvar()
                }
            }} {loading}>
                Salvar
            </Botao>
        </div>
    </div>
    
    
    
    <button
        use:fileManager={{
            accept:".png,.jpg,.jpge,.webp",
            multipleFiles:false
        }}
        class="hidden"
            
        onfileupload={(e)=>{
            file = e.detail[0].file
            data64 = e.detail[0].data64
            fileUploadMode="uploaded"
        }}
        aria-label="a"
        id="fileUpload"
    >
    
    </button>
    


</PopUp>
