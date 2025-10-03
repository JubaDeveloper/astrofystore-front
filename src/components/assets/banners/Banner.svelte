<script lang="ts">
  import SvgAlerta from "../svg/SvgAlerta.svelte";
  import SvgAlertaTriangulo from "../svg/SvgAlertaTriangulo.svelte";
  import SvgCheck from "../svg/SvgCheck.svelte";
  import SvgCheckMin from "../svg/SvgCheckMin.svelte";
  import SvgX from "../svg/SvgX.svelte";


    type Temas = 
     "error-base" | "error-light" | "error-lighter"
    | "information-base" | "information-light" | "information-lighter"
    | "success-base" | "success-light" | "success-lighter"
    | "faded-base" | "faded-light" | "faded-lighter"
    | "warning-base" | "warning-light" | "warning-lighter"
    | "error-transparent"     | "success-transparent"    | "information-transparent" 
    | "warning-transparent" | string;

    interface Props{
        tema: Temas,
        titulo?:string,
        link?:{
            label:string,
            action:VoidFunction
        },
        onClose:VoidFunction
        descricao?:string
    }
    let {tema,titulo="Insira seu titulo aqui",descricao="Insira sua descrição aqui",link,onClose}:Props = $props()

    const temaCor = () => {
    if (tema === "error-base") {
        return "bg-error-base";
    }
    if (tema === "error-light") {
        return "bg-error-light";
    }
    if (tema === "error-lighter") {
        return "bg-error-lighter";
    }
    if (tema === "information-base") {
        return "bg-information-base";
    }
    if (tema === "information-light") {
        return "bg-information-light";
    }
    if (tema === "information-lighter") {
        return "bg-information-lighter";
    }
    if (tema === "success-base") {
        return "bg-success-base";
    }
    if (tema === "success-light") {
        return "bg-success-light";
    }
    if (tema === "success-lighter") {
        return "bg-success-lighter";
    }
    if (tema === "faded-base") {
        return "bg-faded-base";
    }
    if (tema === "faded-light") {
        return "bg-faded-light";
    }
    if (tema === "faded-lighter") {
        return "bg-faded-lighter";
    }
    if (tema === "warning-base") {
        return "bg-warning-base";
    }
    if (tema === "warning-light") {
        return "bg-warning-light";
    }
    if (tema === "warning-lighter") {
        return "bg-warning-lighter";
    }
    if(tema.includes("transparent")){
        return "bg-white-0 border border-soft-200"
    }

    };

    const textoCor = () =>{

        if(tema.includes("base")){
            return "text-static-white"
        }
        return "text-strong-950"

    }

</script>



<div class="w-full px-12 py-4 pointer-events-auto flex justify-center items-center relative rounded-2xl  {temaCor()}">

    <div class="flex gap-2 items-center {textoCor()}">
        {@render icon()}
        <h2 class="text-[14px] font-medium ml-1">{titulo}</h2>
        <div class="w-1 aspect-square {tema.includes("base") ? "bg-static-white" : "bg-strong-950"} rounded-full"></div>
        <h3 class="text-[14px] font-normal">{descricao}</h3>
        {#if link}
            <button onclick={link.action} class="{tema.includes("base") ? "text-neutral-50" : "text-strong-950"}  underline text-[14px] font-medium">
                {link.label}
            </button>
        {/if}
    </div>

    <button class="absolute right-4 p-2" onclick={onClose}>
        <SvgX props={{
            class: tema.includes("base") ? "fill-white" : "fill-strong-950"
        }}/>
    </button>

</div>


{#snippet icon()}
    {@const size = 20}

    {#if tema.includes("error")}

        <SvgAlerta props={{
            class:tema.includes("base") ?  "fill-white": "fill-error-base",
            width:size 
        }}/>

    {:else if tema.includes("success")}

        <SvgCheck props={{
            class:tema.includes("base") ?  "fill-white": "",
            width:size 
        }}/>

    {:else if tema.includes("warning")}
        <SvgAlertaTriangulo props={{
            class:tema.includes("base") ?  "fill-white": "",
            width:size 
        }}/>
    {:else if tema.includes("information")}
        <SvgAlerta props={{
            class:tema.includes("base") ?  "fill-white": "",
            width:size 
        }}/>
    {/if}

{/snippet}