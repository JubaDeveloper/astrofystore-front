<script lang='ts'>
  import Label from "../labels/Label.svelte";
    import SvgClose from "../svg/SvgClose.svelte";

  interface Props {
    form: string[]
  }

  let {form = $bindable()}: Props = $props()
  let inputValue = $state('')
  
  function handleKeyDown(e: KeyboardEvent) {
    if (e.key === 'Enter') {
      e.preventDefault()
      addToForm()
    }
  }

  function addToForm() {
    if (inputValue.trim()) {
      form = [...form, inputValue.trim()]
      inputValue = ''
    }
  }

  function removeFromForm(index: number) {
    form = form.filter((_, i) => i !== index)
  }
</script>

<div class="flex flex-col gap-1">
  <Label label={'Variações do atributo'} mandatory={true} extraTip={'String'}/>
  <input 
    class="flex outline-none border border-soft-200 p-2.5 rounded-[10px] apply-class-focus input text-14 font-normal" 
    placeholder="Ex: vermelho"
    type="text"
    bind:value={inputValue}
    onkeydown={handleKeyDown}
    onblur={addToForm}
  />
  
  {#if form.length > 0}
    <div class="flex flex-wrap gap-2 mt-2">
      {#each form as item, i}
        <div class="flex items-center border border-soft-200 rounded-[10px] px-2 py-1">
          <span class="text-sub-600 text-12 font-medium">{item}</span>
          <button class="flex items-center justify-center -mt-1.5" onclick={() => removeFromForm(i)}>
            <SvgClose/>
          </button>
        </div>
      {/each}
    </div>
  {/if}
</div>