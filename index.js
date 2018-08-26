var downloadGitRepo = require('./download-git');

function fetchGit(options) {
    var {
        branchOrTag,
        source,
        target
    } = options;

    return downloadGitRepo(source, branchOrTag, target);
}

module.exports = fetchGit;