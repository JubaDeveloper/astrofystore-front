<script lang="ts">
    import { LayerCake, Svg, flatten, stack } from 'layercake';
  

    // @ts-ignore
    import { scaleBand, scaleOrdinal } from 'd3-scale'; 
   // @ts-ignore
    import { format } from 'd3-format';
  
    import ColumnStacked from './ColumnStacked.svelte';
    import AxisX from './AxisX.svelte';
    import AxisY from './AxisY.svelte';
  
    interface Props{
      data:any[],
      xKey:string,
      gapX:number,
      gapY:number,
      cores?:string[]
    }
    let {data,xKey,gapX,gapY,cores= ['#00e047', '#7ceb68', '#b7f486', '#ecfda5']}:Props = $props()
  
    const yKey = [0, 1];
    const zKey = 'key';
  
    const seriesNames = Object.keys(data[0]).filter(d => d !== xKey)


    data.forEach(d => {
      seriesNames.forEach(name => {
        d[name] = +d[name];
      });
    });
  
    const formatLabelY = (d: any) => format(`~s`)(d);
  
    const stackedData = stack(data, seriesNames);

</script>
  
  <div class="chart-container">
    <LayerCake
      padding={{ top: 0, right: 0, bottom: 20, left: 20 }}
      x={(d:any) => d.data[xKey]}
      y={yKey}
      z={zKey}
      xScale={scaleBand().paddingInner(0.02).round(true)}
      xDomainSort={false}
      zScale={scaleOrdinal()}
      zDomain={seriesNames}
      zRange={cores}
      flatData={flatten(stackedData)}
      data={stackedData}

      
    >
      <Svg >
        <AxisX  {gapX}   />
        <AxisY dx={-20} dy={-6} ticks={4} gridlines={false} format={formatLabelY} />
        <ColumnStacked  {gapX} {gapY}/>
      </Svg>
    </LayerCake>
  </div>
  
  <style>
    .chart-container {
      width: 100%;
      height: 250px;
    }
  </style>