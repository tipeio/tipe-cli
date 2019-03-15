import { Shape, types, prepareShapes } from '@tipe/schema'
import { resolveShape, createDB } from '../db'
import _ from 'lodash'

describe('db', () => {
  describe('resolveShape', () => {
    test('basic types', () => {
      const Author = new Shape('Author', {
        name: {
          type: types.simpletext
        },
        age: {
          type: types.number
        },
        contractor: {
          type: types.toggle
        },
        bio: {
          type: types.markdown
        },
        birthdate: {
          type: types.calendar
        }
      })

      const { shapes } = prepareShapes([Author])
      const author = resolveShape(Author, shapes)

      expect(_.isString(author.name)).toBeTruthy()
      expect(_.isNumber(author.age)).toBeTruthy()
      expect(_.isBoolean(author.contractor)).toBeTruthy()
      expect(new Date(author.birthdate).getTime()).toBe(author.birthdate)
      expect(_.isString(author.bio)).toBeTruthy()
    })
    test('arrays', () => {
      const Author = new Shape('Author', {
        name: {
          type: types.simpletext,
          array: true
        },
        age: {
          type: types.number,
          array: true
        },
        contractor: {
          type: types.toggle,
          array: true
        },
        bio: {
          type: types.markdown,
          array: true
        },
        birthdate: {
          type: types.calendar,
          array: true
        }
      })

      const { shapes } = prepareShapes([Author])
      const author = resolveShape(Author, shapes)

      author.name.forEach(name => expect(_.isString(name)).toBeTruthy())
      author.age.forEach(age => expect(_.isNumber(age)).toBeTruthy())
      author.contractor.forEach(contractor =>
        expect(_.isBoolean(contractor)).toBeTruthy()
      )
      author.birthdate.forEach(birthdate =>
        expect(new Date(birthdate).getTime()).toBe(birthdate)
      )
      author.bio.forEach(bio => expect(_.isString(bio)).toBeTruthy())
    })

    test('nested', () => {
      const Author = new Shape('Author', {
        name: {
          type: types.simpletext
        },
        info: {
          type: {
            age: {
              type: types.number
            },
            contractor: {
              type: types.toggle
            },
            bio: {
              type: types.markdown
            },
            birthdate: {
              type: types.calendar
            }
          }
        }
      })

      const { shapes } = prepareShapes([Author])
      const author = resolveShape(Author, shapes)

      expect(_.isNumber(author.info.age)).toBeTruthy()
      expect(_.isBoolean(author.info.contractor)).toBeTruthy()
      expect(new Date(author.info.birthdate).getTime()).toBe(
        author.info.birthdate
      )
      expect(_.isString(author.info.bio)).toBeTruthy()
    })
    test('deep array', () => {
      const DocSection = new Shape('DocSection', 'Doc Section', {
        sideBarTitle: {
          type: types.simpletext,
          name: 'side bar title'
        },
        sections: {
          array: true,
          type: types.shape,
          ref: 'DocSection'
        },
        content: {
          type: types.markdown
        }
      })

      const DocType = new Shape('DocType', 'Documentation Type', {
        title: {
          type: types.simpletext
        },
        icon: {
          type: types.asset
        },
        color: {
          type: types.simpletext
        },
        description: {
          type: types.simpletext
        },
        sections: {
          type: types.shape,
          ref: 'DocSection',
          array: true
        }
      })

      const HomePage = new Shape('HomePage', 'Home Page', {
        title: {
          type: types.simpletext
        },
        subtext: {
          type: types.markdown
        },
        guidesSections: {
          type: types.shape,
          ref: 'DocType'
        }
      })

      const { shapes } = prepareShapes([DocSection, HomePage, DocType])
      const document = resolveShape(HomePage, shapes)

      expect(document.guidesSections.sections[0].sections[0].sections).toEqual(
        []
      )
    })
  })
  describe('createDB', () => {
    test('findById', () => {
      const Author = new Shape('Author', {
        name: {
          type: types.simpletext
        },
        age: {
          type: types.number
        },
        contractor: {
          type: types.toggle
        },
        bio: {
          type: types.markdown
        },
        birthdate: {
          type: types.calendar
        }
      })
      const { findById, findByShape } = createDB([Author])
      const docs = findByShape('Author')

      const docFound = findById(docs[0].meta_info.id)
      expect(docFound).toBeTruthy()
      expect(docFound.meta_info.id).toEqual(docs[0].meta_info.id)
      expect(docFound.name).toBeTruthy()
      expect(docFound.age).toBeTruthy()
      expect(docFound.contractor).toBeTruthy()
      expect(docFound.bio).toBeTruthy()
      expect(docFound.birthdate).toBeTruthy()
    })
  })
})
