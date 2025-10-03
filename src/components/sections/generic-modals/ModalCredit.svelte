<script lang="ts">
    import Botao from "$components/assets/buttons/Botao.svelte";
    import Input from "$components/assets/input/Input.svelte";
    import PopUp from "$components/assets/modals/PopUp.svelte";
  import SvgSpeedometer from "$components/assets/svg/SvgSpeedometer.svelte";

    import toast from "$lib/utils/toast.svelte";

    const maxScore = 25
	let {open = $bindable()} = $props()

    let score = $state<number>(maxScore/2)	
    
    let scoreHover = $state<number>(-1)

    let status = $derived.by(()=>{
        if(score<10){
            return "Very bad"
        }
        if(score<20){
            return "Bad"
        }
        if(score<30){
            return "Mid"
        }
        if(score<40){
            return "Good"
        }
        return "Excellent"
    })


</script>



<PopUp bind:open withCloseButton={false}>
	<div class="flex flex-col gap-4 w-[360px]">
		<div class="flex gap-2 items-center justify-between w-full">
            <div class="flex items-center gap-3 font-normal text-strong-950 ">
                <SvgSpeedometer
                    props={{
                        class:"fill-strong-950"
                    }}
                />
                Credit Score
            </div>
            <Botao tema="gray-transparent" onClick={()=>{}}>
                Details
            </Botao>
		</div>
        {@render linha()}

        <div class="flex items-center justify-between w-full">
            <div class="flex flex-col text-sub-600 ">
                <p class="text-[18px]">
                    Your <b class="text-strong-950">credit score</b> is <b class="text-strong-950">{score}</b>
                </p>
                <span class="text-[12px]">The score is considered {status}</span>
            </div>

        </div>

        <div class="flex items-center justify-between w-full">
            {#each {length:maxScore} as _,i}
                <button
                class="shrink-0 h-[30px] px-1 grow group" 
                onclick={()=>score=i}
                onmouseenter={()=>scoreHover=i}
                onmouseleave={()=>scoreHover=-1}
                aria-label={score.toString()}>
                    <div 
                    class="h-full w-full data-[active]:bg-success-base bg-soft-400 hover:bg-success-base"
                    data-active={(()=>{
                        if((i<=score) || i<=scoreHover){
                            if(scoreHover!==-1){
                                if(i<=scoreHover){
                                    return true
                                }
                                return null
                            }
                            return true
                        }
                        return null
                    })()}>

                    </div>
                </button>

            {/each}
        </div>
		
	</div>
</PopUp>



{#snippet linha()}
	<div class="relative w-full">
		<div class="absolute left-[-50%] w-[200%] h-[1px] bg-soft-200">
		</div>
	</div>
{/snippet}