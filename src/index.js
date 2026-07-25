#!/usr/bin/env node
'use strict';

const { runTui } = require('./tui');

runTui()
  .then(() => process.exit(0))
  .catch((error) => {
    process.stderr.write(`Error inesperado: ${error && error.message ? error.message : error}\n`);
    process.exit(1);
  });
