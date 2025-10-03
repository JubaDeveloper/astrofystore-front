<script lang="ts">
  import Botao from "$components/assets/buttons/Botao.svelte";
  import PopUp from "$components/assets/modals/PopUp.svelte";
  import SvgX from "$components/assets/svg/SvgX.svelte";
  import EstrelasText from "./EstrelasText.svelte";

  interface Props{
    open:boolean
  }

  let {open =$bindable()}:Props = $props()


  let avaliado = $state(false)

  async function avaliar() {
    avaliado=true
  }

</script>

<PopUp bind:open withDefaultPadding={false} withCloseButton={false}>
    <div class="rounded-lg w-[440px] shrink-0 flex flex-col relative">
        <button class="absolute top-4 right-4 bg-white-0 rounded-md flex justify-center items-center w-[24px] h-[24px]"
        onclick={()=>open=false}>
            <SvgX props={{
                class:"fill-sub-600"
            }}/>
        </button>
        <img src="/images/avaliacao/{Math.floor(Math.random() * 4) + 1}.png" alt="" class=" w-full object-contain">
        {#if avaliado}
            <span class="text-[20px] font-medium w-full text-center mt-4">
                Valeu pela moral, camarada! 🤝
            </span>
            <span class="text-sub-600 text-[12px] w-full text-center mb-3">
                Pode crer que ela é super importante pra gente!
            </span>
            <div class="w-full h-[1px] bg-soft-200 mb-3"></div>
            <div class="grid h-[40px] grid-cols-1 mx-3 mb-3">
                <Botao tema="gray-transparent" onClick={()=>open=false}>
                    Fechar
                </Botao>
            </div>
        {:else}
            <span class="text-[20px] font-medium w-full text-center mt-4">🙏 Avalia o produto, ai pls!</span>
            <div class="px-3 my-4">
                <EstrelasText estrelas={1} text=""/>

            </div>
            <div class="w-full h-[1px] bg-soft-200 mb-3"></div>
            <div class="grid h-[40px] grid-cols-1 mx-3 mb-3">
                <Botao tema="primary" onClick={avaliar}>
                    Avaliar
                </Botao>
            </div>
        {/if}
    </div>
</PopUp>
