let downloadUrl = require('download');

module.exports = {
	fetchGit:function(url, branchOrTag = 'master', dest, isSSH){
		let repo = this.url2Repo(url, branchOrTag);
		if(!isSSH){
			return this.downloadZip(repo, dest);
		}else{
			return this.downloadByClone(repo, dest);
		}
	},
	downloadByClone:function(){

	},
	url2Repo:function(url, branchOrTag){
		let reg = /((f|ht)tps?:\/\/[^\/]*\/|\w+@[^:]*?:)?([^\/]*\/[^\/]*?)(\.[^\/]*)?$/i;
		let matches = url.match(reg);
		let owerAndName = matches[3];
		let origin = matches[1] || 'https://github.com/';
		let repo = {
			origin,
			owerAndName,
			branchOrTag
		}
		if(!matches[2]){
			let rawOrigin = origin.split(/@|:/)[1];
			origin = 'https://' + rawOrigin +'/';
			repo.rawOrigin = rawOrigin;
			repo.type = 'ssh';
		}else{
			let protocolIdx = origin.indexOf(':');
			repo.rawOrigin = origin.substring(protocolIdx+3, origin.length - 2);
		}
		let uri = origin + owerAndName + '/archive/' + branchOrTag + '.zip';
		repo.uri = uri;
		return repo;
	},
	downloadZip:function (repo, dest){
		console.log('downloading:' + repo.uri);
		return downloadUrl(repo.uri, dest, { extract: true, strip: 1, mode: '666', headers: { accept: 'application/zip' } }).then(()=>repo).catch(err=>{err.repo = repo; throw err});
	}
}

