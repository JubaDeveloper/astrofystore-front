<script lang="ts">
  import InputWrapper from "$components/elements/wrappers/InputWrapper.svelte";
  import sinalizador from "$lib/utils/signal.svelte";

  interface Props {
      value: string | null;
      label: string;
      placeholder?: string;
      mandatory?: boolean;
      tip?: string;
      disabled?: boolean;
      validate?:(v?: string | null)=>string;
      extraTip?:string;
  }

  let {
      value = $bindable(null),
      label,
      mandatory = false,
      tip,
      validate = () => "",
      placeholder = 'DD/MM/AAAA',
      disabled,
      extraTip,
  }: Props = $props();

  let error = $state("")
  let displayValue = $state(value ? formatToDisplay(value) : "");

  // Converte de ISO (YYYY-MM-DD) para display (DD/MM/YYYY)
  function formatToDisplay(isoDate: string | null): string {
    if (!isoDate) return "";
    const [year, month, day] = isoDate.split('-');
    return `${day}/${month}/${year}`;
  }

  // Converte de display (DD/MM/YYYY) para ISO (YYYY-MM-DD)
  function formatToISO(displayDate: string): string | null {
    if (displayDate.length !== 10) return null;
    const [day, month, year] = displayDate.split('/');
    return `${year}-${month}-${day}`;
  }

  function handleInput(e: Event) {
    const input = e.target as HTMLInputElement;
    let rawValue = input.value.replace(/\D/g, '');
    
    // Formata como DD/MM/AAAA
    if (rawValue.length > 2 && rawValue.length <= 4) {
      rawValue = rawValue.slice(0, 2) + '/' + rawValue.slice(2);
    } else if (rawValue.length > 4) {
      rawValue = rawValue.slice(0, 2) + '/' + rawValue.slice(2, 4) + '/' + rawValue.slice(4, 8);
    }
    
    if (rawValue.length > 10) {
      rawValue = rawValue.slice(0, 10);
    }
    
    displayValue = rawValue;
    input.value = rawValue;
    
    value = rawValue.length === 10 ? formatToISO(rawValue) : null;
  }

  function handleKeyDown(e: KeyboardEvent) {
    if ([
      'Backspace', 'Delete', 'Tab', 'ArrowLeft', 'ArrowRight', 
      'ArrowUp', 'ArrowDown', 'Home', 'End'
    ].includes(e.key)) {
      return;
    }
    
    if (!/\d/.test(e.key)) {
      e.preventDefault();
    }
  }

  function handleBlur() {
    if (displayValue.length > 0 && displayValue.length < 10) {
      error = "Data incompleta. Use o formato DD/MM/AAAA";
    } else {
      error = validate?.(value) || "";
    }
  }

  $effect(() => {
    if(sinalizador.signal.tipo === "validarInputs") {
      error = validate?.(value) || "";
    }
  })

  $effect(() => {
    displayValue = formatToDisplay(value);
  })
</script>

<InputWrapper {label} {value} {error} {mandatory} {tip} {extraTip}>
  <div class="flex px-3 pr-1 text-[14px] h-[40px] max-h-[40px] font-normal items-center gap-2 rounded-[10px] apply-class-focus input">
      <input
          type="text"
          value={displayValue}
          {placeholder}
          disabled={disabled}
          oninput={handleInput}
          onkeydown={handleKeyDown}
          onblur={handleBlur}
          onfocus={() => error = ""}
          maxlength="10"
          class="w-full outline-none text-[14px] disabled:text-disabled-300"
      />
  </div>
</InputWrapper>