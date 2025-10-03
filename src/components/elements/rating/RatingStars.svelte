<script lang="ts">
  import SvgHalfStart from "$components/assets/svg/SvgHalfStart.svelte";
import SvgStar from "$components/assets/svg/SvgStar.svelte";

  interface Props{
    rating:number
    enableRating?:boolean
  }

  let {rating = $bindable(2), enableRating = $bindable(true)}:Props = $props()

  let ratingHover = $state<number>(-1)

  const mouseOver = (e:MouseEvent,i:number) => {
    if(!enableRating) return
    const target = e.target as HTMLButtonElement
    if(e.offsetX>target.getBoundingClientRect().width/2){
      ratingHover = i        
    }
    else{
      ratingHover = i-0.5
    }
  }

  const onClick = (e:MouseEvent) => {
      if(!enableRating) return
      rating = ratingHover
  }

</script>
<div class="flex flex-col">
  <div role="complementary" class="flex items-center" onmouseleave={()=>{ratingHover=-1}}>
      {#each {length:5} as _,i}
        {#if enableRating}
          <button 
          class="px-0.5"
          role="menuitem"
          onfocus={()=>{}}
          onclick={onClick}
          onmousemove={(e)=>mouseOver(e,i+1)}>
            {@render chill(i)}
          </button>
        {:else}

          <div class="px-0.5">
            {@render chill(i)}
          </div>
        
        {/if}
      {/each}
  
  </div>
  
  
</div>

{#snippet chill(i:number)}
  {#if ratingHover!==-1 ? (ratingHover>=i+1) : (rating>=i+1)}
    <SvgStar/>
  {:else if ratingHover!==-1 ? (ratingHover===i+0.5) : (rating===i+0.5)}
    <SvgHalfStart/>
  {:else}
    <SvgStar props={{
      fill:"none",
      class:"h-2.5",
      stroke:"#775CFF"
    }}/>
  {/if}
{/snippet}