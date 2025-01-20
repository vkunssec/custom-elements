import { DefaultShadowElement, getShadow, loadCSSApplication, loadTemplateApplication } from "../../core/elements.js";

/** */
export class AppBarElement extends DefaultShadowElement {
    readonly #template = "./src/vk/elements/vk-appbar/template.html";
    readonly #style = "./src/vk/elements/vk-appbar/style.css";

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

            this.#initializeAppBar();
        } catch (error) {
            console.error('Erro ao carregar recursos do AppBar:', error);
        }
    }

    #initializeAppBar() {
        const appbar = this.shadow?.querySelector('.nav');
        if (appbar) {
            this.dispatchEvent(new Event('appbar-ready'));
        }
    }

    static get observedAttributes() {
        return [] as const;
    }
}

customElements.define("vk-appbar", AppBarElement);
