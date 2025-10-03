<script lang='ts'>
    interface Props {
        opcoes?: string[],
    }

    const header: string[] = []

    let {opcoes = header}: Props = $props();
</script>

<thead class="bg-weak-50 rounded-[8px] w-full">
    <tr class="flex items-center w-full gap-10">
        {#each opcoes as opcao, i}
            <th class="text-[14px]  px-6 py-2 font-normal text-sub-600 flex items-start {i === 0 ? 'w-[80%]' : 'w-[20%]'}">
                {opcao}
            </th>
        {/each}
    </tr>
</thead>