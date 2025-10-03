<script lang="ts">
  import { beforeNavigate, goto, onNavigate } from "$app/navigation";
  import storageService from "$lib/utils/storageService";
  import { onMount } from "svelte";

  onMount(() => goto("/login"))

</script>


