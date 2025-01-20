// Interface para configuração do shadow DOM
interface ShadowConfig {
    mode: 'open' | 'closed';
    delegatesFocus?: boolean;
    slotAssignment?: 'manual' | 'named';
}

// Cache para armazenar estilos já carregados
const styleCache = new Map<string, string>();

export class DefaultShadowElement extends HTMLElement {
    // Configuração padrão do shadow DOM
    protected static readonly defaultShadowConfig: ShadowConfig = {
        mode: 'closed',
        // delegatesFocus: true
    };

    constructor() {
        super();
        this.#initialize();
    }

    // Método de inicialização único
    async #initialize(): Promise<void> {
        const shadow = await this.#build(this);
        await this.#load(this);
        this.onInitialized(shadow);
    }

    // Hook para classes filhas implementarem
    protected onInitialized(_shadow: ShadowRoot): void {}

    disconnectedCallback(): void {
        console.log("element removed from page", this.tagName);
    }

    adoptedCallback(): void {
        console.log("element moved to new page", this.tagName);
    }

    attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null): void {
        console.log("element attributes changed", name, oldValue, newValue);
    }

    connectedCallback(): void {
        console.log("element added to page", this.tagName);
    }

    async #build(element: HTMLElement): Promise<ShadowRoot> {
        const shadow = element.attachShadow(DefaultShadowElement.defaultShadowConfig);
        shadows.set(element, shadow);
        return shadow;
    }

    async #load(element: HTMLElement): Promise<void> {
        // Carregamento paralelo dos recursos
        await Promise.all([
            loadCSSApplication(element, undefined, true),
            loadLinkApplication("./src/vk/core/assets/fonts/Montserrat/font.css"),
        ]);
    }
}

const shadows = new WeakMap<HTMLElement, ShadowRoot>();
(window as any).__shadows = shadows;

export function getShadow(element: HTMLElement): ShadowRoot | undefined {
    return shadows.get(element);
}

export function getShadows(): WeakMap<HTMLElement, ShadowRoot> {
    return shadows;
}

export async function loadLinkApplication(url: string, type: string = "stylesheet"): Promise<HTMLLinkElement> {
    const link = document.createElement("link");
    link.rel = type;
    link.href = url;
    document.head.appendChild(link);
    return link;
}

export async function loadCSSApplication(
    element: HTMLElement, 
    url?: string, 
    head: boolean = false
): Promise<HTMLStyleElement> {
    try {
        const style = await loadCSS(url);
        style.setAttribute("inherit", "");
        
        const target = head ? document.head : getShadow(element);
        target?.appendChild(style);
        
        return style;
    } catch (error) {
        console.error(`Erro ao carregar CSS: ${error}`);
        throw error;
    }
}

export async function loadTemplateApplication(element: HTMLElement, url: string): Promise<HTMLTemplateElement> {
    const shadow = getShadow(element);
    const response = await fetch(url, {
        method: "GET",
        mode: "cors"
    });
    const html = await response.text();
    const template = document.createElement("template");
    template.innerHTML = html;
    if (shadow) {
        shadow.appendChild(template.content);
    }
    return template;
}

async function loadCSS(url?: string): Promise<HTMLStyleElement> {
    const style = document.createElement("style");
    
    // Verifica se o CSS já está em cache
    if (url && styleCache.has(url)) {
        style.innerHTML = styleCache.get(url)!;
        return style;
    }

    try {
        let css: string;
        if (!url) {
            css = `@import url("./src/vk/core/css/elements.css");`;
        } else {
            const response = await fetch(url, {
                method: "GET",
                mode: "cors",
                cache: "force-cache" // Usa cache do navegador
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            css = await response.text();
            styleCache.set(url, css); // Armazena no cache
        }

        style.innerHTML = css;
        return style;
    } catch (error) {
        console.error(`Erro ao carregar CSS de ${url}: ${error}`);
        throw error;
    }
}

// Função utilitária para debounce de operações
function debounce<T extends (...args: any[]) => void>(
    fn: T, 
    delay: number
): (...args: Parameters<T>) => void {
    let timeoutId: ReturnType<typeof setTimeout>;
    
    return (...args: Parameters<T>) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => fn(...args), delay);
    };
}
