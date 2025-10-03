<script lang="ts">
    import type { Component } from "svelte";
    import type { SVGAttributes } from "svelte/elements";
    import InputWrapper from "$components/elements/wrappers/InputWrapper.svelte";
  import SvgX from "../svg/SvgX.svelte";
  import { slide } from "svelte/transition";
  
    interface Props {
      tags: string[];
      label: string;

      subLabel?:string;
      placeholder: string;
      Icon?: Component<{ props?: SVGAttributes<SVGSVGElement> }>;
      mandatory?: boolean;
      tip?: string;
      validate?:()=>string;
      disabled?: boolean;
    }
  
    let {
      tags = $bindable(),
      label,
      mandatory = false,
      tip,
      validate = () => "",
      subLabel,
      placeholder,
      Icon,
      disabled,
    }: Props = $props();
  
    let error = $state<string>("")
    let value = $state("")

    $effect(() => {
      if (value) {
        error=""
    }
    });
  </script>
  
  <InputWrapper bind:error {label} {value} {subLabel} {mandatory} {tip}>
    <div
      class="flex p-2 px-4 text-[14px] h-[40px] max-h-[40px] font-normal items-center gap-2 rounded-[10px] apply-class-focus"
      data-disabled={disabled ? true : null}

      data-error={error && error.length > 0 ? true : null}
    >
      {#if Icon}
        <Icon
          props={{
            class: `${disabled ? "fill-disabled-300" : "fill-sub-600"} h-[18px]`,
          }}
        />
      {/if}
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
        if(e.key==="Enter"){
            if(tags.some((obj)=>obj===value)){
                error="Valor já adicionado"
                return
            }
            if(!value) return
            tags.push(value)
            value=""
        }
        }}
        class="w-full outline-none  text-[14px]"
      />
    </div>

    <div class="flex items-center flex-wrap gap-y-2 mt-1">
        {#each tags as tag,_ (tag)} 
            <span class="flex whitespace-nowrap overflow-hidden mr-2 items-center gap-1 border border-soft-200 pl-2 py-1 leading-5 pr-1 rounded-md text-sub-600" transition:slide={{axis:"x"}}>
                {tag}                
                <button class="p-1" onclick={()=>tags = tags.filter((obj)=>obj!==tag)}>
                    <SvgX props={{
                        class:"fill-sub-600"
                    }}/>
                </button>
            </span>
        {/each}
    </div>

  </InputWrapper>
  