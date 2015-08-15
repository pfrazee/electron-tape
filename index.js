var tape = require('tape')
var path = require('path')

module.exports = function (clientFile, cb) {
  // handle (cb) signature (browser thread)
  if (typeof clientFile == 'function' && !cb) {
    cb = clientFile
    clientFile = null
    return cb(tape) // :TODO: send tape client
  }

  // main thread
  var ipc = require('ipc')
  var BrowserWindow = require('browser-window')
  require('app').on('ready', function () {
    var win = new BrowserWindow({ width: 1030, height: 720 })
    win.loadUrl('file://' + path.join(__dirname, 'index.html'))
    win.openDevTools()

    // tell the client what to load
    ipc.once('fetch-testfile', function(e) {
      e.returnValue = clientFile
    })

    // run the server once the client reports ready
    ipc.once('ready', function () {
      cb(tape, win) // :TODO: send tape server
    })
  })
}