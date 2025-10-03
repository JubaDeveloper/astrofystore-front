<script lang="ts">
  import SvgHalfStart from "$components/assets/svg/SvgHalfStart.svelte";
  import SvgStar from "$components/assets/svg/SvgStar.svelte";

  interface Props {
    rating:number;
    enableRating?:boolean;
    place?:string;
    comentario:string;
  }

  let {rating = $bindable(1), enableRating=$bindable(true), place = 'Descreva o que achou do produto.', comentario = $bindable()}:Props = $props()

  let ratingHover = $state<number>(-1)

  const mouseOver = (e:MouseEvent,i:number) => {
    if(!enableRating) return

    const target = e.target as HTMLButtonElement

    if(e.offsetX>target.getBoundingClientRect().width/2){
      ratingHover = i        
    }else{
      ratingHover = i-0.5
    }
  }

  const onClick = (e:MouseEvent) => {
    if(!enableRating) return
    rating = ratingHover
  }
</script>

<div class="flex flex-col w-full">
  <div role="complementary" class="flex flex-col items-center border border-soft-200 rounded-[12px] w-full" onmouseleave={()=>{ratingHover=-1}}>
    <div class="flex items-center justify-around w-full">
      {#each {length:5} as _,i}
        <button 
        class="p-2"
        role="menuitem"
        onfocus={()=>{}}
        onclick={onClick}
        onmousemove={(e)=> mouseOver(e,i+1)}>
          {#if ratingHover!==-1 ? (ratingHover>=i+1) : (rating>=i+1)}
            <SvgStar props={{
              stroke:"#F6B51E",
              viewBox: '0 0 20 20',
              width: "20",
              height: "20",
              fill:"#F6B51E"
            }}/>
          {:else if ratingHover!==-1 ? (ratingHover===i+0.5) : (rating===i+0.5)}
            <SvgHalfStart props={{
              stroke:"#F6B51E",
              viewBox: '0 0 20 20',
              width: "20",
              height: "20",
              fill:"#F6B51E"
            }}/>
          {:else}
            <SvgStar props={{
              fill:"none",
              viewBox: '0 0 20 20',
              width: "20",
              height: "20",
              stroke:"#F6B51E"
            }}/>
          {/if}
        </button>
        {#if i < 4}
          <span class="border-r border-soft-200 h-9 mx-1"></span>
        {/if}
      {/each}
    </div>
    
    <textarea
      maxlength={200} 
      name="input" 
      bind:value={comentario} 
      placeholder={place} 
      class="w-full outline-none min-h-[80px] h-[80px] transition-none text-[14px] p-3 border-t border-soft-200"></textarea>
  </div>
</div>