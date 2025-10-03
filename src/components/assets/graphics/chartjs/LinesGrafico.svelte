<script lang="ts">
    import { browser } from "$app/environment";
    import themeManager from "$lib/settings/theme.svelte";
    import { colorOpacity, cssVar } from "$lib/utils/utils.svelte";
    import Chart, { type ChartConfiguration, type ChartData } from "chart.js/auto";
    import { onMount, untrack } from "svelte";
  
      interface Props{
          data:{
              label: string,
              value:number[], //Quantidade precisa ser a mesma que a quantidade de labels.
              bgColor:string,
          }[],
          labels:string[]
      }
      let {data,labels}:Props = $props()
      let ctx = $state<HTMLCanvasElement>()
      let chart = $state<Chart>()
  
      function mount(){
        if(chart){
            chart.destroy()
        }
          const d:ChartData<"line"> = {
          labels: labels,
          datasets: data.map((obj)=>{
              return{
                  label: obj.label,
                  data: obj.value,
                  fill: true,
                  barThickness:30,
                  borderWidth:2,
                  pointRadius:0,
                  tension:0.3,
                  backgroundColor: colorOpacity(obj.bgColor,0),
                  borderRadius:0,
                  borderColor: obj.bgColor,
                  pointBackgroundColor: 'rgba(255,255,255,0)',
                  pointBorderColor: 'rgba(0,0,0,0)',
                  pointHoverBackgroundColor: obj.bgColor,
                  pointHoverBorderColor: 'white',
                  
              }
          }) 
          };
          const config:ChartConfiguration<"line">= {
              type: 'line',
              data: d,
              options: {
                  responsive:true,
                  maintainAspectRatio: false,
                  plugins:{
                      legend:{
                          display:false
                      },
                      tooltip:{
                      }
                  },
                  elements: {
                  line: {
                      borderWidth: 3
                  }
                  },
                  
                  scales:{
                    x:{
                        grid:{
                            color:cssVar("--color-soft-200")
                        },
                    },
                    y:{
                        grid:{
                            color:cssVar("--color-soft-200"),
                        },
                        title:{
                            display:false,
                        },

                    },
                  }
              },
          };
          //@ts-ignore
          chart = new Chart(ctx, config);
    }

    onMount(mount)
    $effect(() => {
        if(themeManager.theme && browser && data && labels){
            untrack(() => {
                setTimeout(()=>{
                    mount()
                },200)
            });
        }
    });
   </script>
  
  <div class="w-full h-full">
      <canvas id="myChart" bind:this={ctx}></canvas>
  </div>
    