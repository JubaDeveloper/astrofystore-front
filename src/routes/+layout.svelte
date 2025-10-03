<script lang="ts">
	import '../app.css';
    import Toaster from '$components/elements/toast/Toaster.svelte';
    import dev from '$lib/settings/dev.svelte';
  	import BannerLayout from '$components/elements/toast/BannerLayout.svelte';
    import storageService from '$lib/utils/storageService';
  import ModalAvisoGenerico from '$components/sections/modals/ModalAvisoGenerico.svelte';
  import ModalActionGenerico from '$components/sections/modals/ModalActionGenerico.svelte';
	
	let { children } = $props();

	// console.log(storageService.getStoredData("astronfy-token"))

</script>

<svelte:head>
	<title> {dev.getTitleUrl()} </title>
	<link rel="stylesheet" href="/themes/light.css"/>
	<link rel="stylesheet" href="/themes/root.css"/>	
</svelte:head>

<Toaster/>
<BannerLayout/>
<ModalAvisoGenerico/>
<ModalActionGenerico/>
<div class="w-screen h-svh overflow-x-hidden overflow-y-auto text-strong-950 bg-white-0">
	{@render children()}
</div>