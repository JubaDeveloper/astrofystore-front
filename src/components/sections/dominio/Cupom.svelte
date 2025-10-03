<script lang="ts">
  import Badge from "$components/assets/badge/Badge.svelte";


  import Botao from "$components/assets/buttons/Botao.svelte";
  import DropBlock from "$components/assets/logic/DropBlock.svelte";
  import FocusBlock from "$components/assets/logic/FocusBlock.svelte";
  import SvgAdd from "$components/assets/svg/SvgAdd.svelte";
  import SvgCupom from "$components/assets/svg/SvgCupom.svelte";
  import SvgTriangle from "$components/assets/svg/SvgTriangle.svelte";
  import SvgX from "$components/assets/svg/SvgX.svelte";
  import LoaderSmooth from "$components/elements/loading/LoaderSmooth.svelte";
  import InputWrapper from "$components/elements/wrappers/InputWrapper.svelte";
  import carrinhoData from "$lib/api/modules/carrinho/carrinho.data.svelte";
  import cupomController from "$lib/api/modules/cupom/cupom.controller";
  import type { CupomResponseDto } from "$lib/api/modules/cupom/cupom.dto";
  import domainManager from "$lib/settings/domain.svelte";
  import { scale } from "svelte/transition";

  interface Props{
    modo: "edicao" | "visualizacao"
  }

  let {modo}:Props = $props()

  let openCupom = $state(false)
  let loading = $state(false)
  let error = $state(false)

  let inputCupom = $state("")

  async function addCupom(){
    loading=true
    error=false
    const [r,e] = await cupomController.verificarCupom(domainManager.lojaId!,inputCupom)
    if(e){
        loading=false
        error=true
        setTimeout(()=>{
            error=false
        },4000)
        carrinhoData.cupomAplicado = undefined
        return
    }
    openCupom=false
    loading=false
    carrinhoData.cupomAplicado = r.data
    console.log(r.data)
    
  }

</script>



<FocusBlock className='relative' itensWithFocus={["input"]} bind:isFocus={openCupom}>
    {#if !carrinhoData.cupomAplicado}
        {#if modo==="edicao"}
            <Botao tema="primary" onClick={()=>{openCupom=true}}>
                ADICIONAR
            </Botao>
        {:else}
            Nenhum cupom aplicado
        {/if}
    
    {:else}
    <Badge  tema="feature-lighter" css="h-[26px] rounded-lg px-1 pr-1.5">
        <SvgCupom padrao={1} props={{
            class:"shrink-0 ml-2.5 fill-primary-base mr-0.5"
        }}/>
        {carrinhoData.cupomAplicado.codigo}
        {#if modo==="edicao"}
            <button class="p-1" onclick={()=>{
                carrinhoData.cupomAplicado = undefined
            }}>
                <SvgX props={{
                    class:"fill-sub-600"
                }}/>
            </button>        
        {/if}
    </Badge>
    {/if}
    {#if openCupom}
    <div transition:scale  class="top-[-120px] left-[-240px] flex flex-col grow-0 rounded-xl  shrink-0 absolute p-4 px-8" >
        <div class="absolute z-0 top-0 left-0">
            {@render balao()}
        </div>        
        <InputWrapper label="Cupom de desconto" error={error ? "Cupom expirado/não encontrado" : ""} value="">
            <div class="flex items-center h-[40px] shrink-0 z-[2] border {error ? "border-error-base" : "border-soft-200"} rounded-lg mt-0.5">
                <SvgCupom props={{
                    class:`${error && "fill-error-base"} shrink-0 ml-2.5`
                }}/>
                <input type="text"  
                bind:value={inputCupom}
                onkeydown={(e)=>{
                    if(e.key=="Enter"){
                        addCupom()
                    }
                }}
                placeholder="Ex: 4STRONFY" 
                class="shrink outline-0 {error ? "text-error-base" : "text-strong-950"} border-0 pl-2 placeholder:text-sub-600"/>
                <button 
                disabled={loading}
                class="h-full flex items-center shrink-0 justify-center w-[40px]  disabled:cursor-default border-l {error ? "border-error-base" : "border-soft-200"}" 
                onclick={addCupom}>
                    {#if loading}
                        <div class="pl-2.5">
                            <LoaderSmooth cor="text-black" tamanho={"w-[20px]"}/>		
                        </div>
                    {:else}
                        <SvgAdd props={{
                            class:"fill-strong-950 w-4 h-4",
                        }}/>
                    {/if}
                </button>
            </div>    
        </InputWrapper>
    </div>
    {/if}
    
</FocusBlock>


{#snippet balao()}
<svg width="360" height="144" viewBox="0 0 360 144" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g filter="url(#filter0_d_31_5141)">
    <g clip-path="url(#clip0_31_5141)">
    <path d="M20 20C20 11.1634 27.1634 4 36 4H324C332.837 4 340 11.1634 340 20V92C340 100.837 332.837 108 324 108H36C27.1634 108 20 100.837 20 92V20Z" fill="white"/>
    <mask id="path-3-inside-1_31_5141" fill="white">
    <path d="M20 4H340V108H20V4Z"/>
    </mask>
    <path d="M20 4H340V108H20V4Z" fill="white"/>
    <path d="M340 108V107H20V108V109H340V108Z" fill="#E1E4EA" mask="url(#path-3-inside-1_31_5141)"/>
    </g>
    <path d="M36 4.5H324C332.56 4.5 339.5 11.4396 339.5 20V92C339.5 100.56 332.56 107.5 324 107.5H36C27.4396 107.5 20.5 100.56 20.5 92V20C20.5 11.4396 27.4396 4.5 36 4.5Z" stroke="#E1E4EA"/>
    </g>
    <path d="M298.422 114.111C299.404 114.912 300.852 114.855 301.768 113.939L309.207 106.5L290.793 106.5L298.232 113.939L298.422 114.111Z" fill="white" stroke="#E1E4EA"/>
    <rect x="288" y="103" width="24" height="4" rx="2" fill="white"/>
    <defs>
    <filter id="filter0_d_31_5141" x="0" y="0" width="360" height="144" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
    <feFlood flood-opacity="0" result="BackgroundImageFix"/>
    <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
    <feMorphology radius="12" operator="erode" in="SourceAlpha" result="effect1_dropShadow_31_5141"/>
    <feOffset dy="16"/>
    <feGaussianBlur stdDeviation="16"/>
    <feColorMatrix type="matrix" values="0 0 0 0 0.0533333 0 0 0 0 0.0693333 0 0 0 0 0.106667 0 0 0 0.1 0"/>
    <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_31_5141"/>
    <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_31_5141" result="shape"/>
    </filter>
    <clipPath id="clip0_31_5141">
    <path d="M20 20C20 11.1634 27.1634 4 36 4H324C332.837 4 340 11.1634 340 20V92C340 100.837 332.837 108 324 108H36C27.1634 108 20 100.837 20 92V20Z" fill="white"/>
    </clipPath>
    </defs>
</svg>

{/snippet}
