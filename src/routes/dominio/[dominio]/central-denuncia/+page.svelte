<script lang="ts">
  import { goto } from "$app/navigation";
  import Botao from "$components/assets/buttons/Botao.svelte";
  import SvgFoguetao from "$components/assets/svg/SvgFoguetao.svelte";
  import CardDenunciaProduto from "$components/sections/produtos/CardDenunciaProduto.svelte";
  import denunciaController from "$lib/api/modules/denuncia/denuncia.controller";
  import domainManager from "$lib/settings/domain.svelte";
  import storageService from "$lib/utils/storageService";
  import toast from "$lib/utils/toast.svelte";

  let bodyDenuncia = $state({
    produtoId: 0,
    motivo: "",
    descricao: "",
  });

  let formImages = $state([
    {
      id: "",
      data64: "",
      file: null,
    },
  ]);

  let etapaFinalizada: boolean = $state(false);
  let loading = $state(false);
  let denunciaId: number = $state(0);

  async function salvar() {
    loading = true;

    const body = { ...bodyDenuncia };
    const [resCriar, errCriar] = await denunciaController.criarDenuncia(
      domainManager.lojaId!,
      body
    );

    if (errCriar) {
      toast.error("Mensagem do sistema.", errCriar.message);
      loading = false;
      return;
    }

    denunciaId = resCriar.data.id;

    for (const obj of formImages) {
      if (!obj.file) continue;

      const [resAnexo, errAnexo] = await denunciaController.criarAnexos(
        domainManager.lojaId!,
        denunciaId,
        obj.file
      );

      if (errAnexo)
        return toast.error("Mensagme do sistema.", "Erro ao enviar Imagens.");
    }

    toast.success("Denuncia enviada com sucesso!", "");

    loading = false;
    etapaFinalizada = true;
  }
</script>

<div class="flex flex-col w-full justify-center items-center h-full py-12">
  {#if !etapaFinalizada}
    <CardDenunciaProduto
      {loading}
      bind:formImages
      bind:valueMotivo={bodyDenuncia.motivo}
      bind:valueProduto={bodyDenuncia.produtoId}
      bind:valueDescricao={bodyDenuncia.descricao}
      {salvar}
    />
  {:else}
    {@render finalizado()}
  {/if}
</div>

{#snippet finalizado()}
  <div class="flex flex-col items-center justify-center">
    <SvgFoguetao />
    <div class="flex flex-col text-center pb-4">
      <p class="text-20 text-strong-950 font-medium">
        Denuncia enviada com sucesso!
      </p>
      <p class="text-14 font-medium text-sub-600">
        Obrigado por tornar a plataforma um lugar muito melhor!
      </p>
    </div>
    <div class="grid grid-cols-1 h-[40px] w-full">
      <Botao onClick={() => goto("/")} tema={"primary"}>Retornar à loja</Botao>
    </div>
  </div>
{/snippet}

<!-- <style>
  .user-gradient{
    background: linear-gradient(180deg, rgba(113, 119, 132, 0.10) 0%, rgba(113, 119, 132, 0.00) 100%);
  }
</style> -->
