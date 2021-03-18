sap.ui.define(function() {
	"use strict";
	var Formatter = {
		priority :  function (sPriority) {
			switch(sPriority){
				case "S_TL_Y":
					return "Warning";
				case "S_TL_G":
					return "Success";
				case "S_TL_R":
					return "Error";
				default:
					return "None";
			}
		},
		icon :  function (sIcon) {
			switch(sIcon){
				case "S_TL_Y":
					return "sap-icon://status-in-process";
				case "S_TL_G":
					return "sap-icon://message-success";
				case "S_TL_R":
					return "sap-icon://status-negative";
				default:
					return "None";
			}
		}
	};
	return Formatter;
}, true);
