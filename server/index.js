const express = require('express');
const bootable = require('bootable');

const app = bootable(express());

app.phase(bootable.initializers('server/boot'));

const PORT = process.env.PORT || 3000;

app.boot(err => {
  if (err) {
    throw err;
  }
  console.log(`Listening on port ${PORT}`);
  app.listen(PORT);
});
