<script lang="ts">
  import { goto } from "$app/navigation";
  import Botao from "$components/assets/buttons/Botao.svelte";
  import Input from "$components/assets/input/Input.svelte";
  import FillText from "$components/assets/limiter/FillText.svelte";
  import SelectBlock from "$components/assets/logic/SelectBlock.svelte";


  import BubbleWrapper from "$components/elements/wrappers/BubbleWrapper.svelte";
  import InputWrapper from "$components/elements/wrappers/InputWrapper.svelte";
  import { ExternalController } from "$lib/api/modules/external/external.controller";
  import { PredioController } from "$lib/api/modules/predios/predio.controller.svelte";
  import type { EnderecoPredioForm, PredioCadForm } from "$lib/api/modules/predios/predio.dto.svelte";
  import query from "$lib/api/query";
  import sanitizar from "$lib/sanitizers/sanitizer";
  import validacaoInputNormalizada from "$lib/utils/input.svelte";
  import sinalizador from "$lib/utils/signal.svelte";
  import toast from "$lib/utils/toast.svelte";
  import { estadosOptions } from "$lib/utils/values/estados";
  import SelectCidade from "../select/SelectCidade.svelte";

  interface Props{
    etapaAtual:number
    modo:"edicao" | "cadastro"
    formPredio: PredioCadForm,
    formEndereco: EnderecoPredioForm,
  }

  let {
    etapaAtual = $bindable(),
    modo="cadastro",
    formPredio = $bindable(),
    formEndereco = $bindable(),
    }:Props = $props()

  let loading = $state<boolean>(false)

  const predioCon = new PredioController()


  async function onSalvarPrimeiraEtapa(){
      loading=true
      const sendForm = {...formPredio}
      sendForm.totalMoradores = parseInt(sendForm.totalMoradores as string)
      const [r,e] = await predioCon.editar(sendForm,parseInt(query.getQueryKey("idPredio") ?? ""))
      loading=false
      if(e) return toast.error("Erro ao editar predio",e.message)
      toast.success("Edição realizada com sucesso","Prossiga com as proximas etapas, caso deseje atualizar novas informações")
    }

  async function completarDadosCEP(){
    if(formEndereco.cep.length<9) return
    const external = new ExternalController()
    const [dados,error] = await external.enderecoPorCep(formEndereco.cep)
    if(error || !dados) return toast.error("Erro ao buscar dados do CEP",error?.message)

    formEndereco.cidade=dados.localidade
    formEndereco.bairro = dados.bairro
    formEndereco.estado=dados.uf
    formEndereco.logradouro=dados.logradouro
  }

  $effect(()=>{
    if(formEndereco.cep.length===9){
        completarDadosCEP()
    }
  })

  const proxima = async() => {
   
   
    if(etapaAtual===1){
        if(!validacaoEtapa1()){
            sinalizador.sendSignal("validarInputs")
            return
        }
        if(modo==="edicao"){
            onSalvarPrimeiraEtapa()  
            return
        }
        etapaAtual++
    }
    else if(etapaAtual===2){
        if(!validacaoEtapa2()){
            sinalizador.sendSignal("validarInputs")
            return
        }
        if(modo==="cadastro"){
            loading=true
            const tmpForm = {...formPredio}
            tmpForm.totalMoradores = parseInt(tmpForm.totalMoradores as string)
            const [r,e] = await predioCon.cadastrar(tmpForm)
            if(e){
                loading=false
                return toast.error("Erro no cadastro",e.message)
            }
            const [rE,eE] = await predioCon.salvarEndereco(formEndereco,r.id)
            if(eE){
                loading=false
                return toast.error("Erro no cadastro de endereço",e.message)
            }
            loading=false
            toast.success("Notificação do sistema","Prédio cadastrado com sucesso")
            goto("/admin/gestao-de-predios")
        }
        
    }
    

   }

   const validacaoEtapa1 = () => {
        return (
            !validacaoInputNormalizada.NaoVazio(formPredio.nome) &&
            !validacaoInputNormalizada.NaoVazio(formPredio.nomeResponsavel) && 
            !validacaoInputNormalizada.Telefone(formPredio.telefoneResponsavel) &&
            !validacaoInputNormalizada.Email(formPredio.emailResponsavel)
        )
   }

   const validacaoEtapa2 = () => {
        return(
            !validacaoInputNormalizada.NaoVazio(formEndereco.bairro) && 
            !validacaoInputNormalizada.NaoVazio(formEndereco.logradouro) && 
            !validacaoInputNormalizada.NaoVazio(formEndereco.numero) && 
            !validacaoInputNormalizada.Cep(formEndereco.cep) 
        )
   }


    
</script>

{#if etapaAtual===1}
<BubbleWrapper css="w-[415px] absolute px-0 gap-2">

    <div class="px-5 flex flex-col">
        <span class="text-[14px] font-medium">Informações Iniciais</span>
        <span class="text-sub-600 text-[12px] font-normal mb-2">Preencha os dados do prédio e responsável.</span>    
    </div>

    <FillText texto="DADOS DO PRÉDIO"/>
    
    <div class="px-5 flex flex-col">
        <Input placeholder="Digite o nome do prédio" validate={()=>validacaoInputNormalizada.NaoVazio(formPredio.nome)}
            label="Nome do prédio" mandatory={true} bind:value={formPredio.nome} />
            
            <div class="grid grid-cols-7 gap-x-2 mt-2">
                <div class="col-span-5">
                    <InputWrapper label="Tipo de prédio" mandatory={true} value={formPredio.tipo} >                
                        <div class="h-[40px] grid">
                            <SelectBlock options={[{label:"Residencial",value:"RESIDENCIAL"},{label:"Comercial",value:"COMERCIAL"}]} 
                            bind:value={formPredio.tipo} placeholder="Selecionar"/>
                        </div>
                    </InputWrapper>    
                </div>
                <div class="col-span-2">
                    <Input placeholder="Quantidade" sanitize={(e)=>sanitizar.numero(e)} label="Moradores" bind:value={formPredio.totalMoradores as string} mandatory={true} />
                </div>
            </div>
        
    </div>

    <FillText texto="SÍNDICO OU RESPONSÁVEL"/>

    
    <div class="flex flex-col gap-2 px-5">
        
        <Input placeholder="Nome do sindico" validate={()=>validacaoInputNormalizada.NaoVazio(formPredio.nomeResponsavel)}  
        label="Nome" bind:value={formPredio.nomeResponsavel} mandatory={true} />
        
        <Input placeholder="(00) 0 0000-0000"  validate={()=>validacaoInputNormalizada.Telefone(formPredio.telefoneResponsavel)}
        sanitize={(e)=>sanitizar.telefone(e ?? "",false)} label="Telefone" bind:value={formPredio.telefoneResponsavel} mandatory={true} />

        <Input placeholder="email@email.com" label="E-mail" validate={()=>validacaoInputNormalizada.Email(formPredio.emailResponsavel)} 
        bind:value={formPredio.emailResponsavel} mandatory={true} />        
    </div>
    
    <div class="w-full bg-soft-200 h-[1px]"></div>
    
    <div class="h-[40px] px-5 grid grid-cols-2 gap-x-4">
        {#if modo==="cadastro"}
        <Botao tema="gray-transparent" onClick={()=>goto("/admin/gestao-de-predios")}>
            Descartar
        </Botao>
        <Botao tema="black" onClick={proxima}>
            Próximo
        </Botao>
        {:else}
        <div class="col-span-2 grid">
            <Botao tema="black" {loading} onClick={proxima}>
                Salvar
            </Botao>
        </div>
        {/if}
    </div>
</BubbleWrapper>

{:else}

<BubbleWrapper css="w-[415px] absolute px-0 gap-1">
    <div class="flex flex-col px-5">
        <span class="text-[14px] mt-1 font-medium">Endereço do prédio</span>
        <span class="text-sub-600 text-[12px] font-normal mb-2">Preencha os dados do endereço.</span>    
    </div>
    <div class="w-full bg-soft-200 h-[1px]"></div>
    <div class="px-5 grid grid-cols-2 mt-3 gap-x-4 gap-y-3">

        <Input placeholder="0000-0000" validate={()=>validacaoInputNormalizada.Cep(formEndereco.cep)}
        sanitize={(e)=>sanitizar.cep(e ?? "")} label="CEP" bind:value={formEndereco.cep} mandatory={true} />
        
        <InputWrapper label="Estado" mandatory={true}  value="">                
            <div class="h-[40px] grid">
                <SelectBlock options={estadosOptions} bind:value={formEndereco.estado} removableOnClick={false} placeholder="Selecionar"/>
            </div> 
        </InputWrapper>    
        <InputWrapper label="Cidade" value=""  mandatory={true}  >                
            <div class="h-[40px] grid">
                <SelectCidade uf={formEndereco.estado} bind:value={formEndereco.cidade}/>
            </div>
        </InputWrapper>
        <Input placeholder="(00) 0 0000-0000" label="Bairro" validate={()=>validacaoInputNormalizada.NaoVazio(formEndereco.bairro)}
        bind:value={formEndereco.bairro} mandatory={true} />
        <div class="col-span-2">
            <Input placeholder="Ex: Av. dos bandeirantes" label="Rua" validate={()=>validacaoInputNormalizada.NaoVazio(formEndereco.logradouro)}
            bind:value={formEndereco.logradouro} mandatory={true} />     
        </div>
        <Input placeholder="Número do prédio"  validate={()=>validacaoInputNormalizada.NaoVazio(formEndereco.numero)}
        sanitize={(e)=>sanitizar.numero(e)} bind:value={formEndereco.numero} label="Numero" mandatory={true} />     
        <Input placeholder="Ex: Perto do posto" label="Complemento"  bind:value={formEndereco.complemento} />     
    </div>
    <div class="w-full bg-soft-200 h-[1px] mt-1"></div>
    <div class="h-[40px] px-5 grid grid-cols-2 gap-x-4 mt-2">
        {#if modo==="cadastro"}
        <Botao tema="gray-transparent" disabled={loading} onClick={()=>etapaAtual=1}>
            Voltar
        </Botao>
        <Botao tema="black" {loading} onClick={proxima}>
            Cadastrar
        </Botao>
        {:else}
        <div class="col-span-2 grid">
            <Botao tema="black" {loading} onClick={proxima}>
                Salvar
            </Botao>
        </div>
        {/if}
    </div>
</BubbleWrapper>
{/if}
