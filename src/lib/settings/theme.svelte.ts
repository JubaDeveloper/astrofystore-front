import storageService from "$lib/utils/storageService";

class ThemeManager{

	theme = $state<"light" | "dark">("light")

	constructor(){	
		this.theme="light"
	}

	setDarkMode(){
		if(window===null || window===undefined) return
 		window.document.querySelector("html")!.setAttribute("data-theme", "dark");
 		window.document.querySelector("body")?.classList.add("dark")
		this.theme="dark"
		this.save()
	}

	setLightMode(){
		if(window===null || window===undefined) return
  		window.document.querySelector("html")!.setAttribute("data-theme", "light");
  		window.document.querySelector("body")?.classList.remove("dark")
		this.theme="light"
		this.save()
	}

	switch(){
		if(this.theme==="dark"){
			this.setLightMode()
			return
		}
		this.setDarkMode()
	}

	save(){
		storageService.storeData("tema",this.theme)
	}

}

const themeManager = new ThemeManager()

export default themeManager