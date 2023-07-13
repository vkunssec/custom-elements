/**
 * Classe DefaultShadowElement criado extendendo HTMLElement
 * 
 * Métodos do Shadow Root instanciados para possibilitar polimorfismo
 */
export class DefaultShadowElement extends HTMLElement {
    constructor() {
        super();

        this.#build(this);
        this.#load(this);
    }

    /**
     * Declarando métodos das funções do Shadow Root para possível polimorfismo
     */

    /** */
    disconnectedCallback() {
        console.log("element removed from page");
    }
    /** */
    adoptedCallback() {
        console.log("element moved to new page");
    }
    /** */
    attributeChangedCallback(name, oldValue, newValue) {
        console.log("element attributes changed");
    }
    /** */
    connectedCallback() {
        console.log("element added to page");
    }

    /**
     * Criação padrão de um Elemento Shadow Root
     * 
     * @param {HTMLElement} element 
     * @returns 
     */
    async #build(element) {
        const shadow = element.attachShadow({ mode: "closed" });

        shadows.set(element, shadow);
        return shadow;
    }

    /**
     * Carregamento das Fontes e do CSS default do projeto
     *  
     * @param {HTMLElement} element 
     */
    async #load(element) {
        await loadCSSApplication(element, undefined, true);
        await loadLinkApplication("/src/i/core/assets/fonts/Montserrat/font.css");
    }
}

/**
 * Hash Shadows 
 */
const shadows = new WeakMap();
window.__shadows = shadows;
/**
 * Retornar as informações de um Elemento Shadow criado
 * 
 * @param {HTMLElement} element 
 * @returns 
 */
export function getShadow(element) {
    return shadows.get(element);
}
/**
 * Retornar todo o Hash de Shadows
 * @returns 
 */
export function getShadows() {
    return shadows;
}

/**
 * Criando elemento CSS de Font para o projeto
 * 
 * @param {string} url 
 * @returns 
 */
export async function loadLinkApplication(url) {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = url;
    document.head.appendChild(link);
    return link;
}

/**
 * Criando elemento CSS e adicionando no cabeçalho do Shadow
 * 
 * @param {HTMLElement} element 
 * @param {string} url 
 * @param {boolean} head
 * @returns 
 */
export async function loadCSSApplication(element, url, head = false) {
    const style = await loadCSS(url);
    style.setAttribute("inherit", "");
    if (head) {
        document.head.appendChild(style);
    } else {
        const shadow = getShadow(element);
        shadow.appendChild(style);
    }
    return style;
}

/**
 * Criando elemento Template
 * 
 * @param {string} url 
 * @returns 
 */
export async function loadTemplateApplication(element, url) {
    const shadow = getShadow(element);
    const html = await (await fetch(url, {
        method: "GET",
        mode: "cors"
    })).text();
    const template = document.createElement("template");
    template.innerHTML = html;
    // NOTE: se nao for passado <.content> é aplicado no formato #document-fragment
    shadow.appendChild(template.content);
    return template;
}

/**
 * Carregando CSS a partir da URL ou o CSS padrão do projeto
 * 
 * @param {string | undefined} url 
 * @returns 
 */
async function loadCSS(url) {
    const style = document.createElement("style");

    let css = undefined;
    // TODO: melhorar a importação do CSS Default ou retirar essa opção 
    if (!url) {
        css = `@import url("/src/i/core/css/elements.css");`;
    } else {
        css = await (await fetch(url, {
            method: "GET",
            mode: "cors"
        })).text();
    }

    style.innerHTML = css;
    return style;
}
