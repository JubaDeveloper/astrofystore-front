<script lang="ts">
  import Avatar from "$components/assets/avatar/Avatar.svelte";
  interface Props {
    users: {
      name: string;
      src: string;
    }[];
    size?: string;
    maskSize?: string;
  }
  //LEIA ISSO ANTES DE MEXERS NESSES PROPS PELO AMOR DE DEUS

  // Para fazer  o efeito de mascara, substitua os "13px" por (TAMANHO DO AVATAR / 2 + 1PX)
  //Em circle at "px" coloque o tamanho do avatar menos 1 ou 2 px
  let {
    users,
    size = "w-[24px]",
    maskSize = "circle at 24px,transparent 13px",
  }: Props = $props();

  //17px is the radius of the mask. Its calculation is half of our avatar component (32px / 2), plus 1px otherwise you won’t be able to see it with the following avatar on top of it (you can add more than 1px for a bolder effect).
  //41px it’s the 3/4th of our avatar element (32px * 3/4 = 24px) + the radius of the mask (17px)
</script>

<div class="flex items-center">
  {#each users.slice(0,5) as user, i}
    {#if i <= 3}
      <div
        class="flex not-first:-ml-2 aspect-square"
        style={i < users.length - 1
          ? `mask: radial-gradient(${maskSize},white 0);`
          : ""}
      >
        <Avatar
          textSize="text-[11px]"
          src={user.src}
          hasTitle={true}
          name={user.name}
          {size}
        />
      </div>
    {/if}
    {#if i > 3}
      <span class="">
        <p
          class="text-14 font-medium text-sub-600 bg-weak-50 rounded-full -ml-2 px-1 py-0.5"
        >
          +{users.length - 3}
        </p>
      </span>
    {/if}
  {/each}
</div>
