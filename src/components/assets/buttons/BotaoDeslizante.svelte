<script lang='ts'>
    import type { AnyPrimitive, Option } from '$lib/utils/types';
    import type {Component} from 'svelte';

    interface Props {
        opcoes: Option[];
        onChange?:VoidFunction
        value: AnyPrimitive
    }

    let {opcoes, value = $bindable(),onChange}: Props = $props();
</script>

<div class="bg-weak-50 p-1 rounded-[10px]  flex w-auto">
    {#each opcoes as opcao, i}
        <button
            onclick={() => {
                value=opcao.value
                if(onChange)
                    onChange()
            }}
            class="flex grow items-center justify-center gap-1.5 py-1 px-5 rounded-[6px] 
            {value===opcao.value ? 'bg-white-0 text-strong-950 shadow-md' : 'text-soft-400'} font-medium text-[14px] transition-colors duration-200"
        >
            {opcao.label}
        </button>
    {/each}
</div>