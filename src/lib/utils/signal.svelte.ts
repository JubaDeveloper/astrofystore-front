import type { Component } from "svelte"


class Signal{

    signal = $state<{
        tipo:string,
        data:any
    }>({
        tipo:"",
        data:{}
    })

    resetSignal(){
        this.signal={
            tipo:"",
            data:{}
        }        
    }

    sendSignal(tipo:string,data?:any){
        this.signal={
            tipo,
            data
        }
        setTimeout(()=>this.resetSignal(),200)
    }


    sendMeGenericActionModal(data:{
        label:string,
        desc:string,
        btnLabel:string,
        icon:Component,
        action: ()=>Promise<void>
    }){
        this.sendSignal("openGenericActionModal",data);
    }

    sendMeGenericModal(data:{
        label:string,
        desc:string,
        btnLabel:string,
        icon:Component
    }){
        this.sendSignal("openGenericModal",data);
    }
}

const sinalizador = new Signal()

export default sinalizador