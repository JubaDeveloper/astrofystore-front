<script lang="ts">
    import DropBlock from "$components/assets/logic/DropBlock.svelte";
    import FocusBlock from "$components/assets/logic/FocusBlock.svelte";
    import SvgCaret from "$components/assets/svg/SvgCaret.svelte";

    type Status = {
        label: string,
        value: boolean,
        color: string
    }

    interface Props {
        statusOp: Status[],
        value: boolean
    }

    let {statusOp, value=$bindable()}: Props = $props()

    let selectOpen:boolean = $state(false)
    
    let selected = $derived(statusOp.find(s => s.value === value) ?? statusOp[0]) 
    
    function selectOption(s: Status) {
        value = s.value
        selectOpen = false
    }
</script>

<FocusBlock bind:isFocus={selectOpen} className="relative outline-none border-none">
    <button class="flex gap-3 text-[14px] text-sub-600 items-center h-[40px] rounded-lg outline-none border border-soft-200 px-2"
    onclick={() => selectOpen = !selectOpen}>
        <div class="w-[15px] aspect-square border-2 border-white rounded-full overflow-hidden shadow-sm">
            <div class="w-full h-full {selected?.color}">
            </div>
        </div>
        {selected?.label}
        <SvgCaret props={{
            class:"rota"
        }}/>
    </button>
    <DropBlock isDrop={selectOpen} className="absolute right-0 w-[250px] top-[100%] mt-2 flex z-10 flex-col border border-soft-200 rounded-lg bg-white-0 shadow-md">
        {#each statusOp as s}
            <button 
                class="w-full hover:bg-slate-100 text-sub-600 hover:text-strong-950 flex items-center gap-3 p-2 px-3 pointer-events-auto" 
                onclick={() => selectOption(s)}
            >
                <div class="w-[15px] aspect-square border-2 border-white rounded-full overflow-hidden shadow-sm">
                    <div class="w-full h-full {s.color}"></div>
                </div>
                {s.label}
            </button>
        {/each}
    </DropBlock>
</FocusBlock>