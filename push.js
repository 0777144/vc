#! /usr/bin/env node --harmony

const execSync = require('child_process').execSync;

let onlyPrint = false;
let debug = false;

const exec = function (command) {
    // TODO: Сделать нормальное логирование типа .bash_history или как то еще
    console.log(command.green);

    let output = execSync(command);

    console.log(output.toString());
    // TODO: пофиксить onlyPrint, чтобы срабатывал не на всех командах, а только на ключевых
    return !onlyPrint && output;
}

const execQuiet = function (command) {
    if (debug) {
        return exec(command);
    }

    return execSync(command);
}

 const program = require('commander');
// TODO --branch compilataion
//const program = require('commander-completion');
const colors = require('colors');

const increaseArg = (v, total) => total + 1;

program
    .version('0.0.1')
    .usage('push -am \'fix typo\'')
    .option('-m, --message [value]', 'Сообщение комита')
    .option('-a, --all', 'git add -A')
    .option('-A, --all-tracked', 'git add -u')
    .option('-f, --force', 'force push')
    .option('--amend', '')
    .option('--debug', '')
    // TODO --tags
    .option('--tags', '')
    // TODO --remote
    .option('-r, --remote', '')
    .option('--only-print', 'Только выводит команды которые должны быть выполнены')
    .option('-v, --verbose', 'A value that can be increased', increaseArg, 0)
    .parse(process.argv);


onlyPrint = program.onlyPrint;
debug = program.debug;

let message = program.message; // 'Some changes'
let all = program.all;
let allTracked = program.allTracked;
let amend = program.amend ? '--amend' : '';
let force = program.force;
let remote = program.remote || 'origin';


if (debug) {
    console.log(parent);

    // process.exit();
}

let commited = false; // Был ли сделан коммит в текущую ветку

try {
    if (typeof all !== 'undefined') {
        exec('git add -A');
    }

    if (typeof allTracked !== 'undefined') {
        exec('git add -A');
    }

    if (typeof message !== 'undefined') {

        exec(`git commit -m '${message}' ${amend}`);

        commited = true;
        execQuiet('git rev-parse HEAD').toString().trim();

    } else if (amend) {
        exec(`git commit --no-edit ${amend}`);

        execQuiet('git rev-parse HEAD').toString().trim();
    }

    // TODO: ensure remote exists
    if (!force) {
        exec(`git push ${remote} HEAD`);
    } else {
        exec(`git push ${remote} HEAD --force`);
    }

} catch (err) {
    if (err){
        console.log('something was wrong...'.red);
    }

    if (err.output) {
        console.log(err.output && err.output[1].toString());
    }

    if (err.message) {
        // TODO: обрабатывать и нормально выводить ошибки с подсветкой
        console.log(err.message.red);
    } else {
        console.log(err);
    }

    if (commited) {
        exec('git reset HEAD~1');
    }

}

