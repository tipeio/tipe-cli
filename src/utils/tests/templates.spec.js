const { populateRefs } = require('../templates.js')

describe('Utils: Templates', () => {
  describe('populateRefs', () => {
    it('should return correctly formatted document', () => {
      const mockDocuments = [
        { id: '1234', fields: { name: 'test' }, refs: {} },
        { id: 'abcde', fields: { name: 'test', age: 55 }, refs: {} },
        {
          id: 'mo24edd',
          fields: { name: 'test', age: 55 },
          refs: {
            author: {
              name: 'author',
              id: 'author',
              type: 'person',
              value: '1234'
            }
          }
        }
      ]
      const docToFormat = mockDocuments[2]
      const result = populateRefs(mockDocuments, docToFormat)
      expect(result).toBeTruthy()
      expect(result.id).toBe(docToFormat.id)
      expect(result.fields).toEqual(docToFormat.fields)
      expect(result.refs.author.id).toBe(docToFormat.refs.author.id)
      expect(result.refs.author.name).toBe(docToFormat.refs.author.name)
      expect(result.refs.author.type).toBe(docToFormat.refs.author.type)
      expect(result.refs.author.value).toEqual(mockDocuments[0])
    })
    it('should return correctly formatted documents in a list', () => {
      const mockDocuments = [
        { id: '1234', fields: { name: 'test' }, refs: {} },
        { id: 'abcde', fields: { name: 'test', age: 55 }, refs: {} },
        {
          id: 'mo24edd',
          fields: { name: 'test', age: 55 },
          refs: {
            author: {
              name: 'author',
              id: 'author',
              type: 'person',
              value: '1234'
            }
          }
        },
        {
          id: 'fkoffjis903r3202',
          fields: { name: 'test', age: 32 },
          refs: {
            author: {
              name: 'author',
              id: 'author',
              type: 'person',
              value: '1234'
            }
          }
        }
      ]
      const docsToFormat = [mockDocuments[2], mockDocuments[3]]
      const result = populateRefs(mockDocuments, docsToFormat)
      expect(result).toBeTruthy()
      expect(result).toHaveLength(2)
      const firstDoc = result[0]
      expect(firstDoc.id).toBe(docsToFormat[0].id)
      expect(firstDoc.fields).toEqual(docsToFormat[0].fields)
      expect(firstDoc.refs.author.id).toBe(docsToFormat[0].refs.author.id)
      expect(firstDoc.refs.author.name).toBe(docsToFormat[0].refs.author.name)
      expect(firstDoc.refs.author.type).toBe(docsToFormat[0].refs.author.type)
      expect(firstDoc.refs.author.value).toEqual(mockDocuments[0])
      const secondDoc = result[1]
      expect(secondDoc.id).toBe(docsToFormat[1].id)
      expect(secondDoc.fields).toEqual(docsToFormat[1].fields)
      expect(secondDoc.refs.author.id).toBe(docsToFormat[1].refs.author.id)
      expect(secondDoc.refs.author.name).toBe(docsToFormat[1].refs.author.name)
      expect(secondDoc.refs.author.type).toBe(docsToFormat[1].refs.author.type)
      expect(secondDoc.refs.author.value).toEqual(mockDocuments[0])
    })
    it('should work with deeply nested refs', () => {
      const mockDocuments = [
        {
          id: '1234',
          fields: { name: 'test' },
          refs: {
            pets: { name: 'pets', id: 'pets', type: 'pet', value: 'abcde' }
          }
        },
        { id: 'abcde', fields: { name: 'test', age: 55 }, refs: {} },
        {
          id: 'mo24edd',
          fields: { name: 'test', age: 55 },
          refs: {
            author: {
              name: 'author',
              id: 'author',
              type: 'person',
              value: '1234'
            }
          }
        }
      ]
      const docToFormat = mockDocuments[2]
      const result = populateRefs(mockDocuments, docToFormat, 3)
      expect(result).toBeTruthy()
      const refToTest = result.refs.author.value
      expect(refToTest.refs.pets.value).toEqual(mockDocuments[1])
    })
    it('should work with refs in list', () => {
      const mockDocuments = [
        {
          id: '1234',
          fields: { name: 'test' },
          refs: {
            pets: { name: 'pets', id: 'pets', type: 'pet', value: 'abcde' }
          }
        },
        {
          id: '56789',
          fields: { name: 'test' },
          refs: {
            pets: { name: 'pets', id: 'pets', type: 'pet', value: 'abcde' }
          }
        },
        { id: 'abcde', fields: { name: 'test', age: 55 }, refs: {} },
        {
          id: 'mo24edd',
          fields: { name: 'test', age: 55 },
          refs: {
            author: {
              name: 'author',
              id: 'author',
              type: 'person',
              value: ['1234', '56789']
            }
          }
        }
      ]
      const docToFormat = mockDocuments[3]
      const result = populateRefs(mockDocuments, docToFormat, 3)
      expect(result).toBeTruthy()
      const refsToTest = result.refs.author.value
      expect(refsToTest).toHaveLength(2)
      const firstDoc = refsToTest[0]
      expect(firstDoc.id).toBe(mockDocuments[0].id)
      expect(firstDoc.fields).toEqual(mockDocuments[0].fields)
      expect(firstDoc.refs.pets.id).toBe(mockDocuments[0].refs.pets.id)
      expect(firstDoc.refs.pets.name).toBe(mockDocuments[0].refs.pets.name)
      expect(firstDoc.refs.pets.type).toBe(mockDocuments[0].refs.pets.type)
      expect(firstDoc.refs.pets.value).toEqual(mockDocuments[2])
      const secondDoc = refsToTest[1]
      expect(secondDoc.id).toBe(mockDocuments[1].id)
      expect(secondDoc.fields).toEqual(mockDocuments[1].fields)
      expect(secondDoc.refs.pets.id).toBe(mockDocuments[1].refs.pets.id)
      expect(secondDoc.refs.pets.name).toBe(mockDocuments[1].refs.pets.name)
      expect(secondDoc.refs.pets.type).toBe(mockDocuments[1].refs.pets.type)
      expect(secondDoc.refs.pets.value).toEqual(mockDocuments[2])
    })
  })
})