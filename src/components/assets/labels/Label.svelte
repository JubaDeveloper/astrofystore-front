<script lang="ts">
	import { tooltip } from "$lib/actions/title.svelte";
	import SvgAlerta from "../svg/SvgAlerta.svelte";
	import SvgItalic from "../svg/SvgItalic.svelte";
  
	  
	  let {label,mandatory,subLabel,extraTip}:{label:string,mandatory?:boolean,subLabel?:string,extraTip?:string} = $props()
	  
  </script>
  
  <div class="flex items-center">
	  
	  <b class="text-strong-950 text-[14px] font-medium ">
		  {label}
	  </b>
	  {#if mandatory}
		  <span class="text-primary-base text-[14px]">*</span>
	  {/if}
	  {#if subLabel}
		  <span class="text-sub-600 ml-1 mr-1 text-[14px] font-normal">
			  {subLabel}
		  </span>
	  {/if}
  
	  {#if extraTip}
		  <div class="text-primary-base text-[14px] translate-x-1 " use:tooltip={{
			  text:extraTip,
			  posTriangulo:"bottom-middle"
		  }}>
			  <SvgItalic/>
		  </div>
	  {/if}
  </div>