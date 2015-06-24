//! UDPinput.js
//! receives NMEA messages over UDP from the boat network.
//! version : 0.1
//! salmenlinna.fi

var util = require('util');
var winston = require('winston');
var _ = require('lodash');
var nmea = require('../modules/nmea');
var ip = require('../bower_components/node-ip');
var EventEmitter = require('events').EventEmitter;
var dgram = require('dgram');

function UDPinput(options) {
 //   EventEmitter.call(this);

    this._UDPServer = null;
    this._options = options;
//    this._now = {};
//    this._queue = [];

    winston.info('UDP Input initialization...');
}
util.inherits(UDPinput, EventEmitter);

UDPinput.prototype.start = function() {
    if ( this._UDPServer === null ) {
        
        var port = this._options.port;
        var host = this._options.host;

        this._myIP = ip.address();
        winston.info('IP address: ' + this._myIP);

        this._UDPServer = dgram.createSocket('udp4');
        this._UDPServer.bind(port, host);

        // bind to message handler
        this._UDPServer.on('message', _.bind(this.onNewMessage, this));

        // bind to listening handler
        this._UDPServer.on('listening', _.bind(this.onReady, this));
    }
};

//handle new message from the UDP listener
UDPinput.prototype.onNewMessage = function(message, sender) {   
    message = message.toString();
    if ( 'whitelist' in this._options ) {
        var messageId = nmea.messageId(message);
        if ( !_.contains(this._options.whitelist, messageId) ) {
            winston.debug('%s.onNewLine: Message [%s] not whitelisted.  Supressing.', this._options.name, messageId);
            return;
        }
    }
    this.emit('message', message, this);
};

UDPinput.prototype.onReady =function(){
    var address = this._UDPServer.address();
    winston.info('UDP Input listening on ' + address.address + ":" + address.port);
};

UDPinput.prototype.write = function() {
    // pass
};
module.exports = UDPinput;
