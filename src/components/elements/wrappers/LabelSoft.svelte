<script>

    let {label,children,color="text-sub-600"} = $props()
</script>


<div class="flex flex-col gap-1 text-strong-950 font-normal text-[14px]">
    <span class="text-[12px] font-normal {color}">
        {label}
    </span>
    {@render children()}
</div>