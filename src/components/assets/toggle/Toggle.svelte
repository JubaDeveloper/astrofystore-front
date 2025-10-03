<script lang="ts">
    interface Props{
        ativo?:boolean
        click: VoidFunction
    }

    let {ativo = $bindable(false), click}:Props = $props()

    function onClick(){
        ativo = !ativo
        click()
    }
</script>

<button class="flex items-center w-[32px] h-[20px] rounded-full p-1 {ativo===true ? "bg-primary-base" : "bg-sub-300"} relative" aria-label="Toggle" onclick={()=> onClick()}>
    <div class="flex items-center justify-center aspect-square h-[80%] bg-white rounded-full absolute  left-0 {ativo ? "translate-x-[2px]" : "translate-x-[85%]"}">
        <div class="w-[45%] aspect-square {ativo===true ? "bg-primary-base" : "bg-sub-300"} rounded-full"></div>
    </div>
</button>
