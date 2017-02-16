

const exec = require('child_process').execSync;

/**
 * Проверяет есть ли файлы вне индекса
 * @return {Boolean}
 */
const hasNotIndexed = function () {
    return Boolean(exec('git diff-files').length);
};

/**
 * Проверяет появились новые файлы
 * @return {Boolean}
 */
const hasUntracked = function () {
    return Boolean(exec('git ls-files --exclude-standard --others').length);
};


module.exports = {
    hasNotIndexed,
    hasUntracked
};
