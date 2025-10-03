<script lang="ts">
    import DuplaSetaPaginacaoSvg from "$components/assets/svg//SvgDuplaSeta.svelte";
    import SetaPaginacaoSvg from "$components/assets/svg//SvgSetaPaginacao.svelte";

    let ativo = $state<boolean>(false)


</script>

<div class="flex items-center gap-2">
    <button>
        <DuplaSetaPaginacaoSvg/>
    </button>
    <button>
        <SetaPaginacaoSvg/>
    </button>
    
    <div class="flex items-center gap-2">
        <button class="p-1.5 border border-soft-200 rounded-[8px] text-[14px] font-medium text-sub-600 {ativo ? 'bg-soft-200' : ''}" onfocus={()=> ativo = true} onmouseover={()=> ativo = true} onmouseleave={()=> ativo = false}>
            <span class="w-5 h-5 inline-block">{'1'}</span>
        </button>
    </div>
    <button class="rotate-180">
        <SetaPaginacaoSvg/>
    </button>
    <button class="rotate-180">
        <DuplaSetaPaginacaoSvg/>
    </button>
    
</div>