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
        'Type is already being renamed or is target name for an exisiting Type rename.'
      )
    }

    this.#instructions.typeRenames.push({ from, to })
    return this
  }

  renameField(targetType, oldField, newField) {
    let type, from, to

    if (!newField) {
      from = targetType
      to = oldField
      type = this.#activeType
    } else {
      type = targetType
      from = oldField
      to = newField
    }

    if (oldField === newField) {
      throw new MigrationError(
        `Field rename must be a new name, got he same name: "${from}"`
      )
    }

    if (!type) {
      throw new MigrationError(
        'Must set type with .type() or as first argument to rename'
      )
    }

    const isThere = this.#instructions.fieldRenames
      .filter(f => f.type === type)
      .find(f => {
        return f.from === from || f.to === from || f.from === to || f.to === to
      })

    if (isThere) {
      throw new MigrationError(
        `Field for Type "${type}" is already set to be renamed or is a target name for an existing field rename`
      )
    }

    this.#instructions.fieldRenames.push({ type, from, to })
    return this
  }

  removeField(targetType, fieldName) {
    let type, field
    if (!fieldName) {
      field = targetType
      type = this.#activeType
    } else {
      type = targetType
      field = fieldName
    }

    if (!type) {
      throw new MigrationError(
        'Must set type with .type() or as first argument to remove'
      )
    }

    const isThere = this.#instructions.fieldRemoves.find(
      t => t.type === type && t.field === field
    )

    if (isThere) {
      throw new MigrationError(
        `Field "${field}" of Type "${type}" is already set to be removed`
      )
    }

    this.#instructions.fieldRemoves.push({
      type,
      field
    })

    return this
  }
}
