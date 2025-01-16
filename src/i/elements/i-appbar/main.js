import { DefaultShadowElement, loadCSSApplication, loadTemplateApplication } from "../../core/elements.js";

/** */
export class AppBarElement extends DefaultShadowElement {
    #template = "./src/i/elements/i-appbar/template.html";
    #style = "./src/i/elements/i-appbar/style.css";

    constructor() {
        super();

        this.load();
    }

    async load() {
        await loadCSSApplication(this, this.#style);
        await loadTemplateApplication(this, this.#template);
    }
}

customElements.define("i-appbar", AppBarElement);
