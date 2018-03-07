#!/usr/bin/env node

var fetch = require('node-fetch');
var program = require('commander');
var inquirer = require('inquirer');
var fs = require('fs');
var path = require('path');
var changecase = require('change-case');
var stringify = require('json-stable-stringify');
var writeFileAtomic = require('write-file-atomic');

var pkg = require('../package.json');

program
  .version(pkg.version)
  .description(pkg.description);

program
  .command('tipe <file> [output] [templateName]')
  .action(initTipe);

program
  .command('folder <id>')
  .action(initFolder);

program
  .command('document <id> [template-name]')
  .action(initDocument);

program
  .parse(process.argv);

function tipeApi (query, headers) {
  return fetch('https://api.tipe.io/graphql', {
    method: 'post',
    headers: headers,
    body: stringify(query)
  })
    .then(function (res) { return res.json(); })
    .then(function (response) {
      if (response.data) {
        return response.data;
      } else {
        return Promise.reject(response);
      }
    })
    .catch(function (err) {
      console.log('err tipe api', err)
    });
}

function initTipe (filePath, outputPath, templateName) {
  // filePath
  var docQuery = null;
  try {
    docQuery = fs.readFileSync(path.join(process.cwd(), '/', filePath), 'utf8');
  } catch (err) {
    throw err
  }
  const query = { query: docQuery }
  const apiKey = process.env.API_KEY;
  const orgKey = process.env.ORG_KEY;

  const headers = {
    'Content-Type': 'application/json',
    'Authorization': apiKey,
    'Tipe-Id': orgKey
  };
  return tipeApi(query, headers)
    .then(function (data) {
      if (templateName && data[templateName]) {
        data = data[templateName];
      }

      // outputPath
      const json = stringify(data, {space: 2});
      const newPath = path.join(process.cwd(), outputPath)
      const newFilePath = path.join(process.cwd(), outputPath, '/tipe.json');
      if (!fs.existsSync(newPath)) {
        fs.mkdirSync(newPath);
      }
      return new Promise(function (resolve, reject) {
        writeFileAtomic(newFilePath, json, function (err) {
          if (err) {
            return reject(err);
          }
          return resolve(json)
        });
      })
    })
    .catch(function (err) {
      throw err;
    })
}

function initDocument (docId, templateName) {
  const apiKey = process.env.API_KEY;
  const orgKey = process.env.ORG_KEY;

    const headers = {
      'Content-Type': 'application/json',
      'Authorization': apiKey,
      'Tipe-Id': orgKey
    };
    const schemaQuery = {
      query: `
   query Tipe {
   schema: __schema {
     types {
       name
       fields {
         name
         type {
           name
         }
       }
     }
   }
  }`
     };
    tipeApi(schemaQuery, headers)
      .then(function (data) {
        const types = data.schema && data.schema.types || data;
        var resolvedData = filterNativeTypes(data.schema.types)
          .reduce(function (memo, type) {
            memo[type.name] = resolveFields(type.fields)
            return memo
          }, {});
        var logdata = stringify(resolvedData, {space: 2});
        function iden (value) {
          return value.trim().split(' ').join('_');
        }
        const changeFolder = iden; // changecase.param;
        const changeDocument = iden; // changecase.camel;
        return resolveAllDocumentData(docId, templateName, __dirname, changeFolder, changeDocument, resolvedData, headers)
      })
      .catch(function (err) {
        console.log('err after scema', err);
      });

}

function initFolder (folderId, apiKey, orgKey) {
  const apiKey = process.env.API_KEY;
  const orgKey = process.env.ORG_KEY;
  // inquirer.prompt(questions)

  const headers = {
    'Content-Type': 'application/json',
    'Authorization': apiKey,
    'Tipe-Id': orgKey
  };
  const schemaQuery = {
    query: `
 query Tipe {
 schema: __schema {
   types {
     name
     fields {
       name
       type {
         name
       }
     }
   }
 }
}`
   };
  tipeApi(schemaQuery, headers)
    .then(function (data) {
      const types = data.schema && data.schema.types || data;
      var resolvedData = filterNativeTypes(types)
        .reduce(function (memo, type) {
          memo[type.name] = resolveFields(type.fields)
          return memo
        }, {});
      var data = stringify(resolvedData, {space: 2});
      function iden (value) {
        return value.trim().split(' ').join('_');
      }
      const changeFolder = iden; // changecase.param;
      const changeDocument = iden; // changecase.camel;
      return resolveAllFolderData(folderId, __dirname, changeFolder, changeDocument, resolvedData, headers)
    })
    .catch(function (err) {
      console.log('err after scema', err);
    });
}

function resolveAllFolderData (folderId, currentPath, changeFolder, changeDocument, resolvedData, headers) {
  const query = generateFolder(folderId, resolvedData);
  return tipeApi({ query: query }, headers)
    .then(function (res) {
      const folder = res.Folder;
      if (!folder) {
        return
      }
      if (Array.isArray(folder.documents)) {
        resolveDocuments(currentPath, folder.documents, changeDocument);
      }
      if (Array.isArray(folder.folders)) {
        // resolveFolders(currentPath, folder.folders, changeFolder, changeDocument);
        return Promise.all(folder.folders.map(function (fold) {
          const newPath = createFolder(currentPath, fold, changeFolder)
          return resolveAllFolderData(fold.id, newPath, changeFolder, changeDocument, resolvedData, headers);
        }))
        .catch(function (err) {
          console.log('err', err)
        });
      }
    })
    .catch(function (err) {
      console.log('err', err)
    });
}

function resolveAllDocumentData (docId, templateName, currentPath, changeFolder, changeDocument, resolvedData, headers) {
  const query = generateDocument(docId, templateName, resolvedData);
  return tipeApi({ query: query }, headers)
    .then(function (res) {
      if (!res) {
        throw new Error('no response')
      }
      const data = res[templateName];
      if (!data) {
        return
      }
      createDocument(currentPath, data, changeDocument, 0);
    })
    .catch(function (err) {
      console.log('err', err)
    });
}
// function resolveFolder (currentPath, folder, changeFolder, changeDocument) {
//   var folderPath = createFolder(currentPath, folder, changeFolder)
//   // if (Array.isArray(folder.documents)) {
//   //   resolveDocuments(folderPath, folder.documents, changeDocument)
//   // }
//   if (Array.isArray(folder.folders)) {
//     resolveFolders(folderPath, folder.folders, changeFolder, changeDocument)
//   }
// }
// function resolveFolders (currentPath, folders, changeFolder, changeDocument) {
//   folders.forEach(function (folder) {
//     resolveFolder(currentPath, folder, changeFolder, changeDocument);
//   });
// }
function resolveDocuments (folderPath, documents, changeDocument) {
  documents.forEach(function (doc) {
    createDocument(folderPath, doc, changeDocument, 0);
  });
}

function createFolder (_folderPath, folder, change) {
  var folderPath = path.join(_folderPath, change(folder.name))
  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath);
  }
  return folderPath;
}
function createDocument (folderPath, doc, change, next) {
  var copy = next > 0 ? ('_' + next) : '';
  var filename = change(doc._meta.name + copy) + '.json';
  var docPath = path.join(folderPath, filename)
  if (fs.existsSync(docPath)) {
    var _docContent = fs.readFileSync(docPath, 'utf8')
    var _doc = JSON.parse(_docContent)
    var content = stringify(doc, {space: 2});
    if (content !== _docContent && doc._meta.id !== _doc._meta.id) {
      docPath = createDocument(folderPath, doc, change, next + 1);
    }
  }
  if (next === 0) {
    fs.writeFileSync(docPath, stringify(doc, {space: 2}))
  }
  return docPath;
}

function normalize (name) {
  return name.split(' ').join('_')
}

var nativeTypes = {
  'Query': true,
  'String': true,
  'ID': true,
  'Float': true,
  'Boolean': true,
  'Mutation': true,
  'Folder': true,
  'Media': true,
  'AllTemplates': true,
  'DocumentMeta': true,
  '__Schema': true,
  '__Type': true,
  '__TypeKind': true,
  '__Field': true,
  '__InputValue': true,
  '__EnumValue': true,
  '__Directive': true,
  '__DirectiveLocation': true
}

function generateField (types, type, space, count, nested) {
  if (type === 'Meta') {
    return [
      space + 'id',
      space + 'name',
      space + 'updatedAt',
      space + 'createdAt',
      space + 'published'
    ].join('\n')
  }
  if (type === 'Media') {
    return [
      space + 'id',
      space + 'name',
      space + 'size',
      space + 'url',
      space + 'mime'
    ].join('\n')
  }
  if (type === 'AllTemplates') {
    return space + '...tipeModels'
    // return generateDocumentFields(types, space, count, nested);
  }
}

function generateFields (types, fields, space, count, nested) {
  return fields.reduce(function (query, field) {
    if (Array.isArray(field)) {
      // prevent nesting more than once
      if (field[1] === 'AllTemplates' && count > 1) {
        query += `${space}...tipeModels`
        return query;
      }
      query += `${space}${field[0]} {
${generateField(types, field[1], space + '  ', count, nested)}\n
${space}}\n`
    } else {
      query += `${space}${field}\n`
    }
    return query
  }, '')
}

function generateDocumentFields (types, space, count, nested) {
  // how many times we nest
  var currentCount = count + 1
  if (!types) {
    return '';
  }
  return Object.keys(types).reduce(function (query, type) {
    if (nested) {
      query += `${space}${generateFields(types, types[type], space + '  ', currentCount, nested)}\n`
    } else {
    query += `${space}... on ${type} {
${generateFields(types, types[type], space + '  ', currentCount, nested)}
${space}}
`
    }
    return query
  }, '')
}

function generateFolder (folderId, resolvedData) {
  return `
query Tipe {
  Folder(id: "${folderId}") {
    id
    name
    documents {
${generateDocumentFields(resolvedData, '      ', 0)}
    }
    folders {
      id
      name
      documents {
  ${generateDocumentFields(resolvedData, '      ', 0)}
      }
      folders {
        id
        name
      }
    }
  }
}`
}

function generateDocument (docId, templateName, resolvedData) {
  return `
query Tipe {
  ${templateName}(id: "${docId}") {
    ...tipeModels
  }
}
fragment tipeModels on AllTemplates {
${generateDocumentFields(resolvedData, '      ', 0, true)}
}
`
}


function resolveFields (fields) {
  return fields.reduce(function (query, field) {
    if (field.type.name === 'DocumentMeta') {
      query.push([
        field.name,
        'Meta'
      ])
    } else if (field.type.name === 'AllTemplates') {
      query.push([
        field.name,
        'AllTemplates'
      ])
    } else if (field.type.name === 'Media') {
      query.push([
        field.name,
        'Media'
      ])
    } else {
      query.push(field.name)
    }
    return query
  }, [])
}

function filterNativeTypes (types) {
  return types.filter(tpe => !nativeTypes[tpe.name])
}
