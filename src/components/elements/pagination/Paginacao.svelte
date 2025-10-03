<script lang="ts">
    import DuplaSetaPaginacaoSvg from '$components/assets/svg/SvgDuplaSeta.svelte';
    import SetaPaginacaoSvg from '$components/assets/svg/SvgSetaPaginacao.svelte';
  
  
      interface Props{
          onSelecionarPagina: VoidFunction,
          pagina:number,
          totalPaginas:number
      }
  
      let {
          onSelecionarPagina,
          pagina = $bindable(),
          totalPaginas = $bindable()
      }:Props = $props()
  
      const proxima = () => {
          if(pagina<totalPaginas){
              irPara(pagina+1)
  
          }
      }
      const anterior = () => {
          if(pagina>1){
              irPara(pagina-1)
  
          }
      }
  
  
      const primeiraPagina = () => {
          irPara(1)
      }
  
      const ultimaPagina = () => {
          irPara(totalPaginas)
      }
  
  
      const irPara = (p:number) => {
          pagina = p
          onSelecionarPagina()
      }
  
  </script>
  
  <div class="flex items-center gap-2">
      <button onclick={primeiraPagina}>
          <DuplaSetaPaginacaoSvg/>
      </button>
  
      <button onclick={anterior}>
          <SetaPaginacaoSvg/>
      </button>
      
      <div class="flex items-center gap-2">
          {@render paginas()}
      </div>
  
      <button class="rotate-180" onclick={proxima}>
          <SetaPaginacaoSvg/>
      </button>
  
      <button class="rotate-180" onclick={ultimaPagina}>
          <DuplaSetaPaginacaoSvg/>
      </button>
  </div>
  
  
  {#snippet paginas()}
      {@const limite = 1}
      
      {#each {length:totalPaginas} as _,i}
          {@const paginaAtual = i+1}
          {#if paginaAtual>=pagina-limite && paginaAtual<=pagina+limite}
              <button 
              onclick={()=>{
                  pagina=paginaAtual
                  onSelecionarPagina()
              }}
              class="border bg-white-0 aspect-square not-data-[ativo]:border-soft-200 data-[ativo]:bg-primary-base data-[ativo]:text-white-0 data-[ativo]:border-weak-50 
              w-[33px] shrink-0 flex items-center justify-center
              rounded-[8px] text-[14px] font-medium text-sub-600"
              data-ativo={pagina==paginaAtual ? true : null}
              >
                  <span class="inline-block">{paginaAtual}</span>
              </button>
          {/if}
      {/each}
  
      {#if totalPaginas>pagina+limite}
          <div 
          class="p-1.5 border border-soft-200 aspect-square shrink-0 w-[34px] text-center rounded-[8px] text-[14px] font-medium text-sub-600"
          >
              ...
          </div>
          <button 
          onclick={()=>{
              pagina=totalPaginas
              onSelecionarPagina()
          }}
          class="p-1.5 border not-data-[ativo]:border-soft-200 data-[ativo]:bg-weak-50 data-[ativo]:border-weak-50 rounded-[8px] text-[14px] font-medium text-sub-600"
          data-ativo={pagina==totalPaginas ? true : null}
          >
              <span class="w-5 h-5 inline-block">{totalPaginas}</span>
          </button>
      {/if}
  
  {/snippet}
  