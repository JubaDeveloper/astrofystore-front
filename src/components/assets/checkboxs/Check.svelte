<script lang="ts">
  import SvgCheckMin from "../svg/SvgCheckMin.svelte";

  interface Props{
    checked: boolean,
    disabled?:boolean
  }

  let {checked, disabled=false}:Props = $props()

  const styleBox = (checked:boolean) => {
    if(checked){
        return "bg-primary-base border-transparent"
    }
    return "bg-transparent border-soft-200"
  }
</script>

<div class="w-4 flex justify-center items-center aspect-square border-2 rounded-sm {styleBox(checked)}">
	{#if checked}
		<SvgCheckMin/>
	{/if}
</div>

<!-- 
  @component
  Componente deve ser utilizado dentro de um botão. 
  Acople na classe no botão o nome "group", para detectar efeitos de hover
  
  Uso:
    ```tsx
  <button class="group">
    <Check checked={outsideChecked}/>
  </button>
-->