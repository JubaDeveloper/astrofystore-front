import api from "$lib/api/api";
import query from "$lib/api/query";

class DenunciaController{
    async listar(filtros:any){
        return await api.get(`/admin/denuncias/listar${query.searchInMemoryQuerys(filtros)}`)
    }

    async pegar(id:number){
        return await api.get(`/admin/denuncias/${id}`)
    }
    async notificar(id:number,body:any){
        return await api.put(`/admin/denuncias/notificar/${id}`,body)
    }

    async anexar(id:number,file:File){
        const formData = new FormData()
        formData.append("file",file)
        return await api.formData(`/admin/denuncias/${id}`,formData,"POST");
    }

    async arquivar(id:number){
        return await api.put(`/admin/denuncias/arquivar/${id}`)
    }

    async bloquear(id:number){
        return await api.put(`/admin/denuncias/banir/${id}`)
    }

    async desbloquear(id:number){
        return await api.put(`/admin/denuncias/desbanir/${id}`)
    }

    async reavaliar(id:number){
        return await api.put(`/admin/denuncias/desbanir/${id}`);
    }

}


export class DenunciaLojistaController{
    idLoja:number=0
    constructor(idLoja:number){
        this.idLoja = idLoja
    }
    
    async listar(filtros:any){
        return await api.get(`/loja/${this.idLoja}/lojista/denuncias/listar${query.searchInMemoryQuerys(filtros)}`)
    }

    async pegar(id:number){
        return await api.get(`/loja/${this.idLoja}/lojista/denuncias/${id}`)
    }

    async responder(id:number,form:{
        resposta:string
    }){
        return await api.put(`/loja/${this.idLoja}/lojista/denuncias/responder/${id}`,form);
    }


    async anexar(id:number,file:File){
        const formData = new FormData()
        formData.append("file",file)
        return await api.formData(`/loja/${this.idLoja}/lojista/denuncias/${id}`,formData,"POST");
    }


    async arquivar(id:number){
        return await api.put(`/admin/denuncias/arquivar/${id}`)
    }
}

export class DenunciaClienteController{
    idLoja:number=0
    constructor(idLoja:number){
        this.idLoja = idLoja
    }

    async denunciar(form:any){
        return await api.post(`/loja/${this.idLoja}/cliente/denuncias`,form);
    }

    async anexar(id:number,file:File){
        const formData = new FormData()
        formData.append("file",file)
        return await api.formData(`/loja/${this.idLoja}/cliente/denuncias/${id}`,formData,"POST");
    }
}



const denunciaAdminController = new DenunciaController()
export {denunciaAdminController}