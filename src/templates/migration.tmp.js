const template = ctx => `
// this is a migration file
module.exports = db => {
  // ${ctx.message}
}

`
export default template
