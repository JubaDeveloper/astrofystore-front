<script lang="ts">
    import type { SVGAttributes } from "svelte/elements";
        
    interface Props{
        props?:SVGAttributes<SVGSVGElement>,
    }

    let {props}:Props = $props()
</script>


<svg width="18" height="18" viewBox="0 0 18 18" fill="#717784" {...props} xmlns="http://www.w3.org/2000/svg">
    <path d="M9 18C4.0293 18 0 13.9707 0 9C0 4.0293 4.0293 0 9 0C13.9707 0 18 4.0293 18 9C18 13.9707 13.9707 18 9 18ZM9.9 9V4.5H8.1V10.8H13.5V9H9.9Z" />
</svg>
    