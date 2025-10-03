<script lang="ts">
    import Avatar from '$components/assets/avatar/Avatar.svelte';

    interface Props {
        url: string;
        nome: string;
        email: string;
        size?:string;
    }

    let {url, nome, email,size="w-10"}: Props = $props();
</script>

<div class="flex items-start gap-3 w-full">
    <Avatar name={nome} src={url} {size}/>
    <div class="flex flex-col items-start">
        <p class="text-[14px] font-medium text-strong-950">{nome}</p>
        {#if email}
            <p class="text-[12px] font-normal text-sub-600">{email}</p>
        {/if}
    </div>
</div>