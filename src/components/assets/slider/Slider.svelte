<script lang="ts">
  import { tooltip } from '$lib/actions/title.svelte';
  import { onMount } from 'svelte';


    interface Props{
        labelEsquerda:string
        labelDireita:string
        value:number,
        limit:number,
        valorMaximo:number,
    }

    let {labelEsquerda,labelDireita,value = $bindable(),limit,valorMaximo}:Props = $props()

    let sliderWidth = $state<number>(0)
    let slider = $state<HTMLDivElement>()
    let dragMode = $state<boolean>(false)
    

    let positionX = $derived.by(()=>{

        if(!slider) return 0
        const porcentagem = (value*100)/limit
        const xpos = sliderWidth*(porcentagem/100)
        return xpos

    })


    const onEnter = (e:MouseEvent) => {
        dragMode=true
        const porcentagem = (e.offsetX*100)/sliderWidth
        value = porcentagem

    }

    const onExit = () => {
        dragMode=false
    }

    const onMove = (e:MouseEvent) => {
        if(!dragMode) return
        let porcentagem = (e.offsetX*100)/sliderWidth
        if(porcentagem<0) porcentagem=0
        value = porcentagem
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
    <div class="flex items-center justify-between text-[14px] text-sub-600 gap-12">
        <span>
            {labelDireita}
        </span>
        <span>
            {labelEsquerda}
        </span>
    </div>
    {@render slide()}
</div>


{#snippet slide()}

    <div
    role="slider"
    tabindex="-1"
    aria-valuenow={value}
    aria-valuemax={limit}
    aria-valuemin={0} 
    aria-roledescription="Slider"
    class="relative w-full  grow group flex py-3 cursor-col-resize items-center " 
    onmousedown={onEnter}
    onmouseup={onExit}
    onmousemove={onMove}
    onmouseleave={onExit}
    bind:this={slider}>
        <div class="h-[6px] w-full grow  rounded-full bg-soft-200 overflow-hidden pointer-events-none relative flex justify-start"
        >

            <div class="h-full bg-primary-base relative left-[-100%] w-full transition-none" 
            style="transform: translateX({positionX}px)">
            </div>
            
        </div>
    
        <div class="absolute left-0 w-[16px] mr-1 shadow-md aspect-square flex items-center justify-center shrink-0 pointer-events-none rounded-full transition-none bg-white" 
        style="transform:translateX({positionX}px)">
            <div class="w-2 aspect-square rounded-full bg-primary-base">
            </div>
            <div class="absolute top-[-200%] group-hover:translate-y-0 -translate-y-5 opacity-0 group-hover:opacity-100   origin-center left-[-250%]">
                <div class="bg-strong-950 text-white-0 px-2 flex justify-center items-end  rounded-[8px] text-[12px] whitespace-nowrap">
                    Até R${(((value * valorMaximo)/100)/100)
                    .toFixed(2)}
                    <div class="triangle absolute bg-strong-950 translate-y-2.5 rotate-180">
                    </div>
                </div>    
            </div>
        </div>
    
    </div>


{/snippet}
<style>
    /**
 * How to make 3-corner-rounded triangle in CSS (SO)
 * http://stackoverflow.com/q/14446677/1397351
 */
.triangle {
	text-align: left;
}
.triangle:before,
.triangle:after {
	content: '';
	position: absolute;
	background-color: inherit;
}
.triangle,
.triangle:before,
.triangle:after {
	width:  8px;
	height: 8px;
	border-top-right-radius: 30%;
}

.triangle {
	transform: rotate(-60deg) skewX(-30deg) scale(1,.866);
}
.triangle:before {
	transform: rotate(-135deg) skewX(-45deg) scale(1.414,.707) translate(0,-50%);
}
.triangle:after {
	transform: rotate(135deg) skewY(-45deg) scale(.707,1.414) translate(50%);
}

</style>