<script lang="ts">
    import type { SVGAttributes } from "svelte/elements";
        
    interface Props{
        props?:SVGAttributes<SVGSVGElement>
    }

    let {props}:Props = $props()
</script>

<svg width="96" height="96" viewBox="0 0 96 96" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M0 48C0 21.4903 21.4903 0 48 0C74.5097 0 96 21.4903 96 48C96 74.5097 74.5097 96 48 96C21.4903 96 0 74.5097 0 48Z" fill="url(#paint0_linear_12328_9570)" fill-opacity="0.1"/>
    <g filter="url(#filter0_d_12328_9570)">
    <path d="M16 48C16 30.3269 30.3269 16 48 16C65.6731 16 80 30.3269 80 48C80 65.6731 65.6731 80 48 80C30.3269 80 16 65.6731 16 48Z" fill="white"/>
    <path d="M16.5 48C16.5 30.603 30.603 16.5 48 16.5C65.397 16.5 79.5 30.603 79.5 48C79.5 65.397 65.397 79.5 48 79.5C30.603 79.5 16.5 65.397 16.5 48Z" stroke="#E5EBFF"/>
    <path d="M48 56.4C48.9936 56.4 49.8 57.2064 49.8 58.2C49.8 59.1936 48.9936 60 48 60C47.0064 60 46.2 59.1936 46.2 58.2C46.2 57.2064 47.0064 56.4 48 56.4ZM48 36C51.9768 36 55.2 39.2232 55.2 43.2C55.2 45.798 54.2964 47.148 51.9912 49.1076C49.6788 51.072 49.2 51.9564 49.2 54H46.8C46.8 51.0312 47.7444 49.566 50.4372 47.2788C52.2576 45.732 52.8 44.9208 52.8 43.2C52.8 40.548 50.652 38.4 48 38.4C45.348 38.4 43.2 40.548 43.2 43.2V44.4H40.8V43.2C40.8 39.2232 44.0232 36 48 36Z" fill="#5B169C"/>
    </g>
    <defs>
    <filter id="filter0_d_12328_9570" x="14" y="15" width="68" height="68" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
    <feFlood flood-opacity="0" result="BackgroundImageFix"/>
    <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
    <feOffset dy="1"/>
    <feGaussianBlur stdDeviation="1"/>
    <feComposite in2="hardAlpha" operator="out"/>
    <feColorMatrix type="matrix" values="0 0 0 0 0.0392157 0 0 0 0 0.0509804 0 0 0 0 0.0784314 0 0 0 0.03 0"/>
    <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_12328_9570"/>
    <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_12328_9570" result="shape"/>
    </filter>
    <linearGradient id="paint0_linear_12328_9570" x1="48" y1="0" x2="48" y2="96" gradientUnits="userSpaceOnUse">
    <stop stop-color="#775CFF"/>
    <stop offset="1" stop-color="#775CFF" stop-opacity="0"/>
    </linearGradient>
    </defs>
</svg>