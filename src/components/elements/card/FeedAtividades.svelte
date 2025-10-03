<script lang='ts'>
    import PaginacaoFeed from "$components/assets/paginacao/PaginacaoFeed.svelte";
    import TabMenuHorizontal from "$components/assets/tabs/TabMenuHorizontal.svelte";
    import SvgConfiguracao from "$components/assets/svg//SvgConfiguracao.svelte";
    import ItemsCard from "./ItemsCard.svelte";

    interface Props {
        labelCard?: string;
        tituloMarcar?:string;
        gerenciar?:string;
        clickMarcar?: () => void;
        clickGerenciar?: () => void;
    }

    let tituloCard = 'Notifications';
    let tituloBotao = 'Mark all as read';
    let onClickMarcar = () => {};

    let tituloGerenciar = "Manage Notification"
    let onClickGerenciar = () => {};

    let {labelCard = tituloCard, tituloMarcar = tituloBotao, gerenciar = tituloGerenciar, clickMarcar = onClickMarcar, clickGerenciar = onClickGerenciar}: Props = $props();
</script>

<div class="flex flex-col md:w-lg w-full">
    <div class="flex items-center justify-between bg-white-0 py-4 px-5 rounded-t-2xl border-b border-soft-200">
        <p class="text-strong-950 font-medium text-[16px]">{labelCard}</p>
        <button onclick={clickMarcar} class="text-primary-base font-medium text-[14px]">
            {tituloMarcar}            
        </button>
    </div>
    <div class="flex items-center justify-between bg-white-0 py-4 px-5 border-b border-soft-200 w-full">
        <TabMenuHorizontal/>
    </div>
    <div class="flex items-center justify-between bg-white-0 py-4 px-5 border-b border-soft-200">
        <ItemsCard/>
    </div>
    <div class="flex items-center justify-between bg-white-0 py-4 px-5 rounded-b-2xl">
        <PaginacaoFeed/>
        <button onclick={clickGerenciar} class="flex items-center gap-1 font-medium text-[12px] text-sub-600">
            <SvgConfiguracao/>
            {gerenciar}
        </button>
    </div>
</div>