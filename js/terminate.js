import { app } from "../../../scripts/app.js";
import { api } from "../../../scripts/api.js";
import { registerUiOutputListener } from "./ui_output_dispatch.js";

function terminate_function(message) {
	message = message.join('');
	if (message==="terminate") { 
		document.getElementById("autoQueueCheckbox").checked = false;
		api.interrupt(); 
	} else if (message==="autoqueueoff") {
		document.getElementById("autoQueueCheckbox").checked = false;
	}
}

app.registerExtension({
	name: "cg.custom.core.Terminate",
	version: 2,
	async beforeRegisterNodeDef(nodeType, nodeData, app) {
		registerUiOutputListener(nodeType, nodeData, 'terminate', terminate_function);
	},
});
