<script lang="ts">
    import Avatar from "$components/assets/avatar/Avatar.svelte";
  import SvgAdd from "$components/assets/svg/SvgAdd.svelte";
  import SvgX from "$components/assets/svg/SvgX.svelte";
  import { fileManager } from "$lib/actions/file.svelte";

    interface Props{
        formImage:{
            file:File | null,
            data64:string
        },
        src?: string,
        name?: string
    }

    let {formImage = $bindable(), src, name}:Props = $props()

</script>

<button 
class="w-[40px] h-[40px] aspect-square shrink-0 rounded-full hover:brightness-110 bg-sub-300 relative"
aria-label="perfil imagem" 
use:fileManager={{
    accept:".png,.jpg,.jpeg,.webp",
    multipleFiles:false
}}    
onfileupload={(e)=>{
    formImage.data64 = e.detail[0].data64
    formImage.file = e.detail[0].file
}}>

    <div class="{formImage.data64 ? "bg-faded-dark border-white-0" : "bg-faded-base border-white-0"}
    top-0 right-[-2px] flex justify-center items-center absolute w-[14px] h-[14px] aspect-square shrink-0 rounded-full border z-50">
        {#if formImage.data64}
            <SvgX props={{ width:6, fill:"white" }}/>
        {:else}
            <SvgAdd props={{ width:8, fill:"white"}}/>
        {/if}
    </div>
    <div class="w-full h-full overflow-hidden rounded-full">
        {#if formImage.data64}
            <img src={formImage.data64} alt="Perfil" class="object-cover h-full"/>
        {:else if src && name}
            <Avatar src={src} name={name}/>
        {:else}
            <img src="/icons/usuario-default.svg" alt="usuario default"/>
        {/if}
    </div>
    
</button>