<script lang="ts">
    let {texto,position}:{
        texto:string,
        position?:string
    } = $props()
</script>

<div class="bg-weak-50 w-full text-soft-400 px-5 text-[12px] font-normal py-1 {position}">
    {texto}
</div>