//Essa pasta é exclusiva para fazer types GENERICOS E GLOBAIS
//Evite por favor colocar types especificos de arquivos, coloque apenas utilitarios que você acha necessario no codigo

export type AnyPrimitive = number | boolean | string | undefined


export type Option = {
        label:string,
        value:any,
        [key:string]:any
}


export interface MainComponentType{
    hasSelection:boolean,
    optionSelected:Option | Option[] | null,
    placeholder:string,
    isActive:boolean,
    onClick:VoidFunction,
    hasError?:boolean,
    disabled?:boolean
}
export interface OptionComponentType{
    data:Option,
    isSelected:boolean,
    onClick:VoidFunction
}