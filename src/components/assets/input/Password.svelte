<script lang="ts">
  import InputWrapper from "$components/elements/wrappers/InputWrapper.svelte";
  import SvgCadeado from "$components/assets/svg//SvgCadeado.svelte";
  import SvgEye from "$components/assets/svg//SvgEye.svelte";
  import SvgEyeClosed from "$components/assets/svg//SvgEyeClosed.svelte";
  import sinalizador from "$lib/utils/signal.svelte";

  interface Props {
    value: string;
    label: string;
    onEnter?:VoidFunction
    subLabel?:string;
    placeholder?: string;
    mandatory?: boolean;
    tip?: string;
    validate?: () => string;
    sanitize?: (value: string) => string;
    withEye?:boolean
    disabled?: boolean;
  }

  let {
    value = $bindable(),
    label,
    mandatory = false,
    tip,
    onEnter = () => {},
    placeholder,
    withEye=true,
    sanitize,
    disabled,
    subLabel,
	validate = ()=> "",
  }: Props = $props();

  let error = $state<string>("")

  let showPass = $state<boolean>();
  

  $effect(() => {
    if (sanitize) {
      value = sanitize(value);
    }
  });
  $effect(()=>{
    if(sinalizador.signal.tipo==="validarInputs"){
      error=validate()
    }
  })
</script>

<InputWrapper bind:error {label} {value} {subLabel} {mandatory} {tip}>
  <div
    class="flex px-3 text-[14px] h-[40px] max-h-[40px] font-normal  items-center gap-2 rounded-[10px] apply-class-focus"
    data-disabled={disabled ? true : null}
    data-error={error && error.length > 0 ? true : null}
  >
    <SvgCadeado props={{
      class:"w-[13.5px] h-[13.5px] shrink-0"
    }}/>
    {#if showPass}
      {@render input("text")}
    {:else}
      {@render input("password")}
    {/if}
    {#if withEye}
    <button class="absolute right-4" tabindex="-1" onclick={() => (showPass = !showPass)}>
      {#if !showPass}
        <SvgEyeClosed/>
      {:else}
        <SvgEye/>
      {/if}
    </button>
    {/if}
  </div>
</InputWrapper>

{#snippet input(tipo: string)}
  <input
    {disabled}
    type={tipo}
    name="input"
    bind:value
    {placeholder}
    onfocus={() => {error=""}}
    onblur={() => {
      if (value.length > 0) error = validate();
    }}
    onkeydown={(e)=>{
      if(e.key==="Enter") onEnter()
    }}
    class="w-full outline-none  text-[14px]"
  />
{/snippet}
