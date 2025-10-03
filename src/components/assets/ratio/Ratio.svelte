<script lang="ts">


    interface Props{
        checked: boolean,
        disabled?:boolean
    }


    let {checked,disabled=false} = $props()

    const styleBox = (checked:boolean) => {
        if(checked){
            return "bg-primary-base border-transparent group-hover:bg-primary-darker"
        }
        return "shadow-lg  bg-transparent border-strong-950/5 group-hover:border-primary-base"
    }


</script>


<!-- 
  @component
  Componente deve ser utilizado dentro de um botão. 
  Acople na classe no botão o nome "group", para detectar efeitos de hover
  
  Uso:
    ```tsx
  <button class="group">
    <Ratio checked={outsideChecked}/>
  </button>
-->



<div class="w-4 shrink-0 flex justify-center items-center aspect-square border-2 group
rounded-full {styleBox(checked)}">
    {#if checked}
        <div class="w-2 aspect-square rounded-full bg-white">
        </div>
    {/if}
</div>
