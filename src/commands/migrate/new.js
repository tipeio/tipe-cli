import constants from '../../constants'
import { Command } from '@oclif/command'
import { cli } from 'cli-ux'
import path from 'path'
import fs from 'fs'
import { promisify } from 'util'
import template from '../../templates/migration.tmp'

const mkdir = promisify(fs.mkdir)
const readdir = promisify(fs.readdir)
const writeFile = promisify(fs.writeFile)

export default class NewMigrationCommand extends Command {
  constructor(...args) {
    super(...args)
    this.migrationsPath = path.join(process.cwd(), constants.migrationsPath)
  }

  async run() {
    cli.action.start('Checking for migrations folder')
    await this.handleDir()
    cli.action.stop()

    cli.action.start('Creating new migration file')
    const name = await this.migrationName()

    await this.newMigration(name)
    cli.action.stop()

    this.log(`New migration file created @ ${this.migrationsPath}/${name}`)
  }

  async handleDir() {
    try {
      await mkdir(this.migrationsPath)
    } catch (e) {
      if (e.code !== 'EEXIST') {
        this.error(
          `Could not locate migrations directory at ${this.migrationsPath}`,
          { exit: 1 }
        )
      }
    }
  }

  async migrationName() {
    try {
      const migrationFiles = await readdir(this.migrationsPath)
      const length = migrationFiles.length + 1
      return 'v' + length + '.js'
    } catch (e) {
      this.error(
        `Could not locate migrations directory at ${this.migrationsPath}`,
        { exit: 1 }
      )
    }
  }

  async newMigration(name) {
    const filePath = path.join(this.migrationsPath, name)

    try {
      // TODO: get conflicts and add code + comments to the migration template
      const tmp = template({ message: 'hello' })
      await writeFile(filePath, tmp)
    } catch (e) {
      console.error(e)
      this.error('Could not create new migration file.', { exit: 1 })
    }
  }
}

NewMigrationCommand.description =
  'Create a new migration file that you can use to configure a migration.'
