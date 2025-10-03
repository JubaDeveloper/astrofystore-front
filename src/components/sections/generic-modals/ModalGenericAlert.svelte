<script lang="ts">
    import Botao from "$components/assets/buttons/Botao.svelte";
    import PopUp from "$components/assets/modals/PopUp.svelte";
    import SvgAlerta from "$components/assets/svg/SvgAlerta.svelte";

    interface Props{
        label:string,
        sublabel:string,
        btnLabel:string,
        action:VoidFunction,
        cancel:VoidFunction,
        loading:boolean,
        open:boolean
    }

    let {label,sublabel,action,cancel,btnLabel,loading,open=$bindable()}:Props = $props()

</script>

<PopUp bind:open withCloseButton={false}  clickOutside={cancel} withDefaultPadding={false}>
    <div class="flex flex-col w-[440px]">
        <div class="flex gap-4 px-4 mt-4 items-start">
            <div class="bg-error-lighter shrink-0 rounded-[10px] w-[40px] h-[40px] aspect-square flex items-center justify-center">
                <SvgAlerta props={{
                    class:"fill-error-base w-[24px] h-[24px]"
                }}/>
            </div>
            <div class="flex-col justify-start items-start ">
                <div class="justify-start leading-5 text-[16px] text-strong-950 text-base font-medium">
                    {@html (label)}
                </div>
                <div class="justify-start text-sub-600  mt-1 text-[14px] font-normal">
                    {@html (sublabel)}
                </div>
            </div>  
        </div>
        <div class="w-[100%] left-[0] my-3 h-[1px] bg-soft-200">        
        </div>
        <div class="grid grid-cols-2 mb-4 w-full h-[36px] gap-x-3 px-4">
            <Botao tema="gray-transparent" onClick={()=>{
                open=false
                cancel()
            }}>
                Cancelar
            </Botao>
            <Botao tema="red" onClick={action} loading={loading}>
                {btnLabel}
            </Botao>
        </div>
    
    </div>
  </PopUp>
