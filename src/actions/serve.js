const { getUserFile } = require('../utils/paths')
const { createServer } = require('../server')
const boxen = require('boxen')
const logSymbols = require('log-symbols')
const chalk = require('chalk')
const mocks = require('../mocks')
const _ = require('lodash')
const nano = require('nanoid')
const Chance = require('chance')

const chance = new Chance()
const docsPerTemplate = 10

const getFieldvalue = (template, field) => {
  switch (field.type) {
    case 'button':
      return mocks.button()
    case 'image':
      return mocks.image(field.name)
    case 'markdown':
      return mocks.markdown()
    default:
      return mocks.text()
  }
}

const formatFields = (fields, template, getValue = getFieldvalue) =>
  fields.reduce((fields, field) => {
    const final = {
      name: field.name,
      id: field.id,
      type: field.type,
      data: {},
      value: getValue(template, field),
    }
    fields[field.id] = final
    return fields
  }, {})

const createDocsForTemplate = template =>
  _.times(docsPerTemplate, () => ({
    id: nano(),
    fields: formatFields(template.fields, template),
    template: {
      id: template.id,
      name: template.name,
    },
    createdBy: {
      firstName: chance.first(),
      lastName: chance.last(),
      email: chance.email(),
    },
    refs: _.size(template.refs) ? formatFields(template.refs, template, () => false) : {},
  }))

const createMockDocuments = templates => {
  const allDocs = _.flatten(templates.map(createDocsForTemplate))

  return allDocs.map(doc => {
    if (_.size(doc.refs)) {
      doc.refs = _.reduce(
        doc.refs,
        (refs, ref) => {
          const match = _.sample(allDocs.filter(d => d.template.id === ref.type))
          refs[ref.id] = {
            ...refs,
            value: match.id,
          }

          return refs
        },
        {},
      )
    }
    return doc
  })
}

module.exports = program => {
  const p = program.command('serve', 'Push up your templates')

  return p
    .option('--port <port>', 'Port for offline mock API', program.INT, 8300)
    .option('--templates -t <path>', 'Path to Templates', program.STRING, null, true)
    .action(async (args, options, logger) => {
      let templates
      try {
        templates = JSON.parse(getUserFile(options.templates))
      } catch (e) {
        logger.error(logSymbols.error, e.message)
        process.exit(1)
      }

      if (!templates.templates) {
        logger.error(logSymbols.error, 'Missing templates')
        return process.exit(1)
      }

      const docs = createMockDocuments(templates.templates)
      await createServer(docs, options.port)
      const url = `http://localhost:${options.port}`
      const message = `${chalk.magenta.bold('Tipe')} offline mock API\n\n${chalk.white.underline(url)}`

      console.log(boxen(message, { padding: 1, margin: 1, borderColor: 'green', borderStyle: 'single' }))
    })
}
