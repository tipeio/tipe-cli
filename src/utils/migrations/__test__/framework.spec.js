import { TipeMigrationContext } from '../framework'

describe('migration context', () => {
  test('private props', () => {
    const ctx = new TipeMigrationContext()
    expect(ctx.instructions).toBe(undefined)
    expect(ctx.activeType).toBe(undefined)
  })

  describe('remove', () => {
    test('removes active type', () => {
      const ctx = new TipeMigrationContext()

      ctx.type('Author').remove()

      const instructions = ctx.__finalize()
      expect(instructions.typeRemoves).toHaveLength(1)
      expect(instructions.typeRemoves[0]).toEqual({ type: 'Author' })
    })

    test('removes given type', () => {
      const ctx = new TipeMigrationContext()

      ctx.remove('Person')

      const instructions = ctx.__finalize()
      expect(instructions.typeRemoves).toHaveLength(1)
      expect(instructions.typeRemoves[0]).toEqual({ type: 'Person' })
    })

    test('does not allow duplicates', () => {
      const ctx = new TipeMigrationContext()

      expect(() => ctx.remove('Person').remove('Person')).toThrow()
    })

    test('chains', () => {
      const ctx = new TipeMigrationContext()

      ctx
        .remove('Person')
        .type('Post')
        .remove()
        .remove('Section')

      const instructions = ctx.__finalize()
      expect(instructions.typeRemoves).toHaveLength(3)
      expect(instructions.typeRemoves).toEqual([
        { type: 'Person' },
        { type: 'Post' },
        { type: 'Section' }
      ])
    })
  })

  describe('rename', () => {
    test('renames active type', () => {
      const ctx = new TipeMigrationContext()

      ctx.type('Author').rename('Person')

      const instructions = ctx.__finalize()
      expect(instructions.typeRenames).toHaveLength(1)
      expect(instructions.typeRenames[0]).toEqual({
        from: 'Author',
        to: 'Person'
      })
    })

    test('renames given type', () => {
      const ctx = new TipeMigrationContext()

      ctx.rename('Person', 'Author')

      const instructions = ctx.__finalize()
      expect(instructions.typeRenames).toHaveLength(1)
      expect(instructions.typeRenames[0]).toEqual({
        from: 'Person',
        to: 'Author'
      })
    })

    test('errors if no from or to type', () => {
      const ctx = new TipeMigrationContext()

      expect(() => ctx.rename('Author')).toThrow()
    })

    test('does not allow duplicates', () => {
      const ctx = new TipeMigrationContext()

      expect(() => {
        ctx.rename('Author', 'Author')
      }).toThrow()

      expect(() => {
        ctx.rename('Author', 'Person').rename('Person', 'Writer')
      }).toThrow()

      expect(() => {
        ctx.rename('Author', 'Person').rename('Author', 'Person')
      }).toThrow()
    })

    test('chains', () => {
      const ctx = new TipeMigrationContext()

      ctx
        .rename('Person', 'Author')
        .type('Article')
        .rename('Post')
        .rename('Section', 'Block')

      const instructions = ctx.__finalize()
      expect(instructions.typeRenames).toHaveLength(3)
    })
  })

  describe('renameField', () => {
    test('renames field from active type', () => {
      const ctx = new TipeMigrationContext()

      ctx.type('Author').renameField('firstName', 'name')

      const instructions = ctx.__finalize()
      expect(instructions.fieldRenames).toHaveLength(1)
      expect(instructions.fieldRenames[0]).toEqual({
        type: 'Author',
        from: 'firstName',
        to: 'name'
      })
    })

    test('renames field from arguments', () => {
      const ctx = new TipeMigrationContext()

      ctx.renameField('Author', 'firstName', 'name')

      const instructions = ctx.__finalize()
      expect(instructions.fieldRenames).toHaveLength(1)
      expect(instructions.fieldRenames[0]).toEqual({
        type: 'Author',
        from: 'firstName',
        to: 'name'
      })
    })

    test('does not allow duplicates', () => {
      const ctx = new TipeMigrationContext()
      expect(() => {
        ctx
          .renameField('Author', 'firstName', 'name')
          .renameField('Author', 'firstName', 'other')
      }).toThrow()

      expect(() => {
        ctx
          .renameField('Author', 'firstName', 'name')
          .renameField('Author', 'lastName', 'name')
      }).toThrow()

      expect(() => {
        ctx
          .renameField('Author', 'firstName', 'name')
          .renameField('Author', 'firstName', 'name')
      }).toThrow()
    })

    test('requires a Type', () => {
      const ctx = new TipeMigrationContext()
      expect(() => {
        ctx.renameField('firstName', 'name')
      }).toThrow()
    })

    test('allows same name renames from different types', () => {
      const ctx = new TipeMigrationContext()
      expect(() => {
        ctx
          .renameField('Author', 'firstName', 'name')
          .renameField('Post', 'name', 'title')
      }).not.toThrow()
    })

    test('chains', () => {
      const ctx = new TipeMigrationContext()

      ctx
        .renameField('Person', 'name', 'firstName')
        .type('Article')
        .renameField('title', 'name')
        .renameField('favorite', 'fave')

      const instructions = ctx.__finalize()
      expect(instructions.fieldRenames).toHaveLength(3)
    })
  })

  describe('removeField', () => {
    test('removes field from active type', () => {
      const ctx = new TipeMigrationContext()

      ctx.type('Author').removeField('firstName')

      const instructions = ctx.__finalize()
      expect(instructions.fieldRemoves).toHaveLength(1)
      expect(instructions.fieldRemoves[0]).toEqual({
        type: 'Author',
        field: 'firstName'
      })
    })

    test('removes field from arguments', () => {
      const ctx = new TipeMigrationContext()

      ctx.removeField('Author', 'firstName')

      const instructions = ctx.__finalize()
      expect(instructions.fieldRemoves).toHaveLength(1)
      expect(instructions.fieldRemoves[0]).toEqual({
        type: 'Author',
        field: 'firstName'
      })
    })

    test('does not allow duplicates', () => {
      const ctx = new TipeMigrationContext()
      expect(() => {
        ctx
          .removeField('Author', 'firstName')
          .removeField('Author', 'firstName')
      }).toThrow()
    })

    test('requires a Type and field', () => {
      const ctx = new TipeMigrationContext()
      expect(() => {
        ctx.removeField('firstName')
      }).toThrow()
    })

    test('allows same name removes from different types', () => {
      const ctx = new TipeMigrationContext()
      expect(() => {
        ctx.removeField('Author', 'firstName').removeField('Post', 'firstName')
      }).not.toThrow()
    })

    test('chains', () => {
      const ctx = new TipeMigrationContext()

      ctx
        .removeField('Person', 'name')
        .type('Article')
        .removeField('title')
        .removeField('favorite')

      const instructions = ctx.__finalize()
      expect(instructions.fieldRemoves).toHaveLength(3)
    })
  })
})
