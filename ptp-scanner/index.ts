import dgram = require ("dgram");
import process = require  ("process")

enum MessageType{
	SYNC=0x0,
	DELAY_REQ,
	PDELAY_REQ,
	PDELAY_RESP,
	FOLLOW_UP=0x8,
	DELAY_RESP,
	PDELAY_RESP_FOLLOW_UP,
	ANNOUNCE,
	SIGNALING,
	MANAGEMENT,
	/* marker only */
	PTP_MAX_MESSAGE
};

class PtPPacketHeader {
    _data: any;
    constructor(data) {
        this._data = data;
    }

    version() : number {
        return 0x0F & this._data.readInt8(1)
    }

    messageType() : number {
        return (0x0F & this._data.readInt8(0))
    }

    domain() : number {
        return this._data.readInt8(4)
    }
}

const socket = dgram.createSocket({ type: "udp4", reuseAddr: true });
const socket2 = dgram.createSocket({ type: "udp4", reuseAddr: true });
const PORT = 319;
const MULTICAST_ADDR = "224.0.1.129";

socket.bind(PORT);

socket.on("listening", function() {
    socket.addMembership(MULTICAST_ADDR);
    const address = socket.address();
    socket.on("message", function(message, rinfo) {
        let pack = new PtPPacketHeader(message)
      });
  });
  
  socket2.bind(PORT+1);

  socket2.on("listening", function() {
      socket2.addMembership(MULTICAST_ADDR);
      const address = socket2.address();
      socket2.on("message", function(message, rinfo) {
          let pack = new PtPPacketHeader(message)
          if(pack.messageType() == MessageType.ANNOUNCE) {
              console.log("Annouce !!!!!!")
              console.info(`Message from: ${rinfo.address}:${rinfo.port}, domain ${pack.domain()} for version ${pack.version()}`);
            }
        });
    });