<script lang="ts">
  import { fade } from "svelte/transition";
  import SvgXModal from "../svg/SvgXModal.svelte";
  import Botao from "../buttons/Botao.svelte";
  import CardRating from "$components/elements/rating/CardRating.svelte";

  interface Props {
    open: boolean;
    nota: number;
    comentario: string;
    click: VoidFunction;
  }

  let {
    open = $bindable(),
    nota = $bindable(),
    comentario = $bindable(),
    click
  }: Props = $props();

  function imagemAleatoria(): string {
    const images = [
      '/images/camp.png',
      '/images/legalzao.png',
      '/images/chapa.png',
    ];
    const randomIndex = Math.floor(Math.random() * images.length);
    return images[randomIndex];
  }

  let visibilidade: boolean = $state(true)

  $effect(()=>{
    if(comentario.length !== 0) visibilidade = false
  })
</script>

<div class="w-full h-full flex justify-end items-end md:items-center md:justify-center z-10 fixed bottom-0 right-0 left-0 top-0 backdrop-blur-[1px] bg-static-black/30 dark:bg-static-white/10" transition:fade>
  <div class="relative flex flex-col max-sm:w-full w-[500px]">
    <img class="w-full h-fit rounded-t-[10px]" src={imagemAleatoria()} alt="">
    <button class="bg-white-0 p-2 rounded-[8px] absolute right-0 m-3" onclick={() => open = !open}>
      <SvgXModal/>
    </button>
    <div class="bg-white-0 rounded-b-2xl flex flex-col items-center justify-center gap-4">
      <div class="flex flex-col items-center justify-center gap-4 w-full pt-6 p-4">
        <p class="text-20 font-medium text-strong-950">🙏 Avalia o produto, ai pls!</p>
        <CardRating bind:rating={nota} bind:comentario={comentario}/>
      </div>
      
      <div class="border-t border-soft-200 w-full flex items-center justify-center p-4">
        <button class="bg-primary-base rounded-[8px] flex w-full py-2.5 items-center justify-center text-14 font-medium text-white-0 disabled:pointer-events-none disabled:bg-weak-50 disabled:text-disabled-300" disabled={visibilidade} onclick={()=> click()}>
          Avaliar
        </button>
      </div>
    </div>
  </div>
</div>