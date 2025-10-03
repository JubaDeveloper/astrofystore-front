<script lang="ts">
    import type { Snippet } from "svelte";
    
    type Temas =
    | "faded-base" | "faded-light" | "faded-lighter"
    | "inverted-faded-base" 
    | "information-base" | "information-light" | "information-lighter"
    | "inverted-information-base" 
    | "warning-base" | "warning-light" | "warning-lighter"
    | "inverted-warning-base" 
    | "error-base" | "error-light" | "error-lighter"
    | "inverted-error-base" 
    | "success-base" | "success-light" | "success-lighter"
    | "inverted-success-base" 
    | "away-base" | "away-light" | "away-lighter"
    | "inverted-away-base" 
    | "feature-base" | "feature-light" | "feature-lighter"
    | "inverted-feature-base" 
    | "verified-base" | "verified-light" | "verified-lighter"
    | "inverted-verified-base" 
    | "highlighted-base" | "highlighted-light" | "highlighted-lighter"
    | "inverted-highlighted-base"
    | "stable-base" | "stable-light" | "stable-lighter"
    | "inverted-stable-base" 
    | "inverted-soft-base" | string
    
    ;

    interface Props{
        tema: Temas,
        css?:string //Uso apenas para tamanho e necessidades especificas, não use isso para cores e temas
        children:Snippet
    }
    let {tema,children,css="h-[18px] px-2 rounded-full text-[11px]"}:Props = $props()

    let corBg = $state<string>("")

    let corTexto = $state<string>("")


	const texto = () => {


		if(tema.includes("base") && !tema.includes("inverted")){
			corTexto="text-static-white"
            return
        }

        if (tema === "faded-lighter") {
            corTexto = "text-faded-base";
        }
        if (tema === "information-lighter") {
            corTexto = "text-information-base";
        }
        if (tema === "warning-lighter") {
            corTexto = "text-warning-base";
        }
        if (tema === "error-lighter") {
            corTexto = "text-error-base";
        }
        if (tema === "success-lighter") {
            corTexto = "text-success-dark";
        }
        if (tema === "away-lighter") {
            corTexto = "text-away-base";
        }
        if (tema === "feature-lighter") {
            corTexto = "text-feature-dark";
        }
        if (tema === "verified-lighter") {
            corTexto = "text-verified-base";
        }
        if (tema === "highlighted-lighter") {
            corTexto = "text-highlighted-base";
        }
        if (tema === "stable-lighter") {
            corTexto = "text-stable-base";
        }
        if (tema === "faded-light") {
            corTexto = "text-faded-dark";
        }
        if (tema === "information-light") {
            corTexto = "text-information-dark";
        }
        if (tema === "warning-light") {
            corTexto = "text-warning-dark";
        }
        if (tema === "error-light") {
            corTexto = "text-error-dark";
        }
        if (tema === "success-light") {
            corTexto = "text-success-dark";
        }
        if (tema === "away-light") {
            corTexto = "text-away-dark";
        }
        if (tema === "feature-light") {
            corTexto = "text-feature-dark";
        }
        if (tema === "verified-light") {
            corTexto = "text-verified-dark";
        }
        if (tema === "highlighted-light") {
            corTexto = "text-highlighted-dark";
        }
        if (tema === "stable-light") {
            corTexto = "text-stable-dark";
        }
        if (tema === "inverted-faded-base") {
            corTexto = "text-faded-base";
        }
        if (tema === "inverted-information-base") {
            corTexto = "text-information-base";
        }
        if (tema === "inverted-warning-base") {
            corTexto = "text-warning-base";
        }
        if (tema === "inverted-error-base") {
            corTexto = "text-error-base";
        }
        if (tema === "inverted-success-base") {
            corTexto = "text-success-base";
        }
        if (tema === "inverted-away-base") {
            corTexto = "text-away-base";
        }
        if (tema === "inverted-feature-base") {
            corTexto = "text-feature-base";
        }
        if (tema === "inverted-verified-base") {
            corTexto = "text-verified-base";
        }
        if (tema === "inverted-highlighted-base") {
            corTexto = "text-highlighted-base";
        }
        if (tema === "inverted-stable-base") {
            corTexto = "text-stable-base";
        }
        if (tema === "inverted-soft-base") {
            corTexto = "text-soft-base";
        }
        

	}

    const background = () => {

        if (tema === "faded-base") {
            corBg = "bg-faded-base";
        }
        if (tema === "faded-light") {
            corBg = "bg-faded-light";
        }
        if (tema === "faded-lighter") {
            corBg = "bg-faded-lighter";
        }
        if (tema === "inverted-faded-base") {
            corBg = "border border-faded-base";
        }

        if (tema === "information-base") {
            corBg = "bg-information-base";
        }
        if (tema === "information-light") {
            corBg = "bg-information-light";
        }
        if (tema === "information-lighter") {
            corBg = "bg-information-lighter";
        }
        if (tema === "inverted-information-base") {
            corBg = "border border-information-base";
        }
        if (tema === "warning-base") {
            corBg = "bg-warning-base";
        }
        if (tema === "warning-light") {
            corBg = "bg-warning-light";
        }
        if (tema === "warning-lighter") {
            corBg = "bg-warning-lighter";
        }
        if (tema === "inverted-warning-base") {
            corBg = "border border-warning-base";
        }
        if (tema === "error-base") {
            corBg = "bg-error-base";
        }
        if (tema === "error-light") {
            corBg = "bg-error-light";
        }
        if (tema === "error-lighter") {
            corBg = "bg-error-lighter";
        }
        if (tema === "inverted-error-base") {
            corBg = "border border-error-base";
        }
        if (tema === "success-base") {
            corBg = "bg-success-base";
        }
        if (tema === "success-light") {
            corBg = "bg-success-light";
        }
        if (tema === "success-lighter") {
            corBg = "bg-success-lighter";
        }
        if (tema === "inverted-success-base") {
            corBg = "border border-success-base";
        }
        if (tema === "away-base") {
            corBg = "bg-away-base";
        }
        if (tema === "away-light") {
            corBg = "bg-away-light";
        }
        if (tema === "away-lighter") {
            corBg = "bg-away-lighter";
        }
        if (tema === "inverted-away-base") {
            corBg = "border border-away-base";
        }
        if (tema === "feature-base") {
            corBg = "bg-feature-base";
        }
        if (tema === "feature-light") {
            corBg = "bg-feature-light";
        }
        if (tema === "feature-lighter") {
            corBg = "bg-feature-lighter";
        }
        if (tema === "inverted-feature-base") {
            corBg = "border border-feature-base";
        }
        if (tema === "verified-base") {
            corBg = "bg-verified-base";
        }
        if (tema === "verified-light") {
            corBg = "bg-verified-light";
        }
        if (tema === "verified-lighter") {
            corBg = "bg-verified-lighter";
        }
        if (tema === "inverted-verified-base") {
            corBg = "border border-verified-base";
        }
        if (tema === "highlighted-base") {
            corBg = "bg-highlighted-base";
        }
        if (tema === "highlighted-light") {
            corBg = "bg-highlighted-light";
        }
        if (tema === "highlighted-lighter") {
            corBg = "bg-highlighted-lighter";
        }
        if (tema === "inverted-highlighted-base") {
            corBg = "border border-highlighted-base";
        }
        if (tema === "stable-base") {
            corBg = "bg-stable-base";
        }
        if (tema === "stable-light") {
            corBg = "bg-stable-light";
        }
        if (tema === "stable-lighter") {
            corBg = "bg-stable-lighter";
        }
        if (tema === "inverted-stable-base") {
            corBg = "border border-stable-base";
        }
        if (tema === "inverted-soft-base") {
            corBg = "border border-soft-base";
        }

    }

    $effect(()=>{
        if(tema){
            background()
            texto()
        }
    })
</script>

<div class="flex text-center justify-center items-center gap-1 {corBg} {corTexto} {css}">
    {@render children()}
</div>