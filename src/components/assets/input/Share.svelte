<script lang="ts">
    import type { Component } from "svelte";
    import type { SVGAttributes } from "svelte/elements";
    import InputWrapper from "$components/elements/wrappers/InputWrapper.svelte";
  import SvgShare from "../svg/SvgShare.svelte";
  import SvgCopy from "../svg/SvgCopy.svelte";
  import toast from "$lib/utils/toast.svelte";
  
    interface Props {
      value: string;
      label: string;

      subLabel?:string;
      placeholder: string;
      Icon?: Component<{ props?: SVGAttributes<SVGSVGElement> }>;
      mandatory?: boolean;
      tip?: string;
      validate?:()=>string;
      disabled?: boolean;
      sanitize?: (value: string) => string;
      onEnter?: (value: string) => void;
    }
  
    let {
      value = $bindable(),
      label,
      mandatory = false,
      tip,
      subLabel,
      validate = () => "",
      placeholder,
      Icon,
      disabled,
      sanitize,
      onEnter,
    }: Props = $props();
  
    let error = $state<string>("")

    $effect(() => {
      if (sanitize) {
        value = sanitize(value);
      }
    });
  

    const fillIcon = () => {
        if(error){
          return "fill-error-base"
        }
        if(disabled){
          return "fill-disabled-300"
        }
        return "fill-sub-600"
    }

    const copy = () => {
        navigator.clipboard.writeText(value).then(()=>{
            toast.success("Texto copiado na clipboard","")
        })
    }  
  
  </script>
  
  <InputWrapper bind:error {label} {value} {subLabel} {mandatory} {tip}>
    <div
      class="flex text-[14px] h-[40px] overflow-hidden max-h-[40px] font-normal items-center gap-2 rounded-[10px] apply-class-focus" 
      data-disabled={disabled ? true : null}

      data-error={error && error.length > 0 ? true : null}
    >
        <SvgShare props={{
          class: `${fillIcon()} h-[18px]   ml-4`,
        }}/>
      <input
        {disabled}
        type="text"
        name="input"
        bind:value
        {placeholder}
        onfocus={()=> error=""}
        onblur={()=>{
          if(value.length>0)
            error = validate()
        }}
        onkeydown={(e)=>{
        if(e.key==="Enter" && onEnter){
          onEnter(value)
        }
        }}
        class=" w-full outline-none my-2 text-[14px]"
      />
      <button class="relative h-full px-4 border-l border-soft-200 disabled:cursor-default" disabled={disabled} onclick={copy}>
            <SvgCopy props={{
                class: `${disabled ? "fill-disabled-300" : "fill-sub-600"} h-[18px]`,
            }}/>
      </button>

    </div>
  </InputWrapper>
  