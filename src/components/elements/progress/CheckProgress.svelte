<script lang="ts">
  import SvgCheckMin from "$components/assets/svg/SvgCheckMin.svelte";
  import SvgX from "$components/assets/svg/SvgX.svelte";



    interface Props{
        steps:{
            label:string,
            pass:boolean,
            color:string
        }[],
        label:string
    }
    let {steps,label}:Props = $props()

    let concluidos = $derived(steps.filter((obj=>obj.pass)).length)
    
</script>

<div class="flex flex-col text-[12px] font-normal text-sub-600 gap-2">
    <div class="flex items-center gap-2">
        {#each steps as step,i}
            <div class="h-1 flex-grow rounded-[4px] {concluidos>i ?  step.color : "bg-soft-200"}">
            </div>
        {/each}
    </div>
    <span>{label}</span>
    {#each steps as step,i}
        <div class="flex items-center gap-1">
            <div class="{step.pass ?  "bg-success-base" : "bg-soft-200"} w-[14px] flex justify-center items-center shrink-0 aspect-square rounded-full">
                {#if step.pass}
                    <SvgCheckMin props={{
                        width:9,
                    }}/>
                {:else}
                    <SvgX props={{
                        width:7,
                    }}/>
                {/if}
            </div>

            {step.label}
        </div>
    {/each}
</div>