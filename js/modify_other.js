import { app } from "../../../scripts/app.js";
import { registerUiOutputListener } from "./ui_output_dispatch.js";

function modify_other_function (message) {
	message.modify_other.forEach(update => {
		var node_id = parseInt(update[0]);
		var widget_name = update[1];
		var text = update[2];
		var widget = this.graph._nodes_by_id[node_id]?.widgets.find((w) => w.name===widget_name);
		if (widget) { 
			widget.value = text; 
			this.graph._nodes_by_id[node_id].onResize?.(this.size);
		} else { console.log("cg.custom.core.ModifyOther - Widget "+widget_name+" not found")}
	});
};

app.registerExtension({
	name: 'cg.custom.core.ModifyOther',
	version: 1,
	async beforeRegisterNodeDef(nodeType, nodeData, app) {
		registerUiOutputListener(nodeType, nodeData, 'modify_other', modify_other_function);
	},
});


