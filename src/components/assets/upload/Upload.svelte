<script lang="ts">
    import { fileManager } from "$lib/actions/file.svelte";
    import Label from "../labels/Label.svelte";
  import SvgUpload from "../svg/SvgUpload.svelte";

  interface Props{
    formImage:{
        file:File | null,
        data64:string
    },
    label?: string
    mandatory?:boolean,
    size?:string
  }

  let {formImage = $bindable(), label = 'Imagem da Variável',mandatory,size="max-h-52 min-h-52"}: Props = $props()

</script>

<div class="flex flex-col gap-2 rounded-xl object-center object-cover">
  <div class="flex items-center justify-between">
    <Label label={label} {mandatory}/>
    {#if formImage.data64}
      <button onclick={()=> formImage.data64 = ''} class="underline text-12 font-medium text-error-base">
        Excluir
      </button>
    {/if}
  </div>

  {#if formImage.data64}
    <img src={formImage.data64} alt="Imagem selecionada" class="self-start rounded-xl w-full object-cover {size} overflow-hidden" />
  {:else}
    <div class="flex flex-col items-center border border-dashed border-soft-200 rounded-2xl p-8 gap-2">
      <SvgUpload/>
      <div class="flex flex-col gap-1.5 items-center justify-center text-center">
        <p class="text-14 font-medium text-strong-950">Arraste ou selecione a imagem.</p>
        <p class="text-12 font-medium text-sub-600">PNG ou JPG, até 5 MB.</p>
      </div>
      <button class="text-[14px] text-sub-600  font-medium  border border-soft-200 px-3 py-1.5 rounded-[8px] cursor-pointer"
      use:fileManager={{
        accept:".png,.jpg,.jpeg,.webp",
        multipleFiles:false
      }}    
      onfileupload={(e)=>{
          formImage.data64 = e.detail[0].data64
          formImage.file = e.detail[0].file
      }}>
        Procurar
      </button>
    </div>
  {/if}
</div>