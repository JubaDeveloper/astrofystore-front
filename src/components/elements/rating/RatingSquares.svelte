<script lang="ts">

  interface Props{
    maxScore:number,
    score:number,
  }

  let {score = $bindable(),maxScore} = $props()

  let scoreHover = $state<number>(-1);

</script>

<div class="flex items-center justify-between gap-0">
  {#each { length: maxScore } as _, i}
    <button
      class="shrink-0 h-[30px] w-4 px-1 grow group"
      onclick={() => (score = i)}
      onmouseenter={() => (scoreHover = i)}
      onmouseleave={() => (scoreHover = -1)}
      aria-label={score.toString()}
    >
      <div
        class="h-full w-full data-[active]:bg-success-base bg-soft-400 hover:bg-success-base"
        data-active={(() => {
          if (i <= score || i <= scoreHover) {
            if (scoreHover !== -1) {
              if (i <= scoreHover) {
                return true;
              }
              return null;
            }
            return true;
          }
          return null;
        })()}
      ></div>
    </button>
  {/each}
</div>
