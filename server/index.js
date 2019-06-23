const express = require('express');
const bootable = require('bootable');

const checkFeasilibity = require('./handlers/checkFeasibility');

const app = bootable(express());

const PORT = process.env.PORT || 3000;

app.phase(bootable.initializers('server/boot'));

app.boot(err => {
  if (err) {
    throw err;
  }
});

app.get('/feasibility/:profileCode', checkFeasilibity);

console.log(`Listening on port ${PORT}`);
app.listen(PORT);
