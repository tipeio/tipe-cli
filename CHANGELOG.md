# [1.18.0](https://github.com/tipeio/tipe-cli/compare/v1.17.2...v1.18.0) (2019-11-13)


### Features

* **templates:** new select block type. updated createMockDocuments to create number of docs based on skuIds. tests. updated schema to new version. minor code cleanup. ([6cd8ca9](https://github.com/tipeio/tipe-cli/commit/6cd8ca9))

## [1.17.2](https://github.com/tipeio/tipe-cli/compare/v1.17.1...v1.17.2) (2019-11-11)


### Bug Fixes

* **templates:** fixed format of templates. Fixed tests. ([8b32bef](https://github.com/tipeio/tipe-cli/commit/8b32bef))

## [1.17.1](https://github.com/tipeio/tipe-cli/compare/v1.17.0...v1.17.1) (2019-11-05)


### Bug Fixes

* **pkg.json:** updated schema ([a0e144f](https://github.com/tipeio/tipe-cli/commit/a0e144f))

# [1.17.0](https://github.com/tipeio/tipe-cli/compare/v1.16.1...v1.17.0) (2019-11-05)


### Bug Fixes

* **field:** return correct field formatted ([801366b](https://github.com/tipeio/tipe-cli/commit/801366b))


### Features

* **docs:** field list ([351b931](https://github.com/tipeio/tipe-cli/commit/351b931))
* **skuId:** handled documents by sku id ([cb7cdad](https://github.com/tipeio/tipe-cli/commit/cb7cdad))
* **skuIds:** sku ids included in schema ([825b8fb](https://github.com/tipeio/tipe-cli/commit/825b8fb))

## [1.16.1](https://github.com/tipeio/tipe-cli/compare/v1.16.0...v1.16.1) (2019-10-29)


### Bug Fixes

* **reload:** merge docs on reload. fixed refs in list to correct format ([976efa7](https://github.com/tipeio/tipe-cli/commit/976efa7))
* **reload:** merges refs on reload and server starts ([0b8f23e](https://github.com/tipeio/tipe-cli/commit/0b8f23e))

# [1.16.0](https://github.com/tipeio/tipe-cli/compare/v1.15.2...v1.16.0) (2019-10-29)


### Bug Fixes

* **documents:** Flatten result ([f119917](https://github.com/tipeio/tipe-cli/commit/f119917))


### Features

* **documents:** Add documents by array of template ids ([16c16b0](https://github.com/tipeio/tipe-cli/commit/16c16b0))

## [1.15.2](https://github.com/tipeio/tipe-cli/compare/v1.15.1...v1.15.2) (2019-10-27)


### Bug Fixes

* **push:** add error formatter ([bdd251d](https://github.com/tipeio/tipe-cli/commit/bdd251d))
* **reload:** fix offline reload ([c7bf091](https://github.com/tipeio/tipe-cli/commit/c7bf091))
* **wip:** Push progress ([d2765f4](https://github.com/tipeio/tipe-cli/commit/d2765f4))

## [1.15.1](https://github.com/tipeio/tipe-cli/compare/v1.15.0...v1.15.1) (2019-10-25)


### Bug Fixes

* **bin:** fix cli bin ([4907079](https://github.com/tipeio/tipe-cli/commit/4907079))

# [1.15.0](https://github.com/tipeio/tipe-cli/compare/v1.14.0...v1.15.0) (2019-10-25)


### Bug Fixes

* **serve:** added limit to recursive ref populate. tests ([c331889](https://github.com/tipeio/tipe-cli/commit/c331889))


### Features

* **serve:** populate refs from api calls. tests ([f5a747a](https://github.com/tipeio/tipe-cli/commit/f5a747a))

# [1.14.0](https://github.com/tipeio/tipe-cli/compare/v1.13.0...v1.14.0) (2019-10-24)


### Bug Fixes

* **serve:** incorrectly creating multiple docs when multi is set to false ([4036c7a](https://github.com/tipeio/tipe-cli/commit/4036c7a))


### Features

* **serve:** added list of refs ([c624769](https://github.com/tipeio/tipe-cli/commit/c624769))

# [1.13.0](https://github.com/tipeio/tipe-cli/compare/v1.12.0...v1.13.0) (2019-10-24)


### Bug Fixes

* **offline:** Merge existing tipe file on initial load with tipedb json ([513d564](https://github.com/tipeio/tipe-cli/commit/513d564))


### Features

* **reload:** Add reload functionality to offline api ([8f43e64](https://github.com/tipeio/tipe-cli/commit/8f43e64))
* **wip:** WIP ([5f8057a](https://github.com/tipeio/tipe-cli/commit/5f8057a))

# [1.12.0](https://github.com/tipeio/tipe-cli/compare/v1.11.2...v1.12.0) (2019-10-23)


### Bug Fixes

* **test:** Remove post validation formatting ([31a477d](https://github.com/tipeio/tipe-cli/commit/31a477d))


### Features

* **validation:** Add validation via tipe/schema ([9332ff9](https://github.com/tipeio/tipe-cli/commit/9332ff9))

## [1.11.2](https://github.com/tipeio/tipe-cli/compare/v1.11.1...v1.11.2) (2019-10-21)


### Bug Fixes

* **http:** fix utl ([a3e0eb2](https://github.com/tipeio/tipe-cli/commit/a3e0eb2))

## [1.11.1](https://github.com/tipeio/tipe-cli/compare/v1.11.0...v1.11.1) (2019-10-09)


### Bug Fixes

* **push:** fix push ([f6965dc](https://github.com/tipeio/tipe-cli/commit/f6965dc))

# [1.11.0](https://github.com/tipeio/tipe-cli/compare/v1.10.1...v1.11.0) (2019-10-09)


### Features

* **blocks:** add support for boolean block ([923e7e6](https://github.com/tipeio/tipe-cli/commit/923e7e6))

## [1.10.1](https://github.com/tipeio/tipe-cli/compare/v1.10.0...v1.10.1) (2019-10-01)


### Bug Fixes

* **serve:** fix refs output ([80db39e](https://github.com/tipeio/tipe-cli/commit/80db39e))

# [1.10.0](https://github.com/tipeio/tipe-cli/compare/v1.9.0...v1.10.0) (2019-10-01)


### Features

* **serve:** add default mocks ([4d006b4](https://github.com/tipeio/tipe-cli/commit/4d006b4))

# [1.9.0](https://github.com/tipeio/tipe-cli/compare/v1.8.2...v1.9.0) (2019-09-27)


### Bug Fixes

* **test:** fix test ([f8ec93d](https://github.com/tipeio/tipe-cli/commit/f8ec93d))


### Features

* **api:** add mock api ([ca75220](https://github.com/tipeio/tipe-cli/commit/ca75220))

## [1.8.2](https://github.com/tipeio/tipe-cli/compare/v1.8.1...v1.8.2) (2019-09-24)


### Bug Fixes

* **build:** fix file name to build ([5273e2a](https://github.com/tipeio/tipe-cli/commit/5273e2a))

## [1.8.1](https://github.com/tipeio/tipe-cli/compare/v1.8.0...v1.8.1) (2019-09-18)


### Bug Fixes

* **config:** default to prod ([8d3af3a](https://github.com/tipeio/tipe-cli/commit/8d3af3a))

# [1.8.0](https://github.com/tipeio/tipe-cli/compare/v1.7.3...v1.8.0) (2019-09-11)


### Bug Fixes

* **build:** change src to lib ([9227fd0](https://github.com/tipeio/tipe-cli/commit/9227fd0))
* **cli:** clean up ([a1a160e](https://github.com/tipeio/tipe-cli/commit/a1a160e))


### Features

* **push:** add push command ([8177de2](https://github.com/tipeio/tipe-cli/commit/8177de2))
* **push:** push template ([dd062c9](https://github.com/tipeio/tipe-cli/commit/dd062c9))

## [1.7.3](https://github.com/tipeio/tipe-cli/compare/v1.7.2...v1.7.3) (2019-06-05)

## [1.7.2](https://github.com/tipeio/tipe-cli/compare/v1.7.1...v1.7.2) (2019-03-27)

## [1.7.1](https://github.com/tipeio/tipe-cli/compare/v1.7.0...v1.7.1) (2019-03-26)


### Bug Fixes

* **bug fix:** add files property to package.json ([573fb37](https://github.com/tipeio/tipe-cli/commit/573fb37))

# [1.7.0](https://github.com/tipeio/tipe-cli/compare/v1.6.5...v1.7.0) (2019-03-26)


### Bug Fixes

* **validate:** fix validate bugs ([e5627aa](https://github.com/tipeio/tipe-cli/commit/e5627aa))


### Features

* **command:** add default help command ([13a0cbc](https://github.com/tipeio/tipe-cli/commit/13a0cbc))

## [1.6.5](https://github.com/tipeio/tipe-cli/compare/v1.6.4...v1.6.5) (2019-03-23)


### Bug Fixes

* **chore:** fix spacing ([86def00](https://github.com/tipeio/tipe-cli/commit/86def00))

## [1.6.4](https://github.com/tipeio/tipe-cli/compare/v1.6.3...v1.6.4) (2019-03-15)


### Bug Fixes

* **findById:** returns correct value ([a2c7061](https://github.com/tipeio/tipe-cli/commit/a2c7061))
* **offline:** findById returns doc ([76a1a79](https://github.com/tipeio/tipe-cli/commit/76a1a79))

## [1.6.3](https://github.com/tipeio/tipe-cli/compare/v1.6.2...v1.6.3) (2019-03-15)


### Bug Fixes

* **db:** fix null deep array ([9327d08](https://github.com/tipeio/tipe-cli/commit/9327d08))

## [1.6.2](https://github.com/tipeio/tipe-cli/compare/v1.6.1...v1.6.2) (2019-03-14)


### Bug Fixes

* **offline:** add express middleware ([ff3fc96](https://github.com/tipeio/tipe-cli/commit/ff3fc96))

## [1.6.1](https://github.com/tipeio/tipe-cli/compare/v1.6.0...v1.6.1) (2019-03-14)


### Bug Fixes

* **db:** fix resolver ([e744116](https://github.com/tipeio/tipe-cli/commit/e744116))

# [1.6.0](https://github.com/tipeio/tipe-cli/compare/v1.5.0...v1.6.0) (2019-03-13)


### Features

* **new:** add new command ([5cc98da](https://github.com/tipeio/tipe-cli/commit/5cc98da))

# [1.5.0](https://github.com/tipeio/tipe-cli/compare/v1.4.1...v1.5.0) (2019-03-12)


### Features

* **offline:** add offline api ([cfbfd69](https://github.com/tipeio/tipe-cli/commit/cfbfd69))

## [1.4.1](https://github.com/tipeio/tipe-cli/compare/v1.4.0...v1.4.1) (2019-03-09)


### Bug Fixes

* **api:** add api url flag ([9be5b53](https://github.com/tipeio/tipe-cli/commit/9be5b53))

# [1.4.0](https://github.com/tipeio/tipe-cli/compare/v1.3.0...v1.4.0) (2019-01-10)


### Features

* **push:** add dry run ([ec82480](https://github.com/tipeio/tipe-cli/commit/ec82480))

# [1.3.0](https://github.com/tipeio/tipe-cli/compare/v1.2.0...v1.3.0) (2019-01-09)


### Features

* **args:** add arg checks ([2dfe51c](https://github.com/tipeio/tipe-cli/commit/2dfe51c))
* **push:** add push command ([5f173d5](https://github.com/tipeio/tipe-cli/commit/5f173d5))
* **push:** show output ([749152e](https://github.com/tipeio/tipe-cli/commit/749152e)), closes [#17](https://github.com/tipeio/tipe-cli/issues/17)

# [1.2.0](https://github.com/tipeio/tipe-cli/compare/v1.1.0...v1.2.0) (2018-11-06)


### Features

* **migration:** add migration context ([ff0c6b9](https://github.com/tipeio/tipe-cli/commit/ff0c6b9))

# [1.1.0](https://github.com/tipeio/tipe-cli/compare/v1.0.0...v1.1.0) (2018-11-05)


### Features

* **migration:** add migration commands ([1c62015](https://github.com/tipeio/tipe-cli/commit/1c62015))
* **migration:** add migration generator ([e6680fc](https://github.com/tipeio/tipe-cli/commit/e6680fc))

# 1.0.0 (2018-11-02)


### Bug Fixes

* lint ([ff75d99](https://github.com/tipeio/tipe-cli/commit/ff75d99))
* tests ([40a438a](https://github.com/tipeio/tipe-cli/commit/40a438a))
* **type:** type with push command ([97e13cd](https://github.com/tipeio/tipe-cli/commit/97e13cd))
* utils ([767adf7](https://github.com/tipeio/tipe-cli/commit/767adf7))
* **auth:** filepath ([bab156f](https://github.com/tipeio/tipe-cli/commit/bab156f))
* **ci:** fix travis build ([f7a2971](https://github.com/tipeio/tipe-cli/commit/f7a2971))
* **cli:** fixed required statements ([bcb83fd](https://github.com/tipeio/tipe-cli/commit/bcb83fd))
* **commands:** fix to api calls ([21e2804](https://github.com/tipeio/tipe-cli/commit/21e2804))
* **server:** fix content gen ([7eec570](https://github.com/tipeio/tipe-cli/commit/7eec570))
* **test:** fix server command test ([31d52f1](https://github.com/tipeio/tipe-cli/commit/31d52f1))
* **test:** fixed broken tests ([73a308e](https://github.com/tipeio/tipe-cli/commit/73a308e))
* **test:** fixed dem tests ([5d138e5](https://github.com/tipeio/tipe-cli/commit/5d138e5))


### Features

* login init ([b4b994c](https://github.com/tipeio/tipe-cli/commit/b4b994c))
* schema hello world ([5456737](https://github.com/tipeio/tipe-cli/commit/5456737))
* signup ([94620d7](https://github.com/tipeio/tipe-cli/commit/94620d7))
* **push:** push command. fix typos and removed required arg from server command ([5ebc4f8](https://github.com/tipeio/tipe-cli/commit/5ebc4f8))
* src ([b641bc9](https://github.com/tipeio/tipe-cli/commit/b641bc9))
* **args:** add arg priority ([712dd8a](https://github.com/tipeio/tipe-cli/commit/712dd8a))
* **auth:** check if user is auth before running commands. removed unused command. ([c2b5fa8](https://github.com/tipeio/tipe-cli/commit/c2b5fa8))
* **config:** add config system ([550359b](https://github.com/tipeio/tipe-cli/commit/550359b))
* **migration:** add rules ([4dab1f6](https://github.com/tipeio/tipe-cli/commit/4dab1f6))
* **migration:** add rules ([5a21fd1](https://github.com/tipeio/tipe-cli/commit/5a21fd1))
* **pull:** creates schema file from schema stored on tipe ([9dc500a](https://github.com/tipeio/tipe-cli/commit/9dc500a))
* **pull:** WIP ([4fb3a3e](https://github.com/tipeio/tipe-cli/commit/4fb3a3e))
* **push:** add conflict check ([29c2dfd](https://github.com/tipeio/tipe-cli/commit/29c2dfd))
