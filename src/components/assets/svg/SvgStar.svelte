<script lang="ts">
    import type { SVGAttributes } from "svelte/elements";
        
    interface Props{
        props?:SVGAttributes<SVGSVGElement>
    }

    let {props}:Props = $props()
</script>

<svg width="12" height="12" viewBox="0 0 18 18" fill="#775CFF" {...props} xmlns="http://www.w3.org/2000/svg">
    <path d="M17.75 6.69221L11.5925 5.95272L8.99671 0.25L6.40096 5.95272L0.25 6.69221L4.7975 10.9626L3.59491 17.125L8.99671 14.0538L14.4051 17.125L13.2025 10.9626L17.75 6.69221Z"/>
</svg>
    