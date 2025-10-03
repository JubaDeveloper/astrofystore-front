<script lang="ts">
    import type { SVGAttributes } from "svelte/elements";
	interface Props{
		props?:SVGAttributes<SVGSVGElement>
	}

	let {props}:Props = $props()

</script>
<svg width="12" height="15" viewBox="0 0 12 15"  fill="#525866" {...props} xmlns="http://www.w3.org/2000/svg">
	<path d="M3 0.25V7C3 7.79565 3.31607 8.55871 3.87868 9.12132C4.44129 9.68393 5.20435 10 6 10C6.79565 10 7.55871 9.68393 8.12132 9.12132C8.68393 8.55871 9 7.79565 9 7V0.25H10.5V7C10.5 8.19347 10.0259 9.33807 9.18198 10.182C8.33807 11.0259 7.19347 11.5 6 11.5C4.80653 11.5 3.66193 11.0259 2.81802 10.182C1.97411 9.33807 1.5 8.19347 1.5 7V0.25H3ZM0 13H12V14.5H0V13Z"/>
</svg>
	