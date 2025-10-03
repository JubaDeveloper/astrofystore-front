<script lang="ts">
    import type { SVGAttributes } from "svelte/elements";
        
        interface Props{
            props?:SVGAttributes<SVGSVGElement>
        }

    let {props}:Props = $props()

</script>

<svg width="97" height="97" viewBox="0 0 97 97" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M0.5 48.5C0.5 21.9903 21.9903 0.5 48.5 0.5C75.0097 0.5 96.5 21.9903 96.5 48.5C96.5 75.0097 75.0097 96.5 48.5 96.5C21.9903 96.5 0.5 75.0097 0.5 48.5Z" fill="url(#paint0_linear_12505_8611)" fill-opacity="0.1"/>
    <g filter="url(#filter0_d_12505_8611)">
    <path d="M16.5 48.5C16.5 30.8269 30.8269 16.5 48.5 16.5C66.1731 16.5 80.5 30.8269 80.5 48.5C80.5 66.1731 66.1731 80.5 48.5 80.5C30.8269 80.5 16.5 66.1731 16.5 48.5Z" fill="white"/>
    <path d="M17 48.5C17 31.103 31.103 17 48.5 17C65.897 17 80 31.103 80 48.5C80 65.897 65.897 80 48.5 80C31.103 80 17 65.897 17 48.5Z" stroke="#E5EBFF"/>
    <path d="M46.0999 52.306L57.1303 41.2744L58.8283 42.9712L46.0999 55.6996L38.4631 48.0628L40.1599 46.366L46.0999 52.306Z" fill="#3F0B6A"/>
    </g>
    <defs>
    <filter id="filter0_d_12505_8611" x="14.5" y="15.5" width="68" height="68" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
    <feFlood flood-opacity="0" result="BackgroundImageFix"/>
    <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
    <feOffset dy="1"/>
    <feGaussianBlur stdDeviation="1"/>
    <feComposite in2="hardAlpha" operator="out"/>
    <feColorMatrix type="matrix" values="0 0 0 0 0.0392157 0 0 0 0 0.0509804 0 0 0 0 0.0784314 0 0 0 0.03 0"/>
    <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_12505_8611"/>
    <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_12505_8611" result="shape"/>
    </filter>
    <linearGradient id="paint0_linear_12505_8611" x1="48.5" y1="0.5" x2="48.5" y2="96.5" gradientUnits="userSpaceOnUse">
    <stop stop-color="#775CFF"/>
    <stop offset="1" stop-color="#775CFF" stop-opacity="0"/>
    </linearGradient>
    </defs>
</svg>