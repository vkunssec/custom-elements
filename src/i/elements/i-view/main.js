import { DefaultShadowElement, getShadow, loadCSSApplication, loadTemplateApplication } from "../../core/elements.js";

/** */
export class ViewElement extends DefaultShadowElement {
    #template = "./src/i/elements/i-view/template.html";
    #style = "./src/i/elements/i-view/style.css";

    constructor() {
        super();

        this.load();
    }

    async load() {
        await loadCSSApplication(this, this.#style);
        await loadTemplateApplication(this, this.#template);
    }
}

customElements.define("i-view", ViewElement);
