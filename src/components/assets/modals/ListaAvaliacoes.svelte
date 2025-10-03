<script lang="ts">
  import { encurtarTexto } from "$lib/utils/utils.svelte";
  import Avatar from "../avatar/Avatar.svelte";
  import SvgX from "../svg/SvgX.svelte";
  import SidePop from "./SidePop.svelte";

  interface Props {
    open: boolean;
    comentario: string;
    versionarComentario: boolean;
  }

  let {
    open = $bindable(),
    comentario = $bindable(),
    versionarComentario = $bindable(),
  }: Props = $props();
</script>

<SidePop curved={true} bind:open>
  <div class="flex flex-col gap-4 h-full w-full">
    <div class="flex items-center justify-between px-5 w-full">
      <p class="text-18 font-medium text-strong-950">Avaliações do produto</p>
      <button onclick={() => (open = false)}>
        <SvgX cor={"#525866"} />
      </button>
    </div>
    <div class="flex flex-col gap-3 px-5 w-full pt-4 border-soft-200 border-t">
      <div
        class="flex items-start gap-4 w-full border-b border-dashed border-soft-200 pb-7"
      >
        <Avatar name={"Name"} src={"name.com"} />
        <div class="flex flex-col items-start gap-1 w-full">
          <div class="flex items-center justify-between w-full">
            <p class="text-14 font-medium text-strong-950">Jefferson Sandro</p>
            <p class="text-14 font-normal text-sub-600">Há 16h</p>
          </div>
          <p class="text-14 font-normal text-sub-600">
            {!versionarComentario ? encurtarTexto(comentario, 30) : comentario}
          </p>
          <button
            class="text-12 font-medium text-strong-950"
            onclick={() => (versionarComentario = !versionarComentario)}
          >
            {!versionarComentario ? "VER MAIS" : "VER MENOS"}
          </button>
        </div>
      </div>
    </div>
  </div>
</SidePop>
