<script lang='ts'>
    import Botao from "$components/assets/buttons/Botao.svelte";
    import Input from "$components/assets/input/Input.svelte";
    import Site from "$components/assets/input/Site.svelte";
    import TextArea from "$components/assets/input/TextArea.svelte";
    import FillText from "$components/assets/limiter/FillText.svelte";
    import PhotoManagerMin from "$components/elements/media/PhotoManagerMin.svelte";
    import validacaoInputNormalizada from "$lib/utils/input.svelte";
    import ShortUniqueId from "short-unique-id";
    import Upload from "$components/assets/upload/Upload.svelte";
    import { LojaController } from "$lib/api/modules/lojas/lojas.controller";
    import { lojaCadForm } from "$lib/api/modules/lojas/lojas.dto";
    import toast from "$lib/utils/toast.svelte";
    import { configuracaoIdentidade } from "$lib/api/modules/lojas/identidade/identidade.controller";
    import { idLoja } from "$lib/utils/rotas.svelte";
    import Avatar from "$components/assets/avatar/Avatar.svelte";
    import Dominio from "../dominio/Dominio.svelte";
    import SvgIconPix from "$components/assets/svg/SvgIconPix.svelte";
    import { consoleDev } from "$lib/utils/utils.svelte";

    const identidade = new configuracaoIdentidade()
    let dataloja = $state({
        logo: '',
        nome: '',
        url: '',
        descricao: ''
    })

    async function buscarLoja() {
        const [res, err] = await identidade.pegarLoja(parseInt($idLoja))

        if(err) return toast.error('Mensagem do sistema', err.message)

        dataloja = {
            logo: res.data.logo,
            nome: res.data.nome,
            url: res.data.url,
            descricao: res.data.descricao
        }

        form.nome = res.data.nome
        form.descricao = res.data.descricao
        form.dominio = res.data.dominio
    }

    buscarLoja()

    async function buscarCapa() {
        const [res, err] = await identidade.pegarCapa(parseInt($idLoja))

        if(err) return toast.error('Mensagem do sistema', err.message)

        formCapa.data64 = res.data.url
    }

    buscarCapa()

    async function atualizarLoja(){
        loading = true

        const body ={
            nome: form.nome,
            descricao: form.descricao
        }

        if(formImage.file) identidade.salvarAvatar(parseInt($idLoja), formImage.file)

        if(formCapa.file) identidade.capaLoja(parseInt($idLoja), formCapa.file)

        const [res, err] = await identidade.atualizarLoja(parseInt($idLoja), body)

        if(err) {
            loading = false
            toast.error('Mensagem do sistema', err.message)
        }

        loading = false
        toast.success(`Mensagem do sistema`, res.message)
    }
  
    let form = $state(lojaCadForm)

    let formImage = $state({
        file:null,
        data64:""
    })

    let formCapa = $state({
        file:null,
        data64:""
    })
    
    let sugestoes = $state<string[]>([])

    let loading = $state(false)
    
    const lojaC = new LojaController()

    async function urlMaker(e: Event) {
        const target = e.target as HTMLInputElement;
        const value = target.value;
        const formatedValue = value.toLowerCase().normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, "-")
        .replace(/[^a-z0-9\s-]/g, "").replace(/^-|-$/g, '');
        form.dominio = formatedValue
        validarDominio()
    }

    async function validarDominio(){
        if(!form.dominio) return
        const disponivel = await lojaC.validarDominio(form.dominio)
        if(disponivel){
            sugestoes = []
            return
        }
        const uuidGen = new ShortUniqueId({
            dictionary:['1','2','3','4','5','6','7','8','9','10']
        })

        sugestoes = [
            form.dominio+uuidGen.rnd(3),
            form.dominio+uuidGen.rnd(3),
            form.dominio+uuidGen.rnd(3),
        ]
    }

</script>

<div class="w-[440px] max-w-[440px] border border-soft-200 rounded-2xl flex flex-col">
  {@render conteudo()}
</div>

{#snippet conteudo()}
  <div class="flex items-center gap-3.5 p-4 w-full">
      <PhotoManagerMin bind:formImage name={dataloja?.nome} src={dataloja?.logo}/>
      <div class="flex flex-col">
          <p class="text-strong-950 font-medium text-16">Logo da loja</p>
          <p class="text-sub-600 font-normal text-14">400x400 px, PNG ou JPEG</p>
      </div>
  </div>
  <FillText texto="INFORMAÇÕES E CAPA" />
  <div class="p-4 flex flex-col gap-3 border-b border-soft-200 pb-4">
        <Upload bind:formImage={formCapa}/>
        <Input sanitize={(v)=> v.replace(/[@#$%&*(){}![\];]/g, "")} 
            extraTip="Uma vez cadastrado, o nome da loja não podera ser alterado" label={'Nome da loja'}
            validate={()=>validacaoInputNormalizada.NaoVazio(form.nome,"Insira o nome da loja")}
            mandatory={true} placeholder={'Digite o nome da loja'} bind:value={form.nome} onChange={urlMaker}/>

      <div class="flex flex-col gap-1">
            <Site extraTip="Uma vez cadastrado, o dominio da loja não podera ser alterado" label={'URL'} viewOnly={true} comPrefixo={false} dominio="/astronfy.com.br" mandatory={true} placeholder={'nomedasualoja'} bind:value={form.dominio}/>
          
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
      
      <TextArea label={'Descrição'}
      placeholder={'Descreva brevemente sua loja...'} 
      validate={()=>validacaoInputNormalizada.NaoVazio(form.descricao,"Insira a descrição da loja")}
      limit={200} bind:value={form.descricao}/>
  </div>
    <div class="px-3 my-3 w-full h-[40px] grid">
        <Botao tema="primary" onClick={()=> atualizarLoja()} {loading}>
            Salvar
        </Botao>
    </div>
{/snippet}