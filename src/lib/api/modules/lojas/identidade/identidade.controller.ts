import api from "$lib/api/api"
import toast from "$lib/utils/toast.svelte"

export class configuracaoIdentidade {
  async pegarLoja(lojaId: number):Promise<any>{
    const [res, err] = await api.get(`/restrito/loja/${lojaId}`)

    if(err) return toast.error('Mensagem do sistema', err.message)

    return [res, err]
  }

  async pegarCapa(lojaId: number):Promise<any>{
    const [res, err] = await api.get(`/restrito/loja/${lojaId}/imagem/capa`)

    if(err) return toast.error('Mensagem do sistema', err.message)

    return [res, err]
  }

  async atualizarLoja(lojaId: number, body: {nome: string, dominio?: string, descricao: string}):Promise<any>{
    const [res, err] = await api.put(`restrito/loja/${lojaId}`, body)

    if(err) return toast.error('Mensagem do sistema', err.message)

    return [res, err]

  }

  async salvarAvatar(lojaId:number,file:File){
    const formData = new FormData()
    formData.append("arquivo",file)
    const [r,e] = await api.formData(`/restrito/loja/${lojaId}/avatar`,formData,"PUT")
    return [r ? r.data : null,e]
  }

  async capaLoja(lojaId:number, file:File){
    const formData = new FormData()
    formData.append("arquivo",file)
    const [r,e] = await api.formData(`/restrito/loja/${lojaId}/imagem/capa`,formData,"PUT")
    return [r ? r.data : null,e]
  }
}