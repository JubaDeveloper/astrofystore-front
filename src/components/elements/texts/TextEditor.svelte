<script lang="ts">
    import SvgItalicText from "$components/assets/svg/SvgItalicText.svelte";
    import SvgStrikeOver from "$components/assets/svg/SvgStrikeOver.svelte";
    import SvgUnderline from "$components/assets/svg/SvgUnderline.svelte";
    import SvgBold from "$components/assets/svg/SvgBold.svelte";
    import SvgUl from "$components/assets/svg/SvgUL.svelte";
    import SvgOl from "$components/assets/svg/SvgOL.svelte";

    const formatOptions = [
        { command: 'bold', icon: SvgBold },
        { command: 'italic', icon: SvgItalicText },
        { command: 'underline', icon: SvgUnderline },
        { command: 'strikeThrough', icon: SvgStrikeOver },
        { command: 'insertUnorderedList', icon: SvgUl },
        { command: 'insertOrderedList', icon: SvgOl },
    ]
    const textOptions = [
        { label: 'Parágrafo', value: 'p' },
        { label: 'Header', value: 'h1' },
    ]

    let currentTag = $state('p');
    let content = $state('');

    function format(command:string, value = null) {
        document.execCommand(command, false, value!);
    }
    function changeBlockType(tag:string) {
        document.execCommand('formatBlock', false, tag);
        currentTag = tag;
    }
</script>

{#snippet divider()}
    <div class="h-4 w-0.5 bg-soft-200"></div>
{/snippet}

<div class="flex flex-col gap-4 w-full">
    <div class="flex items-center gap-1 p-0.5 border border-soft-200 w-fit rounded-lg">

        <select class="text-sub-600 text-sm font-medium" onchange="{(e) => changeBlockType((e.target as HTMLSelectElement).value)}" bind:value={currentTag}>
            {#each textOptions as { label, value } }
                <option class="text-sub-600 text-sm font-medium" value={value}>{label}</option>
            {/each}
        </select>

        {@render divider()}

        <div class="">tamanho de fonte</div>

        {@render divider()}

        {#each formatOptions as {command, icon}}
        {@const IconComponent = icon}
            <button onclick={() => format(command)}>
                <IconComponent />
            </button>
        {/each}

        {@render divider()}

    </div>
    <div class="editor border border-soft-200 w-full h-96 rounded-xl p-3 focus:outline-none"
        contenteditable="true" oninput={(e) => content = (e.target as HTMLDivElement).innerHTML} bind:innerHTML={content} ></div>
</div>