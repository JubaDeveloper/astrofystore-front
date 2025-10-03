import { page } from "$app/stores";
import { get } from "svelte/store";
import toast from "./toast.svelte";

/**
 * Executa uma ação com base na tecla pressionada.
 * 
 * @param {string} key - A tecla que deve ser pressionada para executar a ação.
 * @param {Function} action - A função a ser executada quando a tecla for pressionada.
 * @param {KeyboardEvent} event - O evento de teclado que contém as informações sobre a tecla pressionada.
 */
export function action(key: string, action: () => void, event: KeyboardEvent) {
    if (event.key === key) {
        action();
    }
}
export function sanitizeUrl(url: string): string {
    // Remove barras duplicadas, mantendo apenas uma
    return url.replace(/\/+/g, '/');
}
export function urltoFile(url:string, filename:string, mimeType:string){
    if (url.startsWith('data:')) {
        var arr = url.split(','),
            mime = arr[0].match(/:(.*?);/)![1],
            bstr = atob(arr[arr.length - 1]), 
            n = bstr.length, 
            u8arr = new Uint8Array(n);
        while(n--){
            u8arr[n] = bstr.charCodeAt(n);
        }
        var file = new File([u8arr], filename, {type:mime || mimeType});
        return Promise.resolve(file);
    }
    return fetch(url)
        .then(res => res.arrayBuffer())
        .then(buf => new File([buf], filename,{type:mimeType}));
}
/**
 * Copia o texto fornecido para a área de transferência.
 * 
 * @param {string} text - O texto a ser copiado para a área de transferência.
 */
export function copyToClipboard(text: string) {
    navigator.clipboard.writeText(text);
}

/**
 * Exibe mensagens no console apenas em ambiente de desenvolvimento (localhost).
 * 
 * @param {string} text - A mensagem a ser exibida no console.
 */
export function consoleDev(text: any){
    const url = get(page).url.origin;
    if(url.includes('http://localhost')) console.log(text);
}   

export function formatarNumero(numero: string) {
    numero = numero.replace(/\D/g, '');

    return numero.replace(/(\d{2})(\d)(\d{4})(\d{4})/, '($1) $2 $3-$4');
}

export function formatCNPJ(cnpj: string) {
    cnpj = cnpj.replace(/\D/g, '');
    return cnpj.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
}

export function formatarRedeSocial(url: string) {
    if (url === null || url === '' || url === undefined) return url
    const username = url.split('.com/')[1].replace('/', '');
    return `@${username}`;
}

export function colorOpacity(color: string, opacity: number): string {
    // Normaliza opacidade para o intervalo [0, 1]
    opacity = Math.max(0, Math.min(1, opacity));
  
    // Remove espaços e converte para minúsculo
    color = color.replace(/\s/g, '').toLowerCase();
  
    // Verifica se é HEX
    const hexMatch = color.match(/^#?([0-9a-f]{6}|[0-9a-f]{3})$/i);
    if (hexMatch) {
      let hex = hexMatch[1];
      // Expande HEX de 3 dígitos para 6
      if (hex.length === 3) {
        hex = hex
          .split('')
          .map((c) => c + c)
          .join('');
      }
      // Converte HEX para RGB
      const r = parseInt(hex.slice(0, 2), 16);
      const g = parseInt(hex.slice(2, 4), 16);
      const b = parseInt(hex.slice(4, 6), 16);
      return `rgba(${r}, ${g}, ${b}, ${opacity})`;
    }
  
    // Verifica se é RGB ou RGBA
    const rgbMatch = color.match(/^rgba?\((\d+),(\d+),(\d+)(?:,([\d.]+))?\)$/i);
    if (rgbMatch) {
      const r = parseInt(rgbMatch[1], 10);
      const g = parseInt(rgbMatch[2], 10);
      const b = parseInt(rgbMatch[3], 10);
      return `rgba(${r}, ${g}, ${b}, ${opacity})`;
    }
  
    // Retorna a cor original se o formato não for reconhecido
    return color;
  }

  export function capitalizarString(str: string): string {
    return str.toUpperCase();
  }
  export function cssVar(varName: string): string {
    const cssVarName = varName.startsWith('--') ? varName : `--${varName}`;
    return getComputedStyle(document.documentElement).getPropertyValue(cssVarName).trim();
  }


export function generateSlug(nome: string): string {
    return '/' + nome
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')  // Remove caracteres não alfanuméricos
      .replace(/\s+/g, '-')      // Substitui espaços por hífens
      .replace(/-+$/g, '');      // Remove hífens no final
}

export const effectBy = <T extends readonly unknown[]>(deps: () => [...T], fn: (prevDepValues: $state.Snapshot<[...T]> | null) => void) => {
    let prevDepValues: $state.Snapshot<[...T]> | null = null;
  
    $effect(() => {
      fn(prevDepValues);
      prevDepValues = $state.snapshot(deps());
    });
};

export function encurtarTexto(texto: string, limite: number): string {
    if (texto.length <= limite) {
        return texto;
    }
    return texto.slice(0, limite) + "...";
}

export function dataAtual(data: Date = new Date()): string {
  const dia = String(data.getDate()).padStart(2, '0');
  const mes = String(data.getMonth() + 1).padStart(2, '0');
  const ano = data.getFullYear();
  return `${dia}/${mes}/${ano}`;
}

export function validarData(dataStr: string): boolean {
  // Verifica o formato básico com regex
  if (!/^\d{2}\/\d{2}\/\d{4}$/.test(dataStr)) {
    return false;
  }

  const [diaStr, mesStr, anoStr] = dataStr.split('/');
  const dia = parseInt(diaStr, 10);
  const mes = parseInt(mesStr, 10);
  const ano = parseInt(anoStr, 10);

  // Validação básica dos componentes da data
  if (ano < 1000 || ano > 9999 || mes < 1 || mes > 12 || dia < 1 || dia > 31) {
    return false;
  }

  // Validação específica do mês/dia
  const data = new Date(ano, mes - 1, dia);
  if (
    data.getFullYear() !== ano ||
    data.getMonth() + 1 !== mes ||
    data.getDate() !== dia
  ) {
    return false; // Data inválida (ex: 30/02/2023)
  }

  // Comparação com a data atual (sem horas/minutos/segundos)
  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0); // Zera a hora para comparar apenas a data

  return data < hoje;
}

export function copiarTexto(texto:string) {
    navigator.clipboard.writeText(texto)
    .then(() => {
        toast.success('Mensagem do sistema.', 'URL copiada com sucesso!')
    })
    .catch(err => {
        toast.error('Falha ao copiar texto: ', 'Erro ao copiar, tente novamente.');
    });
}

export function copiarTextoHTTP(texto:string) {
    // Cria um elemento temporário
    const textarea = document.createElement('textarea');
    textarea.value = texto;
    document.body.appendChild(textarea);
    
    // Seleciona o texto
    textarea.select();
    textarea.setSelectionRange(0, 99999); // Para dispositivos móveis
    
    // Copia o texto
    document.execCommand('copy');
    
    // Remove o elemento temporário
    document.body.removeChild(textarea);
}

export function formatarDataHora(isoString: string): string {
    const data = new Date(isoString);
    
    const diaFormatado = data.getDate();
    const nomeDoMes = data.toLocaleDateString('pt-BR', { month: 'long' });

    const horaFormatada = data.toLocaleTimeString('pt-BR', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
    });

    return `${diaFormatado} de ${nomeDoMes}, ${horaFormatada}`;
}

export function formatarPreco(valor: number|null) {
    const val = valor ?? 0;
    let valorStr = val.toString();
    
    if (valorStr.length < 3) {
        valorStr = valorStr.padStart(3, '0');
    }
    
    const centavos = valorStr.slice(-2);
    const reais = valorStr.slice(0, -2);
    
    const reaisFormatados = reais.length > 0 
        ? parseInt(reais).toLocaleString('pt-BR') 
        : '0';
    
    return `${reaisFormatados},${centavos}`;
}

export function gerarSlug(nome: string) {
  return nome
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, '-');
}