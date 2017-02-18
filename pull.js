#! /usr/bin/env node --harmony

const fs = require('fs');
const path = require('path');
const execSync = require('child_process').execSync;

let onlyPrint = false;

const exec = function (command) {
    // TODO: Сделать нормальное логирование типа .bash_history или как то еще
    // TODO: и учесть там что команды могут вызыватсься из разных репозириев
    console.log(command.green);

    let output = execSync(command);

    console.log(output.toString());
    // TODO: пофиксить onlyPrint, чтобы срабатывал не на всех командах, а только на ключевых
    return !onlyPrint && output;
};

 const program = require('commander');
//const program = require('commander-completion');
const colors = require('colors');

const increaseArg = (v, total) => total + 1;

const {getCurrentBranch} = require('./helpers/branch');

program
    .version('0.0.1')
    .option('-v, --verbose', 'A value that can be increased', increaseArg, 0)
    .parse(process.argv);


let remote = 'origin';
let branch = getCurrentBranch();


try {
    // TODO: передавать остальные параметры в конец, например, -X theirs
    exec(`git pull ${remote} ${branch}`);

} catch (err) {
    if (err){
        console.log('something was wrong...'.red);
    }

    // TODO: git reset && git checkout current branch

    if (err.output) {
        console.log(err.output && err.output[1].toString());
    }

    if (err.message) {
        // TODO: обрабатывать и нормально выводить ошибки с подсветкой
        console.log(err.message.red);
    } else {
        console.log(err);
    }
}

