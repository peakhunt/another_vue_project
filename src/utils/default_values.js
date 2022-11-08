/*
const Store = require('electron-store');
const store = new Store();

const defaults = {
  version: "0.1",
  DEFAULT_TCP_SERVER_PORT: store.get('DEFAULT_TCP_SERVER_PORT', 10095),
  DEFAULT_UDP_SERVER_PORT: store.get('DEFAULT_UDP_SERVER_PORT', 10095),
  iDEFAULT_UDP_SERVER_IP: store.get('DEFAULT_UDP_SERVER_IP', '192.168.1.1'),
  DEFAULT_MAX_HISTORY: store.get('DEFAULT_MAX_HISTORY', 64),
  SimRandDataDefault: {
    minHeight: store.get('SimRandDataDefault.minHeight', 0.8),
    maxHeight: store.get('SimRandDataDefault.maxHeight', 1.2),
    minFrequency: store.get('SimRandDataDefault.minFrequency', 0.8),
    maxFrequency: store.get('SimRandDataDefault.maxFrequency', 1.2),
    minDirection: store.get('SimRandDataDefault.minDirection', 10),
    maxDirection: store.get('SimRandDataDefault.maxDirection', 33),
    changeInterval: store.get('SimRandDataDefault.changeInterval', 0.05),
  },
  dataIntervalMin: store.get('dataIntervalMin', 100),
  dataIntervalMax: store.get('dataIntervalMax', 10000),
  tcpServerPortMin: store.get('tcpServerPortMin', 1024),
  tcpServerPortMax: store.get('tcpServerPortMax', 65536),
  udpPortMin: store.get('udpPortMin', 1024),
  udpPortMax: store.get('udpPortMax', 65536),
  waveHeightMin: store.get('waveHeightMin', 0),
  waveHeightMax: store.get('waveHeightMax', 20),
  waveFrequencyMin: store.get('waveFrequencyMin', 0),
  waveFrequencyMax: store.get('waveFrequencyMax', 20),
  waveDirectionMin: store.get('waveDirectionMin', 0),
  waveDirectionMax: store.get('waveDirectionMax', 360),
  changeIntervalMin: store.get('changeIntervalMin', 0.05),
  changeIntervalMax: store.get('changeIntervalMax', 100),
  dataDurationMin: store.get('dataDurationMin', 0),
  dataDurationMax: store.get('dataDurationMax', 100),
};

if(store.get('version') === undefined ||
   store.get('version') !== defaults.version) {
  store.set(defaults);
}
*/

const defaults = {
  DEFAULT_TCP_SERVER_PORT: 10095,
  DEFAULT_UDP_SERVER_PORT: 10095,
  DEFAULT_UDP_SERVER_IP: "192.168.1.1",
  DEFAULT_MAX_HISTORY: 64,
  SimRandDataDefault: {
    minHeight: 0.8,
    maxHeight: 1.2,
    minFrequency: 0.8,
    maxFrequency: 1.2,
    minDirection: 10,
    maxDirection: 33,
    changeInterval: 60,
  },
  dataIntervalMin: 100,
  dataIntervalMax: 10000,
  tcpServerPortMin: 1024,
  tcpServerPortMax: 65536,
  udpPortMin: 1024,
  udpPortMax: 65536,
  waveHeightMin: 0,
  waveHeightMax: 20,
  waveFrequencyMin: 0,
  waveFrequencyMax: 20,
  waveDirectionMin: 0,
  waveDirectionMax: 360,
  changeIntervalMin: 1,
  changeIntervalMax: 9999,
  dataDurationMin: 1,
  dataDurationMax: 9999,
};

module.exports = defaults;