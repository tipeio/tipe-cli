const _ = require('lodash')

const getMockContent = (field, base) => {
  const mocks = _.isArray(field.mocks) ? field.mocks : [base]
  return _.sample(mocks)
}

const button = field => ({
  value: getMockContent(field, 'click me')
})

const text = field => ({
  value: getMockContent(field, 'this is some text here')
})

const markdown = field => ({
  value: getMockContent(
    field,
    '#This is markdown \n> hello there\n[link here](https://google.com)'
  )
})

const code = field => ({
  value: getMockContent(field, `const name = 'tipe'`),
  data: { lang: 'javascript' }
})

const image = field => {
  const txt64 = Buffer.from('tipe').toString('base64')
  const url = `https://assets.imgix.net/~text?txtclr=fff&bg=3D4CF5&txt64=${txt64}=&txtfont64=TGF0bw&w=100&txtsize=40&fm=svg&h=100&txtalign=center%2Cmiddle`
  return {
    value: getMockContent(field, url)
  }
}

const html = field => ({
  value: getMockContent(
    field,
    '<p>this is some html <i>here</i>. Check out some <a href="https://tipe.io">docs</a></p>'
  )
})

const boolean = field => ({
  value: getMockContent(field, false)
})

module.exports = { button, text, markdown, image, code, html, boolean }
