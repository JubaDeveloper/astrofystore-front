<script lang="ts">
    import type { SVGAttributes } from "svelte/elements";
	interface Props{
		props?:SVGAttributes<SVGSVGElement>
	}

	let {props}:Props = $props()

</script>

<svg width="20" height="20" viewBox="0 0 20 20" fill="#525866" {...props} xmlns="http://www.w3.org/2000/svg">
	<path d="M12.25 16H6.25V14.5H8.44525L10.0323 5.5H7.75V4H13.75V5.5H11.5547L9.96775 14.5H12.25V16Z" />
</svg>
	