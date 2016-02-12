
var config = {
  serialPort: "/dev/cu.wchusbserial1410",
  tcpPort: 2947,
  context: "vessels.urn:mrn:signalk:uuid:28635A52-CA1B-11E5-BB61-74E35FF10656",
  sensors: {
    analog0: {
      mapping: "electrical.dc.batteries.house.voltage",
      transform: function(input) {
        return input / 40.92;
      }
    },
    analog1: {
      mapping: "electrical.dc.batteries.house.current",
      transform: function(input) {
        return (input - 512) / 17.066666667;
      }
    },
    analog2: {
      mapping: "electrical.dc.batteries.starting.voltage",
      transform: function(input) {
        return input / 40.92;
      }
    },
  }
};


var serialport = require("serialport");
var SerialPort = serialport.SerialPort;

console.error('Connecting to serial port');

var serialPort = new SerialPort(config.serialPort, {
  baudrate: 9600,
  parser: serialport.parsers.readline("\n")
});

serialPort.on("open", function () {
  console.error('Serial port connected');
  serialPort.write('1');
  serialPort.on('data', function(data) {
    var parsed = data.split(':');
    var sensor = parsed[0];
    if (config.sensors[sensor]) {
      var value = parseInt(parsed[1]);
      result = {
        "context": config.context,
        "updates": [
          {
            "source": {
              "device": config.serialPort,
              "timestamp": new Date(),
            },
            "values": [
              {
                "path": config.sensors[sensor].mapping,
                "value": config.sensors[sensor].transform(value)
              },
            ]
          },
        ]
      };
      console.log(JSON.stringify(result));
    }
  });
});
