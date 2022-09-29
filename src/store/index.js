import Vue from 'vue'
import Vuex from 'vuex'
import WaveSimulator from '@/utils/wave_simulator'
import default_values from '@/utils/default_values'

let wave_sim = null;

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    appName: 'WaveSim',
    version: 'v0.2',

    running: false,
    runningTime: 0,
    manualMode: true,
    currentValue: {
      height: 0.0,
      frequency: 0.0,
      direction: 0,
    },
    heightHistory: new Array(default_values.DEFAULT_MAX_HISTORY).fill(0),
    frequencyHistory: new Array(default_values.DEFAULT_MAX_HISTORY).fill(0),
    directionHistory: new Array(default_values.DEFAULT_MAX_HISTORY).fill(0),

    dataIntervalValid: true,
    tcpSettingValid: true,
    udpSettingValid: true,
    randomDataValid: true,

    numTCPClients: 0,
    tcpTxCount: 0,
    udpTxCount: 0,

    settingsFileName: '',

    simDataNdx: 0,

    settings: {
      dataInterval: 1000,
      tcpServer: {
        activated: true,
        port: default_values.DEFAULT_TCP_SERVER_PORT,
      },
      udpServer: {
        activated: true,
        ip: "192.168.1.1",
        port: 10095,
      },
      simDataList: [
        { height: 1.0, frequency: 4.0, direction: 60, duration: 10 },
        { height: 2.0, frequency: 5.7, direction: 60, duration: 10 },
        { height: 3.0, frequency: 7.1, direction: 60, duration: 10 },
        { height: 5.0, frequency: 8.9, direction: 60, duration: 10 },
      ],
      simRandomData: {
        minHeight: default_values.SimRandDataDefault.minHeight,
        maxHeight: default_values.SimRandDataDefault.maxHeight,
        minFrequency: default_values.SimRandDataDefault.minFrequency,
        maxFrequency: default_values.SimRandDataDefault.maxFrequency,
        minDirection: default_values.SimRandDataDefault.minDirection,
        maxDirection: default_values.SimRandDataDefault.maxDirection,
        changeInterval: default_values.SimRandDataDefault.changeInterval,
      },
    },
  },
  getters: {
    appName(state) {
      return state.appName;
    },
    appVersion(state) {
      return state.version;
    },
    simRunning(state) {
      return state.running;
    },
    currentValue(state) {
      return state.currentValue;
    },
    simDataList(state) {
      return state.settings.simDataList;
    },
    isItemTop: (state) => (item) => {
      return state.settings.simDataList.indexOf(item) == 0;
    },
    isItemBottom: (state) => (item) => {
      return state.settings.simDataList.indexOf(item) == (state.settings.simDataList.length - 1);
    },

    settingsDataInterval(state) {
      return state.settings.dataInterval;
    },
    isDataIntervalValid(state) {
      return state.dataIntervalValid;
    },
    isTcpSettingValid(state) {
      return state.tcpSettingValid;
    },
    isTcpServerActivated(state) {
      return state.settings.tcpServer.activated;
    },
    settingsTCPServerPort(state) {
      return state.settings.tcpServer.port;
    },
    isUdpSettingValid(state) {
      return state.udpSettingValid;
    },
    settingsUdpServerPort(state) {
      return state.settings.udpServer.port;
    },
    settingsUdpServerIP(state) {
      return state.settings.udpServer.ip;
    },
    isUdpServerActivated(state) {
      return state.settings.udpServer.activated;
    },
    isRandomDataValid(state) {
      return state.randomDataValid;
    },
    settingsRandMinHeight(state) {
      return state.settings.simRandomData.minHeight;
    },
    settingsRandMaxHeight(state) {
      return state.settings.simRandomData.maxHeight;
    },
    settingsRandMinFrequency(state) {
      return state.settings.simRandomData.minFrequency;
    },
    settingsRandMaxFrequency(state) {
      return state.settings.simRandomData.maxFrequency;
    },
    settingsRandMinDirection(state) {
      return state.settings.simRandomData.minDirection;
    },
    settingsRandMaxDirection(state) {
      return state.settings.simRandomData.maxDirection;
    },
    settingsRandChangeInterval(state) {
      return state.settings.simRandomData.changeInterval;
    },
    numTCPClients(state) {
      return state.numTCPClients;
    },
    tcpTxCount(state) {
      return state.tcpTxCount;
    },
    udpTxCount(state) {
      return state.udpTxCount;
    },
    isManualMode(state) {
      return state.manualMode;
    },
    isSimRunning(state) {
      return state.running;
    },
    isSettingsOK(state) {
      if (state.dataIntervalValid &&
          state.randomDataValid &&
          state.tcpSettingValid &&
          state.udpSettingValid) {
        return true;
      }
      return false;
    },
    simRunningTime(state) {
      return state.runningTime;
    },
    currentHeight(state) {
      return state.currentValue.height;
    },
    currentFrequency(state) {
      return state.currentValue.frequency;
    },
    currentDirection(state) {
      return state.currentValue.direction;
    },
    settingsFileName(state) {
      return state.settingsFileName;
    },
    settings(state) {
      return state.settings;
    },
    heightHistory(state) {
      return state.heightHistory;
    },
    frequencyHistory(state) {
      return state.frequencyHistory;
    },
    directionHistory(state) {
      return state.directionHistory;
    },
    simDataNdx(state) {
      return state.simDataNdx;
    },
    numSimDataList(state) {
      return state.settings.simDataList.length;
    }
  },
  mutations: {
    moveItemDown(state, item) {
      let ndx = state.settings.simDataList.indexOf(item);

      // first remove
      state.settings.simDataList.splice(ndx, 1);
      state.settings.simDataList.splice(ndx + 1, 0, item);
    },
    moveItemUp(state, item) {
      let ndx = state.settings.simDataList.indexOf(item);

      // first remove
      state.settings.simDataList.splice(ndx, 1);
      state.settings.simDataList.splice(ndx - 1, 0, item);
    },
    removeItem(state, item) {
      let ndx = state.settings.simDataList.indexOf(item);

      state.settings.simDataList.splice(ndx, 1);
    },
    addNewItem(state, item) {
      state.settings.simDataList.push(item);
    },
    modifyItem(state, { old, mod }) {
      let ndx = state.settings.simDataList.indexOf(old);

      // first remove
      state.settings.simDataList.splice(ndx, 1);
      state.settings.simDataList.splice(ndx, 0, mod);
    },
    setDataInterval(state, v) {
      state.settings.dataInterval = v;
    },
    setDataIntervalValid(state, v) {
      state.dataIntervalValid = v;
    },
    setTcpSettingValid(state, v) {
      state.tcpSettingValid = v;
    },
    setTcpServerActivated(state, v) {
      if (v) {
        state.settings.tcpServer.activated = true;
      } else {
        state.settings.tcpServer.activated = false;
        state.settings.tcpServer.port = default_values.DEFAULT_TCP_SERVER_PORT;
      }
    },
    setTcpServerPort(state, v) {
      state.settings.tcpServer.port = v;
    },
    setUdpSettingValid(state, v) {
      state.udpSettingValid = v;
    },
    setUdpServerPort(state, v) {
      state.settings.udpServer.port = v;
    },
    setUdpServerIP(state, v) {
      state.settings.udpServer.ip = v;
    },
    setUdpServerActivated(state, v) {
      if (v) {
        state.settings.udpServer.activated = true;
      } else {
        state.settings.udpServer.activated = false;
        state.settings.udpServer.port = default_values.DEFAULT_UDP_SERVER_PORT;
        state.settings.udpServer.ip = default_values.DEFAULT_UDP_SERVER_IP;
      }
    },
    setRandomDataValid(state, v) {
      state.randomDataValid = v;
    },
    setRandDataMinHeight(state, v) {
      state.settings.simRandomData.minHeight = v;
    },
    setRandDataMaxHeight(state, v) {
      state.settings.simRandomData.maxHeight = v;
    },
    setRandDataMinFrequency(state, v) {
      state.settings.simRandomData.minFrequency = v;
    },
    setRandDataMaxFrequency(state, v) {
      state.settings.simRandomData.maxFrequency = v;
    },
    setRandDataMinDirection(state, v) {
      state.settings.simRandomData.minDirection = v;
    },
    setRandDataMaxDirection(state, v) {
      state.settings.simRandomData.maxDirection = v;
    },
    setRandDataChangeInterval(state, v) {
      state.settings.simRandomData.changeInterval = v;
    },
    setNumTCPClients(state, v) {
      state.numTCPClients = v;
    },
    setManualMode(state, v) {
      state.manualMode = v;
    },
    setSimRunning(state, v) {
      state.running = v;
    },
    setSimRunningTime(state, v) {
      state.runningTime = v;
    },
    setSettingsFileName(state, v) {
      state.settingsFileName = v;
    },
    setSimDataNdx(state, v) {
      state.simDataNdx = v;
    },
    resetRuntime(state) {
      state.runningTime = 0;
      state.currentValue.height = 0;
      state.currentValue.frequency = 0;
      state.currentValue.direction = 0;

      state.heightHistory = new Array(default_values.DEFAULT_MAX_HISTORY).fill(0);
      state.frequencyHistory = new Array(default_values.DEFAULT_MAX_HISTORY).fill(0);
      state.directionHistory = new Array(default_values.DEFAULT_MAX_HISTORY).fill(0);

      state.numTCPClients = 0;
      state.tcpTxCount = 0;
      state.udpTxCount = 0;

      state.simDataNdx = 0;
    },
    setCurrentValue(state, { height, frequency, direction }) {
      state.currentValue.height = height;
      state.currentValue.frequency = frequency;
      state.currentValue.direction = direction;

      state.heightHistory.push(height);
      state.frequencyHistory.push(frequency);
      state.directionHistory.push(direction);

      if(state.heightHistory.length > default_values.DEFAULT_MAX_HISTORY) {
        state.heightHistory.shift();
      }

      if(state.frequencyHistory.length > default_values.DEFAULT_MAX_HISTORY) {
        state.frequencyHistory.shift();
      }

      if(state.directionHistory.length > default_values.DEFAULT_MAX_HISTORY) {
        state.directionHistory.shift();
      }
    },
    setSettings(state, settings) {
      state.settings = settings;
    },
    setTcpTxCount(state, v) {
      state.tcpTxCount = v;
    },
    setUdpTxCount(state, v) {
      state.udpTxCount = v;
    },
  },
  actions: {
    moveItemDown({ commit }, item) {
      commit('moveItemDown', item);
    },
    moveItemUp({ commit }, item) {
      commit('moveItemUp', item);
    },
    removeItem( { commit }, item) {
      commit('removeItem', item);
    },
    addNewItem( { commit }, item) {
      commit('addNewItem', item);
    },
    modifyItem( { commit }, param) {
      commit ( 'modifyItem', param);
    },
    startSimulation(_, callback) {
      wave_sim.start(callback);
    },
    stopSimulation(_, callback) {
      wave_sim.stop(callback);
    },
  },
  modules: {
  },
  strict: true,
})

wave_sim = new WaveSimulator(store);

export default store;