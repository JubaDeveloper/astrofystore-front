<script lang="ts">
  import SvgCaret from '$components/assets/svg/SvgCaret.svelte';
  import SvgCheck from '$components/assets/svg/SvgCheck.svelte';
  import SvgCheckMin from '$components/assets/svg/SvgCheckMin.svelte';
  import type { Component } from 'svelte';


    type Step =  {
            label:string,
            icon?:Component,
            [key:string]:any
    }
    interface Props{
        steps:Step[],
        currentStep:number,
        format: "inline" | "col",
        indicator?: "number" | "icon",
        click?:boolean
    }

    let {steps,indicator="number",currentStep = $bindable(),format="col", click = false}:Props = $props()


    function changeStep(i:number){
        if(!click) return
        currentStep = i+1
    }

</script>


{#if format==="inline"}
    <div class="flex text-soft-400 items-center gap-6">
        {#each steps as st,i}
            {@render step(st,i)}
            {#if i<steps.length-1}
                <SvgCaret props={{
                    class:"rotate-[-90deg]"
                }}/>
            {/if}
        {/each}
    </div>
{:else}
    <div class="flex flex-col text-soft-400 items-center gap-3">
        {#each steps as st,i}
            <button onclick={()=>changeStep(i)} class="flex w-full items-center justify-between p-2 pr-4 rounded-[10px] data-[current]:bg-weak-50" 
            data-passed={currentStep>i+1 ? true : null} data-futher={i+1>currentStep ? true : null} data-current={currentStep===i+1 ? true : null}>
                {#if indicator==="icon"}
                    {@render stepIcon(st,i)}
                {:else}
                    {@render step(st,i)}
                {/if}
                {#if i+1===currentStep}
                    <SvgCaret props={{
                        class:"rotate-[-90deg]"
                    }}/>
                {/if}    
            </button>
        {/each}
    </div>
{/if}



{#snippet stepIcon(step:Step,i:number)}
{@const Icon = step.icon}
<div class="flex items-center gap-2 text-[14px] text-strong-950 data-[futher]:text-sub-600 font-normal" data-futher={i+1>currentStep ? true : null} >
    <div class="w-[20px] text-[12px] aspect-square flex items-center justify-center rounded-full"
    data-passed={currentStep>i+1 ? true : null} data-futher={i+1>currentStep ? true : null} data-current={currentStep===i+1 ? true : null}>
        <Icon/>
    </div>

    {step.label}

</div>

{/snippet}



{#snippet step(step:Step,i:number)}

<div class="flex items-center gap-2 text-[14px] text-strong-950 data-[futher]:text-sub-600 font-normal" data-futher={i+1>currentStep ? true : null} >
    <div class="w-[20px] text-[12px] aspect-square flex items-center justify-center rounded-full 
    bg-white-0 border border-transparent data-[futher]:text-sub-600 data-[current]:text-white 
    data-[current]:bg-primary-base data-[futher]:border-soft-200 data-[passed]:bg-primary-base"
    data-passed={currentStep>i+1 ? true : null} data-futher={i+1>currentStep ? true : null} data-current={currentStep===i+1 ? true : null}>
        {#if currentStep>i+1}
            <SvgCheckMin props={{
                width:11,
                height:11
            }}/>
        {:else}
            {i+1}
        {/if}
    </div>

    {step.label}

</div>

{/snippet}