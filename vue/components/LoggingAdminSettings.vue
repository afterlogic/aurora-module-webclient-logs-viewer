<template>
  <q-scroll-area class="full-height full-width">
    <div class="q-pa-lg ">
      <q-card flat bordered class="card-edit-settings">
        <q-card-section>
          <div class="row">
              <q-item>
                <q-item-section>
                  <q-checkbox v-model="enableDebugLogging" color="teal">
                    <q-item-label caption>{{$t('LOGSVIEWERWEBCLIENT.LABEL_LOGGING_ENABLE')}}</q-item-label>
                  </q-checkbox>
                </q-item-section>
              </q-item>
          </div>
          <div class="row q-mb-md q-ml-md">
            <div class="col-1 q-my-sm q-ml-sm" v-t="'LOGSVIEWERWEBCLIENT.LABEL_LOGGING_VERBOSITY'"></div>
            <div class="col-5 q-ml-xl">
              <q-select outlined dense class="bg-white" v-model="verbosity"
                        emit-value map-options :options="verbosityList" option-label="name" />
            </div>
          </div>
          <div class="row q-mb-md q-ml-md">
            <div class="col-3 q-ml-sm">
              <q-btn unelevated no-caps dense class="q-px-sm" :ripple="false" color="primary"
                     :label="$t('ADMINPANELWEBCLIENT.BUTTON_DB_CREATE_TABLES')">
              </q-btn>
            </div>
            <div class="col-3">
              <q-btn unelevated no-caps dense class="q-px-sm" :ripple="false" color="primary"
                     :label="$t('ADMINPANELWEBCLIENT.BUTTON_DB_CREATE_TABLES')">
              </q-btn>
            </div>
            <div class="col-3">
              <q-btn unelevated no-caps dense class="q-px-sm" :ripple="false" color="primary"
                     :label="$t('ADMINPANELWEBCLIENT.BUTTON_DB_CREATE_TABLES')">
              </q-btn>
            </div>
          </div>
          <div class="row">
            <q-item>
              <q-item-section>
                <q-checkbox v-model="enableDebugLogging" color="teal">
                  <q-item-label caption>{{$t('LOGSVIEWERWEBCLIENT.LABEL_LOGGING_ENABLE_EVENTS')}}</q-item-label>
                </q-checkbox>
              </q-item-section>
            </q-item>
          </div>
          <div class="row q-mb-md q-ml-md">
            <div class="col-3 q-ml-sm">
              <q-btn unelevated no-caps dense class="q-px-sm" :ripple="false" color="primary"
                     :label="$t('ADMINPANELWEBCLIENT.BUTTON_DB_CREATE_TABLES')">
              </q-btn>
            </div>
            <div class="col-3">
              <q-btn unelevated no-caps dense class="q-px-sm" :ripple="false" color="primary"
                     :label="$t('ADMINPANELWEBCLIENT.BUTTON_DB_CREATE_TABLES')">
              </q-btn>
            </div>
            <div class="col-3">
              <q-btn unelevated no-caps dense class="q-px-sm" :ripple="false" color="primary"
                     :label="$t('ADMINPANELWEBCLIENT.BUTTON_DB_CREATE_TABLES')">
              </q-btn>
            </div>
          </div>
        </q-card-section>
      </q-card>
    </div>
  </q-scroll-area>
</template>

<script>
export default {
  name: "LoggingAdminSettings",
  data() {
    return {
      verbosity: '',
      enableDebugLogging: false,
      verbosityList: []
    }
  }
}
</script>

<style scoped>

</style>
