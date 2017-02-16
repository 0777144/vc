/**
 * @description
 * Получение данных о пользователе из конфига в ~/.gitconfig
 */


const readFileSync = require('fs').readFileSync;
const resolve = require('path').resolve;
const parse = require('ini').parse;

// TODO: ensure config exists
const configPath = resolve(process.env.HOME, '.gitconfig');
const config = parse(readFileSync(configPath, 'utf-8'));

const user = config.user;

module.exports = user;
