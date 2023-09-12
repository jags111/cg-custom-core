import { app } from "../../../scripts/app.js";
import { ComfyWidgets } from "../../../scripts/widgets.js";
import { registerUiOutputListener } from "./ui_output_dispatch.js";

function display_text_function(message) {
	var text = message.display_text.join('');
	var w = this.widgets?.find((w) => w.name === "display_text_widget");
	if (w === undefined) {
		w = ComfyWidgets["STRING"](this, "display_text_widget", ["STRING", { multiline: true }], app).widget;
		w.inputEl.readOnly = true;
		w.inputEl.style.opacity = 0.6;
		w.inputEl.style.fontSize = "9pt";
	}
	w.value = text;
	this.onResize?.(this.size);
}

app.registerExtension({
	name: "cg.custom.core.DisplayText",
	version: 3,
	async beforeRegisterNodeDef(nodeType, nodeData, app) {
		registerUiOutputListener(nodeType, nodeData, 'display_text', display_text_function);
	},
});
