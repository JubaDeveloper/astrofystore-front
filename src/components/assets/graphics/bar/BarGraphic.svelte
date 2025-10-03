<script lang="ts">
  import { LayerCake, Svg } from 'layercake';
  import { scaleBand } from 'd3-scale';

  import Bar from './Bar.svelte';
  import AxisX from './AxisX.svelte';
  import AxisY from './AxisY.svelte';


  let {data,xKey,yKey,width,height} = $props()

  const gap = 30

</script>

<div class="shrink-0  " style="width:{width};height:{height}px;">
  <LayerCake
    padding={{ bottom: 20, left: 35 }}
    x={xKey}
    {width}
    {height}
    y={yKey}
  
    yScale={scaleBand().paddingInner(0.3)}
    xDomain={[0, null]}
    {data}
  >
    <Svg>
      <AxisX  tickMarks baseline snapLabels />
      <AxisY {gap} tickMarks gridlines={false} />
      <Bar {gap}/>
    </Svg>
  </LayerCake>
</div>
