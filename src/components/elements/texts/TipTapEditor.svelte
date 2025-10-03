<script lang="ts">
	import { onMount, onDestroy, type Component } from 'svelte';
	import { Editor, type TiptapEditorHTMLElement } from '@tiptap/core';
	import StarterKit from '@tiptap/starter-kit';
    import SelectBlock from '$components/assets/logic/SelectBlock.svelte';
    import MainNoBorder from '$components/assets/select/minimalist/MainNoBorder.svelte';
    import SvgBold from '$components/assets/svg/SvgBold.svelte';
    import SvgUnderline from '$components/assets/svg/SvgUnderline.svelte';
    import Underline from '@tiptap/extension-underline';
    import SvgSCut from '$components/assets/svg/SvgSCut.svelte';
    import SvgItalicText from '$components/assets/svg/SvgItalicText.svelte';
    import SvgList from '$components/assets/svg/SvgList.svelte';
    import ListItem from '@tiptap/extension-list-item'
    import BulletList from '@tiptap/extension-bullet-list';
    import SvgListNumeric from '$components/assets/svg/SvgListNumeric.svelte';
    import SvgLeftAlign from '$components/assets/svg/SvgLeftAlign.svelte';
  import SvgAlignMiddle from '$components/assets/svg/SvgAlignMiddle.svelte';
import Link from '@tiptap/extension-link'
  import SvgRightAlign from '$components/assets/svg/SvgRightAlign.svelte';
  import TextAlign from '@tiptap/extension-text-align';
  import SvgLink from '$components/assets/svg/SvgLink.svelte';

    interface Props{
        conteudo:string
    }

    let {conteudo = $bindable()}:Props = $props()

	let element = $state<HTMLDivElement>();
	let editor = $state<Editor>()
    let markedStates = $state({
        isBold:false,
        isHeader:false,
        isParagraph:false,
        isItalic:false,
        isUnderline:false,
        isStrike:false,
        isBulletList:false,
        isOrderedList:false,
    })

    const optionsHeader = [
        {
            label:"Header",
            value:"h1"
        },
        {
            label:"Paragrafo",
            value:"p"
        }
    ]
    const optionsAlign = [
        {
            label:"",
            value:"left",
            icon:SvgLeftAlign,
        },
        {
            label:"",
            value:"center",
            icon:SvgAlignMiddle
        },
        {
            label:"",
            value:"right",
            icon:SvgRightAlign,
        }
    ]

    async function adicionarLink(){
        if(!editor) return
        const previousUrl = editor.getAttributes('link').href
        let url = window.prompt('URL', previousUrl)

        if (url === null) {
        return
        }
        if (url === '') {
            editor.chain().focus().extendMarkRange('link').unsetLink().run()
            return
        }
        if (!/^https?:\/\//i.test(url)) {
            url = 'https://' + url;
        }

        editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
    }

	onMount(() => {
		editor = new Editor({
			element: element,
			extensions: [StarterKit,Underline,ListItem,BulletList,Link,TextAlign.configure({
                types: ['heading', 'paragraph']
            })],
			content: conteudo,            
			onTransaction: () => {
                if(!editor) return
                editor = editor;
                markedStates = {
                    isBold: editor.isActive("bold"),
                    isHeader: editor.isActive("heading"), // Verifica se é um cabeçalho (h1, h2, etc.)
                    isParagraph: editor.isActive("paragraph"), // Verifica se é um parágrafo
                    isItalic: editor.isActive("italic"), // Verifica se está em itálico
                    isUnderline: editor.isActive("underline"), // Verifica se está sublinhado
                    isStrike: editor.isActive("strike"), // Verifica se está tachado
                    isBulletList: editor.isActive("bulletList"), // Verifica se é uma lista não ordenada
                    isOrderedList: editor.isActive("orderedList"), // Verifica se é uma lista ordenada
                };
            },
            onUpdate:(props)=>{
                conteudo = props.editor.getHTML()
            }
		});
	});

	onDestroy(() => {
		if (editor) {
			editor.destroy();
		}
	});

</script>

<div class="flex flex-col justify-start items-start w-full gap-4">
    {#if editor}
        <div class=" px-1 flex items-center rounded-xl border border-soft-200 gap-1">
                <SelectBlock placeholder="" MainComponent={MainNoBorder} value={markedStates.isHeader ? "h1" : "p"} removableOnClick={false} options={optionsHeader} onSelect={(op)=>{
                    if(!editor) return
                    if(op.value==="h1"){
                        editor.chain().focus().toggleHeading({level:1}).run()
                        return
                    }
                    if(op.value==="p"){
                        editor.chain().focus().setParagraph().run()
                        return
                    }
                }}/>

                {@render line()}
                <div class="flex items-center gap-1 h-full ">
                    {@render iconButton(()=>editor!.chain().focus().toggleBold().run(),markedStates.isBold,SvgBold)}
                    {@render iconButton(()=>editor!.chain().focus().toggleItalic().run(),markedStates.isItalic,SvgItalicText)}
                    {@render iconButton(()=>editor!.chain().focus().toggleUnderline().run(),markedStates.isUnderline,SvgUnderline)}
                    {@render iconButton(()=>editor!.chain().focus().toggleStrike().run(),markedStates.isStrike,SvgSCut)}
                    {@render iconButton(()=>editor!.chain().focus().toggleBulletList().run(),markedStates.isBulletList,SvgList)}
                    {@render iconButton(()=>editor!.chain().focus().toggleOrderedList().run(),markedStates.isOrderedList,SvgListNumeric)}
                </div>

                {@render line()}
                <SelectBlock placeholder="" MainComponent={MainNoBorder} value="left" removableOnClick={false} options={optionsAlign} onSelect={(op)=>{
                    if(!editor)return
                    editor.chain().focus().setTextAlign(op.value).run()                    
                }}/>
                {@render line()}
                <button onclick={adicionarLink} class="p-1 ml-1">
                    <SvgLink/>                    
                </button>

        </div>
    {/if}


<div class="border border-soft-200  p-2 w-full  rounded-xl text-[14px]">
    <div bind:this={element}  class="max-h-[400px] p-1   overflow-y-auto"></div>
</div>



</div>


{#snippet iconButton(command:VoidFunction,active:boolean,Icon:Component)}
{#if editor}
    <button onclick={command}
        class="{active ? "bg-weak-50" : ""}  h-[28px] aspect-square shrink-0 grow-0 rounded-lg flex items-center justify-center">
            <Icon props={{
                class:active ? "fill-primary-base" : "fill-sub-600"
            }}/>
    </button>
{/if}
{/snippet}

{#snippet line()}
    <div class="h-[16px] w-[2px] grow-0 shrink-0 bg-soft-200">

    </div>
{/snippet}