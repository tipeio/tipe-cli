const _ = require('lodash')
const {
  populateRefs,
  createMockDocuments,
  mergeTipeDB
} = require('../templates.js')

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
          refs: {}
        },
        {
          id: 'mo24edd',
          fields: { name: 'test', age: 55 },
          refs: {
            author: {
              name: 'author',
              id: 'author',
              type: 'person',
              value: ['1234', '1234']
            }
          }
        }
      ]
      const docToFormat = mockDocuments[1]
      const result = populateRefs(mockDocuments, docToFormat, 3)
      expect(result).toBeTruthy()
      const refsToTest = result.refs.author.value
      expect(refsToTest).toHaveLength(2)
      const firstDoc = refsToTest[0]
      expect(firstDoc.id).toBe(mockDocuments[0].id)
      expect(firstDoc.fields).toEqual(mockDocuments[0].fields)
      const secondDoc = refsToTest[0]
      expect(secondDoc.id).toBe(mockDocuments[0].id)
      expect(secondDoc.fields).toEqual(mockDocuments[0].fields)
    })
    it('should only populate 3 levels deep', () => {
      const mockDocuments = [
        {
          id: '1234',
          fields: { name: 'test' },
          refs: {
            pets: { name: 'pets', id: 'pets', type: 'pet', value: 'abcde' }
          }
        },
        {
          id: '5678',
          fields: { name: 'testing' },
          refs: {
            pets: { name: 'pets', id: 'pets', type: 'pet', value: 'mo24edd' }
          }
        },
        {
          id: 'abcde',
          fields: { name: 'test', age: 55 },
          refs: {
            author: {
              name: 'author',
              id: 'author',
              type: 'person',
              value: '5678'
            }
          }
        },
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
      const docToFormat = mockDocuments[3]
      const result = populateRefs(mockDocuments, docToFormat)
      expect(result).toBeTruthy()
      const firstLevel = result.refs.author.value
      const secondLevel = firstLevel.refs.pets.value
      expect(secondLevel.refs.author.value).toEqual(mockDocuments[1].id)
    })
    it('should return correctly with negative depth', () => {
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
      const result = populateRefs(mockDocuments, docToFormat, -1)
      expect(result).toBeTruthy()
      expect(result.id).toBe(docToFormat.id)
      expect(result.fields).toEqual(docToFormat.fields)
      expect(result.refs.author.id).toBe(docToFormat.refs.author.id)
      expect(result.refs.author.name).toBe(docToFormat.refs.author.name)
      expect(result.refs.author.type).toBe(docToFormat.refs.author.type)
      expect(result.refs.author.value).toEqual(mockDocuments[0].id)
    })
  })
  describe('createMockDocuments', () => {
    it('should create single documents and multi documents', () => {
      const templates = [
        {
          name: 'home',
          id: 'home',
          fields: [
            {
              name: 'Title',
              id: 'title',
              type: 'text'
            },
            {
              name: 'Banner Image',
              id: 'banner',
              type: 'image'
            },
            {
              name: 'Documentation',
              id: 'content',
              type: 'markdown'
            }
          ],
          multi: true
        },
        {
          name: 'features',
          id: 'features',
          fields: [
            {
              name: 'Title',
              id: 'title',
              type: 'text'
            }
          ],
          multi: false
        }
      ]
      const result = createMockDocuments(templates)
      expect(result).toHaveLength(3)
      const homeDocs = result.filter(_f => _f.template.name === 'home')
      const featuresDoc = result.filter(_f => _f.template.name === 'features')
      expect(homeDocs.length).toBeGreaterThan(featuresDoc.length)
    })
    it('should create real refs', () => {
      const templates = [
        {
          name: 'home',
          id: 'home',
          fields: [
            {
              name: 'Title',
              id: 'title',
              type: 'text'
            },
            {
              name: 'Banner Image',
              id: 'banner',
              type: 'image'
            },
            {
              name: 'Documentation',
              id: 'content',
              type: 'markdown'
            }
          ],
          refs: [
            {
              type: 'features',
              id: 'features',
              name: 'feature1'
            }
          ],
          multi: false
        },
        {
          name: 'features',
          id: 'features',
          fields: [
            {
              name: 'Title',
              id: 'title',
              type: 'text'
            }
          ],
          multi: false
        }
      ]
      const result = createMockDocuments(templates)
      const homeDoc = _.sample(result.filter(_d => _d.template.id === 'home'))
      const featuresDoc = _.sample(
        result.filter(_d => _d.template.id === 'features')
      )
      expect(homeDoc.refs.features.value).toEqual(featuresDoc.id)
    })
    it('should create list refs', () => {
      const templates = [
        {
          name: 'home',
          id: 'home',
          fields: [
            {
              name: 'Title',
              id: 'title',
              type: 'text'
            },
            {
              name: 'Banner Image',
              id: 'banner',
              type: 'image'
            },
            {
              name: 'Documentation',
              id: 'content',
              type: 'markdown'
            }
          ],
          refs: [
            {
              type: 'features',
              id: 'features',
              name: 'feature1',
              list: true
            }
          ],
          multi: true
        },
        {
          name: 'features',
          id: 'features',
          fields: [
            {
              name: 'Title',
              id: 'title',
              type: 'text'
            }
          ],
          multi: true
        }
      ]
      const result = createMockDocuments(templates)
      const homeDoc = _.sample(result.filter(_d => _d.template.id === 'home'))
      expect(homeDoc.refs.features.value.length).toBeGreaterThan(0)
      homeDoc.refs.features.value.forEach(_r => {
        const featuresDoc = _.sample(result.filter(_d => _d.id === _r))
        expect(featuresDoc).toBeTruthy()
      })
    })
  })
  describe('mergeTipeDB', () => {
    it('should merge documents', () => {
      const db = [
        {
          id: 'JBH25tvUT3L7E5RqKBXvw',
          fields: {
            signup: {
              name: 'sign up button text',
              id: 'signup',
              type: 'button',
              data: {},
              value: 'click me'
            },
            signin: {
              name: 'sign in button text',
              id: 'signin',
              type: 'button',
              data: {},
              value: 'click me'
            }
          },
          template: {
            id: 'home',
            name: 'Home'
          },
          createdBy: {
            firstName: 'Dean',
            lastName: 'Thomas',
            email: 'ti@ciam.lv'
          },
          refs: {}
        },
        {
          id: 'uCT6QdgIRUSI9UdqhVYtr',
          fields: {
            header: {
              name: 'feature header',
              id: 'header',
              type: 'text',
              data: {},
              value: 'this is some text here'
            },
            subHeader: {
              name: 'feature subheader',
              id: 'subHeader',
              type: 'text',
              data: {},
              value: 'this is some text here'
            }
          },
          template: {
            id: 'feature',
            name: 'Feature'
          },
          createdBy: {
            firstName: 'Travis',
            lastName: 'Newman',
            email: 'luc@vi.io'
          },
          refs: {}
        }
      ]
      const generatedDocs = [
        {
          id: 'FJOIWER390452OJD',
          fields: {
            signup: {
              name: 'sign up button text',
              id: 'signup',
              type: 'button',
              data: {},
              value: 'click me'
            },
            signin: {
              name: 'sign in button text',
              id: 'signin',
              type: 'button',
              data: {},
              value: 'click me'
            }
          },
          template: {
            id: 'home',
            name: 'Home'
          },
          createdBy: {
            firstName: 'Dean',
            lastName: 'Thomas',
            email: 'ti@ciam.lv'
          },
          refs: {}
        },
        {
          id: 'jODISJF009W32joCVN',
          fields: {
            header: {
              name: 'feature header',
              id: 'header',
              type: 'text',
              data: {},
              value: 'this is some text here'
            },
            subHeader: {
              name: 'feature subheader',
              id: 'subHeader',
              type: 'text',
              data: {},
              value: 'this is some text here'
            }
          },
          template: {
            id: 'feature',
            name: 'Feature'
          },
          createdBy: {
            firstName: 'Travis',
            lastName: 'Newman',
            email: 'luc@vi.io'
          },
          refs: {}
        }
      ]
      const result = mergeTipeDB(db, generatedDocs)
      expect(result).toHaveLength(2)
      const homeDoc = result[0]
      const featuresDoc = result[1]
      expect(homeDoc.id).toEqual(db[0].id)
      expect(featuresDoc.id).toEqual(db[1].id)
    })
    it('should merge refs', () => {
      const db = [
        {
          id: 'JBH25tvUT3L7E5RqKBXvw',
          fields: {
            signup: {
              name: 'sign up button text',
              id: 'signup',
              type: 'button',
              data: {},
              value: 'click me'
            },
            signin: {
              name: 'sign in button text',
              id: 'signin',
              type: 'button',
              data: {},
              value: 'click me'
            }
          },
          template: {
            id: 'home',
            name: 'Home'
          },
          createdBy: {
            firstName: 'Dean',
            lastName: 'Thomas',
            email: 'ti@ciam.lv'
          },
          refs: {
            featureSet: {
              name: 'features set',
              id: 'featureSets',
              type: 'feature',
              data: {},
              value: 'uCT6QdgIRUSI9UdqhVYtr'
            }
          }
        },
        {
          id: 'uCT6QdgIRUSI9UdqhVYtr',
          fields: {
            header: {
              name: 'feature header',
              id: 'header',
              type: 'text',
              data: {},
              value: 'this is some text here'
            },
            subHeader: {
              name: 'feature subheader',
              id: 'subHeader',
              type: 'text',
              data: {},
              value: 'this is some text here'
            }
          },
          template: {
            id: 'feature',
            name: 'Feature'
          },
          createdBy: {
            firstName: 'Travis',
            lastName: 'Newman',
            email: 'luc@vi.io'
          },
          refs: {}
        }
      ]
      const generatedDocs = [
        {
          id: 'FJOIWER390452OJD',
          fields: {
            signup: {
              name: 'sign up button text',
              id: 'signup',
              type: 'button',
              data: {},
              value: 'click me'
            },
            signin: {
              name: 'sign in button text',
              id: 'signin',
              type: 'button',
              data: {},
              value: 'click me'
            }
          },
          template: {
            id: 'home',
            name: 'Home'
          },
          createdBy: {
            firstName: 'Dean',
            lastName: 'Thomas',
            email: 'ti@ciam.lv'
          },
          refs: {
            featureSet: {
              name: 'features set',
              id: 'featureSets',
              type: 'feature',
              data: {},
              value: 'jODISJF009W32joCVN'
            }
          }
        },
        {
          id: 'jODISJF009W32joCVN',
          fields: {
            header: {
              name: 'feature header',
              id: 'header',
              type: 'text',
              data: {},
              value: 'this is some text here'
            },
            subHeader: {
              name: 'feature subheader',
              id: 'subHeader',
              type: 'text',
              data: {},
              value: 'this is some text here'
            }
          },
          template: {
            id: 'feature',
            name: 'Feature'
          },
          createdBy: {
            firstName: 'Travis',
            lastName: 'Newman',
            email: 'luc@vi.io'
          },
          refs: {}
        }
      ]
      const result = mergeTipeDB(db, generatedDocs)
      const homeDoc = result[0]
      expect(homeDoc.refs.featureSet.value).toEqual(db[0].refs.featureSet.value)
    })
    it('should handle list changes', () => {
      const db = [
        {
          id: 'JBH25tvUT3L7E5RqKBXvw',
          fields: {
            signup: {
              name: 'sign up button text',
              id: 'signup',
              type: 'button',
              data: {},
              value: 'click me'
            },
            signin: {
              name: 'sign in button text',
              id: 'signin',
              type: 'button',
              data: {},
              value: 'click me'
            }
          },
          template: {
            id: 'home',
            name: 'Home'
          },
          createdBy: {
            firstName: 'Dean',
            lastName: 'Thomas',
            email: 'ti@ciam.lv'
          },
          refs: {
            featureSet: {
              name: 'features set',
              id: 'featureSets',
              type: 'feature',
              data: {},
              value: 'uCT6QdgIRUSI9UdqhVYtr'
            }
          }
        },
        {
          id: 'uCT6QdgIRUSI9UdqhVYtr',
          fields: {
            header: {
              name: 'feature header',
              id: 'header',
              type: 'text',
              data: {},
              value: 'this is some text here'
            },
            subHeader: {
              name: 'feature subheader',
              id: 'subHeader',
              type: 'text',
              data: {},
              value: 'this is some text here'
            }
          },
          template: {
            id: 'feature',
            name: 'Feature'
          },
          createdBy: {
            firstName: 'Travis',
            lastName: 'Newman',
            email: 'luc@vi.io'
          },
          refs: {}
        }
      ]
      const generatedDocs = [
        {
          id: 'FJOIWER390452OJD',
          fields: {
            signup: {
              name: 'sign up button text',
              id: 'signup',
              type: 'button',
              data: {},
              value: 'click me'
            },
            signin: {
              name: 'sign in button text',
              id: 'signin',
              type: 'button',
              data: {},
              value: 'click me'
            }
          },
          template: {
            id: 'home',
            name: 'Home'
          },
          createdBy: {
            firstName: 'Dean',
            lastName: 'Thomas',
            email: 'ti@ciam.lv'
          },
          refs: {
            featureSet: {
              name: 'features set',
              id: 'featureSets',
              type: 'feature',
              list: true,
              data: {},
              value: [
                'jODISJF009W32joCVN',
                'jODISJF009W32joCVN',
                'jODISJF009W32joCVN'
              ]
            }
          }
        },
        {
          id: 'jODISJF009W32joCVN',
          fields: {
            header: {
              name: 'feature header',
              id: 'header',
              type: 'text',
              data: {},
              value: 'this is some text here'
            },
            subHeader: {
              name: 'feature subheader',
              id: 'subHeader',
              type: 'text',
              data: {},
              value: 'this is some text here'
            }
          },
          template: {
            id: 'feature',
            name: 'Feature'
          },
          createdBy: {
            firstName: 'Travis',
            lastName: 'Newman',
            email: 'luc@vi.io'
          },
          refs: {}
        }
      ]
      const result = mergeTipeDB(db, generatedDocs)
      const homeDoc = result[0]
      expect(homeDoc.refs.featureSet.value).toHaveLength(3)
    })
    it('should handle arrays', () => {
      const db = [
        {
          id: 'JBH25tvUT3L7E5RqKBXvw',
          fields: {
            signup: {
              name: 'sign up button text',
              id: 'signup',
              type: 'button',
              data: {},
              value: 'click me'
            },
            signin: {
              name: 'sign in button text',
              id: 'signin',
              type: 'button',
              data: {},
              value: 'click me'
            }
          },
          template: {
            id: 'home',
            name: 'Home'
          },
          createdBy: {
            firstName: 'Dean',
            lastName: 'Thomas',
            email: 'ti@ciam.lv'
          },
          refs: {
            featureSet: {
              name: 'features set',
              id: 'featureSets',
              type: 'feature',
              data: {},
              value: [
                'uCT6QdgIRUSI9UdqhVYtr',
                'uCT6QdgIRUSI9UdqhVYtr',
                'uCT6QdgIRUSI9UdqhVYtr'
              ]
            }
          }
        },
        {
          id: 'uCT6QdgIRUSI9UdqhVYtr',
          fields: {
            header: {
              name: 'feature header',
              id: 'header',
              type: 'text',
              data: {},
              value: 'this is some text here'
            },
            subHeader: {
              name: 'feature subheader',
              id: 'subHeader',
              type: 'text',
              data: {},
              value: 'this is some text here'
            }
          },
          template: {
            id: 'feature',
            name: 'Feature'
          },
          createdBy: {
            firstName: 'Travis',
            lastName: 'Newman',
            email: 'luc@vi.io'
          },
          refs: {}
        }
      ]
      const generatedDocs = [
        {
          id: 'FJOIWER390452OJD',
          fields: {
            signup: {
              name: 'sign up button text',
              id: 'signup',
              type: 'button',
              data: {},
              value: 'click me'
            },
            signin: {
              name: 'sign in button text',
              id: 'signin',
              type: 'button',
              data: {},
              value: 'click me'
            }
          },
          template: {
            id: 'home',
            name: 'Home'
          },
          createdBy: {
            firstName: 'Dean',
            lastName: 'Thomas',
            email: 'ti@ciam.lv'
          },
          refs: {
            featureSet: {
              name: 'features set',
              id: 'featureSets',
              type: 'feature',
              list: true,
              data: {},
              value: [
                'jODISJF009W32joCVN',
                'jODISJF009W32joCVN',
                'jODISJF009W32joCVN'
              ]
            }
          }
        },
        {
          id: 'jODISJF009W32joCVN',
          fields: {
            header: {
              name: 'feature header',
              id: 'header',
              type: 'text',
              data: {},
              value: 'this is some text here'
            },
            subHeader: {
              name: 'feature subheader',
              id: 'subHeader',
              type: 'text',
              data: {},
              value: 'this is some text here'
            }
          },
          template: {
            id: 'feature',
            name: 'Feature'
          },
          createdBy: {
            firstName: 'Travis',
            lastName: 'Newman',
            email: 'luc@vi.io'
          },
          refs: {}
        }
      ]
      const result = mergeTipeDB(db, generatedDocs)
      const homeDoc = result[0]
      expect(homeDoc.refs.featureSet.value).toHaveLength(3)
    })
  })
})
