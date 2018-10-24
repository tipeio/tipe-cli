export const asyncWrap = promise => promise.then(r => [null, r]).catch(e => [e])
