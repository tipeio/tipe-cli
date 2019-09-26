// const Chance = require('chance')
// const chance = new Chance()

const button = () => 'click me'
const text = () => '<p>text here</p>'
const markdown = () => '#This is markdown \n> hello there\n[link here](https://google.com)'
const image = text => {
  const txt64 = Buffer.from(text).toString('base64')
  return `https://assets.imgix.net/~text?txtclr=fff&bg=A8A2A1&txt64=${txt64}&txtfont64=TGF0bw&w=100&txtsize=40&fm=svg&h=400&txtalign=center%2Cmiddle`
}

module.exports = { button, text, markdown, image }
