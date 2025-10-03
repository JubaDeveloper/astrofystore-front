<script lang="ts">
  import DropBlock from "$components/assets/logic/DropBlock.svelte";
  import FocusBlock from "$components/assets/logic/FocusBlock.svelte";
import SvgSearch from "$components/assets/svg/SvgSearch.svelte";
  import Pesquisa from "$components/elements/search/Pesquisa.svelte";
  import InputWrapper from "$components/elements/wrappers/InputWrapper.svelte";
  import { ProdutoController } from "$lib/api/modules/produto/produto.controller.svelte";
  import type { Produto } from "$lib/api/modules/produto/produto.dto.svelte";
  import { idLoja } from "$lib/utils/rotas.svelte";
  import toast from "$lib/utils/toast.svelte";

  interface Props{
    produtoSelecionado:Produto | undefined
  }

  let {produtoSelecionado = $bindable()}:Props = $props()

  let value = $state("")
  let open = $state(false)
  let produtos = $state<Produto[]>([])

  const produtosC = new ProdutoController()

  export async function onProduto(p:Produto){
    value = p.nome
  }

  async function listar(){
    open=true
    const [r,e] = await produtosC.listarProdutos(parseInt($idLoja),{
        pesquisa:value
    })
    if(e){
        return toast.error("Erro no sistema",e.message)
    }
    produtos = r.resultado

  }

  async function select(p:Produto){
    produtoSelecionado = p
    onProduto(p)
    open=false
  }

</script>


<InputWrapper label="Selecione um produto" value="">

    <FocusBlock itensWithFocus={["input"]} bind:isFocus={open} className="flex items-center gap-2 px-3 rounded-[8px] py-2 grow apply-class-focus">
        <input 
        type="text" 
        id="input"
        bind:value
        class="outline-none w-full"
        placeholder="Pesquise por nome do produto"
        onkeydown={(e)=>{
            if(e.key==="Enter"){
                listar()
            }
        }}
        >
        <button onclick={()=>{
            open=true
            listar()
        }}>
            <SvgSearch/>
        </button>

        <DropBlock isDrop={open} 
        className="absolute right-0 w-full bottom-[100%] mb-2 flex z-10 flex-col border border-soft-200 rounded-lg bg-white-0 shadow-md">
            {#if produtos.length===0}
                <div class="p-3 text-center">
                    Nenhum produto encontrado
                </div>
            {:else}
                {#each produtos as p}
                    <button class="p-3 flex items-center gap-2 hover:bg-slate-200" onclick={()=>select(p)}>
                        {p.nome}
                    </button>
                {/each}
            {/if}
        </DropBlock>

    </FocusBlock>


</InputWrapper>