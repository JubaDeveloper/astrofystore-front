<script lang="ts">
    import { fileManager } from "$lib/actions/file.svelte";
  import { flip } from "svelte/animate";
    import SvgUpload from "../svg/SvgUpload.svelte";

    interface Props{
        formImage:{
            file:File | null,
            data64:string
        },
        onNewFile:(f:{
            file:File | null,
            data64:string
        }[])=>void
        onDelete:VoidFunction,
        label?: string
        size?:string
    }

    let {formImage = $bindable(),onNewFile,size="w-[200px] h-[200px]",onDelete}: Props = $props()

    let isDragging = $state(false)
    function handleDrag(event:DragEvent) {
    event.preventDefault();
    event.stopPropagation();
  }

  // Atualiza estado de arrastar
  function handleDragEnter() {
    isDragging = true;
  }

  function handleDragLeave() {
    isDragging = false;
  }

  async function handleDrop(event:DragEvent) {
    handleDrag(event);
    isDragging = false;

    const data = event.dataTransfer;
    if(!data)return
    const files = data.files
    const format = Array.from(files).map((obj)=>{
        return{
            file: obj,
            data64: URL.createObjectURL(obj)
        }
    })
    onNewFile(format)
  }

</script>
{#if formImage.data64}
    <div class="relative w-full group {size}" >
        <div class="opacity-0 pointer-events-none group-hover:pointer-events-auto group-hover:opacity-100  absolute right-0 m-3">
            <button class="text-sub-600 text-[12px] border border-soft-200 bg-white-0 p-[2px] px-[4px] rounded-md" onclick={onDelete}>
                Deletar
            </button>
        </div>
        <img src={formImage.data64} alt="Imagem selecionada" class="rounded-xl h-full object-cover overflow-hidden" />
    </div>
{:else}
    <div class="flex flex-col items-center border border-dashed border-soft-200 rounded-2xl justify-center gap-2 {isDragging && "cursor-copy bg-soft-200"} {size}"
    ondragenter={handleDragEnter}
    ondragleave={handleDragLeave}
    ondragover={handleDrag}
    ondrop={handleDrop}
    role="application"
    >
    <SvgUpload/>
    <div class="flex flex-col gap-1.5 items-center justify-center text-center pointer-events-none">

        {#if !isDragging}
        <p class="text-14 font-medium text-strong-950">Arraste ou selecione a imagem.</p>
        <p class="text-12 font-medium text-sub-600">PNG ou JPG, até 5 MB.</p>
        {:else}
            <p class="text-14 font-medium text-strong-950">Arraste os arquivos aqui</p>
        {/if}
    </div>

    {#if !isDragging}
    <button class="text-[14px] text-sub-600   font-medium  border border-soft-200 px-3 py-1.5 rounded-[8px] cursor-pointer"
    use:fileManager={{
        accept:".png,.jpg,.jpeg,.webp",
        multipleFiles:true
    }}    
    onfileupload={(e)=>{
        onNewFile(e.detail)
    }}>
        Procurar
    </button>
    {/if}
    </div>
{/if}       