<script lang="ts">
  import { goto } from "$app/navigation";
  import { page } from "$app/state";



  import Avatar from "$components/assets/avatar/Avatar.svelte";
  import Botao from "$components/assets/buttons/Botao.svelte";
  import Link from "$components/assets/links/Link.svelte";
  import SvgDiscord from "$components/assets/svg/SvgDiscord.svelte";
    import SvgGridBgDireita from "$components/assets/svg/SvgGridBgDireita.svelte";
    import SvgGridBgEsquerda from "$components/assets/svg/SvgGridBgEsquerda.svelte";
  import SvgPinaculo from "$components/assets/svg/SvgPinaculo.svelte";
  import { onMount } from "svelte";
  import { quadInOut } from "svelte/easing";
  import { fade, fly, slide } from "svelte/transition";
 
  let {children} = $props()
 
  let indexLeitorLateral = $state<number>(0)

  let contemLeitorLateral = $derived.by<boolean>(()=>{
    const pathname = page.url.pathname
    if(pathname==="/login"){
        return true
    }
    return false
    
    
  })

  const infoLateral = [
    {
        avatar:"",
        usuario:"Tim Maia",
        texto:"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
        cargo:"CEO"
    },
    {
        avatar:"",
        usuario:"Tim Maia",
        texto:"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
        cargo:"CEO"
    },
    {
        avatar:"",
        usuario:"Tim Maia",
        texto:"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
        cargo:"CEO"
    },
  ] 



  onMount(()=>{

    const interval = setInterval(()=>{
        if(indexLeitorLateral===infoLateral.length-1){
            indexLeitorLateral=0
        }
        else{
            indexLeitorLateral++
        }
    },5000)

    return() => {
        clearInterval(interval)
    }
  })

</script>

<div class="flex ease-in-out justify-between bg-weak-50 w-screen h-svh max-h-svh  data-[leitor]:p-2 gap-2" data-leitor={contemLeitorLateral ? true : null}>

    <div class="flex flex-col grow ease-in-out justify-between bg-white-0 rounded-2xl duration-[850ms] transition-all py-4">

        <div class="flex items-center justify-between pb-4 border-b data-[leitor]:border-transparent border-soft-200 px-6" data-leitor={contemLeitorLateral ? true : null}>
            {@render top()}
        </div>

        <div class="relative flex items-center justify-center w-full grow">
                <div class="absolute flex justify-between items-start left-0 top-0 overflow-hidden w-full h-full">
                    <SvgGridBgEsquerda props={{
                        class:"h-full z-0",
                    }}/>

                    <SvgGridBgDireita props={{
                        class:"h-full z-0"
                    }}/>
    
                </div>
                {#key page.url.pathname}

                    {@const durationAnim = 600}
                
                    <div class=" absolute max-h-[95%] w-full grow flex flex-col justify-center items-center "
                    in:fly={{y:-400,duration:durationAnim,delay:durationAnim/1.5,easing:quadInOut}}
                    out:fly={{x:-1000,duration:durationAnim,easing:quadInOut}}
                    >
                        {@render children()}
                    </div>
                
                {/key}
        </div>

        <div class="flex items-center border-t {contemLeitorLateral ? "border-transparent" : " border-soft-200"} 
        justify-between max-h-[60px] h-[60px] self-center text-14  text-sub-600 pt-3 px-8 
        {contemLeitorLateral ? "w-[200px]" : "w-full grow"} transition-all duration-200">
            
            <div class="[word-spacing:1px] whitespace-nowrap">
                @ 2025 ASTRONFY
            </div>
            
            {#if !contemLeitorLateral}
            <div transition:slide={{axis:"x"}}>
                {@render precisaAjuda()}
            </div>
            {/if}
    
        </div>
    </div>

    {#if contemLeitorLateral}
        <div
        transition:slide={{axis:"x",duration:500,easing:quadInOut}}
        class="flex flex-col  justify-between transition-all ease-in-out duration-500 overflow-hidden background text-white-0 relative items-center 
        w-[447px] py-9">
            {@render leitorLateral()}
        </div>
    {/if}
</div>



{#snippet leitorLateral()}

    <div class="flex flex-col px-8 gap-20">
        <span class="text-weak-50 selft-start w-full font-normal [letter-spacing:2px]">OLÁ LOJISTA</span>
        <div class="flex flex-col gap-2 ">
            <h3 class="leading-12 font-medium ">Seja bem vindo de volta à Astronfy!</h3>
            <p class="text-weak-50 text-[16px]">Estávamos sentindo sua falta. Acesse a plataforma e continue vendendo seus produtos com todas as vantagens que a Astronfy oferece!</p>
        </div>
    
    </div>

    <div class="absolute anim z-10">
        <img src="/images/emoji-money.png" class="loop-anim w-[370px]" alt="">
    </div>

    <div class="flex flex-col w-full">

        <div class="flex items-center gap-2 overflow-hidden w-full ml-8">
                {#each infoLateral as info}
                    <div class="shrink-0 w-72 p-5 bg-purple-700 rounded-2xl shadow-[0px_16px_32px_-12px_rgba(14,18,27,0.10)] outline  
                    outline-offset-[-1px] outline-purple-600 inline-flex flex-col justify-start items-start gap-4"
                    style="transform:translateX(-{indexLeitorLateral*288}px)"
                    >
                        <div class="self-stretch inline-flex justify-start items-center gap-2.5">
                            <Avatar src={info.avatar} name={info.usuario}/>
                        </div>
                        <div class="self-stretch justify-start text-neutral-0 text-sm font-normal leading-tight">
                            {info.texto}
                        </div>
                        <div class="self-stretch flex flex-col justify-start items-start">
                            <div class="self-stretch flex flex-col justify-start items-start gap-1">
                                <div class="justify-start text-text-white-0 text-sm font-normal leading-tight tracking-wide">{info.usuario}</div>
                                <div class="justify-start text-text-disabled-300 text-xs font-light leading-none">{info.cargo}</div>
                            </div>
                        </div>
                    </div>
                    
                {/each}
        </div>

        <div class="flex items-center justify-center mt-6 gap-2">
            {#each infoLateral as _,i}
                <button class="h-2 w-2 data-[current]:w-4 data-[current]:bg-white-0 bg-alpha-white-alpha-24 rounded-full " 
                aria-label={"Indice "+i} 
                onclick={()=>indexLeitorLateral=i}
                data-current={indexLeitorLateral===i ? true : null}>

                </button>
            {/each}

        </div>

    </div>

{/snippet}

{#snippet top()}
{@const path = page.url.pathname}


    {#if path==="/login"}
        <button onclick={()=>goto("/login")}>
            <Avatar size="w-[40px]" src="/images/astronfy.png" name="logo"/>
        </button>
    {:else}
        <div class="flex items-center gap-3">
            <button onclick={()=>goto("/login")}>
                <Avatar size="w-[50px]" src="/images/astronfy.png" name="logo"/>
            </button>
            <div class="flex flex-col [letter-spacing:0.2px]">
                <b class="text-18 font-medium">
                    {#if path==="/recuperar-conta"}
                        Recupere sua conta
                    {:else}
                        Cadastro
                    {/if}
                </b>
                <span class="text-14 text-sub-600 font-normal">
                
                    {#if path==="/recuperar-conta"}
                        Preencha os campos
                    {:else}
                        Complete os dados cadastrais                

                    {/if}
                </span>
            </div>
        </div>
    {/if}

    <div class="flex items-center gap-1 text-[14px] font-normal text-sub-600">
        {#if page.url.pathname==="/cadastro" || page.url.pathname==="/redefinir-senha" || page.url.pathname==="/confirmacao" || page.url.pathname==="/cadastro-concluido"}

            <div class="flex items-center gap-2">
                Já tem uma conta?
                <Botao tema="gray-transparent" onClick={()=>goto("/login")}>
                    Login
                </Botao>
            </div>

        {:else}
            {@render precisaAjuda()}
        {/if}
    </div>
{/snippet}

{#snippet precisaAjuda()}
    <div class="flex items-center gap-2 whitespace-nowrap">
        Precisa de ajuda?
        <Botao tema="gray-transparent" onClick={()=>goto("/cadastro")}>
            <SvgDiscord/>
            Suporte
        </Botao>
    </div>
{/snippet}

<style>
    .background{
        border-radius: 16px;
        background: linear-gradient(349deg, var(--purple-700, #681CE3) 0%, var(--purple-500, #775CFF) 100%);
    }
    .anim{
        animation: star forwards 4s;
    }
    .loop-anim{
        animation:float infinite 2s ease-in-out;
    }
    @keyframes float{
        0%{
            transform: translate(0,0);
        }
        50%{
            transform: translate(0,10px);
        }
        100%{
            transform: translate(0,0);
        }
    }

    @keyframes star{
        0%{
            transform: translate(400px,200px) rotate(40deg);
        }
        100%{
            transform: translate(100px,110px);
        }
    }
</style>