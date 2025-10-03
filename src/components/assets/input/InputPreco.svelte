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
      validate?:(v?:string)=>string;
      extraTip?:string;
      mostrar?: boolean;
  }

  let {
      value = $bindable(0),
      label,
      mandatory = false,
      tip,
      validate = () => "",
      placeholder = 'R$ 0.00',
      disabled,
      extraTip,
      mostrar = true
  }: Props = $props();

  let error = $state("")

  $effect(()=>{
      if(sinalizador.signal.tipo==="validarInputs"){
          error=validate()
      }
  })

  const handleInput = (event: Event) => {
    const input = event.target as HTMLInputElement;
    const raw = input.value.replace(/\D/g, '');

    if (raw.length <= 2) {
      input.value = raw;
      value = parseInt(raw) || 0;
    } else {
      const inteiro = raw.slice(0, -2);
      const decimal = raw.slice(-2);
      const formatted = `${parseInt(inteiro)}.${decimal}`;

      input.value = formatted;
      value = parseFloat(formatted);
    }
  };
</script>

<InputWrapper {label} {value} {error} {mandatory} {tip} {extraTip}>
  <div class="flex px-3 pr-1 text-[14px] h-[40px] max-h-[40px] font-normal items-center gap-2 rounded-[10px] apply-class-focus input">
      R$
      <input
          type="number"
          bind:value={value}
          {placeholder}
          {disabled}
          oninput={handleInput}
          onfocus={()=> error=""}
          onblur={()=>{error = validate()
          }}
          class="w-full outline-none text-[14px] disabled:text-disabled-300"
      />
      {#if mostrar}
        <div class="flex items-center gap-2 border-l border-soft-200 p-2.5">
          <SvgBandeiraBrasil/>
          <span class="text-14 font-medium text-strong-950">BRL</span>
        </div>
      {/if}
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
      appearance: textfield;
  }
</style>