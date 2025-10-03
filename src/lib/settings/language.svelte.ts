
type Idiomas = "PT-BR" | "EN-US"
class LanguageManager{

	idioma = $state<Idiomas>("PT-BR")

	//Basta chamar a funcao que a reatividade ocorre naturalmente
	translator(conteudoPTBR:string,conteudoENUS:string){
		switch(this.idioma){
			case "PT-BR":
				return conteudoPTBR
			case "EN-US":
				return conteudoENUS
		}
	}

}

const languageManager = new LanguageManager()
export default languageManager