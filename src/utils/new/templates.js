export const blog = `const { types, Shape } = require('@tipe/schema')

const BlogPost = new Shape('BlogPost', 'Blog Post', {
  title: {
    type: types.simpletext
  },
  isfeatured: {
    type: types.toggle
  },
  body: {
    type: types.richtext
  },
  mainImg: {
    type: types.asset,
    name: 'main image'
  },
 author: {
    type: types.shape,
    ref: 'Author'
  }
})

const Author = new Shape('Author', {
  avatar: {
    type: types.asset
  },
  name: {
    type: types.simpletext
  },
  bio: {
    type: types.richtext
  },
  socialLinks: {
    name: 'social links',
    type: {
      twitter: {
        type: types.simpletext
      },
      linkedIn: {
        type: types.simpletext
      }
    }
  }
})


const BlogPostPage = new Shape('BlogPostPage', 'Blog Post Page', {
  header: {
    type: {
      title: {
        type: types.simpletext
      },
      body: {
        type: types.richtext
      }
    }
  },
  posts: {
    type: types.shape,
    ref: 'BlogPost',
    array: true
  }
})

module.exports = [Author, BlogPost, BlogPostPage]
`
