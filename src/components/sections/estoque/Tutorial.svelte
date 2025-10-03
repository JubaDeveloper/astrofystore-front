<script>
  import Botao from "$components/assets/buttons/Botao.svelte";
  import FillText from "$components/assets/limiter/FillText.svelte";
  import SvgPlay from "$components/assets/svg/SvgPlay.svelte";
  import BubbleWrapper from "$components/elements/wrappers/BubbleWrapper.svelte";

</script>



<BubbleWrapper css="w-[360px] px-0 gap-3">
    <div class="px-4">
        Tutorial
    </div>
    <FillText texto="EXPLICAÇÃO"/>
    <div class="flex flex-col px-4 text-[12px] text-sub-600 gap-2">
        <span>
            Atributos são as características de um produto que podem variar.
        </span>
        <span>
            Ex: Um jogo pode ter atributos como versão (Standard, Deluxe) e idioma (Português, Inglês), ajudando o cliente a escolher melhor.           
        </span>
    </div>
    <FillText texto="VÍDEO TUTORIAL"/>
    <div class="flex items-center justify-between px-4 text-[12px]">

        <div class="flex flex-col gap-1">
            <b class="text-[14px] font-medium">
                Precisa de um Help? 🎬
            </b>
            <span class="text-sub-600 w-[205px]">
                Senta que lá vem textão... ops, vídeo que a gente fez pra te ajudar!
            </span>
        </div>

        <div class="grid w-[98px]">
            <Botao tema="gray-transparent" onClick={()=>{}}>
                <div class="flex items-center gap-1">
                    <SvgPlay/>
                    Assistir    
                </div>
            </Botao>    
        </div>

    </div>
</BubbleWrapper>
