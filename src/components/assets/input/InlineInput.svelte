<script lang="ts">
  import type { Component } from "svelte";
  import type { SVGAttributes } from "svelte/elements";
  import SvgLapis from "../svg/SvgLapis.svelte";
  import SvgX from "../svg/SvgX.svelte";
  import SvgCheckMin from "../svg/SvgCheckMin.svelte";
 
  interface Props {
    value: string;
    placeholder: string;
    Icon?: Component<{ props?: SVGAttributes<SVGSVGElement> }>;
    validate?: () => string;
    disabled?: boolean;
    onDone: (value: string) => void;
  }

  let {
    value = $bindable(),
    validate = () => "",
    placeholder,
    Icon,
    disabled,
    onDone,
  }: Props = $props();

  let error = $state<string>("");

  const fillIcon = () => {
    if (disabled) {
      return "fill-disabled-300";
    }
    return "fill-sub-600";
  };

  let editMode = $state<boolean>(false)
  let tmpValue = $state<string>(value)
 


</script>

<div
  class="flex p-2 pr-2 px-4 text-[14px] h-[40px] max-h-[40px] font-normal items-center gap-2 rounded-[10px] apply-class-focus"
  data-disabled={disabled ? true : null}

  data-error={error && error.length > 0 ? true : null}
>
  {#if Icon}
    <Icon
      props={{
        class: `${fillIcon()} h-[18px]`,
      }}
    />
  {/if}
  <input
    disabled={disabled || !editMode}
    type="text"
    name="input"
    bind:value={tmpValue}
    {placeholder}
    onfocus={() => (error = "")}
    onblur={() => {
      if (value.length > 0) error = validate();
    }}
    class="w-full outline-none text-strong-950 placeholder:text-soft-400 text-[14px] disabled:text-disabled-300"
  />

    <div class="flex items-center gap-1">

        {#if editMode}
            <button class="p-2" onclick={()=>{
                editMode=false
                tmpValue = value
            }}>
                <SvgX props={{
                    class: fillIcon()+" hover:fill-strong-950"
                }}/>  
            </button>

            <button class="p-2" onclick={()=>{
                onDone(value);
                value = tmpValue
                editMode=false
            }}>
                <SvgCheckMin props={{
                    class: fillIcon()+" hover:fill-strong-950",
                    width:12,
                    height:12
                }}/>
            </button>
        {:else}
            <button disabled={disabled} onclick={()=>editMode=true} class="p-2">
                <SvgLapis props={{
                    class: fillIcon()
                }}/>            
            </button>
        {/if}

    </div>
    
    
</div>
