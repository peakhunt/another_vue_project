const WaveSimTcpServer = require('@/utils/wavesim_tcp_server');
const WaveSimUdp = require('@/utils/wavesim_udp')
const WaveRadarPkt = require('@/utils/waveradar_pkt')

const wavePkt = new WaveRadarPkt(20);

//
// WaveSimulator constructor
//
let WaveSimulator = function(vuex) {
    this.oneSecTimer = null;
    this.vuex = vuex;
    this.manualSimTimer = null;
    this.randomSimTimer = null;
    this.txTimer = null;

    this.tcpServer = null;
    this.udp = null;
}

//
// WaveSimulator privates
//
function getRandom(min, max) {
  let v = Math.random() * (max - min) + min;

  v = v.toFixed(2);
  v = parseFloat(v);
  return v;
}

function executeCurrentManualItem(self) {
  let vuex = self.vuex;
  let simDataList = vuex.getters.simDataList;
  let ndx = vuex.getters.simDataNdx;
  let simItem = simDataList[ndx];

  let delay = simItem.duration * 60 * 1000;   // minute -> ms

  vuex.commit('setCurrentValue', {
    height: simItem.height,
    frequency: simItem.frequency,
    direction: simItem.direction,
  });

  self.manualSimTimer = setTimeout(() => {
    let ndx = vuex.getters.simDataNdx;
    ndx = ndx + 1;
    if (ndx >= simDataList.length) {
      ndx = 0;
    }
    vuex.commit('setSimDataNdx', ndx);
    executeCurrentManualItem(self);
  }, delay);
}

function startManualSimulation(self) {
  executeCurrentManualItem(self);
}

function stopManualSimulation() {
}

function doRandomSim(self, cfg) {
  let vuex = self.vuex;

  let height = getRandom(cfg.minHeight, cfg.maxHeight);
  let frequency = getRandom(cfg.minFrequency, cfg.maxFrequency);

  //
  // direction needs special care.
  //
  let minD = cfg.minDirection;
  let maxD = cfg.maxDirection;

  if (maxD < minD) {
    maxD = maxD + 360;
  }
  let direction = getRandom(minD, maxD);

  if (direction >= 360) {
    direction = direction - 360
    direction = parseFloat(direction.toFixed(2));
  }

  vuex.commit('setCurrentValue', {
    height: height,
    frequency: frequency,
    direction: direction,
  });
}

function startRandomSimulation(self) {
  let vuex = self.vuex;
  let mh1 = vuex.getters.settingsRandMinHeight;
  let mh2 = vuex.getters.settingsRandMaxHeight;
  let mf1 = vuex.getters.settingsRandMinFrequency;
  let mf2 = vuex.getters.settingsRandMaxFrequency;
  let md1 = vuex.getters.settingsRandMinDirection;
  let md2 = vuex.getters.settingsRandMaxDirection;

  let delay = vuex.getters.settingsRandChangeInterval * 60 * 1000;   // minute -> ms

  let cfg = {
    minHeight: mh1 < mh2 ? mh1 : mh2,
    maxHeight: mh1 > mh2 ? mh1 : mh2,
    minFrequency: mf1 < mf2 ? mf1 : mf2,
    maxFrequency: mf1 > mf2 ? mf1 : mf2,
    minDirection: md1,
    maxDirection: md2,
  };

  doRandomSim(self, cfg);

  self.randomSimTimer = setInterval(() => {
    doRandomSim(self, cfg);
  }, delay);
}

function stopRandomSimulation() {
}

function sendWaveData(self) {
  let vuex = self.vuex;

  wavePkt.header.Hs3D_1 = vuex.getters.currentHeight;       // height
  wavePkt.header.Pwp3D_1 = vuex.getters.currentFrequency;   // frequency
  wavePkt.header.Pwd3D_1 = vuex.getters.currentDirection;   // direction

  let data = wavePkt.encode();
  
  if (vuex.getters.isUdpServerActivated) {
    let udpTxCount = vuex.getters.udpTxCount;

    self.udp.send(data);

    udpTxCount = udpTxCount + 1;

    vuex.commit('setUdpTxCount', udpTxCount);
  }

  if (vuex.getters.isTcpServerActivated) {
    let tcpTxCount = vuex.getters.tcpTxCount;
    let count;

    count = self.tcpServer.sendToClients(data);
    if (count !== 0) {
      tcpTxCount = tcpTxCount + count;
      vuex.commit('setTcpTxCount', tcpTxCount);
    }
  }
}

//
// WaveSimulator members
//
WaveSimulator.prototype.start = function (callback) {
  let self = this;
  let vuex = self.vuex;

  vuex.commit('resetRuntime');
  vuex.commit('setSimRunning', true);

  if (vuex.getters.isManualMode) {
    startManualSimulation(self);
  } else {
    startRandomSimulation(self);
  }

  self.oneSecTimer = setInterval(() => {
    let v = vuex.getters.simRunningTime

    v = v + 1
    vuex.commit('setSimRunningTime', v);
  }, 1000);

  let txInterval = vuex.getters.settingsDataInterval;

  self.txTimer = setInterval(() => {
    sendWaveData(self);
  }, txInterval);

  if (vuex.getters.isUdpServerActivated) {
    self.udp = new WaveSimUdp(vuex.getters.settingsUdpServerPort, vuex.getters.settingsUdpServerIP);
  }

  if (vuex.getters.isTcpServerActivated) {
    // eslint-disable-next-line no-unused-vars
    self.tcpServer = new WaveSimTcpServer(vuex, vuex.getters.settingsTCPServerPort);
    self.tcpServer.start((err) => {
      if (err) {
        console.log('faied to start TCP server')
      }
      if (callback) {
        callback();
      }
    });
  } else {
    if (callback) {
      setTimeout(() => {
        callback();
      }, 0);
    }
  }
}

WaveSimulator.prototype.stop = function(callback) {
  let self = this;
  let vuex = self.vuex;

  if (vuex.getters.isManualMode) {
    stopManualSimulation(self);
  } else {
    stopRandomSimulation(self);
  }

  vuex.commit('setSimRunning', false)

  clearInterval(self.oneSecTimer);
  clearInterval(self.txTimer);
  clearTimeout(self.manualSimTimer);
  clearInterval(self.randomSimTimer);

  self.oneSecTimer = null;
  self.txTimer = null;
  self.manualSimTimer = null;
  self.randomSimTimer = null;

  if (vuex.getters.isUdpServerActivated) {
    self.udp.stop();
  }

  if (vuex.getters.isTcpServerActivated) {
    self.tcpServer.stop(() => {
      if(callback) {
        callback();
      }
    });
  } else {
    if (callback) {
      setTimeout(() => {
        callback();
      }, 0);
    }
  }
}

module.exports = WaveSimulator;