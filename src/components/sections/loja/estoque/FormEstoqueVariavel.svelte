<script lang="ts">
  import Atributos from '$components/sections/estoque/Atributos.svelte';
  import Tutorial from '$components/sections/estoque/Tutorial.svelte';
  import Variacoes from '$components/sections/estoque/Variacoes.svelte';

</script>

<div class="flex items-start  gap-5 w-full">
  <div class="flex flex-col gap-3">
    <Atributos/>
    <Tutorial/>
  </div>
  <Variacoes/>
</div>
