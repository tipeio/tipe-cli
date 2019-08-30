const asyncWrap = promise => promise.then(res => [null, res]).catch(err => [err])
module.exports = asyncWrap
