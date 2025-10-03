<script lang="ts">
    import type {Snippet} from "svelte";

    interface Props {
        children: Snippet,
        status: string,
    }

    let {children, status}:Props = $props()
</script>

<button class="flex items-center gap-1 text-12 text-sub-600 font-medium border border-soft-200 py-1 px-2 rounded-[6px]">
    {@render children()}
    {status}
</button>