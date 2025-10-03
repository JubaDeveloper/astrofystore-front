<script lang="ts">
    import type { SVGAttributes } from "svelte/elements";
        
        interface Props{
            props?:SVGAttributes<SVGSVGElement>
        }

    let {props}:Props = $props()

</script>

<svg width="11" height="10" viewBox="0 0 11 10"  fill="#99A0AE" {...props} xmlns="http://www.w3.org/2000/svg">
    <path d="M10.3752 6.24994L10.3752 0.625019L9.12525 0.625L9.12519 4.99994L2.76778 5L5.23637 2.53142L4.35248 1.64754L0.375 5.625L4.35248 9.6025L5.23637 8.71863L2.76775 6.25L10.3752 6.24994Z"/>
</svg>
    