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
})
