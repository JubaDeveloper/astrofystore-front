<script lang="ts">
    interface Props {
        qtd: number,
        value: string
    }

    let { qtd, value = $bindable() }: Props = $props()

    let inputs = $state<HTMLInputElement[]>([])

    function updateValue() {
        let tmp = ""
        inputs.forEach((i) => {
            if (i) tmp += i.value
        })
        
        if (tmp !== value) {
            value = tmp
        }
    }
</script>

<div class="flex items-center gap-2">
    {#each {length: qtd} as _, i}
        <input 
            type="text" 
            bind:this={inputs[i]} 
            class="rounded-[10px] w-[57px] h-[64px] shrink-0 text-[24px] text-center outline outline-soft-200 border border-transparent focus-within:border-strong-950 bg-white-0" 
            oninput={updateValue}
            onkeydown={(e) => {
                e.preventDefault()
                const target = e.target as HTMLInputElement
                
                if (e.key === "ArrowLeft" || e.key === "Backspace") {
                    if (e.key === "Backspace") {
                        target.value = ""
                        updateValue()
                    }
                    if (i > 0) inputs[i-1]?.focus()
                    return
                }

                if (e.key === "ArrowRight" && i < qtd - 1) {
                    inputs[i+1]?.focus()
                    return
                }

                if (e.key === "Delete" || e.key.length > 1) {
                    return
                }

                if (!target.value) {
                    target.value = e.key
                    updateValue()
                }

                if (i < qtd - 1) {
                    setTimeout(() => {
                        inputs[i+1]?.focus()
                    }, 10)
                }
            }}
        />
    {/each}
</div>