<script lang="ts">
  import BolinhaStatus from "$components/elements/card/BolinhaStatus.svelte";

    interface Props{
        dataset:{
            label:string,
            bg:string,
            value:number
        }[]
    }
    let {dataset}:Props = $props()

    let totalValue = $derived.by(()=>{
        return dataset.reduce((sum, item) => sum + item.value, 0);
    })

</script>


<div class="flex flex-col gap-2 w-full">
    <div class="flex items-center gap-2 w-full">
        {#each dataset as data}
            {@const percentual = (data.value*totalValue)/100}
            <div class="rounded-[2px] h-[10px] group relative flex cursor-pointer justify-center {data.bg} " style="width:{percentual*100}%;">
                <div class="absolute bg-white-0 border border-soft-200 text-[13px] font-medium shadow-md opacity-0 pointer-events-none group-hover:opacity-100 group-hover:translate-y-[-36px] px-4 py-1 rounded-lg">
                    {data.value} Produtos
                </div>
            </div>
        {/each}
    </div>
    <div class="flex items-center gap-5 flex-wrap">
        {#each dataset as data}
            <BolinhaStatus bg={data.bg} label={data.label}/>
        {/each}
    </div>
</div>

