<script lang="ts">
  import Avatar from "$components/assets/avatar/Avatar.svelte";
  import Botao from "$components/assets/buttons/Botao.svelte";
  import TextArea from "$components/assets/input/TextArea.svelte";
  import FillText from "$components/assets/limiter/FillText.svelte";
  import Copy from "$components/assets/links/Copy.svelte";
  import LoaderMinhocaExpend from "$components/assets/loading/LoaderMinhocaExpend.svelte";
  import DropBlock from "$components/assets/logic/DropBlock.svelte";
  import FocusBlock from "$components/assets/logic/FocusBlock.svelte";
  import SelectBlock from "$components/assets/logic/SelectBlock.svelte";
  import PopUp from "$components/assets/modals/PopUp.svelte";
  import SidePop from "$components/assets/modals/SidePop.svelte";
  import SvgChorandinho from "$components/assets/svg/historico/SvgChorandinho.svelte";
  import SvgSad from "$components/assets/svg/min/SvgSad.svelte";
  import SvgArrowBack from "$components/assets/svg/SvgArrowBack.svelte";
  import SvgDevolvido from "$components/assets/svg/SvgDevolvido.svelte";
  import SvgMaozinha from "$components/assets/svg/SvgMaozinha.svelte";
  import SvgRealizado from "$components/assets/svg/SvgRealizado.svelte";
  import SvgSetaDireita from "$components/assets/svg/SvgSetaDireita.svelte";
  import SvgStar from "$components/assets/svg/SvgStar.svelte";
  import SvgThreeDots from "$components/assets/svg/SvgThreeDots.svelte";
  import SvgX from "$components/assets/svg/SvgX.svelte";
  import CardIconStatus from "$components/elements/card/CardIconStatus.svelte";
  import LinhaDoTempo from "$components/elements/linha-do-tempo/LinhaDoTempo.svelte";
  import CardRating from "$components/elements/rating/CardRating.svelte";
  import RatingStars from "$components/elements/rating/RatingStars.svelte";
  import InputWrapper from "$components/elements/wrappers/InputWrapper.svelte";
  import { AvaliacaoController } from "$lib/api/modules/avaliacao/avaliacao.controller";
  import type { ComentarioPostDto } from "$lib/api/modules/avaliacao/avaliacao.dto";
  import { comprasController } from "$lib/api/modules/pedido/compras/compras.controller";
  import type { CompraDetalhadaDto } from "$lib/api/modules/pedido/compras/compras.dto";
  import { DevolucaoClienteController } from "$lib/api/modules/pedido/devolucoes/devolucoes.controller";
  import sanitizar from "$lib/sanitizers/sanitizer";
  import handleDate from "$lib/sanitizers/time";
  import domainManager from "$lib/settings/domain.svelte";
  import sinalizador from "$lib/utils/signal.svelte";
  import toast from "$lib/utils/toast.svelte";
  import { sanitizeUrl } from "$lib/utils/utils.svelte";
  import ModalAvisoGenerico from "../modals/ModalAvisoGenerico.svelte";

  interface Props {
    open: boolean;
    idPedido: number;
  }

  let { open = $bindable(), idPedido }: Props = $props();

  let pedido = $state<CompraDetalhadaDto>();
  let produto = $state<CompraDetalhadaDto["itens"][0]>();

  let chave = $state("");
  let loading = $state(false);
  let visualizacao = $state<
    "pedido" | "produto" | "avaliacao" | "fazerAvaliacao" | "devolucao"
  >("pedido");
  let dropDown = $state(false);

  let openPermissao = $state(false);

  let loadingBtn = $state(false);

  let formAvaliacao = $state<ComentarioPostDto>({
    nota: 1,
    comentario: "",
  });

  let formDevolucao = $state({
    motivo:"ARREPENDIMENTO",
    detalhes:"",
  })

  async function mount() {
    loading = true;
    const [res, err] = await comprasController.pegar(idPedido);
    if (err) {
      return console.log(err);
    }
    pedido = res.data as CompraDetalhadaDto;
    loading = false;
  }

  async function revelarChave() {
    loadingBtn = true;

    const [res, err] = await comprasController.revelarChave(
      idPedido,
      produto!.id
    );
    if (!err) {
      produto!.visualizado = true;
      chave = res.data.conteudo
      mount()
    }
    loadingBtn = false;
  }

  async function avaliar() {
    if(!produto) return
    const avaliacaoController = new AvaliacaoController(domainManager.lojaId!);
    loadingBtn = true;
    const [res, err] = await avaliacaoController.avaliar(produto.id,formAvaliacao);
    //Caso dê erro é pq já foi avaliada
    if (err) {
      const [resUpdate, errUpdate] = await avaliacaoController.avaliarNovamente(produto.id,formAvaliacao)
    }
    loadingBtn = false;
    buscarAvalicao();
  }

  async function buscarAvalicao() {
    if(!produto)return
    visualizacao = "avaliacao";
    const avaliacaoController = new AvaliacaoController(domainManager.lojaId!);
    const [r, e] = await avaliacaoController.buscar(produto.id);
    if (e) {
      visualizacao = "fazerAvaliacao";
      return;
    }

    formAvaliacao = {
      comentario: r.data.comentario,
      nota: r.data.nota,
    };
  }

  async function submitDevolucao(){
    loadingBtn=true
    const devolucaoController = new DevolucaoClienteController(domainManager.lojaId!)
    const [r,e] = await devolucaoController.solicitar(idPedido,produto!.id,formDevolucao);
    loadingBtn=false
    if(e){
      sinalizador.sendMeGenericModal({
        btnLabel:"Estou ciente, obrigado!",
        label:"Erro ao processar sua devolução",
        desc:e.message,
        icon:SvgSad
      })
      return toast.error("Erro ao processar devolução",e.message)
    }
    open=false
  
  }

  $effect(()=>{
    if(open===true){
          mount();
    }
  })
</script>

<SidePop
  bind:open
  withDefaultPadding={false}
  withCloseButton={false}
  curved={true}
>
  <div class="flex flex-col w-[400px] grow h-full">
    {#if loading}
      <div class="h-full flex items-center grow justify-center">
        <LoaderMinhocaExpend label="Carregando dados do seu pedido" />
      </div>
    {:else if pedido}
      {#if visualizacao === "pedido"}
        {@render dadosPedido()}
      {:else if visualizacao==="devolucao"}
        {@render dadosDevolucao()}
      {:else}
        {@render dadosProduto()}
      {/if}
    {/if}
  </div>
</SidePop>


{#snippet dadosDevolucao()}
{#if produto}
  <div class="flex flex-col justify-between w-full h-full">
    <div class="flex flex-col gap-4">
        <div class="flex justify-between items-start w-full px-5">
          <div class="flex flex-col">
            <b class="text-[18px] font-semibold">
              Solicitação de devolução
            </b>
            <span>
              Lorens inputm
            </span>
          </div>
          <button class="p-1 mt-2" onclick={()=>visualizacao="pedido"}>
            <SvgX props={{
              class:"fill-sub-600"
            }}/>
          </button>
      </div>
      
      <FillText texto="PEDIDO"/>

      <div class="flex flex-col px-5 gap-2">
        <div class="flex items-center justify-between relative pb-2 overflow-hidden gap-4 border-b-2 border-dashed border-soft-200">
          <div class="flex items-center gap-4 self-center z-1">
            <Avatar
              name={"Produto"}
              src={sanitizeUrl(produto!.imagem ?? "")}
              rounded={"rounded-[8px]"}
            />
            <div class="flex flex-col items-start">
              <p
                class="text-18 text-start font-medium text-strong-950 truncate w-[280px]"
              >
                {produto!.nome}
              </p>
            </div>
          </div>
        </div>
        <div class="flex items-center text-[14px] justify-between w-ful">
          <span class="text-sub-600">
            Valor a ser devolvido
          </span>
          <b>
            R${sanitizar.centavosToReais(produto.preco)}
          </b>
        </div>
      </div>

      <FillText texto="FORMULARIO"/>
      <div class="flex flex-col px-5 gap-2">
        <InputWrapper label="Motivo" mandatory={true} value="">
          <SelectBlock placeholder=""  options={[
            { "label": "Arrependimento", "value": "ARREPENDIMENTO" },
            { "label": "Compra por engano", "value": "COMPRA_POR_ENGANO" },
            { "label": "Valor mudou após compra", "value": "VALOR_MUDOU_APOS_COMPRA" },
            { "label": "Encontrei mais barato", "value": "ENCONTREI_MAIS_BARATO" },
            { "label": "Outro", "value": "OUTRO" }
          ]} bind:value={formDevolucao.motivo} removableOnClick={false} focusCss="relative h-[40px]"/>    
        </InputWrapper>
        <TextArea bind:value={formDevolucao.detalhes} label="Conte-nos mais" placeholder="Escreva aqui" limit={500}/>
      </div>
    </div>
    <div class="border-t border-soft-200 pt-3 px-3">
      <div class="h-[40px] grid grid-cols-2 gap-5">
        <Botao tema="gray-transparent" onClick={()=>visualizacao="pedido"}>
          Cancelar
        </Botao>
        <Botao tema="red" onClick={submitDevolucao} loading={loadingBtn}>
          Enviar solicitação
        </Botao>
      </div>  
    </div>
  </div>
{/if}
{/snippet}

{#snippet dadosProduto()}
  {#if produto}
    <div class="flex flex-col justify-between w-full h-full">
      <div class="flex flex-col gap-4">
        <div class="flex items-center gap-4 px-5">
          <Avatar
            name={produto.nome}
            src={sanitizeUrl(produto.imagem ?? "")}
            rounded={"rounded-[12px]"}
          />
          <div class="flex flex-col">
            <p class="text-16 font-medium text-strong-950 truncate w-[250px]">
              {produto.nome}
            </p>
            {#if pedido?.preco && pedido?.criadoEm}
              <p class="text-14 font-normal text-sub-600">
                {handleDate.formatISODate(pedido?.criadoEm!, "dd MMMM, yyyy")} •
                R$
                {sanitizar.centavosToReais(pedido?.preco!)}
              </p>
            {/if}
          </div>
          {@render dropProduto()}
        </div>
        {#if visualizacao === "produto"}
          <div class="flex flex-col gap-2">
            <FillText texto="CHAVE" />
            <div class="px-5">
              <Copy text={chave} hide={!produto.visualizado} />
            </div>
          </div>
        {:else if visualizacao === "avaliacao"}
          <FillText texto={"SUA AVALIAÇÃO"} />
          <div class="flex flex-col items-start gap-0.5 w-full px-5">
            <div class="flex items-center justify-between w-full">
              <p class="text-14 font-medium text-strong-950">Meu usuário</p>
              <p class="text-12 font-normal text-sub-600">
                {handleDate.formatRelativeDate(new Date())}
              </p>
            </div>
            <p class="text-14 font-normal text-sub-600">
              {formAvaliacao.comentario}
            </p>
            <div class="mt-0.5"></div>
            <RatingStars rating={formAvaliacao.nota} enableRating={false} />
          </div>
        {:else if visualizacao === "fazerAvaliacao"}
          <div class="flex flex-col gap-2">
            <FillText texto={"AVALIAÇÃO DO PRODUTO"} />
            <div class="flex px-5">
              <CardRating
                bind:comentario={formAvaliacao.comentario}
                bind:rating={formAvaliacao.nota}
              />
            </div>
          </div>
        {/if}
      </div>
      <div class="w-full border-t border-soft-200 px-4 pt-3 relative">
        {@render modalPermissaoRevelar()}
        <div class="grid grid-cols-2 h-[40px] gap-2 w-full">
          <Botao
            onClick={() => {
              visualizacao = "pedido";
            }}
            tema="gray-transparent"
          >
            Voltar
          </Botao>
          <Botao
            loading={loadingBtn}
            onClick={() => {
              if (visualizacao === "produto" && produto!.visualizado === false)
                openPermissao = true;
              else if (
                visualizacao === "produto" &&
                produto!.visualizado === true
              )
                buscarAvalicao();
              else if (visualizacao === "avaliacao")
                visualizacao = "fazerAvaliacao";
              else avaliar();
            }}
            tema="primary"
          >
            {#if visualizacao === "produto" && produto.visualizado === false}
              Revelar Chave
            {:else if visualizacao === "produto" && produto.visualizado === true}
              Avaliar produto
            {:else if visualizacao === "avaliacao"}
              Avaliar produto
            {:else}
              Avaliar
            {/if}
          </Botao>
        </div>
      </div>
    </div>
  {/if}
{/snippet}

{#snippet dropProduto()}
  {#if produto}
    <FocusBlock bind:isFocus={dropDown} className="relative">
      <button
        onclick={() => {
          dropDown = true;
        }}
        class="p-1 hover:bg-weak-50"
      >
        <SvgThreeDots />
      </button>
      <DropBlock
        isDrop={dropDown}
        className="absolute left-[-180px]  flex flex-col bg-white-0 rounded-lg shadow-md border border-soft-200"
      >
        <button
          class="p-3 px-5 whitespace-nowrap {produto.visualizado ? "text-primary-dark" : "text-error-base"} flex items-center gap-3"
          onclick={() => {
            if(produto!.visualizado===false){
              visualizacao="devolucao"
              dropDown=false
              return
            }
            visualizacao = "fazerAvaliacao";
            dropDown = false;
          }}
        >
          {#if produto.visualizado}
            <SvgStar
              props={{
                class: "stroke-primary-dark fill-none w-3.5 h-3.5",
              }}
            />
            Avaliar produto
          {:else}
              <SvgArrowBack/>
              Solicitar devolução
          {/if}
        </button>
      </DropBlock>
    </FocusBlock>
  {/if}
{/snippet}

{#snippet dadosPedido()}
  {#if pedido}
    <div class="flex flex-col w-full h-full">
      <div class="flex items-start justify-between px-5 w-full mb-5">
        <div class="flex flex-col">
          <p class="text-18 font-medium text-strong-950">Pedido #{pedido.id}</p>
          <p class="text-14 font-normal text-sub-600">
            {handleDate.formatISODate(pedido.criadoEm, "dd MMMM, yyyy")}
            • R${sanitizar.centavosToReais(pedido.total)}
          </p>
        </div>
        <div class="flex items-start gap-4">
          <CardIconStatus status={pedido.status}/>

          <button class="p-1" onclick={() => (open = false)}>
            <SvgX cor={"sub-600"} />
          </button>
        </div>
      </div>
      <FillText texto={"PROUTOS"} />
      <div class="flex flex-col gap-4 mb-3 mt-3">
        {#each pedido.itens as item}
          <button
            class="flex items-center justify-between px-5 group relative overflow-hidden gap-4 py-4
              not-last:border-b border-dashed border-soft-200"
            onclick={() => {
              produto = item;
              if (produto.visualizado === true) {
                comprasController
                  .revelarChave(idPedido, produto.id)
                  .then((result) => {
                    chave = result[0].data.conteudo;
                  });
              }
              visualizacao = "produto";
            }}
          >
            <div
              class="absolute w-full h-full bg-soft-200 z-0 left-0 translate-x-[-100%] ease-in-out group-hover:translate-x-0"
            ></div>
            <div class="flex items-center gap-4 self-center z-1">
              <Avatar
                name={"Produto"}
                src={sanitizeUrl(item.imagem ?? "")}
                rounded={"rounded-[8px]"}
              />
              <div class="flex flex-col items-start">
                <p
                  class="text-18 text-start font-medium text-strong-950 truncate w-[240px]"
                >
                  {item.nome}
                </p>
                <!-- <p class="text-14 font-normal text-sub-600">
                  {console.log(item)}
                  1 mês | 1 assento
                </p> -->
              </div>
            </div>
            <SvgSetaDireita
              props={{
                class: "z-2",
              }}
            />
          </button>
        {/each}
      </div>
      <FillText texto={"RESUMO DO PEDIDO"} />
      <div class="flex flex-col gap-4 px-5 my-4">
        <div class="flex items-center justify-between">
          <p class="text-14 font-normal text-sub-600">Subtotal</p>
          <p class="text-14 font-normal text-strong-950">
            R${sanitizar.centavosToReais(pedido.preco)}
          </p>
        </div>
        <div class="flex items-center justify-between">
          <p class="text-14 font-normal text-sub-600">Cupom de desconto</p>
          <p class="text-14 font-medium text-success-base">
            - R${sanitizar.centavosToReais(pedido.desconto ?? 0)}
          </p>
        </div>
        <div class="border-b border-dashed border-soft-200"></div>
        <div class="flex items-center justify-between">
          <p class="text-14 font-normal text-sub-600">Total</p>
          <p class="text-14 font-medium text-strong-950">
            R${sanitizar.centavosToReais(pedido.total)}
          </p>
        </div>
      </div>
      <FillText texto={"LINHA DO TEMPO"} />
      <div
        class="flex flex-col w-full overflow-y-auto px-5 mt-4 h-[130px] shrink-0 scroll-smooth scrollbar-hide"
      >
        <LinhaDoTempo historico={pedido.historico} />
      </div>
    </div>
  {/if}
{/snippet}

{#snippet modalPermissaoRevelar()}
  <PopUp bind:open={openPermissao} withDefaultPadding={false}>
    <div class="w-[380px] flex flex-col gap-3 pb-3">
      <div class="flex items-start gap-4 px-5 pt-5">
        <div class="shrink-0">
          <SvgMaozinha />
        </div>
        <div class="flex flex-col text-left gap-1">
          <p class="text-16 text-strong-950 font-medium">Calma aí, paizão!</p>
          <p class="text-14 text-sub-600 font-normal">
            Ao visualizar suas chaves você não poderá mais pedir reembolso.
          </p>
        </div>
      </div>
      <div class="border-b border-soft-200"></div>
      <div class="grid grid-cols-2 gap-x-3 px-5 h-[40px]">
        <Botao onClick={() => (openPermissao = false)} tema="gray-transparent">
          Voltar
        </Botao>
        <Botao
          onClick={() => {
            openPermissao = false;
            revelarChave();
          }}
          tema="primary"
        >
          Tô ligado
        </Botao>
      </div>
    </div>
  </PopUp>
{/snippet}

