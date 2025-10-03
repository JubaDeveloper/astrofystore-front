<script lang="ts">
  import Botao from '$components/assets/buttons/Botao.svelte';
  import TextArea from '$components/assets/input/TextArea.svelte';
  import Tip from '$components/assets/labels/Tip.svelte';
  import SelectBlock from '$components/assets/logic/SelectBlock.svelte';
  import UploadMin from '$components/assets/upload/UploadMin.svelte';
  import BubbleWrapper from '$components/elements/wrappers/BubbleWrapper.svelte';
  import { LojaPublicaController } from '$lib/api/modules/loja-publica/loja.publica.controller';
  import type { FiltrosLojaPublica } from '$lib/api/modules/loja-publica/loja.publica.dto';
  import domainManager from '$lib/settings/domain.svelte';
  import toast from '$lib/utils/toast.svelte';
  import ShortUniqueId from 'short-unique-id';
  import { onMount } from 'svelte';
  import { dndzone, type DndEvent } from "svelte-dnd-action";
  import { flip } from 'svelte/animate';

  interface Props {
    formImages: FormIm[];
    loading: boolean;
    salvar: (imagensAtualizadas: FormIm[]) => void;
    valueMotivo: string;
    valueProduto: number;
    valueDescricao: string;
  }

  type FormIm = {
    file:File | null,
    data64:string,
    id:string,
  }

  let {
    loading,
    formImages: formImages = $bindable(),
    salvar,
    valueMotivo = $bindable(),
    valueProduto = $bindable(),
    valueDescricao = $bindable()
  }: Props = $props();

  let idsDelete = $state<string[]>([])
  let idsOrdem = $derived.by<string[]>(()=>{
    return formImages.filter((obj)=>obj.id!=="" && obj.data64.length>0).map((obj)=>{
      return obj.id
    })
  })

  const shortU = new ShortUniqueId()

  let validacao: boolean = $state(true);

  $effect(()=>{
    if(valueDescricao !== '' && valueMotivo !== '' && valueProduto !== 0) validacao = false
  })

  function handleDndConsider(e: CustomEvent<DndEvent<FormIm>>) {
    formImages = e.detail.items;
  }

  function handleDndFinalize(e: CustomEvent<DndEvent<FormIm>>) {
    formImages = e.detail.items;
  }

  function continuar() {
    if (validacao) {
      return toast.alert("Mensagme do sistema.", "Para prosseguir preencha todas as informações obrigatórias.");
    }
    salvar(formImages);
  }

  interface Produto {
    id: string;
    nome: string;
  }

  interface ProdutoSelect {
    label: string;
    value: string;
  }

  const lojaPublicaController = new LojaPublicaController();
  let dominio = $state<string>("");
  let filtros = $state<FiltrosLojaPublica>({
    pesquisa: "",
    categoriaId: "",
    pagina: 1,
    quantidade: 10,
  });
  let produtosSelect = $state<ProdutoSelect[]>([]);

  async function listarProdutos() {
    const [res, err] = await lojaPublicaController.listarProdutos(dominio, filtros);

    if (err) {
      toast.error("Mensagem do sistema", err.message || "Erro ao listar produtos");
      return;
    }

    if (res?.data?.resultado) {
      produtosSelect = res.data.resultado.map((obj: Produto) => ({
        label: obj.nome,
        value: obj.id,
      }));
    } else {
      produtosSelect = [];
    }
  }

  onMount(() => {
    dominio = domainManager.ultimoDominioAcessado!;
    listarProdutos();
  });
</script>

<div class="flex items-start gap-6">
  <BubbleWrapper css="w-[440px] px-0 gap-4">
    <div class="flex w-full items-center justify-between px-4">
      <p class="text-16 font-medium text-strong-950">{'Denunciar loja'}</p>
    </div>

    <div class="border-b border-soft-200"></div>

    <div class="flex flex-col gap-3 px-4">
      <div class="flex flex-col gap-1">
        <p class="text-14 font-medium text-strong-950">
          Motivo <span class="text-primary-base">*</span>
        </p>
        <SelectBlock
          placeholder="Selecione o Motivo"
          options={[
            { label: 'Produto Ilegal', value: 'PRODUTOS_ILEGAIS' },
            { label: 'Direitos Autorais', value: 'DIREITOS_AUTORAIS' }
          ]}
          bind:value={valueMotivo}
        />
      </div>

      <div class="flex flex-col gap-1">
        <p class="text-14 font-medium text-strong-950">
          Selecione um Produto <span class="text-primary-base">*</span>
        </p>
        <SelectBlock
          placeholder="Selecione o produto"
          options={produtosSelect}
          bind:value={valueProduto}
        />
      </div>

      <TextArea
        label="Descrição"
        placeholder="Descreva o motivo"
        bind:value={valueDescricao}
        mandatory={true}
        limit={200}
      />
    </div>

    <div class="px-5 flex flex-col gap-1 text-sub-600 text-[14px]">
      <div class="flex items-center gap-1 text-strong-950 font-medium">
        Anexos <span class="text-primary-base">*</span>
        {#if formImages.length > 1}
          <b class="text-sub-600 font-normal">
            ({formImages.length - 1} imagens)
          </b>
        {/if}
      </div>
      <div
        class="grid w-full mb-1 gap-x-2 gap-y-5 {formImages.length > 1 ? 'grid-cols-2' : 'grid-cols-1'}"
        use:dndzone={{
          items: formImages,
          flipDurationMs: 400,
          dragDisabled: formImages.length <= 1
        }}
        onconsider={handleDndConsider}
        onfinalize={handleDndFinalize}
      >
        {#each formImages as formIm, i (i)}
          <div animate:flip={{ duration: 400 }}>
            <UploadMin
              bind:formImage={formImages[i]}
              size={formImages.length > 1 ? "w-[200px] h-[200px]" : "w-full h-[202px]"}
              onDelete={() => {
                formImages = formImages.filter((_obj, idx) => idx !== i);
              }}
              onNewFile={(f)=>{
              formImages = formImages.filter((o,i2)=>i2!==i)
              f.forEach((obj)=>{
                formImages.push({
                  file:obj.file,
                  data64:obj.data64,
                  id: shortU.rnd(10)
                })
              })
              formImages.push({
                file:null,
                data64:"",
                id: shortU.rnd(10)
              })
            }}/>   
          </div>
        {/each}
      </div>
      <Tip type="tip" label="A primeira imagem será a imagem principal."/>
    </div>

    <div class="w-full h-[1px] bg-soft-200"></div>

    <div class="grid grid-cols-2 gap-3 px-4 h-[40px]">
      <Botao onClick={() => window.history.back()} disabled={loading} tema="transparent">
        Voltar
      </Botao>
      <Botao onClick={continuar} {loading} tema="primary" disabled={validacao}>
        Continuar
      </Botao>
    </div>
  </BubbleWrapper>
</div>