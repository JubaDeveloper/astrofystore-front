<script lang="ts">
  import { page } from "$app/state";
  import Avatar from "$components/assets/avatar/Avatar.svelte";
    import Botao from "$components/assets/buttons/Botao.svelte";
    import Stackedbar from "$components/assets/graphics/chartjs/Stackedbar.svelte";
  import FillText from "$components/assets/limiter/FillText.svelte";
  import LoaderMinhoca from "$components/assets/loading/LoaderMinhoca.svelte";
    import SelectBlock from "$components/assets/logic/SelectBlock.svelte";
    import SvgEnjoado from "$components/assets/svg/historico/SvgEnjoado.svelte";
    import SvgPresente from "$components/assets/svg/historico/SvgPresente.svelte";
    import SvgBell from "$components/assets/svg/SvgBell.svelte";
    import BolinhaStatus from "$components/elements/card/BolinhaStatus.svelte";
    import BubbleWrapper from "$components/elements/wrappers/BubbleWrapper.svelte";
    import LabelSoft from "$components/elements/wrappers/LabelSoft.svelte";
  import TabelaCliente from "$components/sections/cliente/TabelaCliente.svelte";
    import Header from "$components/sections/header/Header.svelte";
  import avatarController from "$lib/api/modules/avatar/avatar.controller";
  import { ClientesController } from "$lib/api/modules/clientes/clientes.controller";
  import type { ClienteDetalhadoDTO, ClienteGastosDto } from "$lib/api/modules/clientes/clientes.dto";
  import sanitizar from "$lib/sanitizers/sanitizer";
  import handleDate from "$lib/sanitizers/time";
  import { idLoja } from "$lib/utils/rotas.svelte";
    import { onMount } from "svelte";
    
    const clienteController = new ClientesController(parseInt($idLoja))

    let loading = $state(true)

    let filtros = $state({
        gastosTempo:"total"
    })

    let clienteDetalhado = $state<ClienteDetalhadoDTO>()

    let relatorioCliente = $state<ClienteGastosDto>()    


    async function gerarGastos(){
        relatorioCliente=undefined
        const [r,e] = await clienteController.relatorioGastos(parseInt(page.params.idCliente),{
            periodo: filtros.gastosTempo
        })
        relatorioCliente = r.data
        console.log(r.data)
    }

    onMount(async()=>{
        let r,e 
        [r,e] = await clienteController.pegar(parseInt(page.params.idCliente))
        if(e){
            console.log(e)
            return
        }
        clienteDetalhado = r.data;
        loading=false
        console.log(r)
    })

    $effect(()=>{
        if(filtros){
            gerarGastos()
        }
    })
  </script>
  
  <div class="flex flex-col gap-5">
      <Header  label="Dashboard do cliente" desc="Visão geral do cliente" />
    
      <div class="grid grid-cols-3 gap-4">
          <div class="col-span-2 flex flex-col gap-2">
              {@render relatorio()}
          </div>
          <div class="col-span-1 flex flex-col gap-2">
            {@render cardRight()}
          </div>
      </div>
      <TabelaCliente/>
  </div>
  
  
  {#snippet relatorio()}
  <BubbleWrapper css="flex flex-col gap-3 px-5 py-3 h-[380px]">
      <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M8.10003 4.5H9.90003V13.5H8.10003V4.5ZM11.7 8.1H13.5V13.5H11.7V8.1ZM4.50002 9.9H6.30002V13.5H4.50002V9.9ZM11.7 1.8H2.70002V16.2H15.3V5.4H11.7V1.8ZM0.900024 0.8928C0.900024 0.3996 1.30232 0 1.79912 0H12.6L17.1 4.5V17.0937C17.1009 17.2119 17.0784 17.3291 17.0339 17.4386C16.9895 17.5481 16.9239 17.6478 16.8409 17.7319C16.7579 17.8161 16.6591 17.8831 16.5503 17.9291C16.4414 17.9751 16.3245 17.9992 16.2063 18H1.79372C1.55736 17.9984 1.33114 17.9038 1.16392 17.7367C0.996701 17.5697 0.90191 17.3436 0.900024 17.1072V0.8928Z" fill="#525866"/>
              </svg>                            
              Relátorio de pedidos
          </div>
          <div class="flex items-center gap-5">
              <BolinhaStatus bg="bg-feature-base" label="Gasto"/>
              <BolinhaStatus bg="bg-warning-base" label="Devolvido"/>
              <SelectBlock placeholder="Anual" options={[
                {
                    label:"Total",
                    value:"total"
                },
                {
                    label:"Anual",
                    value:"anual"
                },
                {
                    label:"Semestral",
                    value:"semestral"
                },

                {
                    label:"Mensal",
                    value:"mensal"
                }
              ]}  bind:value={filtros.gastosTempo} removableOnClick={false} focusCss="relative ml-4 h-[36px] w-[120px]"/>
          </div>
      </div>
      {#if relatorioCliente}
      <div class="flex items-center justify-between px-40 py-4.5 border-t border-b gap-8 border-soft-200">
          <div class="flex items-center gap-3">
              <div class="flex items-center justify-center bg-weak-50 w-[40px] aspect-square rounded-full">
                  <SvgPresente/>
              </div>
              <LabelSoft  label="TOTAL GASTO">
                  <b class="font-medium text-[16px]">
                      R$ {sanitizar.centavosToReais(relatorioCliente.totEmVendas)}
                  </b>
              </LabelSoft>
          </div>
          <div class="w-[1px] h-full bg-soft-200"></div>
          <div class="flex items-center gap-3">
              <div class="flex items-center justify-center bg-weak-50 w-[40px] aspect-square rounded-full">
                  <SvgEnjoado/>
              </div>
              <LabelSoft  label="TOTAL DEVOLVIDO">
                  <b class="font-medium text-[16px]">
                    R$ {sanitizar.centavosToReais(relatorioCliente.totDevolvido)}
                </b>
              </LabelSoft>
          </div>
      </div>
      <div class="w-full h-[220px]">
          <Stackedbar
          labels={Object.keys(relatorioCliente.relatorio).map((obj)=>{
            return obj
          })}
          data={[
              {
              label: "Gasto",
              bgColor: "#775CFF",
              value: Object.keys(relatorioCliente.relatorio).map((obj)=>{
                    return relatorioCliente!.relatorio[obj].vendidos
              }),
              },
              {
              label: "Devolvido",
              bgColor: "#FF8447",
              value: Object.keys(relatorioCliente.relatorio).map((obj)=>{
                    return relatorioCliente!.relatorio[obj].devolvidos
              }),
              },
          ]}
          />       
      </div>
      {:else}
        <div class="flex justify-center items-center w-full h-full">
            <LoaderMinhoca/>
        </div>
      {/if}
  </BubbleWrapper>
  {/snippet}
  
  {#snippet cardRight()}

    <BubbleWrapper css="flex flex-col gap-5 h-[380px] shrink-0 px-0 py-5 pb-0">
        {#if loading}
            <div class="flex justify-center items-center w-full h-full">
                <LoaderMinhoca/>
            </div>
        {:else if clienteDetalhado}
            <div class="flex items-center gap-3 px-5">
                <Avatar src={avatarController.url("USUARIO",clienteDetalhado.id)} name={clienteDetalhado.nome} size="w-[48px]"/>
                <div class="flex flex-col">
                    <b class="font-medium text-[18px]">
                        {clienteDetalhado.nome}
                    </b>
                    <span class="text-[14px] text-sub-600">
                        {handleDate.formatISODate(clienteDetalhado.criadoEm)}
                    </span>
                </div>
            </div>
            <FillText texto="DADOS DE CONTATO"/>
            <div class="flex flex-col px-5 gap-3">
                {@render textLabel("Telefone",clienteDetalhado.telefone)}
                {@render textLabel("Email",clienteDetalhado.email)}
            </div>
        
            <FillText texto="ESTATÍSTICAS"/>
            <div class="flex flex-col px-5 gap-3">
                {@render textLabel("Pedidos",clienteDetalhado.quantidadePedidos.toString())}
                {@render textLabel("Produtos adquiridos",clienteDetalhado.quantidadePedidos.toString())}
                {@render textLabel("Taxa de devolução",clienteDetalhado.txDevolucao.toString())}
            </div>
        {/if}
    </BubbleWrapper>


  {/snippet}
  
  
  {#snippet btnsTop()}
      <div class="flex items-center gap-2">
          <div class="grid h-[40px]">
              <Botao onClick={()=>{
  
              }} tema="gray-transparent">
                  Visualizar loja
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M8.05818 3.02003L1.49488 9.58333L0.416626 8.50508L6.97917 1.94177H1.19519V0.416666H9.58329V8.80476H8.05818V3.02003Z" fill="#525866"/>
                  </svg>                
              </Botao>                
          </div>
          <div class="grid aspect-square h-[40px]">
              <Botao onClick={()=>{
  
              }} tema="gray-transparent">
                  <SvgBell/>
              </Botao>                
          </div>
  
      </div>
  {/snippet}


  {#snippet textLabel(text:string,desc:string)}
      <div class="flex text-[14px] font-normal justify-between w-full">
        <span class="text-sub-600">
            {text}
        </span>
        <span>
            {desc}
        </span>
      </div>
  {/snippet}