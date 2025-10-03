
<script lang="ts">
    import type { SVGAttributes } from "svelte/elements";
	interface Props{
		props?:SVGAttributes<SVGSVGElement>
	}

	let {props}:Props = $props()

</script>

<svg width="14" height="13" viewBox="0 0 14 13"  fill="#525866" class="rotate-180" {...props} xmlns="http://www.w3.org/2000/svg">
    <path d="M0.25 0H13.75V1.5H0.25V0ZM0.25 11.25H10.75V12.75H0.25V11.25ZM0.25 7.5H13.75V9H0.25V7.5ZM0.25 3.75H10.75V5.25H0.25V3.75Z"/>
</svg>
    