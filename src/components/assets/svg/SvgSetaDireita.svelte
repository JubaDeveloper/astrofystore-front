<script lang="ts">
  import type { SVGAttributes } from "svelte/elements";
      
  interface Props{
    props?:SVGAttributes<SVGSVGElement>
  }

  let {props}:Props = $props()
</script>

<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
  <path d="M10.7959 9.9992L7.08337 6.2867L8.14387 5.2262L12.9169 9.9992L8.14387 14.7722L7.08337 13.7117L10.7959 9.9992Z" fill="#525866"/>
</svg>