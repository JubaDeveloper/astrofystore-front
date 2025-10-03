<script lang="ts">
  import SidePop from "$components/assets/modals/SidePop.svelte";
    import SvgDoubleCheck from "$components/assets/svg/SvgDoubleCheck.svelte";
  import SvgMaosAleluia from "$components/assets/svg/SvgMaosAleluia.svelte";
  import SvgSinozinho from "$components/assets/svg/SvgSinozinho.svelte";
  import SvgX from "$components/assets/svg/SvgX.svelte";
  import notificacaoController from "$lib/api/modules/notificacoes/notificacao.controller";
  import toast from "$lib/utils/toast.svelte";
  import { consoleDev, encurtarTexto } from "$lib/utils/utils.svelte";
  import { onMount } from "svelte";

  async function listar() {
    const [res, err] = await notificacaoController.listar({})

    if(err) return toast.error('Mensagem do sistema.', err.message)
  }

  async function lerTodas() {
    const [res, err] = await notificacaoController.marcarTodas()

    if(err) return toast.error('Mensagem do sistema.', err.message)
    consoleDev(res)
  }
  interface Props {
    open: boolean,
  }

  let {
    open = $bindable()
  }:Props = $props()

  let opcoes = $state(['Todas', 'Não lidas'])
  let index: number = $state(0)

</script>

<SidePop curved={true} bind:open={open}>
  <div class="flex flex-col w-full h-full">
    <div class="flex items-center justify-between px-5">
      <div class="flex items-center gap-3">
        <SvgSinozinho/>
        <p class="text-18 font-medium text-strong-950">Notificações</p>
      </div>
      <button>
        <SvgX cor={'sub-600'}/>
      </button>
    </div>
    <div class="flex items-start justify-between pt-3.5 px-5 gap-5 border-t border-b border-soft-200 mt-5">
      <div class="flex items-start gap-5">
        {#each opcoes as item, i}
          <button class="text-14 font-medium pb-5 border-b-2 flex items-center gap-1 {index === i ? 'text-strong-950  border-primary-base':'text-sub-600 border-transparent'}" onclick={()=> index = i}>
            {item}
            {#if i === 1}
              <span class="bg-primary-base rounded-full text-11 text-white-0 w-5 h-5 flex items-center justify-center">9</span>
            {/if}
          </button>
        {/each}
      </div>
      <button class="text-14 font-medium text-sub-600 flex items-center gap-2" onclick={()=> lerTodas()}>
        <SvgDoubleCheck/>
        Ver todas
      </button>
    </div>
    <div class="overflow-y-auto overflow-x-hidden flex flex-col gap-3 p-3">
      {#each Array(20) as _, i}
        <button class="rounded-[12px] border border-soft-200 bg-weak-50 p-4 flex justify-start items-start whitespace-nowrap gap-4">
          <div class="shrink-0">
            <SvgMaosAleluia/>
          </div>
          <div class="flex flex-col gap-2">
            <div class="flex items-center gap-2 w-full">
              <p class="text-16 font-medium text-strong-950">Sua reparação foi aprovada!</p>
              <span class="bg-faded-light rounded-2xl px-2 py-0.5 text-12 font-medium text-faded-dark">Há 4m</span>
            </div>
            <p class="text-14 font-normal text-sub-600">{encurtarTexto('Sua loja permanecerá no ar normalmente.', 50)}</p>
          </div>
        </button>
        <button class="rounded-[12px] p-4 flex justify-start items-start whitespace-nowrap gap-4">
          <div class="shrink-0">
            <SvgMaosAleluia/>
          </div>
          <div class="flex flex-col gap-2 text-start ">
            <div class="flex items-center gap-2 w-full">
              <p class="text-16 font-medium text-strong-950">Prazo de resposta expirando!</p>
              <span class="bg-faded-light rounded-2xl px-2 py-0.5 text-12 font-medium text-faded-dark">Há 4m</span>
            </div>
            <p class="text-14 font-normal text-sub-600 whitespace-normal">{encurtarTexto('O prazo para responder à denuncia de sua loja por produtos ilegais, referente ao item Netflix expira em 2 dias. Responda o quanto antes para manter sua loja ativa.', 100)}</p>
          </div>
        </button>
      {/each}
    </div> 
  </div>
</SidePop>