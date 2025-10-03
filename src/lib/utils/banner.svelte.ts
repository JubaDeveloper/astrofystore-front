
import ShortUniqueId from "short-unique-id";

type Status = "information" | "success" | "error" | "warning" | "faded"
type Tema = "base" | "light" | "lighter" | "transparent"
type Propriedades = {
    status?:Status
}
type Banner = {
    id:string,
    titulo:string,
    conteudo:string,
    link?:Link,
    status:Status  
}
type Link = {
    label:string,
    action:VoidFunction
}

class BannerManager{

    banners = $state<Banner[]>([])

    tema = $state<Tema>("base")
    
    temasArray = ["base","light","lighter","transparent"]


    uuid = new ShortUniqueId({length:20});
    
    success(titulo:string,conteudo:string,link?:Link){
        this.push(titulo,conteudo,link,{
            status:"success",
        })
    }

    error(titulo:string,conteudo:string,link?:Link){
        this.push(titulo,conteudo,link,{
            status:"error",
        })
    }

    alert(titulo:string,conteudo:string,link?:Link){
        this.push(titulo,conteudo,link,{
            status:"warning",
        })
    }

    neutral(titulo:string,conteudo:string,link?:Link){
        this.push(titulo,conteudo,link,{
            status:"faded",
        })
    }


    push(titulo:string,conteudo:string,link?:Link,propriedades?:Propriedades){
        const id = this.uuid.rnd();

        if(!propriedades)
            propriedades = {};

        const props = { 
            status: propriedades.status ?? "information",
        }
        this.banners.push({
            titulo,
            conteudo,
            link,
            id,
            status:props.status
        })
    }
    
    remove(id:string){
        this.banners = this.banners.filter(item => item.id !== id);
    }

    change(){
        let trocar:string = ""
        this.temasArray.map((obj,i)=>{
            if(obj===this.tema){
                if(i<this.temasArray.length-1){
                    trocar=this.temasArray[i+1]
                }
                else{
                    trocar=this.temasArray[0]
                }
            }
        })
        this.tema = trocar as Tema
    }

}


const banner = new BannerManager()
export default banner