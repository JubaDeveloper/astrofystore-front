<script lang="ts">
  import SvgIconPix from "../svg/SvgIconPix.svelte";
  import toast from "$lib/utils/toast.svelte";

  interface Props {
    value: string,
    show: boolean
  }

  let {
    value,
    show = $bindable(),
  }: Props = $props();
</script>

{#if show}
  <div class="flex px-3 text-[14px] h-[40px] max-h-[40px] font-normal items-center gap-2 rounded-[10px] apply-class-focus w-full">
    {@render input("text")}
    <button class="-mr-3 z-50" onclick={()=> {navigator.clipboard.writeText(value), toast.success('Key copiada com sucesso.', 'Agora é só aproveitar, meu patrão!')}}>
      <SvgIconPix/>
    </button>
  </div>
{:else}
  <div class="flex px-3 text-[14px] h-[40px] max-h-[40px] font-normal items-center gap-2 rounded-[10px] apply-class-focus w-full">
    {@render input("password")}
  </div>
{/if}

{#snippet input(tipo: string)}
  <input
    type={tipo}
    name="input"
    bind:value
    class="w-full outline-none  text-[14px]"
  />
{/snippet}