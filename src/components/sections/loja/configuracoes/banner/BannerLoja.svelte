<script lang="ts">
    import { goto } from "$app/navigation";
    import Botao from "$components/assets/buttons/Botao.svelte";
    import FillText from "$components/assets/limiter/FillText.svelte";
    import SvgCaret from "$components/assets/svg/SvgCaret.svelte";
    import SvgImagem from "$components/assets/svg/SvgImagem.svelte";
    import SvgPlus from "$components/assets/svg/SvgPlus.svelte";
    import { LojaImagensController } from "$lib/api/modules/lojas/imagens/lojas.imagens.controller";
    import { idLoja } from "$lib/utils/rotas.svelte";
    import { onMount } from "svelte";
    import UploadFiles from "../../UploadFiles.svelte";
    import SvgTrash from "$components/assets/svg/SvgTrash.svelte";
    import PopUp from "$components/assets/modals/PopUp.svelte";
    import SvgAlerta from "$components/assets/svg/SvgAlerta.svelte";
    import banner from "$lib/utils/banner.svelte";
    import toast from "$lib/utils/toast.svelte";

    let open = $state(false)
    let openDeleteModal = $state(false)
    let bannerVisivel = $state(1)
    let banners = $state<{
        exibicao:boolean,
        id:number,
        ordem:any,
        tipo:string,
        uri:string,
        url:string
    }[]>([])

    let bannerIdFocus = $state<number>(0)

    let bannerAtual = $derived.by(()=>{
        return banners.find((obj)=>{
            if(obj.ordem===bannerVisivel){
                return obj
            }
        })
    })

    let uploadContainer = $state<ReturnType<typeof UploadFiles>>()

  function back(){
    if(bannerVisivel>1){
        bannerVisivel--
    }
    else{
        bannerVisivel=3
    }
  }
  function next(){
    if(bannerVisivel<3){
        bannerVisivel++
    }
    else{
        bannerVisivel=1
    }
  }

  const loadBanners = async() => {
        const lojaI = new LojaImagensController()
        const [data,error] = await lojaI.listarBanner(parseInt($idLoja))
        if(error) toast.error("Notificação do sistema",error.message)
        banners = data.banners

    }

  const setarBanner = async(id:number)=>{

        banners.forEach((obj)=>{
            if(obj.id===id){
                obj.ordem = bannerVisivel
            }else if(obj.ordem===bannerVisivel){
                deselecionarBanner(obj.id)
            }
        })

        
        const lojaI = new LojaImagensController()
        const [data,error] = await lojaI.setarOrdemBanner(parseInt($idLoja),id,bannerVisivel)

  }

    const deselecionarBanner = async(id:number)=>{

        banners.forEach((obj)=>{
            if(obj.id===id){
                obj.ordem = -1
        }})
          
        const lojaI = new LojaImagensController()
        const [data,error] = await lojaI.setarOrdemBanner(parseInt($idLoja),id,-1)
        if(error) toast.error("Notificação do sistema",error.message)

    }

  onMount(()=>{
    loadBanners()

  })

</script>



<div class="w-[440px] max-w-[440px] border border-soft-200 rounded-2xl flex flex-col">
    {@render conteudo()}
  </div>
  
  {#snippet conteudo()}
    <div class="flex items-center justify-between gap-3.5 p-4 w-full">
        <div class="flex flex-col">
            <p class="text-strong-950 font-medium text-16">Configurar Banners</p>
            <p class="text-sub-600 font-normal text-14">Você pode cadastrar até 8 peças </p>
        </div>
        <div class="h-[36px] grid">
            <Botao tema={'primary'} onClick={()=>open=true}>
                <div class="flex gap-1 items-center">
                    <SvgPlus props={{
                        class:"fill-white"
                    }}/>
                    Peça    
                </div>
            </Botao>    
        </div>

    </div>
    <FillText texto="BANNERS" />
    <div class="p-4 flex flex-col gap-3">
        <div class="flex items-center justify-between text-[12px]">
            Banner {bannerVisivel} de 3
            <div class="grid grid-cols-2 h-[24px] gap-x-2">   
                {#each {length:2} as _,i}
                    <button class="w-[24px] h-[24px] border border-soft-200 flex items-center justify-center rounded-md" onclick={()=>{
                        i==0 ? back() : next()
                        }}>
                            <SvgCaret props={{
                                class:i==0 ? "rotate-90" : "rotate-270"
                            }}/>
                    </button>
                {/each}
            </div>
        </div>
        <div class="overflow-hidden bg-weak-50 rounded-xl justify-center group items-center relative gap-4 h-[148px] max-h-[148px] w-full flex flex-col">
                {#if bannerAtual}
                    <div class="opacity-0 pointer-events-none group-hover:pointer-events-auto group-hover:opacity-100  absolute flex right-0 top-0 m-2 mr-3">
                        <button onclick={()=>{
                            deselecionarBanner(bannerAtual.id)
                        }}
                        class="text-sub-600 text-[12px] border border-soft-200 bg-white-0 p-[2px] px-[4px] rounded-md">
                            Deselecionar
                        </button>
                    </div>
                    <img src={bannerAtual.url} class="w-full h-full object-cover" alt=""/>
                {:else}
                    <div class="flex flex-col items-center p-10 gap-2 text-center text-sub-600 text-[12px]">
                        <SvgImagem/>
                        Preencha o espaço do banner clicando em uma das peças cadastradas.    
                    </div>
                {/if}
        </div>
    </div>
    <FillText texto="PEÇAS CADASTRADAS" />

    {#if banners.length===0}
        <div class="p-4 flex flex-col justify-center items-center">
            <img src="/images/emoji-no-imagem.png" alt="" class="w-[204px]">
            <b class="text-[14px]">
                Nenhuma peça encontrada
            </b>
            <span class="text-sub-600 text-[12px]">
                Salve as peças para armazena-las aqui.
            </span>
        </div>
    {:else}
        <div class="grid grid-cols-2 gap-x-3 gap-y-2 p-3">
            {#each banners as b}
                <div class="flex overflow-hidden group h-[122px] max-h-[122px] relative rounded-[17px] p-[3px] border-3 
                {b.ordem!==null && b.ordem>0 ? "border-purple-400" :  "hover:border-purple-200 border-transparent"}">
                    <button class="absolute top-0 left-0 w-full h-full" aria-label="Selecionar banner"
                    onclick={()=>{
                       setarBanner(b.id)
                    }}>
                    </button>

                    <div class="opacity-0 pointer-events-none group-hover:pointer-events-auto group-hover:opacity-100  absolute flex
                    items-center justify-between w-full right-0 p-2 px-3 left-0 ">
                            <button onclick={()=>{
                                if(!uploadContainer) return
                                uploadContainer.modoEdicao(b)
                            }} 
                            class="text-sub-600 text-[12px] border border-soft-200 bg-white-0 p-[2px] px-[4px] rounded-md">
                                Editar
                            </button>
                            <button onclick={()=>{
                                bannerIdFocus = b.id
                                openDeleteModal=true
                            }}
                                class="text-sub-600 text-[12px] w-[24px] h-[24px] flex items-center justify-center bg-error-base hover:bg-error-dark rounded-md">
                                    <SvgTrash props={{
                                        width:12,
                                        height:12,
                                        class:"fill-white-0",
                                    }}/>
                            </button>
                    </div>
                    <img src={b.url} alt={b.tipo} class="object-cover  w-full h-full rounded-[14px]">                    
                </div>


            {/each}    
        </div>
    {/if}
    <!-- <div class="px-3 my-3 w-full h-[40px] grid">
        <Botao tema="primary" onClick={()=> ''} {loading}>
          Salvar
        </Botao>
    </div> -->
  {/snippet}


<UploadFiles bind:this={uploadContainer} onSalvar={loadBanners} bind:open/>

<PopUp bind:open={openDeleteModal} withDefaultPadding={false} withCloseButton={false}>
    <div class="flex flex-col w-[400px]">
        <div class="flex gap-4 p-4 px-4">
            <div class="bg-error-light mt-1 shrink-0 rounded-md w-6 h-6 flex items-center justify-center">
                <SvgAlerta props={{
                    class:"fill-error-base w-4 h-4"
                }}/>
            </div>
            <div class="leading-1.5 flex-col justify-start items-start gap-1">
                <div class="justify-start text-[14px] text-strong-950 text-base font-medium">
                    Tem certeza que deseja excluir essa peça?
                </div>
                <div class="justify-start text-sub-600 text-[12px] text-sm font-light">
                    Essa ação é irreversível e a peça será apagada do nosso banco de dados.
                </div>
            </div>  
        </div>
        <div class="w-full h-[1px] bg-soft-200">        
        </div>
        <div class="grid grid-cols-2 px-4 my-3 w-full h-[36px] gap-x-3">
            <Botao tema="gray-transparent" onClick={()=>{}}>
                Cancelar
            </Botao>
            <Botao tema="red" onClick={()=>{
                new LojaImagensController().deletarBanner(parseInt($idLoja),bannerIdFocus)
                banners = banners.filter((obj)=>obj.id!==bannerIdFocus)
                openDeleteModal=false
            }}>
                Excluir
            </Botao>
        </div>
    
    </div>
</PopUp>