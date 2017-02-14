'use strict';

var
	_ = require('underscore'),
	ko = require('knockout'),
	
	TextUtils = require('%PathToCoreWebclientModule%/js/utils/Text.js'),
	
	Ajax = require('modules/%ModuleName%/js/Ajax.js'),
	
	Api = require('%PathToCoreWebclientModule%/js/Api.js'),
	Settings = require('%PathToCoreWebclientModule%/js/Settings.js'),
	WindowOpener = require('%PathToCoreWebclientModule%/js/WindowOpener.js'),
	Screens = require('%PathToCoreWebclientModule%/js/Screens.js'),
	
	ModulesManager = require('%PathToCoreWebclientModule%/js/ModulesManager.js'),
	CAbstractSettingsFormView = ModulesManager.run('AdminPanelWebclient', 'getAbstractSettingsFormViewClass')
;

/**
* @constructor
*/
function CLoggingAdminSettingsView()
{
	CAbstractSettingsFormView.call(this, Settings.ServerModuleName);
	
	this.enableLogging = ko.observable(Settings.EnableLogging);
	this.enableEventLogging = ko.observable(Settings.EnableEventLogging);
	this.loggingLevel = ko.observable(Settings.LoggingLevel);
	
	this.aLoggingLevelOptions = [
		{
			label: TextUtils.i18n('%MODULENAME%/LABEL_LOGGING_DEBUG'),
			value: Enums.LogLevel.Full
		},
		{
			label: TextUtils.i18n('%MODULENAME%/LABEL_LOGGING_WARNINGS'),
			value: Enums.LogLevel.Warning
		},
		{
			label: TextUtils.i18n('%MODULENAME%/LABEL_LOGGING_ERRORS'),
			value: Enums.LogLevel.Error
		},
		{
			label: TextUtils.i18n('%MODULENAME%/LABEL_LOGGING_SPEC_USER'),
			value: Enums.LogLevel.Spec
		}
	];
}

_.extendOwn(CLoggingAdminSettingsView.prototype, CAbstractSettingsFormView.prototype);

CLoggingAdminSettingsView.prototype.ViewTemplate = '%ModuleName%_AdminSettingsView';

CLoggingAdminSettingsView.prototype.getCurrentValues = function()
{
	return [
		this.enableLogging(),
		this.enableEventLogging(),
		this.loggingLevel()
	];
};

CLoggingAdminSettingsView.prototype.revertGlobalValues = function()
{
	this.enableLogging(Settings.EnableLogging);
	this.enableEventLogging(Settings.EnableEventLogging);
	this.loggingLevel(Settings.LoggingLevel);
};

CLoggingAdminSettingsView.prototype.getParametersForSave = function ()
{
	return {
		'EnableLogging': this.enableLogging(),
		'EnableEventLogging': this.enableEventLogging(),
		'LoggingLevel': this.loggingLevel()
	};
};

/**
 * @param {Object} oParameters
 */
CLoggingAdminSettingsView.prototype.applySavedValues = function (oParameters)
{
	Settings.update(oParameters.EnableLogging, oParameters.EnableEventLogging, oParameters.LoggingLevel);
};

CLoggingAdminSettingsView.prototype.setAccessLevel = function (sEntityType, iEntityId)
{
	this.visible(sEntityType === '');
};

/**
 * Sends a request to the server to save the settings.
 */
CLoggingAdminSettingsView.prototype.save = function ()
{
	if (!_.isFunction(this.validateBeforeSave) || this.validateBeforeSave())
	{
		this.isSaving(true);

		Ajax.coreSend('UpdateLoggingSettings', this.getParametersForSave(), this.onResponse, this);
	}
};


CLoggingAdminSettingsView.prototype.download = function (type)
{
	var bUseEventLog = type === "event" ? true : false;
	
	Ajax.coreSend('GetLogFile', {}, function (oResponse) {
		console.log('download', oResponse);
	}, this);
};

CLoggingAdminSettingsView.prototype.view = function ()
{
	Ajax.coreSend('GetLog', {}, function (oResponse) {
		if (oResponse && oResponse.Result)
		{
			var oWin = WindowOpener.open('', 'Logsviwer', true);
			oWin.document.write('<pre>'+oResponse.Result+'</pre>');
		}
	}, this);
};

CLoggingAdminSettingsView.prototype.clear = function ()
{
	Ajax.coreSend('ClearLog', {}, function (oResponse) {
		if (oResponse && oResponse.Result)
		{
			Screens.showReport(TextUtils.i18n('%MODULENAME%/REPORT_CLEAR_LOG'));
		}
		else
		{
			Screens.showError(TextUtils.i18n('%MODULENAME%/ERROR_CLEAR_LOG'));
		}
	}, this);
};

module.exports = new CLoggingAdminSettingsView();
