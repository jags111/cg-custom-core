import { app } from "../../../scripts/app.js";
import { api } from "../../../scripts/api.js";

app.registerExtension({
	name: "cg.custom.core.Terminate",
	version: 2,
	async beforeRegisterNodeDef(nodeType, nodeData, app) {
		if (nodeData.ui_output.includes('terminate')) {
			const onExecuted = nodeType.prototype.onExecuted;

			nodeType.prototype.onExecuted = function (message) {
				onExecuted?.apply(this, arguments);
				const terminate = message.terminate.join('');
				if (terminate==="terminate") { 
					document.getElementById("autoQueueCheckbox").checked = false;
					api.interrupt(); 
				} else if (terminate==="autoqueueoff") {
					document.getElementById("autoQueueCheckbox").checked = false;
				}
			}
		}
	},
});
