<script lang="ts">
    import type { Component } from "svelte";
    import type { SVGAttributes } from "svelte/elements";
    import InputWrapper from "$components/elements/wrappers/InputWrapper.svelte";
  import SvgShare from "../svg/SvgShare.svelte";
  import SvgCopy from "../svg/SvgCopy.svelte";
  import toast from "$lib/utils/toast.svelte";
  import sinalizador from "$lib/utils/signal.svelte";
    import SvgIconPix from "../svg/SvgIconPix.svelte";
    import { copiarTexto } from "$lib/utils/utils.svelte";
  
    interface Props {
      value: string;
      label: string;
      dominio:string;
      comPrefixo?:boolean;
      subLabel?:string;
      viewOnly?:boolean;
      placeholder: string;
      Icon?: Component<{ props?: SVGAttributes<SVGSVGElement> }>;
      mandatory?: boolean;
      tip?: string;
      extraTip?:string;
      validate?:()=>string;
      disabled?: boolean;
      sanitize?: (value: string) => string;
      onEnter?: (value: string) => void;
    }
  
    let {
      value = $bindable(),
      label,
      viewOnly,
      comPrefixo=true,
      extraTip,
      dominio="",
      mandatory = false,
      tip,
      validate = () => "",
      placeholder,
      Icon,
      disabled,
      sanitize,
      subLabel,
      onEnter,
    }: Props = $props();
  
    let error = $state<string>("")

    $effect(()=>{
      if(sinalizador.signal.tipo==="validarInputs"){
        error=validate()
      }
    })
    $effect(() => {
      if (sanitize) {
        value = sanitize(value);
      }
    });
  

  
</script>

<InputWrapper bind:error {label} {extraTip} {subLabel} {value} {mandatory} {tip}>
  <div class="flex items-center gap-2">
    <div
        class="flex text-[14px] h-[40px] overflow-hidden max-h-[40px] w-full font-normal items-center gap-2 rounded-[10px] apply-class-focus input" 
        data-disabled={disabled}
        data-error={error && error.length > 0 ? true : null}
      >
      
        {#if comPrefixo}
          <div class="relative flex items-center in-focus-within:text-sub-600 text-soft-400  h-full px-4 border-r border-soft-200">
                https://
          </div>
        {/if}

        <input
          {disabled}
          type="text"
          name="input"
          bind:value
          {placeholder}
          onfocus={()=> error=""}
          onblur={async()=>{
            if(value.length>0)
              error = await validate()
          }}
          onkeydown={(e)=>{
          if(e.key==="Enter" && onEnter){
            onEnter(value)
          }
          }}
          class=" w-full outline-none m-2 {viewOnly ? "pointer-events-none" : ""} text-[14px]"
        />

        {#if dominio}
          <div class="relative flex items-center in-focus-within:text-sub-600 text-strong-950  h-full px-2 border-l border-soft-200">
            {dominio}
          </div>
        {/if}

      </div>
      <button class="border border-soft-200 hover:border-strong-950 rounded-[10px]" onclick={()=> copiarTexto('astrofystorestore.com.br/' + value)}>
        <SvgIconPix/>
      </button>
  </div>
  
</InputWrapper>