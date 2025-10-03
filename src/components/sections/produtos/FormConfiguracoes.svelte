<script lang="ts">
  import { goto } from '$app/navigation';
  import Avatar from '$components/assets/avatar/Avatar.svelte';
  import Botao from '$components/assets/buttons/Botao.svelte';
  import BotaoDeslizante from '$components/assets/buttons/BotaoDeslizante.svelte';
  import Input from '$components/assets/input/Input.svelte';
  import InputPreco from '$components/assets/input/InputPreco.svelte';
  import TextArea from '$components/assets/input/TextArea.svelte';
  import Label from '$components/assets/labels/Label.svelte';
  import FillText from '$components/assets/limiter/FillText.svelte';
  import SelectBlock from '$components/assets/logic/SelectBlock.svelte';
  import SvgPlus from '$components/assets/svg/SvgPlus.svelte';
  import SvgSetaDireita from '$components/assets/svg/SvgSetaDireita.svelte';
  import Upload from '$components/assets/upload/Upload.svelte';
  import BubbleWrapper from '$components/elements/wrappers/BubbleWrapper.svelte';

    import type { ProdutosForm } from '$lib/api/modules/produto/produto.dto.svelte';
    import { optionsStatus } from '$lib/api/modules/produto/produto.utils';
  import toast from '$lib/utils/toast.svelte';
  import type { Option } from '$lib/utils/types';

  interface FormVariaveis {
      formImage: {
          file: File | null,
          data64: string
      },
      nome: string,
      preco: number | null,
      descricao: string
  }

  interface Props {
      formImage: {
          file: File | null,
          data64: string
      },
      loading?: boolean,
      form: ProdutosForm,
      click: VoidFunction,
  }

  let {
      formImage = $bindable(),
      loading = $bindable(),
      form = $bindable(),
      click
  }: Props = $props()

  let condicional: boolean = $state(true)
  let adicionarVariavel: boolean = $state(false)
  let editarVariavel: boolean = $state(false)
  let indexVariavel: number | null = $state(null)

  let produtosVariaveis: FormVariaveis[] = $state([]);
  let obj = $state<FormVariaveis>({
      nome: '',
      preco: null,
      descricao: '',
      formImage: {
          data64: "",
          file: null
      }
  })

  function produtosForm() {
      const isValid = obj.nome.trim() !== '' &&
                      obj.preco !== null &&
                      obj.formImage.data64.trim() !== '' &&
                      obj.formImage.file !== null;

      if (isValid) {
          if (editarVariavel) {
            produtosVariaveis[indexVariavel!] = { ...obj };
            editarVariavel = !editarVariavel;
          } else {
            produtosVariaveis.push(obj);
            adicionarVariavel = !adicionarVariavel
          }

          obj = {
            nome: '',
            preco: null,
            descricao: '',
            formImage: {
              data64: "",
              file: null
            }
          }
      } else {
        toast.push("Mensagem do sistema", "Todos os campos devem ser preenchidos.");
      }
  }

  function excluirObj(nome: string) {
    const produto = produtosVariaveis.findIndex(i => i.nome === nome)

    if (produto !== -1) {produtosVariaveis.splice(produto, 1), editarVariavel = !editarVariavel}
  }

  function edicao(index: number) {
      indexVariavel = index;
      editarVariavel = true;
      obj = { ...produtosVariaveis[index] };
  }
</script>

<div class="flex items-start gap-6">
  <BubbleWrapper css="min-w-[440px] px-0 gap-4">
      <div class="flex w-full items-center justify-between px-4">
          <p class="text-16 font-medium text-strong-950">{'Configurações do produto'}</p>
          <SelectBlock bind:value={form.ativo} options={optionsStatus} placeholder="Status" focusCss={'relative outline-none flex w-[150px]'}/>
      </div>

      <div class="border-b border-soft-200"></div>

      <div class="px-5 flex flex-col gap-3">
          <div class="flex flex-col gap-0.5">
              <Label label={'Tipo'} extraTip={'Alguma coisa aqui'} mandatory={true}/>
              <BotaoDeslizante opcoes={[{label: 'Simples', value: true}, {label: 'Variável', value: false}]} bind:value={condicional}/>
          </div>

          {#if condicional}
              <InputPreco label="Preço" mandatory={true} bind:value={form.preco}/>
          {:else}
              {#if produtosVariaveis.length < 1}
                  <div class="flex flex-col gap-1">
                      <Label label={'Variável'} extraTip={'Alguma coisa aqui'} mandatory={true} />
                      <p class="text-14 font-normal text-sub-600">O produto não possui variáveis cadastradas.</p>
                      <div class="grid h-[40px] w-[104px]">
                          <Botao tema={'primary'} onClick={() => adicionarVariavel = !adicionarVariavel}>
                              <SvgPlus />
                              Variável
                          </Botao>
                      </div>
                  </div>
              {:else}
                  <div class="flex flex-col gap-3">
                      <Label label={'Variáveis'} mandatory={true}/>
                      <div class="flex flex-col gap-1">
                          {#each produtosVariaveis as produto, i}
                              <button class="flex items-center justify-between p-1 rounded-[10px] hover:bg-weak-50" onclick={()=> edicao(i)}>
                                  <div class="flex items-center gap-2">
                                      <Avatar src={produto.nome} name={produto.nome}/>
                                      <div class="flex flex-col">
                                          <p class="text-strong-950 text-14 font-medium flex items-start">{produto.nome}</p>
                                          <p class="text-sub-600 text-12 font-medium flex items-start">{'R$ ' + produto.preco}</p>
                                      </div>
                                  </div>
                                  <SvgSetaDireita/>
                              </button>
                              <div class="border-b border-soft-200"></div>
                          {/each}
                      </div>
                      <div class="grid h-[40px] w-[104px]">
                          <Botao tema={'primary'} onClick={() => adicionarVariavel = !adicionarVariavel}>
                              <SvgPlus />
                              Variável
                          </Botao>
                      </div>
                  </div>
              {/if}
          {/if}
      </div>

      <div class="w-full h-[1px] bg-soft-200"></div>

      <div class="grid grid-cols-2 gap-3 px-4 h-[40px]">
          <Botao onClick={() => window.history.back()} tema={"transparent"}>
              Cancelar
          </Botao>
          <Botao onClick={click} {loading} tema={"primary"}>
              Continuar
          </Botao>
      </div>
  </BubbleWrapper>

  {#if adicionarVariavel || editarVariavel}
      <BubbleWrapper css="min-w-[440px] px-0 gap-4">
          <div class="flex w-full items-center justify-between px-4">
              <p class="text-16 font-medium text-strong-950">{editarVariavel ? 'Editar Variável' : 'Adicionar Variável'}</p>
              {#if editarVariavel}
                <button class="rounded-[8px] p-1.5 bg-error-base text-white-0 text-14 font-medium" onclick={()=> excluirObj(obj.nome)}>
                  Excluir
                </button>
              {/if}
          </div>

          <div class="border-b border-soft-200"></div>

          <div class="flex flex-col px-5 gap-3">
              <Input label="Nome da variável" placeholder="Ex: mensal" mandatory={true} bind:value={obj.nome}/>
              <InputPreco label="Preço" mandatory={true} bind:value={obj.preco}/>
              <TextArea label="Descrição" placeholder="Descreva o produto para o cliente" bind:value={obj.descricao} limit={200} />
              <Upload bind:formImage={obj.formImage}/>
          </div>

          <div class="w-full h-[1px] bg-soft-200"></div>

          <div class="grid gap-3 px-4 h-[40px]">
              <Botao onClick={produtosForm} {loading} tema={"primary"}>
                  {editarVariavel ? 'Salvar' : 'Adicionar'}
              </Botao>
          </div>
      </BubbleWrapper>
  {/if}
</div>