<template>
  <q-scroll-area class="full-height full-width">
    <div class="q-pa-lg" style="min-width: 811px">
      <q-card flat bordered class="card-edit-settings">
        <q-card-section>
          <div class="row">
            <q-item>
              <q-item-section>
                <q-checkbox v-model="enableLogging" color="teal">
                  <q-item-label caption v-t="'LOGSVIEWERWEBCLIENT.LABEL_LOGGING_ENABLE'" />
                </q-checkbox>
              </q-item-section>
            </q-item>
          </div>
          <div class="row q-mb-md q-ml-md">
            <div class="col-1 q-my-sm q-ml-sm" v-t="'LOGSVIEWERWEBCLIENT.LABEL_LOGGING_VERBOSITY'" />
            <div class="col-5 q-ml-xl">
              <q-select flat
                        outlined
                        dense class="bg-white" v-model="verbosity"
                        :options="verbosityList"/>
            </div>
          </div>
          <div class="row q-mb-md q-ml-md">
            <div class="q-ml-sm">
              <q-btn unelevated no-caps dense class="q-px-sm" :ripple="false" color="primary"
                     :label="$t('LOGSVIEWERWEBCLIENT.BUTTON_LOGGING_DOWNLOAD', {'SIZE': viewLogSizeBytes})"
                     @click="getLogFile(logFileName, false)" />
            </div>
            <div class="q-ml-md">
              <q-btn unelevated no-caps dense class="q-px-sm" :ripple="false" color="primary"
                     :label="viewLogText" @click="getLog(false)" />
            </div>
            <div class="q-ml-md">
              <q-btn unelevated no-caps dense class="q-px-sm q-py-xs" :ripple="false" color="primary"
                    v-t="'LOGSVIEWERWEBCLIENT.BUTTON_LOGGING_CLEAR'" @click="clearLog" />
            </div>
          </div>
          <div class="row">
            <q-item>
              <q-item-section>
                <q-checkbox v-model="enableEventLogging" color="teal">
                  <q-item-label caption v-t="'LOGSVIEWERWEBCLIENT.LABEL_LOGGING_ENABLE_EVENTS'" />
                </q-checkbox>
              </q-item-section>
            </q-item>
          </div>
          <div class="row q-mb-md q-ml-md">
            <div class="q-ml-sm">
              <q-btn unelevated no-caps dense class="q-px-sm" :ripple="false" color="primary"
                     :label="$t('LOGSVIEWERWEBCLIENT.BUTTON_LOGGING_DOWNLOAD_EVENTS', {'SIZE': viewEventLogSizeBytes})"
                     @click="getLogFile(eventLogFileName, true)" />
            </div>
            <div class="q-ml-md">
              <q-btn unelevated no-caps dense class="q-px-sm"
                     :ripple="false" color="primary"
                     :label="viewEventsLogText" @click="getLog(true)" />
            </div>
            <div class="q-ml-md">
              <q-btn unelevated no-caps dense class="q-px-sm q-py-xs" :ripple="false" color="primary"
                     v-t="'LOGSVIEWERWEBCLIENT.BUTTON_LOGGING_CLEAR'" />
            </div>
          </div>
          <div class="row q-mb-md q-ml-md" v-if="users.length">
            <div class="col-10">
              <div class="q-px-md">
                {{$t('LOGSVIEWERWEBCLIENT.LABEL_LOGGING_USERS_WITH_SEPARATE_LOG')}}
                <span class="logging-user__link" v-for="(user, index) in users"
                      :key="user" @click="getLogFile(logFileName, false, user)">
                      {{ user }}{{ index !== users.length - 1 ? ',' : '' }}
                </span>
              </div>
            </div>
          </div>
          <div class="row q-mb-md q-ml-md" v-if="users.length">
            <div class="q-ml-sm">
              <q-btn unelevated no-caps dense class="q-px-sm q-py-xs" :ripple="false" color="primary"
                    v-t="'LOGSVIEWERWEBCLIENT.BUTTON_LOGGING_TURN_OFF_SEPARATE_LOGS'"
                     @click="turnOffSeparateLogs" />
            </div>
            <div class="q-ml-md">
              <q-btn unelevated no-caps dense class="q-px-sm q-py-xs" :ripple="false" color="primary"
                     v-t="'LOGSVIEWERWEBCLIENT.BUTTON_LOGGING_CLEAR_SEPARATE_LOGS'" @click="clearSeparateLogs" />
            </div>
          </div>
        </q-card-section>
      </q-card>
      <div class="q-pt-md text-right">
        <q-btn unelevated no-caps dense class="q-px-sm" :ripple="false" color="primary" @click="save"
               :label="saving ? $t('COREWEBCLIENT.ACTION_SAVE_IN_PROGRESS') : $t('COREWEBCLIENT.ACTION_SAVE')" />
      </div>
    </div>
    <UnsavedChangesDialog ref="unsavedChangesDialog"/>
  </q-scroll-area>
</template>

<script>
import textUtil from 'src/utils/text'
import webApi from 'src/utils/web-api'
import settings from 'src/settings'
import notification from 'src/utils/notification'
import errors from 'src/utils/errors'
import UnsavedChangesDialog from 'src/components/UnsavedChangesDialog'
import _ from 'lodash';

export default {
  name: 'LoggingAdminSettings',
  components: {
    UnsavedChangesDialog
  },
  data () {
    return {
      verbosity: '',
      logFileData: {},
      logSizeBytes: 0,
      eventLogSizeBytes: 0,
      viewLastLogSize: 0,
      viewLogSizeBytes: 0,
      viewEventLogSizeBytes: 0,
      logFileName: '',
      eventLogFileName: '',
      enableLogging: false,
      enableEventLogging: false,
      loggingLevel: 100,
      users: [],
      timeOut: false,
      saving: false
    }
  },
  mounted () {
    this.populate()
    this.getLogFilesData()
    this.getUsersWithSeparateLog()
  },
  beforeRouteLeave (to, from, next) {
    if (this.hasChanges() && _.isFunction(this?.$refs?.unsavedChangesDialog?.openConfirmDiscardChangesDialog)) {
      this.$refs.unsavedChangesDialog.openConfirmDiscardChangesDialog(next)
    } else {
      next()
    }
  },
  computed: {
    verbosityList () {
      return [
        { value: 100, label: this.$t('LOGSVIEWERWEBCLIENT.LABEL_LOGGING_DEBUG') },
        { value: 50, label: this.$t('LOGSVIEWERWEBCLIENT.LABEL_LOGGING_WARNINGS') },
        { value: 20, label: this.$t('LOGSVIEWERWEBCLIENT.LABEL_LOGGING_ERRORS') },
      ]
    },
    viewLogText () {
      if (this.logSizeBytes < this.viewLastLogSize) {
        return this.$t('LOGSVIEWERWEBCLIENT.BUTTON_LOGGING_VIEW')
      } else {
        return this.$tc('LOGSVIEWERWEBCLIENT.BUTTON_LOGGING_VIEW_LAST', textUtil.getFriendlySize(this.viewLastLogSize), { SIZE: textUtil.getFriendlySize(this.viewLastLogSize) })
      }
    },
    viewEventsLogText () {
      if (this.eventLogSizeBytes < this.viewLastLogSize) {
        return this.$t('LOGSVIEWERWEBCLIENT.BUTTON_LOGGING_VIEW');
      } else {
        return this.$t('LOGSVIEWERWEBCLIENT.BUTTON_LOGGING_VIEW_LAST', textUtil.getFriendlySize(this.viewLastLogSize), { SIZE: textUtil.getFriendlySize(this.viewLastLogSize) });
      }
    }
  },
  beforeDestroy() {
    clearTimeout(this.timeOut);
  },
  methods: {
    hasChanges () {
      const data = settings.getLoggingData()
      return this.enableLogging !== data.enableLogging ||
          this.enableEventLogging !== data.enableEventLogging ||
          this.verbosity.value !== data.loggingLevel
    },
    populate () {
      const data = settings.getLoggingData()
      this.enableLogging = data.enableLogging
      this.enableEventLogging = data.enableEventLogging
      this.viewLastLogSize = data.viewLastLogSize
      this.verbosityList.forEach((elem) => {
        if (elem.value === data.loggingLevel) {
          this.verbosity = elem
        }
      })
    },
    save () {
      this.saving = true
      const parameters = {
        EnableLogging: this.enableLogging,
        EnableEventLogging: this.enableEventLogging,
        LoggingLevel: this.verbosity.value
      }
      webApi.sendRequest({
        moduleName: 'Core',
        methodName: 'UpdateSettings',
        parameters: parameters,
      }).then(result => {
        this.saving = false
        if (result) {
          settings.saveLoggingData({
            enableLogging: this.enableLogging,
            enableEventLogging: this.enableEventLogging,
            loggingLevel: this.verbosity.value
          })
          notification.showReport(this.$t('COREWEBCLIENT.REPORT_SETTINGS_UPDATE_SUCCESS'))
        } else {
          notification.showError(this.$t('COREWEBCLIENT.ERROR_SAVING_SETTINGS_FAILED'))
        }
      }, response => {
        this.saving = false
        notification.showError(errors.getTextFromResponse(response, this.$t('COREWEBCLIENT.ERROR_SAVING_SETTINGS_FAILED')))
      })
    },
    getLogFilesData () {
      webApi.sendRequest({
        moduleName: 'LogsViewerWebclient',
        methodName: 'GetLogFilesData',
      }).then(result => {
        if (result) {
          this.logSizeBytes = result.LogSizeBytes
          this.eventLogSizeBytes = result.EventLogSizeBytes
          this.viewLogSizeBytes = textUtil.getFriendlySize(result.LogSizeBytes)
          this.viewEventLogSizeBytes = textUtil.getFriendlySize(result.EventLogSizeBytes)
          this.logFileName = result.LogFileName
          this.eventLogFileName = result.EventLogFileName
        }
        this.setUpdateStatusTimer()
      })
    },
    setUpdateStatusTimer () {
      this.timeOut = setTimeout(this.getLogFilesData, 5000)
    },
    getUsersWithSeparateLog () {
      const parameters = {}
      webApi.sendRequest({
        moduleName: 'LogsViewerWebclient',
        methodName: 'GetUsersWithSeparateLog',
        parameters: parameters,
      }).then(result => {
        if (result) {
          this.users = result
        }
      }, response => {
        notification.showError(errors.getTextFromResponse(response))
      })
    },
    getLog (eventsLog) {
      const parameters = {
        EventsLog: eventsLog
      }
      webApi.sendRequest({
        moduleName: 'LogsViewerWebclient',
        methodName: 'GetLog',
        parameters: parameters,
      }).then(result => {
        if (result) {
          const oWin = window.open('view-log', '', 'scrollbars=1')
          oWin.document.write('<pre>' + result + '</pre>')
        }
      }, response => {
        notification.showError(errors.getTextFromResponse(response))
      })
    },
    getLogFile (fileName, eventsLog, PublicId = '') {
      const parameters = {
        EventsLog: eventsLog,
        PublicId: PublicId
      }
      if (PublicId) {
        fileName = PublicId + '-' + fileName
      }
      webApi.downloadExportFile({
        moduleName: 'LogsViewerWebclient',
        methodName: 'GetLogFile',
        parameters: parameters,
        fileName: fileName,
        format: 'Raw'
      })
    },
    clearLog () {
      webApi.sendRequest({
        moduleName: 'LogsViewerWebclient',
        methodName: 'ClearLog',
      }).then(result => {
        if (result === true) {
          notification.showReport(this.$t('COREWEBCLIENT.REPORT_SETTINGS_UPDATE_SUCCESS'))
        } else {
          notification.showError(this.$t('COREWEBCLIENT.ERROR_SAVING_SETTINGS_FAILED'))
        }
      }, response => {
        notification.showError(errors.getTextFromResponse(response, this.$t('COREWEBCLIENT.ERROR_SAVING_SETTINGS_FAILED')))
      })
    },
    turnOffSeparateLogs () {
      webApi.sendRequest({
        moduleName: 'LogsViewerWebclient',
        methodName: 'TurnOffSeparateLogs',
      }).then(result => {
        if (result === true) {
          this.getUsersWithSeparateLog()
        }
      })
    },
    clearSeparateLogs () {
      webApi.sendRequest({
        moduleName: 'LogsViewerWebclient',
        methodName: 'ClearSeparateLogs',
      }).then(result => {
        if (result === true) {
          notification.showReport(this.$t('COREWEBCLIENT.REPORT_SETTINGS_UPDATE_SUCCESS'))
        } else {
          notification.showError(this.$t('COREWEBCLIENT.ERROR_SAVING_SETTINGS_FAILED'))
        }
      }, response => {
        notification.showError(errors.getTextFromResponse(response, this.$t('COREWEBCLIENT.ERROR_SAVING_SETTINGS_FAILED')))
      })
    },
  }
}
</script>

<style scoped>
.logging-user__link {
  color: #1c868e;
  cursor: pointer;
}

.logging-user__link:hover {
  text-decoration: underline;
}
</style>
