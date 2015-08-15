# Electron Tape

A [tape](npm.im/tape) testing harness for electron apps.

## Usage

To use electron-tape, you create two test files: one for the main thread, and one for the ui thread.

Both files will be loaded and run simultaneously. The test results will be output in the logs of their respective threads. Both threads will remain open so you can check the results.

To run the tests, call `electron --v=-1 <main-thread-testfile>`.

**main-test.js:**

```js
var etape    = require('electron-tape')
var ipc      = require('ipc')

etape(__dirname+'/ui-test.js', function (tape, window) {

  tape('send/receive data', function (t) {
    // send 1, 2, 3
    window.webContents.send('test-channel', 1)
    window.webContents.send('test-channel', 2)
    window.webContents.send('test-channel', 3)

    // receive 1, 2, 3
    var n = 0
    ipc.on('test-channel', function (e, v) {
      t.equal(v, ++n)
      if (n === 3)
        t.end()
    })
  })

})
```

**ui-test.js:**

```js
var etape    = require('electron-tape')
var ipc      = require('ipc')

etape(function (tape, window) {

  tape('send/receive data', function (t) {
    // send 1, 2, 3
    ipc.send('test-channel', 1)
    ipc.send('test-channel', 2)
    ipc.send('test-channel', 3)

    // receive 1, 2, 3
    var n = 0
    ipc.on('test-channel', function (e, v) {
      t.equal(v, ++n)
      if (n === 3)
        t.end()
    })
  })

})
```