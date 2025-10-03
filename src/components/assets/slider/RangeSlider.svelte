<script lang="ts">
    import { onMount } from 'svelte';
  
  
      interface Props{
          label:string,
          subLabel?:string,
          start:number,
          end:number,
          limit:number
      }
  
      let {label,subLabel,start = $bindable(),end = $bindable(),limit}:Props = $props()
  
      let sliderWidth = $state<number>(0)
      let slider = $state<HTMLDivElement>()

      let dragMode = $state<"off" | "start" | "end">("off")
      
  
      let positionXMin = $derived.by(()=>{
  
          if(!slider) return 0
          const porcentagem = (start*100)/limit
          const xpos = sliderWidth*(porcentagem/100)
        
          return xpos
  
      })

  
      let positionXMax = $derived.by(()=>{
  
            if(!slider) return 0
            const porcentagem = (end*100)/limit
            const xpos = sliderWidth*(porcentagem/100)
            return xpos

        })

    
    
        const onEnter = (e:MouseEvent) => {

            const porcentagem = (e.offsetX*100)/sliderWidth
            if(Math.abs(porcentagem-end)>Math.abs(porcentagem-start)){
                dragMode="start"
                return
            }
            dragMode="end"
        
        }

    
        const onExit = () => {
            dragMode="off"
        }
    
        const onMove = (e:MouseEvent) => {
            if(dragMode==="off") return
            const offset = dragMode==="start" ? -35 : 15
            const porcentagem = ((e.offsetX+offset)*100)/sliderWidth
            if(dragMode==="start"){
                
                if(porcentagem<=0){
                    start = 0
                    return
                }
                if(porcentagem>=end){
                    start = end-1
                    return 
                }
                
                start = porcentagem
                


            }
            if(dragMode==="end"){

                if(porcentagem>=limit){
                    end = limit
                    return
                }
                if(porcentagem<=start){
                    end = start+1
                    return 
                }
                
                end = porcentagem
                

            }
        }
        
  
  
      onMount(()=>{
          const resizeObserver = new ResizeObserver((entries, observer) => {
          for (const entry of entries) {
              const { width, height } = entry.contentRect;
              sliderWidth = width
          }
          });
          resizeObserver.observe(slider!);
          return () => {
              resizeObserver.unobserve(slider!)
              resizeObserver.disconnect()
          }
  
      })
     
  </script>
  
  
  <div class="flex flex-col ">
      <div class="flex items-center justify-between text-[12px] text-sub-600 gap-12">
          <div class="flex gap-1 items-center">
              <span>{label}</span>
              {#if subLabel}
                  <span class="text-soft-400">{subLabel}</span>
              {/if}
          </div>
          <span>
              {start.toFixed(2)} - {end.toFixed(2)}
          </span>
      </div>

      <div class="relative w-full grow py-3 " 
      bind:this={slider}
      role="slider"
      tabindex="-1"
      aria-valuenow={limit}
      aria-valuemax={limit}
      aria-valuemin={0} 
      aria-roledescription="Slider" 
      onmousedown={onEnter}
      onmouseup={onExit}
      onmousemove={onMove}
      onmouseleave={onExit}>

        <div class="w-full grow bg-soft-200 select-none pointer-events-none h-[6px] mt-3 rounded-full flex items-center">
            
            {@render slide("start")} 
            {@render slide("end")}

            <div class="bg-primary-base h-full z-0 rounded-full transition-none"
            style="
            transform:translateX({positionXMin+2}px);
            width:{positionXMax-positionXMin}px;
            ">
        </div>
      </div> 
      </div>
  </div>
  
  



  {#snippet slide(mode: "start" | "end")}
  
      <div
      role="button"
      tabindex="-1"
      onmousedown={(e)=>{e.preventDefault()}}
      class="absolute select-none left-0 z-[5] aspect-square flex items-center justify-center shrink-0 
      rounded-full transition-none cursor-col-resize" 
      style="transform:translateX({mode==="start" ? positionXMin : (positionXMax-10)}px)"
      >
        <div class="bg-white w-4 rounded-full flex shadow-md items-center justify-center aspect-square ">
            <div class="w-2 aspect-square rounded-full bg-primary-base">

            </div>
        </div>
    
      </div>
  
  
  {/snippet}