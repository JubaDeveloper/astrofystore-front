<script lang="ts">
    import type { SVGAttributes } from "svelte/elements";
        
    interface Props{
        props?:SVGAttributes<SVGSVGElement>
    }

    let {props}:Props = $props()
</script>

<svg width="18" height="19" viewBox="0 0 18 19" fill="#FF8447" {...props} xmlns="http://www.w3.org/2000/svg">
    <path d="M16.2 13.5H18V15.3H0V13.5H1.8V7.2C1.8 5.29044 2.55857 3.45909 3.90883 2.10883C5.25909 0.758569 7.09044 0 9 0C10.9096 0 12.7409 0.758569 14.0912 2.10883C15.4414 3.45909 16.2 5.29044 16.2 7.2V13.5ZM6.3 17.1H11.7V18.9H6.3V17.1Z" />
</svg>
    