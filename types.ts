export interface CommandFlagConfig {
  [key: string]: CommandFlag
}

export interface CommandFlag {
  complete?: string
  type?: string
  required?: boolean
  parse?(string): any
  default?(): any
}

export interface CommandArgs {
  port?: string
  project: string
  schema?: string
  apikey: string
  'dry-run': boolean
  dryRun?: boolean
  api?: string
}
