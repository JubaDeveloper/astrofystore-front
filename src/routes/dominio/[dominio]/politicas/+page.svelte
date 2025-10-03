<script lang='ts'>
    import Botao from "$components/assets/buttons/Botao.svelte";
    import SvgVoltar from "$components/assets/svg/SvgVoltar.svelte";
  import api from "$lib/api/api";
  import domainManager from "$lib/settings/domain.svelte";
  import toast from "$lib/utils/toast.svelte";
  import { consoleDev } from "$lib/utils/utils.svelte";
  import { onMount } from "svelte";

  let slug = $state(domainManager.lojainfo?.politicas[0].slug);
  let domain = $state(domainManager.ultimoDominioAcessado);
  let data:string = $state('')

  async function politicas() {
    const [res, err] = await api.get(`/l/${domain}/politica/${slug}`)
    if(err) return toast.error('Mensagem do sistema.', err.message)
    data = formatarPolitica(res.data.conteudo)
  }

  function formatarPolitica(politica: string) {
    politica = politica.replace(/<h1>/g, '<h1 class="text-20 font-medium text-strong-950">')
    politica = politica.replace(/<p>/g, '<p class="text-14 text-strong-950">')
    return politica
  }

  onMount(()=> politicas())
</script>

{#if domainManager.lojainfo}
  <div class="flex flex-col items-center justify-center p-6 gap-8">
    <div class="flex flex-col min-w-2xl max-w-2xl gap-4">
      <p class="text-40 font-medium text-strong-950">Políticas da loja</p>
      <span>{@html data}</span>
    </div>
    <div class="h-10 grid grid-cols-1">
      <Botao onClick={()=> window.history.back()} tema={'black'}>
        <SvgVoltar/>
        Voltar à página anterior
      </Botao>
    </div>
  </div>
{:else}
  <div>
    carregando
  </div>
{/if}
