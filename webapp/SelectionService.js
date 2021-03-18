sap.ui.define([
	"sap/ui/core/service/Service",
	"sap/ui/core/service/ServiceFactory",
	"sap/ui/core/service/ServiceFactoryRegistry"
], function (Service, ServiceFactory, ServiceFactoryRegistry) {
	"use strict";
	var oSelectionService = Service.extend("zscriepwmobiletable.SelectionService", {
		
		_oEventProvider : null,
		
		init: function () {
			ServiceFactoryRegistry.register("zscriepwmobiletable.SelectionService", new ServiceFactory(this.getInterface()));
			this._oEventProvider = new sap.ui.base.EventProvider();
			//The "select" event is published by the zscriepwmobiletable.controller.Table controller instance once a table row has been selected
			sap.ui.getCore().getEventBus().subscribe("zscriepwmobiletable", "select", this._onSelect, this);
		},
		/*
		 * @private
		 * @param {String} sChannel
		 * @param {String} sId
		 * @param {Object} oData
		 * The method propagates the "select" event fired by the zscriepwmobiletable.controller.Table instance
		 */
		_onSelect : function(sChannel, sId, oData) {
			this._oEventProvider.fireEvent("select", {"id" : oData.id});
		},
		
		/*
		 * @param {Function} fnFunction
		 * @param {Object} oListener
		 * Attach external handler function to the table row selection event
		 */
		attachSelect : function(fnFunction, oListener){
			this._oEventProvider.attachEvent("select", null, fnFunction, oListener);
		},
		
		/*
		 * @param {Function} fnFunction
		 * @param {Object} oListener
		 * Detach external handler function from the table row selection event
		 */
		detachSelect : function(fnFunction, oListener){
			this._oEventProvider.detachEvent("select", fnFunction, oListener);
		}
	});

	return oSelectionService;

});