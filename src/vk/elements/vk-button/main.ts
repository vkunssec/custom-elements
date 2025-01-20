import { DefaultShadowElement, getShadow, loadCSSApplication, loadTemplateApplication } from "../../core/elements.js";

export class ButtonElement extends DefaultShadowElement {
    readonly #template = "./src/vk/elements/vk-button/template.html";
    readonly #style = "./src/vk/elements/vk-button/style.css";

    constructor() {
        super();
        this.load();
    }

    get shadow(): ShadowRoot | undefined {
        return getShadow(this);
    }

    async load() {
        try {
            // Carrega recursos em paralelo usando Promise.all
            await Promise.all([
                loadCSSApplication(this, this.#style),
                loadTemplateApplication(this, this.#template)
            ]);
            
            this.#initializeIcon();
        } catch (error) {
            console.error('Erro ao carregar recursos do botão:', error);
        }
    }
    
    #initializeIcon() {
        const iconSlot = this.querySelector('[slot="icon"]')?.textContent?.trim();
        if (iconSlot) {
            this.setAttribute('icon', iconSlot);
        }
    }
    
    attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null) {
        if (name !== 'icon' || oldValue === newValue || !this.shadow) return;

        const icon = this.shadow.querySelector<HTMLElement>("vk-icon");
        if (icon && newValue) {
            icon.setAttribute("icon", newValue);
        }
    }

    static get observedAttributes() { 
        return ["icon"] as const; 
    }
}

customElements.define("vk-button", ButtonElement);
