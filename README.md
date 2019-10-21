# Tipe CLI

![Tipe logo](https://cdn.tipe.io/tipe/tipe-cat-no-text.svg)
[![Build Status](https://travis-ci.com/tipeio/tipe-cli.svg?token=mE8qfws6qu8ishNcR5Zr&branch=master)](https://travis-ci.com/tipeio/tipe-cli)

> CLI for [Tipe](https://tipe.io). Manage your content templates and projects.

# Getting started
**Install the CLI**
with npm
```
npm i @tipe/cli
```

with yarn
```
yarn add @tipe/cli
```

**Create templates for your content**
```javascript
// tipe.js

module.exports = {
  templates: {
    home: {
      name: 'Home',
      fields: {
        heroImage: {
          name: 'Hero Image',
          type: 'image'
        },
        heroTitle: {
          name: 'Hero Title',
          type: 'text'
        }
      }
    }
  }
}
```
**Start the offline mock API**
```
tipe serve
```

**Query for mock content in your app with the SDK**
```
npm i @tipe/js
```
```
yarn add @tipe/js
```

```javascript
// app.js

const tipe = require('@tipe/js')({offline: true})

const getHomePageContent = () => tipe.document.list({template: 'home'})
```

# Going to production
1. **[Create an account on Tipe](https://tipe.io?rel=cli)**
2. **Push up your templates to your Tipe project**
```
tipe push --config tipe.js --project your-project-id --apikey your-api-key
```
3. **Change SDK to use live API in Production**
```javascript
const tipe = require('@tipe/js')({
  offline: process.env.NODE_ENV !== 'production',
  project: YOUR_TIPE_PROJECT_ID,
  key: YOUR_TIPE_API_KEY
})
```

# Creating Templates

```javascript
module.exports = {
  templates: {
    home: { // template id. Used in the API arguments and responses
    
      disabled: false, // you can only disabled templates from the dashboard if you no longer need them
      
      name: 'Home', // template name is used on the dashbard for content creators
      
      fields: { // all templates must have fields
      
        title: { // field id. Used in the API arguments and responses
        
          disabled: false, // you can only disabled fields from the dashboard if you no longer need them
        
          name: 'Title', // field name is used on the dashboard for content creators,
          
          type: 'text' // the type of content
        }  
      }
    }
  }
}
```
## Field types
* text
* code
* markdown
* image
* button
* html


# Issues

For problems directly related to the CLI, [add an issue on GitHub.](https://github.com/tipeio/tipe-cli/issues)

For other issues, [submit a support ticket.](https://tipe.io)

# Developing

```
yarn link
yarn install
```

The core plugins are located in [./src/commands](./src/commands)

To cut a release, commit you messages using our [commit guide](https://github.com/tipeio/tipe-conventions/blob/4987a13f29bc7e5fcbb428dd7b245fedcd5bf6ce/COMMIT_CONVENTION.md#git-commit-message-convention)
