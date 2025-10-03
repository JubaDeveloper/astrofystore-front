<script lang="ts">
    import type { SVGAttributes } from "svelte/elements";
        
    interface Props{
        props?:SVGAttributes<SVGSVGElement>
    }

    let {props}:Props = $props()
</script>
<svg width="20" height="20" viewBox="0 0 20 20" fill="none" {...props} xmlns="http://www.w3.org/2000/svg">
    <path d="M1.72711 0.453613L19.5462 18.2736L18.2727 19.5462L15.0255 16.299L5.00941 16.2999L0.999913 19.4499V2.79991C0.999913 2.64691 1.03771 2.50381 1.10431 2.37781L0.453613 1.72711L1.72711 0.453613ZM18.0999 1.89991C18.3386 1.89991 18.5675 1.99473 18.7363 2.16352C18.9051 2.3323 18.9999 2.56122 18.9999 2.79991V15.2064L5.69251 1.89991H18.0999Z" fill="#FB3748"/>
    </svg>
    