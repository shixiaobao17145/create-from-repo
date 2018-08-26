let downloadUrl = require('download');
module.exports = function (url, branchOrTag = 'master', dest) {
    let reg = /([^\/]*\/[^\/]*?)(\.[^\/]*)?$/i;
    let matches = url.match(reg);
    let owerAndName = matches[1];
    let origin = 'https://github.com/'
    let uri = origin + owerAndName + '/archive/' + branchOrTag + '.zip';
    console.log('downloading:' + uri);
    return downloadUrl(uri, dest, { extract: true, strip: 1, mode: '666', headers: { accept: 'application/zip' } });
}