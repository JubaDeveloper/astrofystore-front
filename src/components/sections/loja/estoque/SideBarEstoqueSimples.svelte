<script lang="ts">
    import { page } from "$app/state";
    import Botao from "$components/assets/buttons/Botao.svelte";
    import Input from "$components/assets/input/Input.svelte";
    import InputPreco from "$components/assets/input/InputPreco.svelte";
    import Number from "$components/assets/input/Number.svelte";
    import TextArea from "$components/assets/input/TextArea.svelte";
    import SelectBlock from "$components/assets/logic/SelectBlock.svelte";
    import SelectMainWithSnippet from "$components/assets/select/Select_Main_With_Snippet.svelte";
    import SelectOptionWithSnippet from "$components/assets/select/Select_Option_With_Snippet.svelte";
    import BubbleWrapper from "$components/elements/wrappers/BubbleWrapper.svelte";
    import InputWrapper from "$components/elements/wrappers/InputWrapper.svelte";
    import type { FormEstoqueSimples } from "$lib/api/modules/lojas/estoque/estoque.dto";
    import query from "$lib/api/query";
    import storageService from "$lib/utils/storageService";
    import { onMount } from "svelte";
    import InputEstoque from "./InputEstoque.svelte";
    import { effectBy } from "$lib/utils/utils.svelte";
    import SideBar from "$components/sections/nav/SideBar.svelte";
    import SidePop from "$components/assets/modals/SidePop.svelte";
    import SvgImagem from "$components/assets/svg/SvgImagem.svelte";
    import SvgThreeDots from "$components/assets/svg/SvgThreeDots.svelte";
    import Upload from "$components/assets/upload/Upload.svelte";
    import TabMenuHorizontal from "$components/assets/tabs/TabMenuHorizontal.svelte";
    import Tabs from "$components/assets/tabs/Tabs.svelte";
  import { ProdutoVariacaoController } from "$lib/api/modules/produto/variacao/produto.variacao.controller";
  import { idLoja } from "$lib/utils/rotas.svelte";
  import { EstoqueVariacaoController } from "$lib/api/modules/lojas/estoque/variacao/estoque.variacao.controller";
    
    interface Props{
      back:VoidFunction,
      open:boolean,
    }
  
    let {back,open = $bindable()}:Props = $props()
  
    let loading = $state(false)
    let form = $state({
      nome:"",
      estoqueBaixo:0,
      itensEstoque:[],
      preco:0,
      status:"ativo",
      tipo:"lista",
      mensagem:""
    })

    let formImage = $state({
        file:null,
        data64:""
    })
    
    let tabItem = $state("Configurações")

    const idProduto = parseInt(page.params.idProduto)
  


  </script>
  
  
  {#snippet greenBtn()}
      <div class="w-2 aspect-square bg-green-400 rounded-full"></div>
  {/snippet}
  {#snippet redBtn()}
      <div class="w-2 aspect-square bg-red-400 rounded-full"></div>
  {/snippet}
  
  <SidePop curved={true} bind:open>
      <div class="w-full px-4 flex items-center justify-between">
        <div class="flex gap-3 items-center">
            <div class="w-[32px] h-[32px] grow-0 shrink-0 aspect-square rounded-[6px] relative flex items-center justify-center bg-soft-200">
                <SvgImagem props={{
                    class:"fill-soft-400"
                }}/>
                <div class="absolute border-white-0 border-2 shadow-md bg-soft-200 w-3 aspect-square rounded-full -right-1 -bottom-0.5"></div>
            </div>
            <div class="flex flex-col leading-4">
                <span class="text-[14px]">1 Tela - 1 Mês</span>
                <span class="text-[12px] text-error-base">Item sem preço</span>
            </div>    
        </div>
        <button class="p-2">
            <SvgThreeDots/>
        </button>
      </div>

      <div class="w-full h-[1px] bg-soft-200 my-3"></div>

      <Tabs bind:labelSelected={tabItem} options={[
        {
            label:"Configurações",
        },
        {
            label:"Atributos"
        }
      ]}/>  
  

        {#if tabItem==="Configurações"}
            {@render formSnippet()}
        {:else}
            <div></div>
        {/if}

      <div class="flex flex-col grow justify-end w-full">
        <div class="w-full h-[1px] bg-soft-200 my-3"></div>
        <div class="grid grid-cols-2 gap-x-3 px-4 h-[40px] w-full">
            <Botao onClick={back} tema="gray-transparent">
                Voltar 
            </Botao>
            <Botao onClick={()=>{}} {loading} tema="primary">
              Salvar
            </Botao>
        </div>
  
      </div>

    </SidePop>
  
  
{#snippet formSnippet()}
<div class="grid grid-cols-8 gap-x-3 gap-y-2 px-4 mt-4">
    <div class="col-span-5">
        <Input  label="Nome do Item" mandatory={true} bind:value={form.nome} placeholder="Ex: item 1" />
    </div>
    <div class="col-span-3">
        <InputWrapper label="Status" value="">
            <SelectBlock placeholder="Selecione" bind:value={form.status} focusCss="relative h-[40px]" MainComponent={SelectMainWithSnippet} OptionComponent={SelectOptionWithSnippet} options={[
                {
                    label:"Ativo",
                    value:"ativo",
                    snippet:greenBtn
                },
                {
                    label:"Inativo",
                    value:"inativo",
                    snippet:redBtn
                }
            ]}/>    
        </InputWrapper>
    </div>
    <div class="col-span-8">
      <Upload bind:formImage mandatory={false} size="h-[200px] max-h-[200px] object-contain" label="Imagem"/>
    </div>
    <div class="col-span-8">
        <InputPreco bind:value={form.preco} placeholder="" label="Preço" mandatory={true}/>
    </div>
    <div class="col-span-5">
        <InputWrapper label="Tipo de Estoque" mandatory={true} value="">
            <SelectBlock placeholder="Selecione" removableOnClick={false} bind:value={form.tipo} focusCss="relative h-[40px]" MainComponent={SelectMainWithSnippet} OptionComponent={SelectOptionWithSnippet} options={[
                {
                    label:"Lista",
                    value:"lista",
                },
                {
                    label:"Descrição",
                    value:"descricao",
                }
            ]}/>    
        </InputWrapper>
    </div>
    <div class="col-span-3">
        <Number extraTip="Para ser notificado quando o estoque estiver acabando, defina um valor abaixo do qual você quer ser alertado." 
        label="Estoque Baixo" bind:value={form.estoqueBaixo} limit={1000}/>
    </div>
    <div class="col-span-8">
        {#if form.tipo==="lista"}
          <InputEstoque bind:tags={form.itensEstoque}/>
        {:else}
            <TextArea label="Descrição" limit={300} placeholder="Digite..." value=""/>
        {/if}
    </div>
</div>
{/snippet}