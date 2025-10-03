<!--
  @component
  Generates an SVG bar chart.
 -->
<script>
  import { tooltip } from '$lib/actions/title.svelte';
  import { getContext } from 'svelte';

  const { data, xGet, yGet, xScale, yScale,xKey } = getContext('LayerCake');

  let {fill="blue",gap} = $props()
</script>

<g class="bar-group">
  {#each $data as d, i}
    <rect
      use:tooltip={{text:$xGet(d).toFixed(2),posTriangulo:"bottom-middle"}}
      class="group-rect"
      data-id={i}
      x={$xScale.range()[0]}
      y={$yGet(d)}
      rx={4}
      height={$yScale.bandwidth()}
      width={$xGet(d)}
      {fill}
    ></rect>
  {/each}
</g>