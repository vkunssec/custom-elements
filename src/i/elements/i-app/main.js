import { DefaultShadowElement, loadCSSApplication, loadTemplateApplication } from "../../core/elements.js";


export class AppElement extends DefaultShadowElement {
    #template = "/src/i/elements/i-app/template.html";
    #style = "/src/i/elements/i-app/style.css";

    constructor() {
        super();

        this.load();
    }

    async load() {
        await loadCSSApplication(this, this.#style);
        await loadTemplateApplication(this, this.#template);
    }
}

customElements.define("i-app", AppElement);
