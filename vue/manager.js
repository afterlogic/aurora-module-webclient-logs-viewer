
export default {
    getAdminSystemTabs () {
        return [
            {
                name: 'logging',
                title: 'LOGSVIEWERWEBCLIENT.LABEL_LOGGING_SETTINGS_TAB',
                component () {
                    return import('src/../../../LogsViewerWebclient/vue/components/LoggingAdminSettings')
                },
            },
        ]
    },
}
