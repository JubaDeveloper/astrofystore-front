<script lang='ts'>
    import SvgSeta from "$components/assets/svg/SvgSeta.svelte";

    interface Props {
        clickCima?: ()=> void;
        clickBaixo?: ()=> void;
    }

    let onClickCima = () => {};

    let onClickBaixo = () => {};

    let {clickCima = onClickCima, clickBaixo = onClickBaixo}: Props = $props();
</script>

<div>
    <div class="font-medium text-[12px] text-sub-600 flex items-center gap-2">
        Use
        <button onclick={()=> clickCima()}>
            <SvgSeta props={{class:"shrink-0"}}/>
        </button>
        <button onclick={()=> clickBaixo()}>
            <SvgSeta props={{class:"shrink-0 rotate-180"}}/>
        </button>
        to navigate
    </div>
</div>