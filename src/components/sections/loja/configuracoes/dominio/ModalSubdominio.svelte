<script lang="ts">

    import Botao from '$components/assets/buttons/Botao.svelte';
    import Site from '$components/assets/input/Site.svelte';
    import PopUp from '$components/assets/modals/PopUp.svelte';
  import { LojaController } from '$lib/api/modules/lojas/lojas.controller';
  import { idLoja } from '$lib/utils/rotas.svelte';
  import toast from '$lib/utils/toast.svelte';
  import ShortUniqueId from 'short-unique-id';
    import { onMount } from 'svelte';

    interface Props{
        open: boolean
    }

    let {open = $bindable()}:Props = $props()

    let form = $state({
        nome:"",
        dominio:"",
        descricao:""
    })

    let sugestoes = $state<string[]>([])
    let loading = $state(false)
    let dominioOriginal = $state()

    const lojaC = new LojaController()

    async function salvar(){
        loading=true
        const mensagem = await validarDominio()
        if(mensagem){
            loading=false
            return toast.alert("Erro na alteração do subdominio",mensagem)
        }
        const [data,error] = await lojaC.salvarSubDominio(form.dominio,parseInt($idLoja))
        loading=false
        if(error){
            return toast.alert("Erro na atualização do subdominio",error.message)
        }
        open=false
        toast.success("Alteração de dominio realizada com sucesso","")
        
    }

    async function validarDominio():Promise<string>{
        if(!form.dominio) return "Preencha o campo de dominio"
        if(form.dominio===dominioOriginal) return "Dominio não pode ser igual ao já cadastrado"
        const disponivel = await lojaC.validarDominio(form.dominio)
        if(disponivel){
            sugestoes = []
            return ""
        }
        const uuidGen = new ShortUniqueId({
            dictionary:['1','2','3','4','5','6','7','8','9','10']
        })

        sugestoes = [
            form.dominio+uuidGen.rnd(3),
            form.dominio+uuidGen.rnd(3),
            form.dominio+uuidGen.rnd(3),
        ]
        return "Dominio não disponivel, insira um novo dominio ou use uma de nossas sugestões"
    }
    onMount(async()=>{
        const [data,error] = await lojaC.pegar(parseInt($idLoja))
        form.nome=data.nome
        form.dominio = data.dominio
        form.descricao = data.descricao
        dominioOriginal = form.dominio
    })

    $effect(()=>{
        if(form.dominio){
            validarDominio()
        }
    })

</script>

<PopUp bind:open withDefaultPadding={false} withCloseButton={false}>
    <div class="flex flex-col w-[400px] gap-2">
      <b class="p-1 px-4 mt-3 font-medium">Edite o subdominio gratuito</b>
      <div class="w-full h-[1px] bg-soft-200"></div>
      <div class="px-4 p-1">
        <div class="flex flex-col gap-1">
            <Site placeholder="yoursite" bind:value={form.dominio} 
            label="URL" mandatory={true} comPrefixo={false} dominio=".astrofystore.com" onEnter={validarDominio}/>        
            {#if sugestoes.length>0}
                <div class="flex flex-col gap-1 leading-3.5 text-[12px] shrink-0  text-error-base">
                    Dominio não disponivel, algumas sugestões: 
                    <div class="flex items-center gap-2">
                        {#each  sugestoes as  sugestao}
                                <button class="text-success-base hover:text-success-dark underline bg-success-lighter p-1 rounded-md" onclick={()=>{
                                    form.dominio = sugestao
                                    validarDominio()
                                }}>
                                    {sugestao}
                                </button>
                        {/each}

                    </div>
                </div>
            {/if}            
        </div>
      </div>
      <div class="w-full h-[1px] bg-soft-200"></div>
      <div class="grid grid-cols-2 gap-x-2 mx-4 m-1 mb-3 h-[40px]">
        <Botao tema="gray-transparent" onClick={()=>open=false}>
          Cancelar
        </Botao>
        <Botao tema="primary" onClick={salvar} {loading}>
          Salvar alterações
        </Botao>
      </div>
    </div>
  </PopUp>