<script lang="ts">
  import Botao from "$components/assets/buttons/Botao.svelte";
  import Input from "$components/assets/input/Input.svelte";
    import InputMultiplos from "$components/assets/input/InputMultiplos.svelte";
  import PopUp from "$components/assets/modals/PopUp.svelte";
  import SvgClose from "$components/assets/svg/SvgClose.svelte";

  interface Form {
    nome: string,
    variacoes: string[]
  }

  interface Props {
    open: boolean,
    loading?: boolean,
    click: VoidFunction,
    formVariacoes: Form
  }

  let {
    open = $bindable(false),
    loading,
    click,
    formVariacoes = $bindable()
  } : Props = $props()

</script>

<PopUp bind:open withCloseButton={false} withDefaultPadding={false}>
  <div class="flex flex-col border border-soft-200 overflow-hidden p-4 pt-[10px] rounded-[16px] w-[640px] px-0 gap-4">
    <div class="flex w-full items-center justify-between px-4">
      <p class="text-16 font-medium text-strong-950">{'Cadastrar Atributo'}</p>
      <button onclick={()=> open = !open}>
        <SvgClose/>
      </button>
    </div>

    <div class="border-b border-soft-200"></div>

    <div class="flex flex-col gap-3 px-5">
      <Input label="Nome do atributo" placeholder="Ex: cor" mandatory={true} bind:value={formVariacoes.nome} extraTip={'String'}/>
      <InputMultiplos bind:form={formVariacoes.variacoes}/>
    </div>

    <div class="w-full h-[1px] bg-soft-200"></div>
    <div class="grid grid-cols-2 gap-3 px-4 h-[40px]">
      <Botao onClick={()=> open = false} tema={"transparent"}>
        Voltar
      </Botao>
      <Botao onClick={click} {loading} tema={"primary"}>
        Castrar
      </Botao>
    </div>
  </div>
</PopUp>