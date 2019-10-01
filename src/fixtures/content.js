const Tipe = require('@tipe/js').default

const tipe = Tipe({ offline: true, project: 1234 })

tipe.document
  .list()
  .then(d => console.log(JSON.stringify(d.data[0], null, 2)))
  .catch(e => console.error(e))
