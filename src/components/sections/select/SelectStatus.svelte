<script lang="ts">
    import DropBlock from "$components/assets/logic/DropBlock.svelte";
    import FocusBlock from "$components/assets/logic/FocusBlock.svelte";
    import SvgCaret from "$components/assets/svg/SvgCaret.svelte";
    import { LojaController } from "$lib/api/modules/lojas/lojas.controller";
    import { idLoja } from "$lib/utils/rotas.svelte";
    import { onMount } from "svelte";

    const statusOp = [
        {
            label:"Loja Online",
            value:true,
            color:"bg-green-500"
        },
        {
            label:"Loja Offline",
            value:false,
            color:"bg-red-500"
        },       
    ]

    let status = $state(true)

    let selected = $derived.by(()=>{
        return statusOp.find((obj)=>obj.value===status);
    })

    let selectOpen = $state(false)

    const lojaC = new LojaController()

    const changeStatus = async(s:boolean)=>{
        status = s
        lojaC.mudarStatus(parseInt($idLoja))
    }

    onMount(async()=>{
        const [data,e] = await lojaC.pegar(parseInt($idLoja))
        status = data.visibilidade
    })


</script>
<FocusBlock bind:isFocus={selectOpen} className="relative outline-none border-none">
    <button class="flex gap-3 text-[14px] text-sub-600 items-center h-[40px] rounded-lg outline-none border border-soft-200 px-2"
    onclick={()=>selectOpen=!selectOpen}>
        <div class="w-[15px] aspect-square border-2 border-white rounded-full overflow-hidden shadow-sm">
            <div class="w-full h-full {selected?.color}">

            </div>
        </div>
        {selected?.label}
        <SvgCaret props={{
            class:"rota"
        }}/>
    </button>
    <DropBlock isDrop={selectOpen} 
    className="absolute right-0 w-[250px] top-[100%] mt-2 flex z-10 flex-col border border-soft-200 rounded-lg bg-white-0 shadow-md">
            {#each statusOp as s}
                <button class="w-full hover:bg-slate-100 text-sub-600 hover:text-strong-950 flex items-center gap-3 p-2 px-3 pointer-events-auto" onclick={()=>{
                    if(status===s.value) return selectOpen=false
                    changeStatus(s.value)
                    selectOpen=false
                }}>
                    <div class="w-[15px]  aspect-square border-2 border-white rounded-full overflow-hidden shadow-sm">
                        <div class="w-full h-full {s.color}">
    
                        </div>
                    </div>
                    {s.label}
                </button>
            {/each}

    </DropBlock>
</FocusBlock>
