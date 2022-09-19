const udp = require('dgram');

let WaveSimUdp = function(destPort, destIP) {
  let self = this;

  self.destPort = destPort;
  self.destIP = destIP;

  self.socket = udp.createSocket('udp4');
}

WaveSimUdp.prototype.stop = function() {
  let self = this;

  self.socket.close();
}

WaveSimUdp.prototype.send = function(data) {
  let self = this;

  //console.log(`udp sending data ${data.length} bytes`)
  self.socket.send(data, self.destPort, self.destIP, (err) =>{
    // error handling
    if(err) {
      console.log(`WaveSimUdp send error ${err}`)
    }
  });
}

module.exports = WaveSimUdp;