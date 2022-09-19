const net = require('net');

let WaveSimTcpServer = function (vuex, port) {
  this.vuex = vuex;
  this.clients = [];
  this.port = port;
  this.sSocket = null;
}

WaveSimTcpServer.prototype.start = function (callback) {
  let self = this;

  self.clients = [];
  self.sSocket = net.createServer((cSocket) => {
    //
    // accept handling
    //
    console.log('CONNECTED ' + cSocket.remoteAddress + ':' + cSocket.remotePort );

    cSocket.setKeepAlive(true);
    cSocket.setNoDelay(true);

    self.clients.push({
      name: cSocket.remoteAddress + cSocket.remotePort,
      socket: cSocket,
    });

    self.vuex.commit('setNumTCPClients', self.clients.length)

    cSocket.on('end', () => {
      let ndx = self.clients.findIndex((client) => {
        if (client.socket === cSocket) {
          return true;
        }
        return false;
      });

      if (ndx !== -1) {
        console.log('CLOSED ' + cSocket.remoteAddress + ':' + cSocket.remotePort );
        cSocket.destroy();
        self.clients.splice(ndx, 1);
        self.vuex.commit('setNumTCPClients', self.clients.length)
      }
    });

    // eslint-disable-next-line no-unused-vars
    cSocket.on('data', (chunk) => {
      // just ignore any ingress traffic
    });
    cSocket.on('error', (err) => {
      console.log(`client socket error ${err}`);
      cSocket.emit('end');
    });
  });


  self.sSocket.on('error', (err) => {
    // handle any error
    console.log('TCP SERVER Error ' + err);
    callback(err);
  });

  self.sSocket.listen(self.port, () => {
    console.log(`TCP SERVER Started ${self.port}`);
    callback();
  });
}

WaveSimTcpServer.prototype.stop = function (callback) {
  let self = this;

  self.clients.forEach((client) => {
    client.socket.destroy();
  });

  self.clients = [];
  self.vuex.commit('setNumTCPClients', self.clients.length)

  self.sSocket.close(() => {
    // server really stopped
    console.log('TCP SERVER stopped');
    self.sSocket.unref();
    callback();
  });
}

WaveSimTcpServer.prototype.sendToClients = function (data) {
  let self = this
  let count = 0;

  //console.log(`tcp sending data ${data.length} bytes`)
  self.clients.forEach((client) => {
    client.socket.write(data);
    count = count + 1;
  });

  return count;
}

module.exports = WaveSimTcpServer;