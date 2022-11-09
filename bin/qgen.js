#!/usr/bin/env node
const { program } = require("commander");
program
    .command('query [...pattern]', 'query to typescript function generator', { executableFile: './qgen-query.js' })
    .command('type', 'postgres type parser generator', { executableFile: './qgen-type.js' })
    .command('test', 'test', { executableFile: './qgen-test.js' })
    .parse()