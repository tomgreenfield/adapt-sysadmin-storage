define([
	"core/origin",
	"plugins/sysadmin/views/sysadminPluginView"
], function(Origin, SysadminPluginView) {

	var StorageView = SysadminPluginView.extend({

		name: "storage",

		preRender: function() {
			$.ajax({
				url: "storage",
				error: function(jqXHR, textStatus, errorThrown) {
					Origin.Notify.alert({
						type: "error",
						text: Origin.l10n.t("app.storageerror")
					});
				},
				success: function(data, textStatus, jqXHR) {
					this.model = new Backbone.Model(data);
					this.render();
				}.bind(this)
			});
		},

		postRender: function() {
			this.setViewToReady();
		}

	}, { template: "storage" });

	return StorageView;

});
