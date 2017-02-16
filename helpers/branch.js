const R = require('ramda');
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
};

const execQuiet = function (command) {
    if (debug) {
        return exec(command);
    }

    return execSync(command);
};


/**
 * Очищает нвзвание ветки от звездочки в начале и пробелов по ее концам, удаляет remotes/origin/
 * @param {String} branch
 * @return {String}
 */
const clearBranchName = function (branch) {
    const branchRE = /[a-z-\/0-9]+/i;
    const remoteRE = /remotes\/origin\//;

    const matchBrancheRE = branch => branchRE.exec(branch);
    const removeRemote = branch => branch.replace(remoteRE, '');

    return R.pipe(matchBrancheRE, R.path([0]), R.defaultTo(''), removeRemote)(branch);
};

/**
 * Возвращает список доступных веток
 * @return {Array<String>}
 */
const getAllBranches = function () {
    const matchBranches = R.pipe(R.map(clearBranchName), R.uniq);

    let branches = execQuiet('git branch --all --sort=-committerdate').toString().split('\n');

    return matchBranches(branches);
};

/**
 * Возвращает список доступных веток по номеру задачи
 * @param {String/Number} RE
 * @return {Array<String>}
 */
const getAllBranchesByRE = function(RE) {
    let regexp = new RegExp(RE);
    let branches = getAllBranches();

    return R.filter(branch => regexp.test(branch))(branches);
};

/**
 * Возвращает последнюю обновленную ветку по регулрному выражению
 * @param {String} RE
 * @return {String}
 */
const getBranchByRE = function(RE) {
    let branches = getAllBranchesByRE(RE);

    if (!branches[0]) {
        // TODO: Правильно бросать исключения с типом ошибки чтобы потом нормально обработать
        throw new Error(`Can\'not fild brach by RE: ${RE}`);
    }

    return branches[0];
};

/**
 * Возвращает текущую ветку
 * @return {String}
 */
const getCurrentBranch = function () {
    return clearBranchName(execQuiet('git rev-parse --abbrev-ref HEAD'));
};

/**
 * Проверяет наличие ветки
 * @param {String} branch
 * @return {Boolean}
 */
const isBrachExists = function (branch) {
    // TODO: определиться какой способ выбрать (проверить на несуществующих ветках и ветках существующих только в удаленном репозитории)
    // Если ветки не существует эта команда завалится
    // Command failed: git rev-parse feature/somefeature --quiet
    // fatal: ambiguous argument 'feature/somefeature': unknown revision or path not in the working tree.
    //     Use '--' to separate paths from revisions, like this:
    // 'git <command> [<revision>...] -- [<file>...]'
    // return Boolean(execQuiet(`git rev-parse ${branch} --quiet`).length);

    // Если ветки не существует эта команда завалится
    // Command failed: git show-ref feature/somefeature --quiet
    // return Boolean(execQuiet(`git show-ref ${branch} --quiet`).length);


    // Если указать параметр --quiet, то Boolean(execQuiet(`git show-ref ${branch} --quiet`).length); вернет false
    try {
        return Boolean(execQuiet(`git show-ref ${branch}`).length);
    } catch (err) {
        return false;
    }
};


module.exports = {
    getAllBranches,
    getAllBranchesByRE,
    getBranchByRE,
    getCurrentBranch,
    isBrachExists
};
