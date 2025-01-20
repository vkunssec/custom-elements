import { DefaultShadowElement, getShadow, loadCSSApplication, loadTemplateApplication } from "../../core/elements.js";

/** */
export class ViewElement extends DefaultShadowElement {
    readonly #template = "./src/vk/elements/vk-view/template.html";
    readonly #style = "./src/vk/elements/vk-view/style.css";

    constructor() {
        super();
        this.load();
    }

    get shadow(): ShadowRoot | undefined {
        return getShadow(this);
    }

    async load() {
        try {
            // Carrega recursos em paralelo
            await Promise.all([
                loadCSSApplication(this, this.#style),
                loadTemplateApplication(this, this.#template)
            ]);

            this.#initializeView();
        } catch (error) {
            console.error('Erro ao carregar recursos do View:', error);
        }
    }

    #initializeView() {
        const mainContainer = this.shadow?.querySelector('.main');
        if (mainContainer) {
            // Configurações iniciais da View
            this.dispatchEvent(new Event('view-ready'));
        }
    }

    static get observedAttributes() {
        return [] as const;
    }
}

customElements.define("vk-view", ViewElement);
