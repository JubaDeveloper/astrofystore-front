<script lang='ts'>
  import SelectBlock from "$components/assets/logic/SelectBlock.svelte";
  import InputWrapper from "$components/elements/wrappers/InputWrapper.svelte";
  import axios from "axios";


    interface Props{
        uf:string,
        value:string
    }

    let {uf,value = $bindable()}:Props = $props()

    let cidades = $state([])
    let loading = $state(false)

    const pegarCidadePorUF = async() => {
        try{
            loading=true
            const response = await axios.get(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${uf}/distritos`)
            cidades = response.data.filter((obj: any, index: number, self: any[]) => 
                self.findIndex((o: any) => o.nome === obj.nome) === index
            ).map((obj: any) => {
                return {
                    label: obj.nome,
                    value: obj.nome
                }
            }).sort((a:any, b:any) => a.label.localeCompare(b.label));
            loading=false
        }
        catch(err){
            loading=false
        }
    }

    $effect(()=>{
        if(uf){
            pegarCidadePorUF()
        }
    })

</script>



<SelectBlock options={cidades} bind:value={value} placeholder="Selecione sua cidade" loading={loading} disabled={uf ? false : true}/>
