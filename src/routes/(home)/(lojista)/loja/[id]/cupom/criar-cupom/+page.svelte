<script lang='ts'>
  import { goto } from '$app/navigation';
  import { page } from '$app/state';
  import Botao from '$components/assets/buttons/Botao.svelte';
    import Date from '$components/assets/input/Date.svelte';
  import Input from '$components/assets/input/Input.svelte';
  import InputData from '$components/assets/input/InputData.svelte';
  import InputNumber from '$components/assets/input/InputNumber.svelte';
  import InputPreco from '$components/assets/input/InputPreco.svelte';
  import Number from '$components/assets/input/Number.svelte';
  import FillText from '$components/assets/limiter/FillText.svelte';
  import SelectBlock from '$components/assets/logic/SelectBlock.svelte';
    import PopUp from '$components/assets/modals/PopUp.svelte';
  import SvgChorandinho from '$components/assets/svg/historico/SvgChorandinho.svelte';
  import SvgEnjoado from '$components/assets/svg/historico/SvgEnjoado.svelte';
  import SvgSad from '$components/assets/svg/min/SvgSad.svelte';
    import SvgAlerta from '$components/assets/svg/SvgAlerta.svelte';
  import SvgFlechaDireita from '$components/assets/svg/SvgFlechaDireita.svelte';
  import SvgSetaDireita from '$components/assets/svg/SvgSetaDireita.svelte';
  import SvgX from '$components/assets/svg/SvgX.svelte';
    import BubbleWrapper from '$components/elements/wrappers/BubbleWrapper.svelte';
    import Cupom from '$components/sections/dominio/Cupom.svelte';
  import SelectStatus from '$components/sections/select/SelectStatus.svelte';
  import SelectVisibilidade from '$components/sections/select/SelectVisibilidade.svelte';
  import categoriaController from '$lib/api/modules/categoria/categoria.controller';
    import cupomController from '$lib/api/modules/cupom/cupom.controller';
  import sanitizar from '$lib/sanitizers/sanitizer';
  import sinalizador from '$lib/utils/signal.svelte';
  import toast from '$lib/utils/toast.svelte';
  import type { Option } from '$lib/utils/types';
    import { consoleDev } from '$lib/utils/utils.svelte';
  import { onMount } from 'svelte';

  let loading: boolean = $state(false)
  let tipo: boolean = $state(false)
  let idLoja = page.params.id;
  let open: boolean = $state(false)

  let formBody = $state<{
    nome: string;
    codigo: string;
    tipoDesconto: 'percentual' | "fixo";
    valorDesconto: number;
    dataInicio: string;
    dataVencimento?: string;
    quantidade: number;
    categoriaId: number | undefined;
    ativo: boolean;
    gastoMinimo?: number;
    limiteDesconto?: number;
  }>({
    nome: '',
    codigo: '',
    tipoDesconto: 'percentual',
    valorDesconto: 10,
    dataInicio: '',
    dataVencimento: '',
    quantidade: 10,
    categoriaId: undefined,
    ativo: true,
    gastoMinimo: 10,
    limiteDesconto: 10,
  })

  let categorias = $state<Option[]>([])

  let disabled = $derived.by(()=>{
    if(!formBody.dataInicio || formBody.dataInicio.length<10 
    || !formBody.dataVencimento || formBody.dataVencimento.length<10 
    || !formBody.nome || !formBody.codigo || !formBody.categoriaId){
      return true
    }
    return false
  })

  async function buscarCategorias(){
    const [res, err] = await categoriaController.listar(parseInt(page.params.id),{})
    if(err) return toast.error('Mensagem do sistema.', err.message)
    const received = res.resultado
    categorias = received.map((obj: any) => {
      return { label: obj.nome, value: obj.id }
    })
  }

  async function categoriasList() {
    const [res, err] = await categoriaController.listar(parseInt(idLoja),{})

    if(err) return toast.error('Mensagem do sistema', err.message)

    const data = res.resultado
    categorias = data.map((obj: any) => {
      return { label: obj.nome, value: obj.id }
    })
  }
  
  function formatToISO(displayDate: string): string  {
    const [day, month, year] = displayDate.split('/');
    return `${year}-${month}-${day}`;
  }

  async function criarCupom() {
    const body = {...formBody}
    body.gastoMinimo = Math.trunc(body.gastoMinimo!*100)
    body.limiteDesconto = Math.trunc(body.limiteDesconto!*100)
    body.dataInicio = formatToISO(body.dataInicio)
    body.dataVencimento = formatToISO(body.dataVencimento!)
    if(body.tipoDesconto==="percentual"){


    }

    else{
      delete body.limiteDesconto
      body.valorDesconto = Math.trunc(body.valorDesconto*100)
    }

    if(!body.dataVencimento){
      delete body.dataVencimento
    }

    console.log(body)
    loading = true
    const [res, err] = await cupomController.criarCupom(parseInt(idLoja), body)
    loading=false
    if(err) return sinalizador.sendMeGenericModal({
      label:"Ops, algo deu errado!",
      desc: err.message as string,
      btnLabel:"Ok, compreendo",
      icon:SvgSad
    })

    toast.success('Cupom criado com sucesso!', 'Seu cupom já pode ser gerenciado na lista.')
    loading = false
    goto(`/loja/${idLoja}/cupom`)
  }

  onMount(()=> {
    categoriasList()
    buscarCategorias()
  })
</script>

{#snippet header()}
  <div class="border-b border-soft-200 pb-5 flex items-center justify-between">
      <div class="flex flex-col">
          <span class="text-[18px] font-medium">
            Cupons
          </span>
          <p class="text-[14px] text-sub-600">
            Visualize e gerencie seus cupons
          </p>
      </div>
      <button onclick={()=> window.history.back()}>
        <SvgX cor={'#525866'}/>
      </button>
  </div>
{/snippet}

{#snippet tipoValor()}
  <div class="bg-weak-50 p-1 rounded-[10px] flex items-center">
    <button class="w-full text-14 font-medium rounded-[10px] p-1 {!tipo ? 'bg-white-0 text-strong-950' : 'bg-transparent text-sub-600'}" onclick={()=> {tipo = !tipo, formBody.tipoDesconto = 'percentual'}}>
      Porcentagem (%)
    </button>
    <button class="w-full text-14 rounded-[10px] p-1 {tipo ? 'bg-white-0 text-strong-950' : 'bg-transparent text-sub-600'}" onclick={()=> {tipo = !tipo, formBody.tipoDesconto = 'fixo'}}>
      Valor (R$)
    </button>
  </div>
{/snippet}

{#snippet modal()}
  <div class="border border-soft-200 rounded-2xl min-w-md flex flex-col gap-4">
    <div class="flex items-center justify-between gap-4 px-4 pt-4 w-full">
      <p class="text-strong-950 font-medium text-16">Criar Cupom</p>
      <SelectVisibilidade bind:value={formBody.ativo} statusOp={[
        {
            label:"Ativo",
            value:true,
            color:"bg-green-500"
        },
        {
            label:"Inativo",
            value:false,
            color:"bg-red-500"
        },
      ]}/>
    </div>

    <FillText texto="INFORMAÇÕES BÁSICAS" />
    <div class="flex flex-col gap-3 px-4">
      <Input label={'Nome'} placeholder={'Digite o nome do seu cupom'} bind:value={formBody.nome} mandatory={true}/>
      <Input label={'Código'} placeholder={'Digite o código de aplicação do seu cupom'} bind:value={formBody.codigo} mandatory={true}/>
      <div class="flex flex-col gap-0.5">
        <p class="text-14 font-medium text-strong-950">Categoria<span class="text-primary-base">*</span></p>
        <SelectBlock options={categorias} bind:value={formBody.categoriaId} placeholder={'Selecionar'}/>
      </div>
    </div>

    <FillText texto="REGRAS DE APLICAÇÃO" />
    <div class="flex flex-col px-4 gap-4">
      {@render tipoValor()}
      <div class="flex items-center gap-4">
        {#if !tipo}
          <InputNumber label={'Desconto'} placeholder={'0%'} bind:value={formBody.valorDesconto} mandatory={true} 
          sanitize={(v)=>parseInt(sanitizar.numero(v.toString(),100,0))}
          extraTip={'Valor em porcentagem'}/>
          <InputPreco label={'Limite desc.'} placeholder={'R$0,00'} bind:value={formBody.limiteDesconto!} extraTip={'algo aqui'} mostrar={false}/>
        {:else}
          <InputPreco label={'Valor Desconto'} placeholder={'R$0,00'} bind:value={formBody.valorDesconto} extraTip={'algo aqui'} mostrar={false}/>
        {/if}
        <!-- <InputNumber label={'Desconto'} placeholder={'0%'} bind:value={formBody.valorDesconto} mandatory={true} extraTip={'Algo aqui'}/> -->
      </div>
      <div class="flex items-center gap-4">
        <InputNumber label={'Quantidade'} placeholder={'100'} bind:value={formBody.quantidade} mandatory={true} extraTip={'Algo aqui'}/>
        <InputPreco label={'Gasto mín.'} placeholder={'R$0,00'} bind:value={formBody.gastoMinimo!} mandatory={false} extraTip={'Algo aqui'} mostrar={false}/>
      </div>
    </div>

    <FillText texto="VALIDADE DO CUPOM" />
    <div class="flex flex-col px-4">
      <div class="flex items-center gap-4">
        <Input  label={'Início'} sanitize={(v)=>sanitizar.data(v)} placeholder={'DD / MM / YYYY'} bind:value={formBody.dataInicio} mandatory={true}/>
        <Input  label={'Vencimento'}  sanitize={(v)=>sanitizar.data(v)} placeholder={'DD / MM / YYYY'} bind:value={formBody.dataVencimento!} mandatory={true}/>
      </div>
    </div>
    <div class="px-3 my-3 w-full h-[40px] grid ">
        <Botao tema="primary" disabled={disabled} onClick={()=> criarCupom()} {loading}>
          Criar cupom
        </Botao>
    </div>
  </div>
{/snippet}

{#snippet popup()}
    <PopUp bind:open withCloseButton={false} withDefaultPadding={false}>
          <div class="flex flex-col w-[440px]">
            <div class="flex gap-4 px-4 mt-4">
              <div class="bg-error-light mt-1 shrink-0 rounded-md w-[40px] h-[40px] aspect-square flex items-center justify-center">
                  <SvgAlerta props={{
                      class:"fill-error-base w-[24px] h-[24px]"
                  }}/>
              </div>
              <div class="flex-col justify-start items-start gap-1.5">
                  <p class="text-16 font-medium text-strong-950">Tem certeza que deseja voltar?</p>
                  <p class="text-14 font-normal text-sub-600">Os campos preenchidos para esse cupom serão perdidos.</p>
              </div>  
            </div>
            <div class="w-[100%] left-[0] my-3 h-[1px] bg-soft-200">
            </div>
            <div class="grid grid-cols-2 mb-4 w-full h-[36px] gap-x-3 px-4">
                <Botao tema="gray-transparent" onClick={()=> open = false}>
                    Cancelar
                </Botao>
                <Botao tema="black" onClick={()=> {window.history.back(), open = false}}>
                    Voltar a pagina anterior
                </Botao>
            </div>
          </div>
  </PopUp>
{/snippet}

<div class="flex flex-col gap-6">
  {@render header()}
  <div class="flex items-start justify-between gap-8">
    <button class="flex items-center gap-2" onclick={()=> open = true}>
      <span class="border border-soft-200 rounded-[8px] p-0.5"><SvgFlechaDireita/></span> Voltar
    </button>
    {@render modal()}
    <dir></dir>
  </div>
  {@render popup()}
</div>