<script lang="ts">
    import type { Component } from "svelte";
    import type { SVGAttributes } from "svelte/elements";
    import InputWrapper from "$components/elements/wrappers/InputWrapper.svelte";
  import SvgSearch from "../svg/SvgSearch.svelte";
  
    interface Props {
      value: string;
      label: string;
      posicaoLupa?:"esquerda" | "direita"
      subLabel?:string;
      placeholder: string;
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
      subLabel,
      mandatory = false,
      posicaoLupa = "esquerda",
      tip,
      validate = () => "",
      placeholder,
      disabled,
      onEnter,
    }: Props = $props();
  
    let error = $state<string>("")
  
  </script>
  
  <InputWrapper bind:error {label} {subLabel} {value} {mandatory} {tip}>
    <div
      class="flex p-2 px-4 text-[14px] h-[40px] max-h-[40px] font-normal items-center gap-2 bg-white-0 rounded-[10px] 
      apply-class-focus"
      data-disabled={disabled}
      data-error={error && error.length > 0 ? true : null}
    >
        <button onclick={()=>onEnter ? onEnter(value) : ()=>{}} class="{posicaoLupa == 'direita' ? "order-3" : "order-1"}"> 
            <SvgSearch
            props={{
                class: `${disabled ? "fill-disabled-300" : "fill-sub-600"} h-[18px]`,
            }}
            />                
        </button>

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
        class="order-2 w-full outline-none text-strong-950 placeholder:text-soft-400 text-[14px] disabled:text-disabled-300"
      />
    </div>
  </InputWrapper>
  