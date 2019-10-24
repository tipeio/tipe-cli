const boxen = require('boxen')
const logSymbols = require('log-symbols')
const chalk = require('chalk')
const _ = require('lodash')
const nano = require('nanoid')
const Chance = require('chance')

const { getUserConfig } = require('../utils/config')
const asyncWrap = require('../utils/async')
const { startServer } = require('../server')
const mocks = require('../mocks')

const chance = new Chance()
const docsPerTemplate = 10

const getField = (template, field) => {
  switch (field.type) {
    case 'button':
      return mocks.button(field)
    case 'image':
      return mocks.image(field)
    case 'markdown':
      return mocks.markdown(field)
    case 'code':
      return mocks.code(field)
    case 'html':
      return mocks.html(field)
    case 'boolean':
      return mocks.boolean(field)
    default:
      return mocks.text(field)
  }
}

const formatFields = (fields, template, renderField = getField) =>
  fields.reduce((fields, field) => {
    const final = _.times(field.list ? 3 : 1, () =>
      _.merge(
        {
          name: field.name,
          id: field.id,
          type: field.type,
          data: {},
        },
        renderField(template, field),
      ),
    )
    fields[field.id] = field.list ? final : final[0]
    return fields
  }, {})

const createDocsForTemplate = template =>
  _.times(template.multi === false ? 1 : docsPerTemplate, () => ({
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
          if (Array.isArray(ref)) {
            const _ref = ref[0]
            const match = _.sample(allDocs.filter(d => d.template.id === _ref.type))
            refs[_ref.id] = ref.map(_r => ({
              ..._r,
              value: match.id,
            }))

            return refs
          }
          const match = _.sample(allDocs.filter(d => d.template.id === ref.type))
          refs[ref.id] = {
            ...ref,
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
    .option('--config -c <path>', 'Path to config file', program.STRING, 'tipe.js')
    .option('--watch -w <watch>', 'Watch tipe.js for changes', program.BOOL, true)
    .action(async (__, options, logger) => {
      let [error, allOptions] = await asyncWrap(getUserConfig())

      if (error) {
        logger.error(logSymbols.error, error.message)
        return process.exit(1)
      }

      if (!allOptions.config.templates) {
        logger.error(logSymbols.error, 'Missing templates')
        return process.exit(1)
      }
      const docs = createMockDocuments(allOptions.config.templates)
      startServer(docs, options)

      const url = `http://localhost:${options.port}`
      const message = `${chalk.magenta.bold('Tipe')} offline mock API\n\n${chalk.white.underline(url)}`

      console.log(
        boxen(message, {
          padding: 1,
          margin: 1,
          borderColor: 'green',
          borderStyle: 'single',
        }),
      )
    })
}
