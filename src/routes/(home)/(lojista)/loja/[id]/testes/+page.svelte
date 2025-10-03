<script lang="ts">
  import SvgX from '$components/assets/svg/SvgX.svelte';
  import StepIndicator from '$components/elements/progress/StepIndicator.svelte';
  import Atributos from '$components/sections/estoque/Atributos.svelte';
  import AdicionarAtributos from '$components/sections/estoque/modais/AdicionarAtributos.svelte';
  import AdicionarVariacoes from '$components/sections/estoque/modais/AdicionarVariacoes.svelte';
  import Variacoes from '$components/sections/estoque/Variacoes.svelte';
  import FormEstoqueSimples from '$components/sections/loja/estoque/FormEstoqueSimples.svelte';
  import storageService from '$lib/utils/storageService';
  import toast from '$lib/utils/toast.svelte';
  import { onMount } from 'svelte';

  interface Form {
    nome: string,
    variacoes: string[]
  }
  interface FormVariacoes {
    nome: string,
    variacao: string,
    preco: number,
    estoque: number
  }

  let form = $state<Form>({
    nome: '',
    variacoes: []
  })

  let formAtributos = $state<Form[]>([])

  let formVariacoes = $state<FormVariacoes[]>([])

  const passosNovoProduto = [
    { label:"Tipo de estoque" },
    { label:"Passo 2" },
  ]

  let etapaAtual = $state<number>(2)

  let modalAtributos: boolean = $state(false)
  let modalVariacoes: boolean = $state(false)

  async function concluir(){}

  function prov() {
    if (form.variacoes.length === 0) {
      return toast.push('Mensagem do sistema', 'Adicione as variações do atributo para continuar.');
    }

    // Adiciona novo atributo
    formAtributos.push({
      nome: form.nome,
      variacoes: [...form.variacoes]
    });

    // Limpa formulário temporário
    form = { nome: '', variacoes: [] };

    const novasCombinacoes:any[] = [];

    for (let i = 0; i < formAtributos.length - 1; i += 2) {
      const attr1 = formAtributos[i];
      const attr2 = formAtributos[i + 1];

      attr1.variacoes.forEach(v1 => {
        attr2.variacoes.forEach(v2 => {
          const existe = formVariacoes.some(v => v.nome === v1 && v.variacao === v2);
          if (!existe) {
            novasCombinacoes.push({
              nome: v1,
              variacao: v2,
              preco: 0,
              estoque: 0
            });
          }
        });
      });
    }

    formVariacoes = [...formVariacoes, ...novasCombinacoes];

    storageService.storeData('atributosProduto', formAtributos);
    storageService.storeData('variacoesProduto', formVariacoes);

    modalAtributos = false;
  }



  onMount(()=>{
    formAtributos = storageService.getStoredData('atributosProduto') ?? [];
    formVariacoes = storageService.getStoredData('variacoesProduto') ?? [];
  })
</script>

<div class="flex flex-col gap-5">
  {@render header()}

  <div class="flex items-start gap-5">
    <Atributos continuar={()=> modalAtributos = true} bind:open={modalAtributos} bind:formAtributos/>
    <Variacoes concluir={()=> concluir()} bind:form={formVariacoes} voltar={()=> {}}/>
  </div>

  <AdicionarAtributos click={()=> prov()} bind:open={modalAtributos} bind:form={form}/>
  <AdicionarVariacoes click={()=> prov()} bind:open={modalVariacoes} bind:formVariacoes={form}/>
</div>

{#snippet header()}
  <div class="flex w-full items-center justify-between border-b border-soft-200 py-4 pb-6">
      <span class="text-[18px] font-medium">
          Cadastro de estoque
      </span>
      
      <StepIndicator format="inline" steps={passosNovoProduto} currentStep={etapaAtual}/>

      <button onclick={()=> window.history.back()}>
          <SvgX props={{
              class:"fill-sub-600"
          }}/>
      </button>
  </div>
{/snippet}