<script lang="ts">
    import type { SVGAttributes } from "svelte/elements";
	interface Props{
		props?:SVGAttributes<SVGSVGElement>
	}

	let {props}:Props = $props()

</script>
<svg width="14" height="14" viewBox="0 0 14 14"  fill="#525866" {...props} xmlns="http://www.w3.org/2000/svg">
    <path d="M4 1H13.75V2.5H4V1ZM1.75 0.25V2.5H2.5V3.25H0.25V2.5H1V1H0.25V0.25H1.75ZM0.25 8.5V6.625H1.75V6.25H0.25V5.5H2.5V7.375H1V7.75H2.5V8.5H0.25ZM1.75 12.625H0.25V11.875H1.75V11.5H0.25V10.75H2.5V13.75H0.25V13H1.75V12.625ZM4 6.25H13.75V7.75H4V6.25ZM4 11.5H13.75V13H4V11.5Z"/>
</svg>
    