<script lang="ts">
    import type { SVGAttributes } from "svelte/elements";
        
    interface Props{
        props?:SVGAttributes<SVGSVGElement>
    }

    let {props}:Props = $props()
</script>

<svg width="14" height="14" viewBox="0 0 14 14" fill="#525866" {...props} xmlns="http://www.w3.org/2000/svg">
    <path d="M7 2C5.28215 2 3.76568 2.86641 2.86527 4.1875H4.5V5.4375H0.75V1.6875H2V3.2496C3.13988 1.73229 4.95477 0.75 7 0.75C10.4517 0.75 13.25 3.54822 13.25 7H12C12 4.23857 9.76144 2 7 2ZM2 7C2 9.76144 4.23857 12 7 12C8.71788 12 10.2343 11.1336 11.1348 9.8125H9.5V8.5625H13.25V12.3125H12V10.7504C10.8601 12.2677 9.04525 13.25 7 13.25C3.54822 13.25 0.75 10.4517 0.75 7H2Z"/>
</svg>
    