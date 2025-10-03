<script lang="ts">
  import LoaderMinhoca from "./LoaderMinhoca.svelte";

  interface Props{
    label:string
  }
  let {label}:Props = $props()

</script>
<div class="w-full grow  h-full items-center flex flex-col gap-2 justify-center">
    <div class="h-[70px]">
        <LoaderMinhoca/>                       
    </div>
    <span class="text-sub-600 text-[16px]">
        {label}
    </span>
</div>