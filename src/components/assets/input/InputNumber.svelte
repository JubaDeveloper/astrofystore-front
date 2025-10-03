<script lang="ts">
  import InputWrapper from "$components/elements/wrappers/InputWrapper.svelte";
  import sinalizador from "$lib/utils/signal.svelte";
  import SvgBandeiraBrasil from '$components/assets/svg/SvgBandeiraBrasil.svelte';

  interface Props {
    value: number | null;
    label: string;
    placeholder?: string;
    mandatory?: boolean;
    tip?: string;
    disabled?: boolean;
    sanitize?: (value: string) => number;
    validate?:(v?:string)=>string;
    extraTip?:string;
  }

  let {
    value = $bindable(),
    label,
    mandatory = false,
    tip,
    sanitize,
    validate = () => "",
    placeholder = '100',
    disabled,
    extraTip,
  }: Props = $props();

  let error = $state("")

  $effect(() => {
    if (sanitize) {
      value = sanitize(value ? value.toString() : "0");
    }
  });

  $effect(()=>{
      if(sinalizador.signal.tipo==="validarInputs"){
          error=validate()
      }
  })
</script>

<InputWrapper {label} {value} {error} {mandatory} {tip} {extraTip}>
  <div class="flex px-3 pr-1 text-[14px] h-[40px] max-h-[40px] font-normal items-center gap-2 rounded-[10px] apply-class-focus input">
      <input
          type="number"
          bind:value={value}
          {placeholder}
          disabled={disabled}
          onfocus={()=> error=""}
          onblur={()=>{error = validate()
          }}
          class="w-full outline-none text-[14px] disabled:text-disabled-300"
      />
  </div>
</InputWrapper>

<style>
  /* Remove spin buttons em todos os navegadores */
  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
      -webkit-appearance: none;
      margin: 0;
  }
  input[type="number"] {
      -moz-appearance: textfield;
  }
</style>