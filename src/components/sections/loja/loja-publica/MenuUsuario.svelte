<script lang="ts">
  import { goto } from "$app/navigation";
  import Avatar from "$components/assets/avatar/Avatar.svelte";
  import Botao from "$components/assets/buttons/Botao.svelte";
  import DropBlock from "$components/assets/logic/DropBlock.svelte";
  import FocusBlock from "$components/assets/logic/FocusBlock.svelte";
  import SvgBag from "$components/assets/svg/SvgBag.svelte";
  import SvgCaret from "$components/assets/svg/SvgCaret.svelte";
  import SvgDefaultUser from "$components/assets/svg/SvgDefaultUser.svelte";
  import SvgLogout from "$components/assets/svg/SvgLogout.svelte";
  import SvgUserThree from "$components/assets/svg/SvgUserThree.svelte";
  import storageService from "$lib/utils/storageService";
  import toast from "$lib/utils/toast.svelte";
  import { onMount } from "svelte";

  let open = $state(false);
  let nomeDelu: string = $state("");

  let opcoes = $state([
    {
      icon: SvgUserThree,
      name: "Meu Perfil",
      click: () => {
        open = false;
      },
    },
    {
      icon: SvgBag,
      name: "Minhas Compras",
      click: () => {
        open = false;
        goto("/minhas-compras");
      },
    },
    {
      icon: SvgLogout,
      name: "Logout",
      click: () => {
        toast.alert("Notificação do sistema", "Você foi deslogado com sucesso");
        storageService.clearAllStoredData();
        goto("/login");
      },
    },
  ]);

  onMount(() => {
    nomeDelu = storageService.getStoredData("astronfy-user").nome;
  });
</script>

<FocusBlock bind:isFocus={open} className="relative flex w-auto">
  <Botao
    tema="gray-transparent"
    onClick={() => (open = !open)}
    defaultPadding={false}
  >
    <div class="px-1 shrink-0 flex items-center gap-2 p-1 pr-2">
      <Avatar src="" name={nomeDelu} size="h-[30px]" rounded="rounded-md" />
      <span class="text-14 text-strong-950 font-medium">{nomeDelu}</span>
      <SvgCaret
        props={{
          class: `${open ? "rotate-180" : ""}`,
        }}
      />
    </div>
  </Botao>
  <DropBlock
    className="flex flex-col min-w-[200px] whitespace-nowrap absolute top-[110%] rounded-[8px] right-0 shadow-md border border-soft-200 p-1 bg-white-0"
    isDrop={open}
  >
    {#each opcoes as { icon: Icon, name, click }, i}
      <button
        class="flex items-center justify-start gap-2 text-12 text-sub-600 font-medium p-2 rounded-[6px] hover:bg-weak-50"
        onclick={click}
      >
        <div class="shrink-0">
          <Icon props={{ fill: "#525866" }} />
        </div>
        {name}
      </button>
    {/each}
  </DropBlock>
</FocusBlock>
