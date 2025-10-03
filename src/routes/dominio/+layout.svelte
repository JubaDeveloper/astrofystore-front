<script lang="ts">
  import MaisCategorias from "$components/sections/loja/loja-publica/MaisCategorias.svelte";
  import PesquisaShort from "$components/sections/loja/loja-publica/PesquisaShort.svelte";
  import MenuUsuario from "$components/sections/loja/loja-publica/MenuUsuario.svelte";
  import SvgInstagram from "$components/assets/svg/SvgInstagram.svelte";
  import SvgWhatsapp from "$components/assets/svg/SvgWhatsapp.svelte";
  import Avatar from "$components/assets/avatar/Avatar.svelte";
  import Botao from "$components/assets/buttons/Botao.svelte";
  import SvgBell from "$components/assets/svg/SvgBell.svelte";
  import SvgCart from "$components/assets/svg/SvgCart.svelte";
  import domainManager from "$lib/settings/domain.svelte";
  import handleDate from "$lib/sanitizers/time";
  import type { Categoria } from "$lib/api/modules/produto/produto.dto.svelte";
  import type { DataLojaDto } from "$lib/api/modules/lojas/lojas.dto";
  import { fade, slide } from "svelte/transition";
  import { goto } from "$app/navigation";
  import { page } from "$app/state";
  import { onMount } from "svelte";
  import Notificacao from "$components/elements/notificacao/Notificacao.svelte";
  import SideBarCarrinho from "$components/sections/dominio/SideBarCarrinho.svelte";
  import ModalAvaliar from "$components/sections/avaliacao/ModalAvaliar.svelte";
  import SvgSuporte from "$components/assets/svg/SvgSuporte.svelte";
  import { browser } from "$app/environment";
  import sinalizador from "$lib/utils/signal.svelte";
  import storageService from "$lib/utils/storageService";
  import toast from "$lib/utils/toast.svelte";

  let rotaDivergente = $state(page.url.pathname)

  $effect(()=>{
    if(page.url.pathname) rotaDivergente = page.url.pathname
  })

  const corteCategorias = 3;
  const redesSociais = [
    {
      icon: SvgInstagram,
      link: "https://instagram.com",
    },
    {
      icon: SvgWhatsapp,
      link: "https://whatsapp.com",
    },
  ];
  const linksUteis = [
    {
      label: "Políticas da loja",
      link: "/politicas",
    },
    {
      label: "Torne-se um lojista",
      link: "/torne-se",
    },
    {
      label: "Denunciar loja",
      link: "/denunciar",
      red: true,
    },
  ];

  let categoriasMain = $derived.by<Categoria[]>(() => {
    if (domainManager.lojainfo) {
      return domainManager.lojainfo.categorias;
    }
    return [];
  });

  let logado = $state<boolean>(false);
  let novoItemCarrinho = $state(false)
  
  let { children } = $props();
  let openCarrinho: boolean = $state(false);

  function buscarLogin() {
    const token = localStorage.getItem("astronfy-token");
    const usuario = localStorage.getItem("astronfy-user");
    if (!token || !usuario){
      logado=false
      return;
    }

    logado = true;
  }

  $effect(() => {
    if (page.url.pathname) buscarLogin();
  });

  $effect(()=>{
    if(sinalizador.signal.tipo==="novoItemCarrinho"){
      novoItemCarrinho=true
    }
  })

  onMount(() => {
    buscarLogin();
   console.log(storageService.getStoredData("astronfy-token"))
  });
</script>

{#snippet header(infoLoja: DataLojaDto)}
  <header
    class="grid grid-cols-3 w-full p-4 border-b border-soft-200 z-10 sticky top-0 bg-white-0"
  >
    <div class="col-span-1">
      <button
        class="flex items-center gap-2 text-[16px] font-semibold"
        onclick={() => {
          goto("/");
        }}
      >
        <Avatar src={infoLoja.logo} name={infoLoja.loja.nome} />
        {infoLoja.loja.nome}
      </button>
    </div>
    <div class="flex items-center gap-4 col-span-1 justify-center">
      {#each categoriasMain.slice(0, corteCategorias) as categoria}
        <button
          class="text-sub-600 hover:text-strong-950 text-[14px]"
          onclick={() => goto("/categoria/" + categoria.nome)}
        >
          {categoria.nome}
        </button>
      {/each}
      {#if categoriasMain.length > corteCategorias}
        {@const outrasCategorias = categoriasMain.slice(corteCategorias)}
        <MaisCategorias categorias={outrasCategorias} />
      {/if}
    </div>
    <div class="flex items-center gap-3 col-span-1  justify-end">
      <div class="grid h-[40px] aspect-square relative">
        <Botao onClick={() => {
          openCarrinho=true
          novoItemCarrinho=false
        }} tema="gray-transparent">
          {#if novoItemCarrinho}
            <div class="absolute w-2 aspect-square rounded-full bg-orange-300 -right-0.5 -top-0.5">
            </div>
          {/if}
          <SvgCart />
        </Botao>
      </div>
      <div class="grid h-[40px] aspect-square">
        <Botao onClick={() => {}} tema="gray-transparent">
          <SvgBell />
        </Botao>
      </div>
      <PesquisaShort />
      {#if logado}
        <MenuUsuario />
      {:else}
        <div class="flex h-[40px]">
          <Botao tema={"primary"} onClick={() => goto("/login")}>Login</Botao>
        </div>
      {/if}
    </div>
  </header>
  <!-- <Notificacao bind:open/> -->
{/snippet}

{#snippet footer(infoLoja: DataLojaDto)}
  <footer
    class="bg-weak-50 grid grid-cols-4 w-full p-7 border-t border-soft-200"
  >
    <div class="flex flex-col justify-between gap-12 col-span-1">
      <div class="flex flex-col gap-2">
        <button
          class="flex items-center gap-2 text-[16px] font-semibold col-span-1"
          onclick={() => {
            goto("/");
          }}
        >
          <Avatar src={infoLoja.logo} name={infoLoja.loja.nome} />
          {infoLoja.loja.nome}
        </button>
        <p class="text-sub-600 text-[12px]">
          {infoLoja.loja.descricao}
        </p>
      </div>
      <b class="text-strong-950 text-[12px]">
        © {handleDate.formatISODate(infoLoja.loja.criadoEm, `yyyy`)}
        {infoLoja.loja.nome}. Todos os direitos reservados
      </b>
    </div>
    <div class="flex flex-col gap-2 col-span-1 items-center">
      <div class="flex flex-col">
        <b class="px-1 text-left"> Links úteis </b>
        <div class="flex flex-col mt-2">
          {#each linksUteis as link}
            <button
              onclick={() => {
                if(link.red && !storageService.getStoredData("astronfy-token")){
                  toast.alert("Para denunciar a loja você precisa estar logado!","")
                  goto("/login?redirect=/denunciar")
                  return
                }
                goto(link.link)
              }}
              class="{link.red
                ? 'text-error-base'
                : 'text-sub-600'} hover:underline text-[12px] text-left p-1"
            >
              {link.label}
            </button>
          {/each}
        </div>
      </div>
    </div>

    <div class="flex flex-col gap-2 col-span-1 items-center">
      <div class="flex flex-col">
        <b class="px-1 text-left"> Categorias </b>
        <div class="flex flex-col mt-2">
          {#each categoriasMain as categoria, i}
            {#if i < 4}
              <button
                onclick={() => goto(`/categoria/${categoria.nome}`)}
                class="hover:underline text-sub-600 text-[12px] text-left p-1"
              >
                {categoria.nome}
              </button>
            {/if}
          {/each}
        </div>
      </div>
    </div>

    <div class="flex flex-col gap-2 items-end justify-between">
      <div class="flex flex-col">
        <b class="px-1"> Confira nossas redes sociais </b>
        <div class="flex items-center justify-end gap-2 mt-2">
          {#each redesSociais as rede}
            {@const Rede = rede.icon}
            <button
              class="rounded-full flex items-center border border-soft-200 justify-center w-[48px] aspect-square bg-white-0"
            >
              <Rede />
            </button>
          {/each}
        </div>
      </div>
      <span class="text-[12px]">
        Desenvolvida por <a target="_blank" href="https://astrofy.site/"
          >Astrofy</a
        >
      </span>
    </div>
  </footer>
{/snippet}

{#snippet top()}
  {@const path = page.url.pathname}
  <div class="flex items-center justify-between px-6 pt-6">
    {#if path === "/login"}
      <button class="flex items-center gap-2" onclick={() => goto("/")}>
        <Avatar
          size="w-[40px]"
          src={domainManager.lojainfo!.logo}
          name="logo"
        />
        <span class="text-14 font-medium text-strong-950"
          >{domainManager.lojainfo?.loja.nome}</span
        >
      </button>
    {:else}
      <div class="flex items-center gap-3">
        <button onclick={() => goto("/login")}>
          <Avatar size="w-[50px]" src="/images/astronfy.png" name="logo" />
        </button>
        <div class="flex flex-col [letter-spacing:0.2px]">
          <b class="text-18 font-medium">
            {#if path === "/recuperar-conta"}
              Recupere sua conta
            {:else}
              Cadastro
            {/if}
          </b>
          <span class="text-14 text-sub-600 font-normal">
            {#if path === "/recuperar-conta"}
              Preencha os campos
            {:else}
              Complete os dados cadastrais
            {/if}
          </span>
        </div>
      </div>
    {/if}

        <div class="flex items-center gap-1 text-[14px] font-normal text-sub-600">
            {#if rotaDivergente !== '/login'}
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
    </div>
{/snippet}

{#snippet topDenuncia()}
    <div class="flex items-center justify-between px-6 pt-6 border-b border-soft-200 pb-7">
        <div class="flex items-center gap-1 text-[14px] font-normal text-sub-600">
            <div class="flex items-center gap-6">
              <Botao tema="gray-transparent" onClick={()=> window.history.back()}>
                Voltar
              </Botao>
              <span class="text-18 font-medium text-strong-950">Central de denuncias</span>
            </div>
        </div>

        <div class="flex items-center gap-2 whitespace-nowrap">
          Precisa de ajuda?
          <Botao tema="gray-transparent" onClick={()=>goto("/cadastro")}>
              <SvgSuporte/>
              Suporte
          </Botao>
      </div>
    </div>
{/snippet}

{#snippet precisaAjuda()}
  <div class="flex items-center gap-2 whitespace-nowrap">
    Precisa de ajuda?
    <Botao tema="gray-transparent" onClick={() => goto("/cadastro")}>
      <SvgSuporte />
      Suporte
    </Botao>
  </div>
{/snippet}

{#if domainManager.lojainfo && browser}
  <div class="flex flex-col h-full w-full overflow-y-auto max-w-screen overflow-x-hidden">
    {#if !['/login', '/cadastro', '/autenticacao', '/cadastro-concluido', '/confirmacao', '/recuperar-conta', '/redefinir-senha', '/central-denuncia'].includes(rotaDivergente)}
      {@render header(domainManager.lojainfo!)}
    {:else if ['/central-denuncia'].includes(rotaDivergente)}
      {@render topDenuncia()}
    {:else}
      {@render top()}
    {/if}
    <div class="grow flex flex-col relative">
      {#key page.url.pathname}
        {@const duration = 300}
        <div
          class="absolute grow h-full w-full"
          in:fade={{ delay: duration }}
          out:fade={{ duration }}
        >
          <div class="grow w-full h-full flex flex-col justify-between">
            <main class="flex py-4 flex-col grow {!['/login', '/cadastro', '/autenticacao', '/cadastro-concluido', '/confirmacao', '/recuperar-conta', '/redefinir-senha', '/central-denuncia'].includes(rotaDivergente) ? '':'h-full'} z-0">
              {@render children()}
            </main>
            {#if !['/login', '/cadastro', '/autenticacao', '/cadastro-concluido', '/confirmacao', '/recuperar-conta', '/redefinir-senha'].includes(rotaDivergente)}
              {@render footer(domainManager.lojainfo!)}
            {:else if rotaDivergente !== '/login'}
              <div class="flex items-center border-t border-soft-200 justify-between py-6 px-8 w-full">
                <span class="text-14 font-normal text-sub-600">@ 2025 ASTRONFY</span>
                <div transition:slide={{axis:"x"}}>
                  {@render precisaAjuda()}
                </div>
              </div>
            {:else}
              <div class="flex items-center justify-center w-full pb-6">
                <span class="text-14 font-normal text-sub-600"
                  >@ 2025 ASTRONFY</span
                >
              </div>
            {/if}
          </div>
        </div>
      {/key}
    </div>
  </div>
{/if}

<SideBarCarrinho bind:open={openCarrinho} />

<ModalAvaliar open={false} />
