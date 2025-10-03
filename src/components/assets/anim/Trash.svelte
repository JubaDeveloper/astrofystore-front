<script lang="ts">
    interface Props{
        onClick:VoidFunction
    }
    let {onClick}:Props = $props()
</script>

<button class="relative flex flex-col shrink-0 w-[28px] aspect-square group p-1" aria-label="trash" onclick={onClick}>

    <div class="group-hover:translate-y-[-150%] group-hover:translate-x-[-35%] group-hover:rotate-[-60deg] flex h-[22%] flex-col">
        <div class="w-[60%] h-[50%] self-center bg-error-base "></div>
        <div class="w-full h-[50%] bg-error-base"></div>    
    </div>
    <div class="rounded-b-[1px] w-[80%] grow bg-error-base self-center relative flex items-start  pt-[20%] justify-center gap-[15%]">
        <div class="h-[50%] w-[20%] bg-white shrink-0"></div>
        <div class="h-[50%] w-[20%] bg-white shrink-0"></div>
    </div>

</button>
    