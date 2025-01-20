import { DefaultShadowElement, loadCSSApplication, loadTemplateApplication } from "../../core/elements.js";

/** */
export class ViewElement extends DefaultShadowElement {
    #template = "./src/vk/elements/vk-view/template.html";
    #style = "./src/vk/elements/vk-view/style.css";

    constructor() {
        super();

        this.load();
    }

    async load() {
        await loadCSSApplication(this, this.#style);
        await loadTemplateApplication(this, this.#template);
    }
}

customElements.define("vk-view", ViewElement);
