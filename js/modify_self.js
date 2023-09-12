import { app } from "../../../scripts/app.js";
import { registerUiOutputListener } from "./ui_output_dispatch.js";

function modify_self_function(message) {
	message.modify_self.forEach(self_modify => {
		var w = this.widgets?.find((w) => w.name === self_modify[0])
		if (w) {
			w.value = self_modify[1];
			this.onResize?.(this.size);
		}
	});
}

app.registerExtension({
	name: "cg.custom.core.SelfModify",
	version: 1,
	async beforeRegisterNodeDef(nodeType, nodeData, app) {
		registerUiOutputListener(nodeType, nodeData, 'modify_self', modify_self_function);
	},
});