<script lang="ts">
    import { goto } from "$app/navigation";
    import Avatar from "$components/assets/avatar/Avatar.svelte";
    import Botao from "$components/assets/buttons/Botao.svelte";
    import DropBlock from "$components/assets/logic/DropBlock.svelte";
    import FocusBlock from "$components/assets/logic/FocusBlock.svelte";
    import SvgCaret from "$components/assets/svg/SvgCaret.svelte";
    import type { Categoria } from "$lib/api/modules/produto/produto.dto.svelte";
  
    interface Props {
      categorias: Categoria[]
    }
    let { categorias }: Props = $props();
    let open = $state(false)
  </script>

<FocusBlock bind:isFocus={open} className="relative">
  <button class="text-[14px] text-sub-600 flex items-center gap-2" onclick={()=>open=!open}>
      Mais categorias
      <SvgCaret props={{class:`${open ? "rotate-180" : ""}`}}/>

  </button>
    <DropBlock className="flex flex-col w-full absolute top-[120%] bg-white-0 rounded-[4px] left-0  border border-soft-200 text-sub-600" isDrop={open}>
      {#each categorias as {nome},i}
          <button class="py-2 px-1 hover:bg-soft-200" onclick={()=>goto("/categoria/"+nome)}>
              {nome}
          </button>
          
      {/each}
    </DropBlock>
</FocusBlock>