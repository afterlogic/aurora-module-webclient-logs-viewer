'use strict';

module.exports = {
	ServerModuleName: 'LogsViewerWebclient',
	HashModuleName: 'logs-viewer',
	
	EnableLogging: '',
	EnableEventLogging: '',
	LoggingLevel: '',
//	LogFileName: '',

	
	/**
	 * Initializes settings of the module.
	 * 
	 * @param {Object} oAppDataSection module section in AppData.
	 */
	init: function (oAppDataSection)
	{
		console.log(oAppDataSection);
		
		if (oAppDataSection)
		{
			this.EnableLogging = !!oAppDataSection.EnableLogging;
			this.EnableEventLogging = !!oAppDataSection.EnableEventLogging;
			this.LoggingLevel = oAppDataSection.LoggingLevel;
			
			this.ELogLevel = oAppDataSection.ELogLevel;
		}
	},
	
	/**
	 * Updates admin module settings after editing.
	 * 
	 * @param {int} iAuthMode
	 */
	update: function (EnableLogging, EnableEventLogging, LoggingLevel)
	{
		console.log('updateAdmin', arguments);
		this.LoggingLevel = LoggingLevel;
		
		this.EnableLogging = EnableLogging;
		this.EnableEventLogging = EnableEventLogging;
		this.LoggingLevel = LoggingLevel;
	}
};
