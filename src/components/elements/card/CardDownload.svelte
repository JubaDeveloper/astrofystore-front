<script lang="ts">
  import SvgFile2 from "$components/assets/svg/SvgFile2.svelte";
  import type { DenunciaDetalhadaDto } from "$lib/api/modules/denuncias/denuncias.dto";
  import FileMimic from "./FileMimic.svelte";


    interface Props{
        url:string,
        mimetype:string
        filename:string,
        size:string,
    }
    let {url,mimetype,filename,size}:Props = $props()

    function open(){

        window.open(url)
    }


</script>

<button class="border border-soft-200 overflow-hidden w-[180px] max-w-[180px] gap-3 grow-0 shrink-0 flex items-center justify-between p-3 rounded-[8px]"
onclick={open}>
    <div class="flex gap-2">
        <FileMimic mimetype={mimetype}/>
        <div class="flex flex-col text-[12px]">
            <b class="font-medium truncate w-[80px]">
                {filename}
            </b>
            <span class="text-left">
                {(parseInt(size)/1024).toFixed(2)}MB
            </span>
        </div>
        
    </div>
    <svg width="14" height="15" viewBox="0 0 14 15" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M0.25 13.25H13.75V14.75H0.25V13.25ZM7.75 8.879L12.3032 4.325L13.3638 5.3855L7 11.75L0.63625 5.38625L1.69675 4.325L6.25 8.8775V0.5H7.75V8.879Z" fill="#525866"/>
    </svg>        
</button>
