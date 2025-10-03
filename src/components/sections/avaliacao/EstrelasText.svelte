<script lang="ts">
  import SvgHalfStart from "$components/assets/svg/SvgHalfStart.svelte";
  import SvgStar from "$components/assets/svg/SvgStar.svelte";


    interface Props{
        estrelas:number,
        text:string
    }
    let {estrelas = $bindable(),text = $bindable()}:Props = $props()

    let ratingHover = $state<number>(0)

    const mouseOver = (e:MouseEvent,i:number) => {
        const target = e.target as HTMLButtonElement
        if(e.offsetX>target.getBoundingClientRect().width/2){
        ratingHover = i        
        }
        else{
        ratingHover = i-0.5
        }
    }

    const onClick = (e:MouseEvent) => {
        estrelas = ratingHover
    }
</script>


<div class="flex flex-col w-[408px]">
    <div role="complementary" class="grid grid-cols-5" onmouseleave={()=>{ratingHover=-1}}>
        {#each {length:5} as _,i}
            <button 
            class="w-[81px] h-[36px] flex justify-center items-center border border-soft-200 
            not-first:border-l-0 first:rounded-tl-lg last:rounded-tr-lg
            "
            role="menuitem"
            onfocus={()=>{}}
            onclick={onClick}
            onmousemove={(e)=>mouseOver(e,i+1)}>
              {#if ratingHover!==-1 ? (ratingHover>=i+1) : (estrelas>=i+1)}
                <SvgStar props={{
                    class: "h-[16px] w-[16px] fill-yellow-500"
                }}/>
              {:else if ratingHover!==-1 ? (ratingHover===i+0.5) : (estrelas===i+0.5)}
                <SvgHalfStart props={{
                    class: "h-[16px] w-[16px] fill-yellow-500"
                }}/>
              {:else}
                <SvgStar props={{
                  fill:"none",
                  class:"h-[16px] w-[16px] stroke-soft-200",
                }}/>
              {/if}
            </button>
        {/each}    
    </div>
    <textarea placeholder="Insira o motivo de sua avaliação"
    style="resize:none;"
    class="text-[14px] w-full border h-[96px] outline-0 border-soft-200 border-t-0 rounded-b-lg p-2" 
    bind:value={text}></textarea>

  

</div>