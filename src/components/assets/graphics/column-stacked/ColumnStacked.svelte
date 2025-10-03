<!--
  @component
  Generates an SVG column chart. It uses the z-scale for color assignments and aassumes both `xScale` and `zScale` are ordinal scales.  It assumes your data is in a [D3 stack format](https://github.com/d3/d3-shape#stack
 -->
<script>
  import { tooltip } from '$lib/actions/title.svelte';
  import { getContext } from 'svelte';

  const { data, xGet, yGet, zGet, xScale,width } = getContext('LayerCake');

  let {gapX,gapY} = $props()
</script>

<g class="column-group">
  {#each $data as series, i}
    {#each series as d,j}
      {@const yVals = $yGet(d)}
      {@const columnHeight = yVals[0] - yVals[1]}
      <rect
        use:tooltip={{text:series.key,posTriangulo:'top-middle'}}
        class="z-10"
        data-id={i}
        x={ $xGet(d) + (j*gapX) }
        y={yVals[1] - 2 - (i*gapY)}
        width={$xScale.bandwidth()}
        height={columnHeight}
        fill={$zGet(series)}
        z={2}
        ></rect>
    {/each}
  {/each}
</g>