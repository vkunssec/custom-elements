import { DefaultShadowElement, getShadow, loadCSSApplication, loadTemplateApplication, loadLinkApplication } from "../../core/elements.js";

export class IconElement extends DefaultShadowElement {
    readonly #template = "./src/vk/elements/vk-icon/template.html";
    readonly #style = "./src/vk/elements/vk-icon/style.css";
    readonly #fontUrl = "./src/vk/core/assets/fonts/material-icons/font.css";

    constructor() {
        super();
        this.load();
    }

    get shadow(): ShadowRoot | undefined {
        return getShadow(this);
    }

    async load() {
        try {
            // Carrega todos os recursos em paralelo
            await Promise.all([
                loadLinkApplication(this.#fontUrl),
                loadCSSApplication(this, this.#style),
                loadTemplateApplication(this, this.#template)
            ]);

            this.#updateIcon();
        } catch (error) {
            console.error('Erro ao carregar recursos do ícone:', error);
        }
    }

    #updateIcon() {
        const icon = this.shadow?.querySelector<HTMLElement>("i");
        if (!icon) return;

        // Define o texto do ícone
        const iconText = this.textContent?.trim() || this.getAttribute("icon") || "";
        icon.textContent = iconText;

        // Remove classes existentes
        icon.classList.remove('material-icons', 'material-icons-outlined');

        // Adiciona a classe apropriada e força o estilo
        if (this.hasAttribute('outlined')) {
            icon.classList.add('material-icons-outlined');
            icon.style.setProperty('font-family', '"Material Icons Outlined"', 'important');
            // Força o estilo em vários níveis
            icon.style.fontFamily = '"Material Icons Outlined"';
            icon.setAttribute('style', 'font-family: "Material Icons Outlined" !important');
        } else {
            icon.classList.add('material-icons');
            icon.style.setProperty('font-family', '"Material Icons"', 'important');
        }

        // Mostra o ícone
        icon.classList.add('vk-icon-loaded');

        // Debug
        console.log('Atualizando ícone:', {
            texto: iconText,
            outlined: this.hasAttribute('outlined'),
            classes: icon.className,
            fontFamily: getComputedStyle(icon).fontFamily,
            style: icon.getAttribute('style')
        });
    }

    attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null) {
        if (!this.shadow) return;
        this.#updateIcon();
    }

    static get observedAttributes() {
        return ["icon", "outlined"];
    }
}

customElements.define("vk-icon", IconElement);
