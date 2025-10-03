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
  import type { FormDeEstoqueSimples } from "$lib/api/modules/lojas/estoque/estoque.dto";
  import InputEstoque from "./InputEstoque.svelte";
  import { effectBy } from "$lib/utils/utils.svelte";

  interface Props{
    onSalvar:() => Promise<void>,
    formSimples:FormDeEstoqueSimples,
    tags?:{value:string, selected:boolean}[],
    idEstoque?:number
  }

  let {onSalvar, formSimples = $bindable({
    nome:"",
    estoqueBaixo:0,
    itensEstoque:[],
    preco:0,
    status:"ativo",
    tipo:"lista",
    mensagem:""
  })
  ,tags = $bindable([]),idEstoque}:Props = $props()


  let loading = $state(false)

  const idProduto = parseInt(page.params.idProduto)

  async function salvar(){
    loading=true
    await onSalvar()
    loading = false
    // const [r,e] = await estoqueController.criar({
    //     tipoEstoque:formSimples.tipo,
    //     mensagem:formSimples.mensagem
    // })
    
    loading=false
  }

  $effect(()=>{
    if(tags){
      formSimples.itensEstoque = tags.map(item=>item.value)
    }
  })

</script>



<BubbleWrapper css="px-0 flex flex-col self-center   w-[440px]">
    <div class="w-full px-4 flex items-center justify-between">
        <span>Estoque Simples</span>
    </div>

    <div class="w-full h-[1px] bg-soft-200 my-3"></div>

        <div class="grid grid-cols-8 gap-x-3 gap-y-2 px-4">
            <div class="col-span-8">
                <InputPreco mostrar={true} bind:value={formSimples.preco} placeholder="" label="Preço" mandatory={true}/>
            </div>
            <div class="col-span-8">
                <InputWrapper label="Tipo de Estoque" mandatory={true} value="">
                    <SelectBlock placeholder="Selecione" removableOnClick={false} bind:value={formSimples.tipo} focusCss="relative h-[40px]" MainComponent={SelectMainWithSnippet} OptionComponent={SelectOptionWithSnippet} options={[
                        {
                            label:"Lista",
                            value:"lista",
                        },
                        {
                            label:"Mensagem padrão",
                            value:"mensagem",
                        }
                    ]}/>    
                </InputWrapper>
                <!-- <div class="col-span-3">
                </div>
                <Number extraTip="Para ser notificado quando o estoque estiver acabando, defina um valor abaixo do qual você quer ser alertado." 
                label="Estoque Baixo" bind:value={formSimples.estoqueBaixo} limit={1000}/>
            </div> -->
            <div class="col-span-8">
                {#if formSimples.tipo==="lista"}
                <InputEstoque idEstoque={idEstoque ?? -1} bind:tags/>
                {:else}
                    <TextArea bind:value={formSimples.mensagem} label="Mensagem" mandatory={true} limit={300} placeholder="Digite..."/>
                {/if}
            </div>
        </div>
    </div>
    <div class="flex flex-col">
        <div class="w-full h-[1px] bg-soft-200 my-3"></div>
    
        <div class="grid grid-cols-1 w-full gap-x-3 px-4 h-[40px]">
            <Botao onClick={salvar} tema="primary" {loading}>
                Continuar
            </Botao>
        </div>
    
    </div>

</BubbleWrapper>

