<script lang="ts">
  import type { SVGAttributes } from "svelte/elements";
  interface Props{
    props?:SVGAttributes<SVGSVGElement>,
    cor?: string
  }

let {props, cor = '#CACFD8'}:Props = $props()

</script>

<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
  <g clip-path="url(#clip0_13219_174978)">
  <g filter="url(#filter0_d_13219_174978)">
  <circle cx="10" cy="10" r="6" fill={cor}/>
  <circle cx="10" cy="10" r="5" stroke="white" stroke-width="2"/>
  </g>
  </g>
  <defs>
  <filter id="filter0_d_13219_174978" x="0" y="2" width="20" height="20" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
  <feFlood flood-opacity="0" result="BackgroundImageFix"/>
  <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
  <feOffset dy="2"/>
  <feGaussianBlur stdDeviation="2"/>
  <feColorMatrix type="matrix" values="0 0 0 0 0.105882 0 0 0 0 0.109804 0 0 0 0 0.113725 0 0 0 0.04 0"/>
  <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_13219_174978"/>
  <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_13219_174978" result="shape"/>
  </filter>
  <clipPath id="clip0_13219_174978">
  <rect width="20" height="20" fill="white"/>
  </clipPath>
  </defs>
</svg> 