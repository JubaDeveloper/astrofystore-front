<script lang="ts">
  import type { Component } from "svelte";
  import type { SVGAttributes } from "svelte/elements";
  import InputWrapper from "$components/elements/wrappers/InputWrapper.svelte";
  import sinalizador from "$lib/utils/signal.svelte";

  interface Props {
    value: string;
    label: string;
    subLabel?:string;
    placeholder: string;
    error?:string;
    Icon?: Component<{ props?: SVGAttributes<SVGSVGElement> }>;
    Icon2?: Component<{ props?: SVGAttributes<SVGSVGElement> }>;
    mandatory?: boolean;
    onChange?:(e:Event)=>void;
    tip?: string;
    extraTip?:string;
    validate?:(v?:string)=>string | Promise<string>;
    disabled?: boolean;
    sanitize?: (value: string) => string;
    onEnter?: (value: string) => void;
    errorAlways?:boolean
  }

  let {
    value = $bindable(),
    label,
    mandatory = false,
    subLabel,
    errorAlways=false,
    tip,
    error=$bindable(""),
    extraTip,
    onChange = () => {},
    validate = () => "",
    placeholder,
    Icon,
    Icon2,
    disabled,
    sanitize,
    onEnter,
  }: Props = $props();


  $effect(() => {
    if (sanitize) {
      value = sanitize(value);
    }
  });

  async function validarAll(){
    error= await validate()
  }

  $effect(()=>{
    if(sinalizador.signal.tipo==="validarInputs"){
      validarAll()
    }
  })



</script>

<InputWrapper bind:error {label} {extraTip} {value} {subLabel} {mandatory} {tip}>
  <div
    class="flex px-3 text-[14px] h-[40px] max-h-[40px] font-normal items-center gap-2  rounded-[10px] apply-class-focus input" 
    data-disabled={disabled ? true : null}
    data-error={error && error.length > 0 ? true : null}
  >
    {#if Icon}
      <Icon
        props={{
          width:17,
          height:15
        }}
      />
    {/if}
    <input
      {disabled}
      type="text"
      name="input"
      bind:value
      {placeholder}
      oninput={async(e)=>{
        onChange(e);
        if(errorAlways)
          error = await validate()
      }}
      onfocus={()=>{

        if(!errorAlways){
          error=""
        }
      }}
      onblur={async()=>{
        if(value.length>0)
          error = await validate()
      }}
      onkeydown={async(e)=>{
      if(e.key==="Enter" && onEnter){
        onEnter(value)
      }
      }}
      class="w-full outline-none text-[14px] disabled:text-disabled-300"
    />

    {#if Icon2}
      <Icon2
        props={{
          width:17,
          height:15
        }}
      />
    {/if}
  </div>
</InputWrapper>
