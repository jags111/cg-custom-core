import { app } from "../../../scripts/app.js";

app.registerExtension({
	name: "cg.custom.core.SelfModify",
	version: 1,
	async beforeRegisterNodeDef(nodeType, nodeData, app) {
		if (nodeData.ui_output.includes('modify_self')) {
			const onExecuted = nodeType.prototype.onExecuted;

			nodeType.prototype.onExecuted = function (message) {
				onExecuted?.apply(this, arguments);
				message.modify_self.forEach(self_modify => {
                    var w = this.widgets?.find((w) => w.name === self_modify[0])
                    if (w) {
                        w.value = self_modify[1];
                        this.onResize?.(this.size);
                    }
                });

			}
		}
	},
});