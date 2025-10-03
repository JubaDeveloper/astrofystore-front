<script lang="ts">
    interface Props{
        bg:string,
        label:string
    }

    let {bg,label}:Props = $props()
</script>

<div class="flex items-center gap-3 text-[16px] font-normal">
    <div class="w-[11px] border border-white shadow-md aspect-square rounded-full {bg}"></div>    
    {label}
</div>