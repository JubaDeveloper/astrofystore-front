<script lang="ts">
    import type { Snippet } from "svelte";
    import { slide } from "svelte/transition";


    let {isDrop,className="",children,divElement = $bindable()}:{isDrop:boolean,className:string,children:Snippet,divElement?:HTMLDivElement} = $props()

</script>

<!-- 
  @component
    Utilize esse componente para ter uma animação de drop 
-->


{#if isDrop}
    <div class="{className}" transition:slide={{duration:300}} bind:this={divElement}>
        {@render children()}
    </div>
{/if}