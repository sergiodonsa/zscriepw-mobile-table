sap.ui.define([
	"/../Formatter",
	'sap/m/TablePersoController',
	'/../PersoService',
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/ui/model/Sorter",
	"sap/ndc/BarcodeScanner"
], function (Formatter, TablePersoController, PersoService, Controller, JSONModel, Filter, FilterOperator, Sorter, BarcodeScanner) {
	"use strict";
	var TableController = Controller.extend("zscriepwmobiletable.controller.Table", {
		_oEventBus: null,
		_oFilterDialog : null,
		_oSortDialog : null,
		_oTable : null,
		
		onInit: function () {
			this._oEventBus = sap.ui.getCore().getEventBus();
			this._oTable = this.byId("idNotificationsTable");

//			var	oBinding = this._oTable.getBinding("items"),
//				aFilters = [],
//				sPath = 'XBLNR',//Filtro i valori sporchi della tabella originale per chiave = '_________'
//				sOperator = 'NE',
//				sValue1 = '________________',
//				oFilter = new Filter(sPath, sOperator, sValue1);
//				aFilters.push(oFilter);
		
			/*	var oModel, oView;
				var oMockServer = new MockServer({
					rootUri: "sapuicompsmarttableshowdetails/"
				});
				this._oMockServer = oMockServer;
				oMockServer.simulate("test-resources/sap/ui/comp/demokit/sample/smarttable/mockserver/metadata.xml", "test-resources/sap/ui/comp/demokit/sample/smarttable/mockserver/");
				oMockServer.start();*/
			/*	oModel = new ODataModel("sapuicompsmarttableshowdetails", {
					defaultCountMode: "Inline"
				});
				oView = this.getView();
				oView.setModel(oModel);*/
	

			// apply filter settings
//			oBinding.filter(aFilters);
			
			// init and activate controller
			this._oTPC = new TablePersoController({
			table: this.byId("idNotificationsTable"),
			//specify the first part of persistence ids e.g. 'demoApp-productsTable-dimensionsCol'
			componentName: "zscriepw",
			persoService: PersoService
			}).activate();


		},
		
		/*
		 * Table row selection handler
		 * @param {Object} oEvent
		 */
		onSelect: function (oEvent) {
			var oSelectedListItem = oEvent.getParameter("listItem"),
				oNotificationCell = oSelectedListItem.getCells()[0],
				sNotificationId = oNotificationCell.getTitle();
			this._oEventBus.publish("zscriepwmobiletable", "select", {
				"id": sNotificationId
			});
		},
		
		/*
		 * Barcode scan button press handler
		 */
		onBarcodeScan: function () {
			var scanSuccessCallback = function (result) {
				if (!result.cancelled) {
					var oSearchField = 	this.byId("searchField");
					oSearchField.setValue(result.text);
					oSearchField.fireSearch({"query" : result.text});
				}
			};
			BarcodeScanner.scan(scanSuccessCallback.bind(this));
		},
		
		/*
		 * Table search handler
		 * @param {Object} oEvent
		 */
		onSearch: function (oEvent) {
			var sQuery,
				oBindings = this._oTable.getBinding("items");
			if (oEvent.getParameters().clearButtonPressed) {
				oBindings.filter("");
			} else {
				sQuery = oEvent.getParameter("query");
				if (sQuery && sQuery.length > 0) {
					oBindings.filter([new Filter("XBLNR", FilterOperator.Contains, sQuery)]);
				}
			}
		},
		
		/*
		 * Sort button press handler
		 */
		onSort: function(){
			if (!this._oSortDialog) {
				this._oSortDialog = sap.ui.xmlfragment("zscriepwmobiletable.fragments.Sort", this);
			}
			this._oSortDialog.open();
		},
		
		/*
		 * Filter button press handler
		 */
		/*onFilter: function(){
			if (!this._oFilterDialog) {
				this._oFilterDialog = sap.ui.xmlfragment("zscriepwmobiletable.fragments.Filter", this);
			}

			var oData = this.getView().getModel('DATA').getData(),
				oModel = this.getView().getModel('DATA'),
				oJSONModel = new sap.ui.model.json.JSONModel();
				
				this.getView().setModel(oJSONModel, "DATAX");
				var myModel = this.getView().getModel("DATAX");

				
			 var	oXblnr,
				aXblnr = {};
			 var i = 0;
			oData.NotificationCollection.forEach(function(oItem) {
				var prop = '/NotificationCollection/' + i + '/S_FKKOP-XBLNR';
				 
				oXblnr = oModel.getProperty(prop);
				prop = '/S_FKKOP-XBLNR';
				if( oXblnr !== "________________"){
					var aData  = myModel.getProperty(prop);
					aXblnr.xblnr = oXblnr;
					oJSONModel.setData(aXblnr);	

				}	
				i++;
			});
			
			
			this.getView().getModel('DATA').getProperty("/NotificationCollection");
			var oJSONModel = new sap.ui.model.json.JSONModel();
			oJSONModel.setProperty("/S_FKKOP-XBLNR", aXblnr);
			
			this.getView().addDependent(this._oFilterDialog);
			this._oFilterDialog.open();
		},*/
		
		/*
		 * Handles table sorting
		 * @param {Object} oEvent
		 */
		onSortConfirm : function(oEvent){
			var mParams = oEvent.getParameters(),
				bDescending = mParams.sortDescending,
				sPath = mParams.sortItem.getKey(),
				oSorter;
			//A custom sorter is required for dates
/**			if(sPath === "S_FKKOP-BUDAT" || sPath === "S_FKKOP-BLDAT"){                   */
            if(sPath === "BUDAT"){
				oSorter = new Sorter(sPath, bDescending, undefined, this._compareDates);
			}else{
				oSorter = new Sorter(sPath, bDescending);
			}
			
			this._oTable.getBinding("items").sort([oSorter]);
		},
		
		/**
		 * Compares two date strings
		 * @param {String} sDateX
		 * @param {String} sDateY
		 * @return {Integer} [-1;1] 
		 */
		_compareDates : function(sDateX, sDateY){
			var oDateX = new Date(sDateX),
				oDateY = new Date(sDateY);
				
			if(oDateX < oDateY || !oDateY){
				return -1;
			}
	
			if(oDateX > oDateY || !oDateX){
				return 1;
			}
			
			return 0;
		},
		/**
		 * Converts date constants into dynamic date strings
		 * @param {String} sValue
		 * @return {String}
		 */ 
		_convertDate : function(sValue){
			var oDate = new Date();
			switch(sValue){
				case "TODAY" :
					return oDate.toDateString();
				case "MONTH" :
					oDate.setMonth(oDate.getMonth() - 1);
					return oDate.toDateString();
				default :
					return sValue;
			}
		},
		
		/*
		 * Handles table filtering
		 * @param {Object} oEvent
		 */
		onFilterConfirmed : function(oEvent){
			var mParams = oEvent.getParameters(),
				oBinding = this._oTable.getBinding("items"),
				aFilters = [];
			mParams.filterItems.forEach(function(oItem) {
				var aSplit = oItem.getKey().split("___"),
					sPath = aSplit[0],
					sOperator = aSplit[1],
					sValue1 = aSplit[2],
					sValue2 = aSplit[3],
					oFilter = new Filter(sPath, sOperator, sValue1, sValue2);
					//Custom filter settings for dates
					if(sPath === "BUDAT"){
						oFilter.oValue1 = this._convertDate(sValue1);
						oFilter.sValue2 = this._convertDate(sValue2);
						oFilter.fnCompare = this._compareDates;
					}
				aFilters.push(oFilter);
			}.bind(this));
			// apply filter settings
			oBinding.filter(aFilters);
		},

		onSliderMoved: function(oEvent) {
			var iValue = oEvent.getParameter("value");
			var oTable = this.byId("idSmartTable").getTable();

			if (iValue === 0) {
				oTable.setContextualWidth("Phone");
			} else if (iValue === 1) {
				oTable.setContextualWidth("Tablet");
			} else if (iValue === 2) {
				oTable.setContextualWidth("auto");
			}
		},

		onBeforeExport: function(oEvt) {
			var mExcelSettings = oEvt.getParameter("exportSettings");

			// Disable Worker as Mockserver is used in Demokit sample
			mExcelSettings.worker = false;
		},

	/*	onExit: function() {
			this._oMockServer.stop();
		},

		onPersoButtonPressed: function (oEvent) {
			this._oTPC.openDialog();
		},

		onTablePersoRefresh : function() {
			DemoPersoService.resetPersData();
			this._oTPC.refresh();
		},

		onTableGrouping : function(oEvent) {
			this._oTPC.setHasGrouping(oEvent.getSource().getSelected());
		}*/
		


	});

	return TableController;
});