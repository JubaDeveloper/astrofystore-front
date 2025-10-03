<script lang="ts">
  import SvgCaret from "$components/assets/svg/SvgCaret.svelte";
  import type { Snippet } from "svelte";


    interface Props{
        children?:Snippet,
        label:string,
        desc:string,
        action:VoidFunction
    }

    let {children,label,desc,action}:Props = $props()


</script>


<div class="border border-soft-200 rounded-[16px] flex justify-between items-center w-full p-4">
    <div class="flex items-center gap-3">
        {@render children?.()}
        <div class="flex flex-col">
            <b class="text-[14px] font-medium">{label}</b>
            <span class="text-[11px]">{desc}</span>
        </div>
    </div>

    <button class="p-3" onclick={action}>
        <SvgCaret props={{
            class:"rotate-[-90deg]"
        }}/>
    </button>

</div>