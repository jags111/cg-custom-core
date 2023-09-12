import { app } from "../../../scripts/app.js";
import { api } from "../../../scripts/api.js";
import { ComfyWidgets } from "../../../scripts/widgets.js";
import { registerUiOutputListener } from "./ui_output_dispatch.js";

function terminate_function(message) { 
	message = message.join('');
	if (message==="terminate") { 
		document.getElementById("autoQueueCheckbox").checked = false;
		api.interrupt(); 
	} else if (message==="autoqueueoff") {
		document.getElementById("autoQueueCheckbox").checked = false;
	}
};

function modify_self_function(message) {
	message.forEach(self_modify => {
		var w = this.widgets?.find((w) => w.name === self_modify[0])
		if (w) {
			w.value = self_modify[1];
			this.onResize?.(this.size);
		}
	});
};

function modify_other_function (message) {
	message.forEach(update => {
		var node_id = parseInt(update[0]);
		var widget_name = update[1];
		var text = update[2];
		var node = this.graph._nodes_by_id[node_id];
		var widget = node?.widgets.find((w) => w.name===widget_name);
		if (widget) { 
			widget.value = text; 
			node.onResize?.(node.size);
		} else { console.log("cg.custom.core.ModifyOther - Widget "+widget_name+" not found")}
	});
};

function display_text_function(message) {
	var text = message.join('');
	var w = this.widgets?.find((w) => w.name === "display_text_widget");
	if (w === undefined) {
		w = ComfyWidgets["STRING"](this, "display_text_widget", ["STRING", { multiline: true }], app).widget;
		w.inputEl.readOnly = true;
		w.inputEl.style.opacity = 0.6;
		w.inputEl.style.fontSize = "9pt";
	}
	w.value = text;
	this.onResize?.(this.size);
};

app.registerExtension({
	name: "cg.custom.core.DisplayText",
	version: 3,
	async beforeRegisterNodeDef(nodeType, nodeData, app) {
        registerUiOutputListener(nodeType, nodeData, 'terminate', terminate_function);
		registerUiOutputListener(nodeType, nodeData, 'display_text', display_text_function);
        registerUiOutputListener(nodeType, nodeData, 'modify_self', modify_self_function);
        registerUiOutputListener(nodeType, nodeData, 'modify_other', modify_other_function);
	},
});

