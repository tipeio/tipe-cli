export class MigrationError extends Error {
  constructor(message) {
    super(message)
    this.message = `[TipeMigrationError]: ${message}`
  }
}

export class TipeMigrationContext {
  #instructions = {
    typeRenames: [],
    typeRemoves: [],
    fieldRenames: [],
    fieldRemoves: []
  }

  #activeType = null

  __finalize() {
    return this.#instructions
  }

  type(typeName) {
    this.#activeType = typeName
    return this
  }

  remove(toRemove) {
    const type = toRemove || this.#activeType
    const isThere = this.#instructions.typeRemoves.find(t => t.type === type)

    if (isThere) {
      throw new MigrationError(`Type "${type}" is already set to be removed`)
    }

    this.#instructions.typeRemoves.push({ type })
    return this
  }

  rename(oldTypeName, newTypeName) {
    let from, to

    if (!newTypeName) {
      to = oldTypeName
      from = this.#activeType

      if (!from) {
        throw new MigrationError(
          'Must set a From type with .type(), or pass a to type'
        )
      }
    } else {
      from = oldTypeName
      to = newTypeName
    }

    // same type
    if (to === from) {
      throw new MigrationError(
        `Cannot rename a Type to the same name "${from}"`
      )
    }

    const isThere = this.#instructions.typeRenames.find(t => {
      return t.from === to || t.from === from || t.to === from || t.to === to
    })

    if (isThere) {
      throw new MigrationError(
        'Cannot reuse same Type names for renaming again'
      )
    }

    this.#instructions.typeRenames.push({ from, to })
    return this
  }

  renameField(from, to) {
    this.#instructions.fieldRenames.push({ type: this.#activeType, from, to })
    return this
  }

  removeField(fieldName) {
    this.#instructions.fieldRenames.push({
      type: this.#activeType,
      field: fieldName
    })
    return this
  }
}
