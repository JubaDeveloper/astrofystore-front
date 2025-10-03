<script lang="ts">
    import SvgFile2 from "$components/assets/svg/SvgFile2.svelte";
    import type { DenunciaDetalhadaDto } from "$lib/api/modules/denuncias/denuncias.dto";
  
  
      interface Props{
          mimetype:string
      }
      let {mimetype}:Props = $props()
  
      console.log(mimetype)
  
</script>
<div class="relative">
    <SvgFile2/>
    <div class="px-[3px] py-0.5 bg-error-base rounded inline-flex justify-start items-center gap-2 absolute top-[35%] left-[-10%]">
        <div class="justify-center text-static-white text-[7px] font-semibold uppercase leading-3 tracking-tight">
            {mimetype.split("/")[1].toUpperCase()}
        </div>
    </div>
</div>