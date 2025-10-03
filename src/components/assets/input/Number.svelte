<script lang="ts">
  import InputWrapper from "$components/elements/wrappers/InputWrapper.svelte";
  import sanitizar from "$lib/sanitizers/sanitizer";
  import SvgMinus from "../svg/SvgMinus.svelte";
  import SvgAdd from "../svg/SvgAdd.svelte";

  interface Props {
    value: number;
    label: string;

    subLabel?: string;
    mandatory?: boolean;
    tip?: string;
    validate?: () => string;
    disabled?: boolean;
    limit: number;
    extraTip?: string;
    min?: number;
    buttonsOnly?: boolean;
    onChange?: (novo: number, old: number) => void;
    onEnter?: (value: number) => void;
  }

  let {
    value = $bindable(),
    label,
    subLabel,
    mandatory = false,
    tip,
    limit,
    min = 0,
    buttonsOnly = false,
    validate = () => "",
    onChange = () => "",
    extraTip = "",
    disabled,
    onEnter,
  }: Props = $props();

  let error = $state<string>("");

  function fillIcon() {
    if (disabled) {
      return "fill-disabled-300";
    }
    return "fill-sub-600";
  }
  function add() {
    let tmp = value;
    if (value < limit) {
      value++;
    }
    onChange(value, tmp);
  }
  function minus() {
    let tmp = value;
    if (value > 0 && value > min) {
      value--;
    }
    onChange(value, tmp);
  }
  function handleEnter(e: KeyboardEvent) {
    if (e.key === "Enter" && onEnter) onEnter(value);
  }

  $effect(() => {
    if (value > limit) {
      value = limit;
    }

    if (!value) {
      value = 0;
    }
    value = parseInt(sanitizar.numero(value.toString(), limit));
  });
</script>

<InputWrapper
  {extraTip}
  bind:error
  {label}
  {value}
  {subLabel}
  {mandatory}
  {tip}
>
  <div
    class="font-normal flex p-[2px] xl:p-1 justify-between xl:gap-2 overflow-hidden rounded-[8px] apply-class-focus"
    data-disabled={disabled ? true : null}
    data-error={error && error.length > 0 ? true : null}
  >
    <button
      class="px-2 xl:px-3 outline-transparent"
      tabindex="-1"
      onclick={minus}
    >
      <SvgMinus props={{ class: fillIcon(), width: 14 }} />
    </button>
    <input
      disabled={disabled || buttonsOnly}
      type="text"
      name="input"
      pattern="[0-9]"
      bind:value
      onfocus={() => (error = "")}
      onblur={() => (error = validate())}
      onkeydown={(e) => handleEnter(e)}
      class="w-full outline-none {buttonsOnly &&
        'disabled:text-strong-950'} text-[14px] text-center"
    />

    <button
      class=" px-2 xl:px-3 outline-transparent"
      tabindex="-1"
      onclick={add}
    >
      <SvgAdd props={{ class: fillIcon(), width: 14 }} />
    </button>
  </div>
</InputWrapper>

<style>
  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
    /* display: none; <- Crashes Chrome on hover */
    -webkit-appearance: none;
    margin: 0; /* <-- Apparently some margin are still there even though it's hidden */
  }

  /* input[type=number] {
      -moz-appearance:textfield;
  } */
</style>
