<script lang="ts">
  import Avatar from "$components/assets/avatar/Avatar.svelte";
  import Botao from "$components/assets/buttons/Botao.svelte";
  import PopAvaliar from "$components/assets/modals/PopAvaliar.svelte";
  import SidePop from "$components/assets/modals/SidePop.svelte";
  import SvgCart from "$components/assets/svg/SvgCart.svelte";
  import SvgX from "$components/assets/svg/SvgX.svelte";
  import RatingStars from "$components/elements/rating/RatingStars.svelte";
  import { AvaliacaoController } from "$lib/api/modules/avaliacao/avaliacao.controller";
  import type { ComentarioDto } from "$lib/api/modules/avaliacao/avaliacao.dto";
  import handleText from "$lib/sanitizers/text";
  import handleDate from "$lib/sanitizers/time";
  import domainManager from "$lib/settings/domain.svelte";
  import toast from "$lib/utils/toast.svelte";
  import { encurtarTexto } from "$lib/utils/utils.svelte";
  import ModalAvaliar from "./ModalAvaliar.svelte";

  interface Props {
    open: boolean;
    produtoId: number;
  }
  let { open = $bindable(), produtoId }: Props = $props();

  let openAvaliar = $state(false);
  let expandirComentario = $state(false);
  let loading = $state(false);
  let comentarios = $state<ComentarioDto[]>([]);

  const avaliacaoController = new AvaliacaoController(domainManager.lojaId!);

  const maximoCaracteres = 38;

  async function listar() {
    loading = true;
    const [r, e] = await avaliacaoController.listar(produtoId);
    if (e) {
      return toast.error("Notificação do sistema", e.message);
    }
    comentarios = r.data.resultado;
    loading = false;
  }

  listar();
</script>

<SidePop curved={true} bind:open>
  <div class="flex flex-col h-full w-full">
    <div class="flex flex-col gap-4 h-full w-full">
      <div class="flex items-center justify-between px-5 w-full">
        <p class="text-18 font-medium text-strong-950">Avaliações do produto</p>
        <button onclick={() => (open = false)}>
          <SvgX cor={"#525866"} />
        </button>
      </div>
      <div class="flex flex-col border-t border-soft-200">
        {#if comentarios.length > 0}
          {#each comentarios as comentario}
            <div class="flex flex-col gap-3 px-5 w-full pt-4">
              <div
                class="flex items-start gap-3 w-full border-b-2 border-dashed border-soft-200 pb-5"
              >
                <Avatar
                  name={comentario.cliente.nome}
                  src={"name.com"}
                  size="w-[48px]"
                />
                <div class="flex flex-col items-start gap-0.5 w-full">
                  <div class="flex items-center justify-between w-full">
                    <p class="text-14 font-medium text-strong-950">
                      {comentario.cliente.nome}
                    </p>
                    <p class="text-12 font-normal text-sub-600">
                      {handleDate.formatRelativeDate(
                        new Date(comentario.criadoEm)
                      )}
                    </p>
                  </div>
                  <p class="text-14 font-normal text-sub-600">
                    {encurtarTexto(
                      comentario.comentario,
                      expandirComentario ? 9999999999 : maximoCaracteres
                    )}
                  </p>
                  {#if comentario.comentario.length > maximoCaracteres}
                    <button
                      class="text-12 space-x-4 font-medium text-strong-950"
                      onclick={() => (expandirComentario = !expandirComentario)}
                    >
                      {!expandirComentario ? "VER MAIS" : "VER MENOS"}
                    </button>
                  {/if}
                  <div class="mt-0.5"></div>
                  <RatingStars rating={comentario.nota} enableRating={false} />
                </div>
              </div>
            </div>
          {/each}
        {:else}
          <div
            class="flex flex-col w-full gap-1 items-center justify-center top-0 left-0 h-full absolute"
          >
            <h6 class="font-semibold">Nenhuma avaliação para este produto</h6>
            <span class="text-sub-600 text-[14px]">
              Seja o primeiro a avaliar ao comprar este produto!
            </span>
            <div class="grid h-[40px] mt-2 w-[250px]">
              <Botao tema="green" onClick={() => (open = false)}>
                <SvgCart
                  props={{
                    fill: "white",
                    class: "w-4 h-4",
                  }}
                />
                <span class="text-[16px]"> Voltar as compras </span>
              </Botao>
            </div>
          </div>
        {/if}
      </div>
    </div>
  </div>

  <!-- <ModalAvaliar bind:open={openAvaliar}/> -->
</SidePop>
