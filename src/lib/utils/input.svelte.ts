import validateInputs from "$lib/sanitizers/validateFormats"

class ValidacaoInputNormalizada{
    
    Email = (v:string):string => {
        if(validateInputs.email(v)){
            return ""
        }
        return "E-mail não é valido"
    }

    NaoVazio = (v:string,message?:string):string => {
        if(v.length>=1){
            return ""
        }
        return message ?? "Campo não pode ser vazio"
    }

    NotNull = (v:any,message?:string):string => {
        if(v!==null && v!==undefined){
            return ""
        }
        return message ?? "Campo não pode ser vazio"
    }
    
    ArrayNaoVazio = (v:any[],message?:string):string => {
        if(v.length>=1){
            return ""
        }
        return message ?? "Campo não pode ser vazio"
    }
    
    Date = (v:string):string => {
        return ""
    }

    Telefone = (v:string):string => {
        if(v.replace(/\D/g, '').length===11){
            return ""
        }
        return "Insira um telefone valido"
    }
    
    Igual = (v:string,s:string,message:string):string => {
        if(v===s){
            return ""
        }
        return message

    }
    Cpf = (v:string) => {
        if(v.length===14){
            return ""
        }
        return "Insira um cpf valido"
    }

    Cep = (v:string) => {
        if(v.length===9){
            return ""
        }
        return "Insira um cep valido"
    }
}



const validacaoInputNormalizada = new ValidacaoInputNormalizada()
export default validacaoInputNormalizada