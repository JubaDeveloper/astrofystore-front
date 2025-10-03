<script lang="ts">
  import SvgSearch from "$components/assets/svg/SvgSearch.svelte";


    interface Props {
        value:string,
        onSearch: (v:string) => void
        placeholder:string,
        maxWidth?:string,
    }

    let {value = $bindable(),onSearch,placeholder,maxWidth="max-w-[500px]"}:Props = $props()
</script>


<div class="flex items-center gap-2 px-3 rounded-[8px] py-2 grow apply-class-focus {maxWidth}">
    <button>
        <SvgSearch/>
    </button>
    <input 
    type="text" 
    bind:value={value} 
    class="outline-none w-full"
    placeholder={placeholder}
    onkeydown={(e)=>{
        if(e.key==="Enter"){
            onSearch(value)
        }
    }}
    >
</div>