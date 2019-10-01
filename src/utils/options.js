const mainOptions = [
  { flag: '--apikey <key>', description: 'API Key' },
  { flag: '--project <id>', description: 'Tipe project' },
]

const addFlags = program => mainOptions.reduce((p, o) => p.option(o.flag, o.description), program)

module.exports = {
  addFlags,
}
