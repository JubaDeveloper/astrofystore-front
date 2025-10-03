<script lang="ts">
    import FocusBlock from "$components/assets/logic/FocusBlock.svelte";
    import DropBlock from "$components/assets/logic/DropBlock.svelte";
    import SvgSearch from "$components/assets/svg/SvgSearch.svelte";

    import { slide } from "svelte/transition";
    import { untrack } from "svelte";

    let containerInput = $state<HTMLInputElement>()
    let idInterval = $state<number>()
    let expand = $state(false)
    let open = $state(false)
    let input = $state("")

    function handleExpand(){
        expand = !expand
    }
    function handleFocusOut(event: FocusEvent, callback: () => void) {
        if(input.length > 0) return
        const related = event.relatedTarget as HTMLElement | null;
        const current = event.currentTarget as HTMLElement;
        if (!related || !current.contains(related)) callback();
    }

    $effect(()=>{
        if(input.length===0 && expand===true){
                idInterval = setTimeout(()=>{
                    open=false
                    setTimeout(()=>{
                        expand=false
                    },600)
                },12000)
        } else {
            untrack(()=>{
                clearTimeout(idInterval)
            })
        }
        if(input && untrack(()=>open===false) && untrack(()=>containerInput)){
            untrack(()=>{
                open=true
                setTimeout(()=>{
                    containerInput!.focus()
                },200)
            })
        }
    })
</script>

<div onfocusout={(e) => handleFocusOut(e, () => expand = false)} class="flex border border-soft-200 rounded-[10px] h-[40px] max-h-[40px] min-w-[40px] items-center">
    {#if expand}
        <div class="flex w-[300px]" in:slide={{axis:"x"}} out:slide={{axis:"x"}}>
            <FocusBlock itensWithFocus={["input"]} bind:isFocus={open} className="relative">
                <input type="text"  bind:this={containerInput} bind:value={input} placeholder="Pesquise por produtos..." class="px-2 outline-none border-none">
                <DropBlock isDrop={open} className="flex flex-col w-[340px] absolute top-[175%] rounded-[8px] bg-white-0 left-0 shadow-md border border-soft-200 p-3">
                    aa
                </DropBlock>
            </FocusBlock>
        </div>
    {/if}

    <button class="w-[40px] max-w-[40px]  h-full flex items-center justify-center" onclick={handleExpand}>
        <SvgSearch/>
    </button>
</div>