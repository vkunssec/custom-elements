import { DefaultShadowElement, loadCSSApplication, loadTemplateApplication } from "../../core/elements.js";

/** */
export class AppBarElement extends DefaultShadowElement {
    #template = "./src/vk/elements/vk-appbar/template.html";
    #style = "./src/vk/elements/vk-appbar/style.css";

    constructor() {
        super();

        this.load();
    }

    async load() {
        await loadCSSApplication(this, this.#style);
        await loadTemplateApplication(this, this.#template);
    }
}

customElements.define("vk-appbar", AppBarElement);
