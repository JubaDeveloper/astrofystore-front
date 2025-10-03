
import axios, { type AxiosError, type AxiosInstance, type InternalAxiosRequestConfig } from "axios";
import { browser } from "$app/environment";
import dev from "$lib/settings/dev.svelte";
import storageService from "$lib/utils/storageService";

class Api {

    private readonly URL: string;
   
    private static excludeAuthToken: string[] = [
        "/auth/",
        "/predio"
    ];
    
    private axiosInstance: AxiosInstance;

    private static exactlyMatch: string[] = ['/usuario']
    
    
    constructor(){
        this.URL = dev.keys.backend ? dev.keys.backend : "";
        this.axiosInstance = axios.create({
            baseURL: this.URL,
            headers: {
                "Content-Type": "application/json",
            },
        });

        this.axiosInstance.interceptors.request.use(
            this.handleRequest,
        );
    }

    
    private handleRequest( config: InternalAxiosRequestConfig<any>): InternalAxiosRequestConfig<any> {
       
        // const endpoint = config.url?.split("?")[0] || "";
        // const route = endpoint.split(dev.keys.backend)[0] || ''
        // if (Api.excludeAuthToken.some(url => endpoint.includes(url)) || Api.exactlyMatch.some(url => url === route)) return config

        if(!browser){
            throw new Error("Componente não renderizado ao lado do cliente para pegar o localstorage")
        }
        
        // const token = window.localStorage.getItem("all-in-hall-token")
        
        // if (!token) {
        //     throw new Error("Token não encontrado");
        // }
        const token = storageService.getStoredData("astronfy-token")
        if(token)
            config.headers["Authorization"] = `Bearer ${token}`;

        return config;
    }
    
    private async makeRequest(method:string,endpoint:string,body?:any,extraHeaders?:Record<string,any>):Promise<[any,any]>{
        try{
            const response = await this.axiosInstance.request({
                method: method,
                url:endpoint,
                data:body,
                headers: extraHeaders ? extraHeaders : {}
            })
            return [response.data,null]
        }
        catch(error){
            const e = error as AxiosError
            if(!e.response){
                return[null,{message:"Servidor fora do ar",error:error}]
            }
            return [null, e.response.data];
        }
    }

    /**
     * Envia uma requisição POST para o endpoint especificado com o corpo fornecido.
     * @param {string} endpoint - O endpoint da API para onde a requisição será enviada.
     * @param {any} body - O corpo da requisição POST.
     * @returns {Promise<[any, any]>} Uma promise que resolve para um array com os dados da resposta ou um erro.
     */

    async post(
        endpoint: string,
        body?: Record<string, any>
    ): Promise<[any, any]> {

       return this.makeRequest("POST",endpoint,body)
    }

    
    /**
     * Envia uma requisição GET para o endpoint especificado.
     * @param {string} endpoint - O endpoint da API para onde a requisição será enviada.
     * @returns {Promise<[any, any]>} Uma promise que resolve para um array com os dados da resposta ou um erro.
     */
    async get(endpoint: string): Promise<[any, any]> {
       return this.makeRequest("GET",endpoint)
    }

    /**
     * Envia uma requisição PUT para o endpoint especificado com o corpo fornecido.
     * @param {string} endpoint - O endpoint da API para onde a requisição será enviada.
     * @param {any} body - O corpo da requisição PUT.
     * @returns {Promise<[any, any]>} Uma promise que resolve para um array com os dados da resposta ou um erro.
     */
    async put(
        endpoint: string,
        body?: Record<string, any>
    ): Promise<[any, any]> {
        return this.makeRequest("PUT",endpoint,body)
    }

    async patch(
        endpoint: string,
        body?: Record<string, any>
    ): Promise<[any, any]> {
        return this.makeRequest("PATCH",endpoint,body)
    }

    /**
     * Envia uma requisição DELETE para o endpoint especificado.
     * @param {string} endpoint - O endpoint da API para onde a requisição será enviada.
     * @returns {Promise<[any, any]>} Uma promise que resolve para um array com os dados da resposta ou um erro.
     */
    async delete(endpoint: string,body?:Record<string,any>): Promise<[any, any]> {
        return this.makeRequest("DELETE",endpoint,body)
    }

    /**
     * Envia uma requisição PUT do tipo FormData com dados de formulário e arquivos para o endpoint especificado.
     * @param {string} endpoint - O endpoint da API para onde a requisição será enviada.
     * @param {any} body - Os dados do formulário a serem enviados.
     * @returns {Promise<[any, any]>} Uma promise que resolve para um array com os dados da resposta ou um erro.
     */
    async formData(endpoint: string,body: Record<string, any>, method  : string = 'PUT'): Promise<[any, any]> {
        const formData = new FormData();
        for (const key in body) {
            formData.append(key, body[key]);
        }
        return this.makeRequest(method,endpoint,body,{"Content-Type": "multipart/form-data"})
    }

}

const api = new Api();
export default api;