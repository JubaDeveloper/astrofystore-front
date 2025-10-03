
import type { Action } from "svelte/action";


type FileContent = {file:File,data64:string}[];
  
type MyAction = Action<
  HTMLButtonElement,
  {
    accept:string,
    multipleFiles?:boolean
  },
  {
    onfileupload: (e:CustomEvent<FileContent>) => void;
  }
>

export const fileManager:MyAction
= (node:HTMLButtonElement,info:{accept:string,multipleFiles?:boolean}) =>
{

  
		$effect(() => {
		
      let content:FileContent
    
      const criar = () => {
          if(inputHTML){
              inputHTML.removeEventListener("change",()=>{})
              node.removeChild(inputHTML)
          }
          inputHTML = document.createElement("input")
          inputHTML.type="file";
          inputHTML.accept=info.accept
          inputHTML.style.display="none";
  
          inputHTML.multiple = info.multipleFiles!==undefined ? info.multipleFiles : false 
          node.appendChild(inputHTML)
          inputHTML.addEventListener("change",(event)=>{
              if(info.multipleFiles===true){
                  const input = event.target as HTMLInputElement;
                  const files: File[] = Array.from(input.files ?? []).map((file) => {
                    return file;
                  }) as File[]
                  if(files.length===0) return    
                  content = Array.from(files).map((file) => {
                    return {
                      file,
                      data64:URL.createObjectURL(file)
                    }
                  });
                  const inputChange = new CustomEvent("fileupload",{detail:content})
  
                  node.dispatchEvent(inputChange)
                  criar();
                  return
              }
              const input = event.target as HTMLInputElement;
              const file = input.files?.[0];
              if(!file) return    
              const data64 = URL.createObjectURL(file);
              content = [{file,data64}]
              const inputChange = new CustomEvent("fileupload",{detail:content})
              node.dispatchEvent(inputChange)
              criar();
          })
      }
      let inputHTML:HTMLInputElement
      criar(); //Permite enviar o mesmo arquivo
  
      function click(){
          inputHTML.click()
      }
  
      node.addEventListener("click",click)
      return () => {
        node.removeEventListener("click",click)
			};
		});




}