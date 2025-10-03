<script lang="ts">
    import SvgAlerta from "$components/assets/svg/SvgAlerta.svelte";
  import { slide } from "svelte/transition";

    let {label,type}:{label:string,type:"tip" | "error"} = $props()
	
</script>



<div transition:slide|global={{axis:"y"}} class="flex items-start gap-1 leading-4  text-[12px] shrink-0 {type==="tip" ? "text-sub-600" : "text-error-base"}">
	<SvgAlerta props={{
		class: `${type==="tip" ? "fill-soft-400" : "fill-error-base"} mt-[1px] shrink-0`,
		width:14,
		height:14
	}}/>
	{label}
</div>