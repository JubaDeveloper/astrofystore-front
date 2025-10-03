import api from "$lib/api/api";

class Denuncias {
  async criarDenuncia(lojaId: number, body: {
    produtoId: number,
    motivo: string,
    descricao: string
  }){
    return api.post(`/loja/${lojaId}/cliente/denuncias`, body)
  }

  async criarAnexos(lojaId: number, denunciaId: number, file:File){
    const formData = new FormData()
    formData.append("file", file)
    return api.formData(`/loja/${lojaId}/cliente/denuncias/${denunciaId}`, formData,"POST")
  }
}

const denunciaController = new Denuncias();
export default denunciaController