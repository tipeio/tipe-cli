const mainOptions = [{ flag: '--apikey', description: 'API Key' }, { flag: '--project', description: 'Tipe project' }]
module.exports = program => mainOptions.reduce(o => program.option(o.flag, o.dedscription))
