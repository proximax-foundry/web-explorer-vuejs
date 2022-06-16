(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[1],{

/***/ "./node_modules/node-gyp-build/index.js":
/*!**********************************************!*\
  !*** ./node_modules/node-gyp-build/index.js ***!
  \**********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("/* WEBPACK VAR INJECTION */(function(process) {var fs = __webpack_require__(/*! fs */ \"./node_modules/node-libs-browser/mock/empty.js\")\nvar path = __webpack_require__(/*! path */ \"./node_modules/path-browserify/index.js\")\nvar os = __webpack_require__(/*! os */ \"./node_modules/os-browserify/browser.js\")\n\n// Workaround to fix webpack's build warnings: 'the request of a dependency is an expression'\nvar runtimeRequire =  true ? require : undefined // eslint-disable-line\n\nvar vars = (process.config && process.config.variables) || {}\nvar prebuildsOnly = !!Object({\"NODE_ENV\":\"staging\",\"BASE_URL\":\"/web-explorer-vuejs/\"}).PREBUILDS_ONLY\nvar abi = process.versions.modules // TODO: support old node where this is undef\nvar runtime = isElectron() ? 'electron' : (isNwjs() ? 'node-webkit' : 'node')\n\nvar arch = os.arch()\nvar platform = os.platform()\nvar libc = Object({\"NODE_ENV\":\"staging\",\"BASE_URL\":\"/web-explorer-vuejs/\"}).LIBC || (isAlpine(platform) ? 'musl' : 'glibc')\nvar armv = Object({\"NODE_ENV\":\"staging\",\"BASE_URL\":\"/web-explorer-vuejs/\"}).ARM_VERSION || (arch === 'arm64' ? '8' : vars.arm_version) || ''\nvar uv = (process.versions.uv || '').split('.')[0]\n\nmodule.exports = load\n\nfunction load (dir) {\n  return runtimeRequire(load.path(dir))\n}\n\nload.path = function (dir) {\n  dir = path.resolve(dir || '.')\n\n  try {\n    var name = runtimeRequire(path.join(dir, 'package.json')).name.toUpperCase().replace(/-/g, '_')\n    if (Object({\"NODE_ENV\":\"staging\",\"BASE_URL\":\"/web-explorer-vuejs/\"})[name + '_PREBUILD']) dir = Object({\"NODE_ENV\":\"staging\",\"BASE_URL\":\"/web-explorer-vuejs/\"})[name + '_PREBUILD']\n  } catch (err) {}\n\n  if (!prebuildsOnly) {\n    var release = getFirst(path.join(dir, 'build/Release'), matchBuild)\n    if (release) return release\n\n    var debug = getFirst(path.join(dir, 'build/Debug'), matchBuild)\n    if (debug) return debug\n  }\n\n  var prebuild = resolve(dir)\n  if (prebuild) return prebuild\n\n  var nearby = resolve(path.dirname(process.execPath))\n  if (nearby) return nearby\n\n  var target = [\n    'platform=' + platform,\n    'arch=' + arch,\n    'runtime=' + runtime,\n    'abi=' + abi,\n    'uv=' + uv,\n    armv ? 'armv=' + armv : '',\n    'libc=' + libc,\n    'node=' + process.versions.node,\n    process.versions.electron ? 'electron=' + process.versions.electron : '',\n     true ? 'webpack=true' : undefined // eslint-disable-line\n  ].filter(Boolean).join(' ')\n\n  throw new Error('No native build was found for ' + target + '\\n    loaded from: ' + dir + '\\n')\n\n  function resolve (dir) {\n    // Find matching \"prebuilds/<platform>-<arch>\" directory\n    var tuples = readdirSync(path.join(dir, 'prebuilds')).map(parseTuple)\n    var tuple = tuples.filter(matchTuple(platform, arch)).sort(compareTuples)[0]\n    if (!tuple) return\n\n    // Find most specific flavor first\n    var prebuilds = path.join(dir, 'prebuilds', tuple.name)\n    var parsed = readdirSync(prebuilds).map(parseTags)\n    var candidates = parsed.filter(matchTags(runtime, abi))\n    var winner = candidates.sort(compareTags(runtime))[0]\n    if (winner) return path.join(prebuilds, winner.file)\n  }\n}\n\nfunction readdirSync (dir) {\n  try {\n    return fs.readdirSync(dir)\n  } catch (err) {\n    return []\n  }\n}\n\nfunction getFirst (dir, filter) {\n  var files = readdirSync(dir).filter(filter)\n  return files[0] && path.join(dir, files[0])\n}\n\nfunction matchBuild (name) {\n  return /\\.node$/.test(name)\n}\n\nfunction parseTuple (name) {\n  // Example: darwin-x64+arm64\n  var arr = name.split('-')\n  if (arr.length !== 2) return\n\n  var platform = arr[0]\n  var architectures = arr[1].split('+')\n\n  if (!platform) return\n  if (!architectures.length) return\n  if (!architectures.every(Boolean)) return\n\n  return { name, platform, architectures }\n}\n\nfunction matchTuple (platform, arch) {\n  return function (tuple) {\n    if (tuple == null) return false\n    if (tuple.platform !== platform) return false\n    return tuple.architectures.includes(arch)\n  }\n}\n\nfunction compareTuples (a, b) {\n  // Prefer single-arch prebuilds over multi-arch\n  return a.architectures.length - b.architectures.length\n}\n\nfunction parseTags (file) {\n  var arr = file.split('.')\n  var extension = arr.pop()\n  var tags = { file: file, specificity: 0 }\n\n  if (extension !== 'node') return\n\n  for (var i = 0; i < arr.length; i++) {\n    var tag = arr[i]\n\n    if (tag === 'node' || tag === 'electron' || tag === 'node-webkit') {\n      tags.runtime = tag\n    } else if (tag === 'napi') {\n      tags.napi = true\n    } else if (tag.slice(0, 3) === 'abi') {\n      tags.abi = tag.slice(3)\n    } else if (tag.slice(0, 2) === 'uv') {\n      tags.uv = tag.slice(2)\n    } else if (tag.slice(0, 4) === 'armv') {\n      tags.armv = tag.slice(4)\n    } else if (tag === 'glibc' || tag === 'musl') {\n      tags.libc = tag\n    } else {\n      continue\n    }\n\n    tags.specificity++\n  }\n\n  return tags\n}\n\nfunction matchTags (runtime, abi) {\n  return function (tags) {\n    if (tags == null) return false\n    if (tags.runtime !== runtime && !runtimeAgnostic(tags)) return false\n    if (tags.abi !== abi && !tags.napi) return false\n    if (tags.uv && tags.uv !== uv) return false\n    if (tags.armv && tags.armv !== armv) return false\n    if (tags.libc && tags.libc !== libc) return false\n\n    return true\n  }\n}\n\nfunction runtimeAgnostic (tags) {\n  return tags.runtime === 'node' && tags.napi\n}\n\nfunction compareTags (runtime) {\n  // Precedence: non-agnostic runtime, abi over napi, then by specificity.\n  return function (a, b) {\n    if (a.runtime !== b.runtime) {\n      return a.runtime === runtime ? -1 : 1\n    } else if (a.abi !== b.abi) {\n      return a.abi ? -1 : 1\n    } else if (a.specificity !== b.specificity) {\n      return a.specificity > b.specificity ? -1 : 1\n    } else {\n      return 0\n    }\n  }\n}\n\nfunction isNwjs () {\n  return !!(process.versions && process.versions.nw)\n}\n\nfunction isElectron () {\n  if (process.versions && process.versions.electron) return true\n  if (Object({\"NODE_ENV\":\"staging\",\"BASE_URL\":\"/web-explorer-vuejs/\"}).ELECTRON_RUN_AS_NODE) return true\n  return typeof window !== 'undefined' && window.process && window.process.type === 'renderer'\n}\n\nfunction isAlpine (platform) {\n  return platform === 'linux' && fs.existsSync('/etc/alpine-release')\n}\n\n// Exposed for unit tests\n// TODO: move to lib\nload.parseTags = parseTags\nload.matchTags = matchTags\nload.compareTags = compareTags\nload.parseTuple = parseTuple\nload.matchTuple = matchTuple\nload.compareTuples = compareTuples\n\n/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../node-libs-browser/mock/process.js */ \"./node_modules/node-libs-browser/mock/process.js\")))\n\n//# sourceURL=webpack:///./node_modules/node-gyp-build/index.js?");

/***/ }),

/***/ "./node_modules/node-libs-browser/mock/empty.js":
/*!******************************************************!*\
  !*** ./node_modules/node-libs-browser/mock/empty.js ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("\n\n//# sourceURL=webpack:///./node_modules/node-libs-browser/mock/empty.js?");

/***/ }),

/***/ "./node_modules/os-browserify/browser.js":
/*!***********************************************!*\
  !*** ./node_modules/os-browserify/browser.js ***!
  \***********************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("exports.endianness = function () { return 'LE' };\n\nexports.hostname = function () {\n    if (typeof location !== 'undefined') {\n        return location.hostname\n    }\n    else return '';\n};\n\nexports.loadavg = function () { return [] };\n\nexports.uptime = function () { return 0 };\n\nexports.freemem = function () {\n    return Number.MAX_VALUE;\n};\n\nexports.totalmem = function () {\n    return Number.MAX_VALUE;\n};\n\nexports.cpus = function () { return [] };\n\nexports.type = function () { return 'Browser' };\n\nexports.release = function () {\n    if (typeof navigator !== 'undefined') {\n        return navigator.appVersion;\n    }\n    return '';\n};\n\nexports.networkInterfaces\n= exports.getNetworkInterfaces\n= function () { return {} };\n\nexports.arch = function () { return 'javascript' };\n\nexports.platform = function () { return 'browser' };\n\nexports.tmpdir = exports.tmpDir = function () {\n    return '/tmp';\n};\n\nexports.EOL = '\\n';\n\nexports.homedir = function () {\n\treturn '/'\n};\n\n\n//# sourceURL=webpack:///./node_modules/os-browserify/browser.js?");

/***/ }),

/***/ "./node_modules/utf-8-validate/fallback.js":
/*!*************************************************!*\
  !*** ./node_modules/utf-8-validate/fallback.js ***!
  \*************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\n/**\n * Checks if a given buffer contains only correct UTF-8.\n * Ported from https://www.cl.cam.ac.uk/%7Emgk25/ucs/utf8_check.c by\n * Markus Kuhn.\n *\n * @param {Buffer} buf The buffer to check\n * @return {Boolean} `true` if `buf` contains only correct UTF-8, else `false`\n * @public\n */\nfunction isValidUTF8(buf) {\n  const len = buf.length;\n  let i = 0;\n\n  while (i < len) {\n    if ((buf[i] & 0x80) === 0x00) {  // 0xxxxxxx\n      i++;\n    } else if ((buf[i] & 0xe0) === 0xc0) {  // 110xxxxx 10xxxxxx\n      if (\n        i + 1 === len ||\n        (buf[i + 1] & 0xc0) !== 0x80 ||\n        (buf[i] & 0xfe) === 0xc0  // overlong\n      ) {\n        return false;\n      }\n\n      i += 2;\n    } else if ((buf[i] & 0xf0) === 0xe0) {  // 1110xxxx 10xxxxxx 10xxxxxx\n      if (\n        i + 2 >= len ||\n        (buf[i + 1] & 0xc0) !== 0x80 ||\n        (buf[i + 2] & 0xc0) !== 0x80 ||\n        buf[i] === 0xe0 && (buf[i + 1] & 0xe0) === 0x80 ||  // overlong\n        buf[i] === 0xed && (buf[i + 1] & 0xe0) === 0xa0  // surrogate (U+D800 - U+DFFF)\n      ) {\n        return false;\n      }\n\n      i += 3;\n    } else if ((buf[i] & 0xf8) === 0xf0) {  // 11110xxx 10xxxxxx 10xxxxxx 10xxxxxx\n      if (\n        i + 3 >= len ||\n        (buf[i + 1] & 0xc0) !== 0x80 ||\n        (buf[i + 2] & 0xc0) !== 0x80 ||\n        (buf[i + 3] & 0xc0) !== 0x80 ||\n        buf[i] === 0xf0 && (buf[i + 1] & 0xf0) === 0x80 ||  // overlong\n        buf[i] === 0xf4 && buf[i + 1] > 0x8f || buf[i] > 0xf4  // > U+10FFFF\n      ) {\n        return false;\n      }\n\n      i += 4;\n    } else {\n      return false;\n    }\n  }\n\n  return true;\n}\n\nmodule.exports = isValidUTF8;\n\n\n//# sourceURL=webpack:///./node_modules/utf-8-validate/fallback.js?");

/***/ }),

/***/ "./node_modules/utf-8-validate/index.js":
/*!**********************************************!*\
  !*** ./node_modules/utf-8-validate/index.js ***!
  \**********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("/* WEBPACK VAR INJECTION */(function(__dirname) {\n\ntry {\n  module.exports = __webpack_require__(/*! node-gyp-build */ \"./node_modules/node-gyp-build/index.js\")(__dirname);\n} catch (e) {\n  module.exports = __webpack_require__(/*! ./fallback */ \"./node_modules/utf-8-validate/fallback.js\");\n}\n\n/* WEBPACK VAR INJECTION */}.call(this, \"/\"))\n\n//# sourceURL=webpack:///./node_modules/utf-8-validate/index.js?");

/***/ }),

/***/ "./src/util/metadataUtil.ts":
/*!**********************************!*\
  !*** ./src/util/metadataUtil.ts ***!
  \**********************************/
/*! exports provided: MetadataUtils */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"MetadataUtils\", function() { return MetadataUtils; });\n/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ \"./node_modules/tslib/tslib.es6.js\");\n/* harmony import */ var _state_appState__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @/state/appState */ \"./src/state/appState.ts\");\n/* harmony import */ var tsjs_xpx_chain_sdk__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! tsjs-xpx-chain-sdk */ \"./node_modules/tsjs-xpx-chain-sdk/dist/index.js\");\n/* harmony import */ var tsjs_xpx_chain_sdk__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(tsjs_xpx_chain_sdk__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var utf_8_validate__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! utf-8-validate */ \"./node_modules/utf-8-validate/index.js\");\n/* harmony import */ var utf_8_validate__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(utf_8_validate__WEBPACK_IMPORTED_MODULE_3__);\n\n\n\n\nclass MetadataUtils {\n    static removeDoubleZero(string) {\n        let isZero = string.endsWith('00');\n        if (isZero) {\n            string = string.substring(0, string.length - 2);\n            string = this.removeDoubleZero(string);\n        }\n        return string;\n    }\n    static convertUtf8(scopedMetadataKey) {\n        scopedMetadataKey = MetadataUtils.removeDoubleZero(scopedMetadataKey);\n        let bytes = tsjs_xpx_chain_sdk__WEBPACK_IMPORTED_MODULE_2__[\"Convert\"].hexToUint8(scopedMetadataKey);\n        if (utf_8_validate__WEBPACK_IMPORTED_MODULE_3___default()(bytes)) {\n            scopedMetadataKey = tsjs_xpx_chain_sdk__WEBPACK_IMPORTED_MODULE_2__[\"Convert\"].decodeHexToUtf8(scopedMetadataKey);\n        }\n        return scopedMetadataKey;\n    }\n    static getAccountMetadata(publicKey) {\n        return Object(tslib__WEBPACK_IMPORTED_MODULE_0__[\"__awaiter\"])(this, void 0, void 0, function* () {\n            try {\n                let accountMetadata;\n                let accountMetadataList = [];\n                let metadataQueryParams = new tsjs_xpx_chain_sdk__WEBPACK_IMPORTED_MODULE_2__[\"MetadataQueryParams\"]();\n                metadataQueryParams.metadataType = tsjs_xpx_chain_sdk__WEBPACK_IMPORTED_MODULE_2__[\"MetadataType\"].ACCOUNT;\n                metadataQueryParams.targetKey = publicKey;\n                let fetchMetadata = yield _state_appState__WEBPACK_IMPORTED_MODULE_1__[\"AppState\"].chainAPI.metadataAPI.searchMetadatas(metadataQueryParams);\n                fetchMetadata.metadataEntries.forEach(metadataEntry => {\n                    accountMetadata = {\n                        scopedMetadataKeyUtf8: metadataEntry.scopedMetadataKey.toHex() == this.convertUtf8(metadataEntry.scopedMetadataKey.toHex()) ? null : this.convertUtf8(metadataEntry.scopedMetadataKey.toHex()),\n                        scopedMetadataKeyHex: metadataEntry.scopedMetadataKey.toHex(),\n                        value: metadataEntry.value\n                    };\n                    accountMetadataList.push(accountMetadata);\n                });\n                return accountMetadataList;\n            }\n            catch (e) {\n                console.error(e);\n            }\n        });\n    }\n    static getAssetMetadata(mosaic) {\n        return Object(tslib__WEBPACK_IMPORTED_MODULE_0__[\"__awaiter\"])(this, void 0, void 0, function* () {\n            try {\n                let assetMetadata;\n                let assetMetadataList = [];\n                let metadataQueryParams = new tsjs_xpx_chain_sdk__WEBPACK_IMPORTED_MODULE_2__[\"MetadataQueryParams\"]();\n                metadataQueryParams.metadataType = tsjs_xpx_chain_sdk__WEBPACK_IMPORTED_MODULE_2__[\"MetadataType\"].MOSAIC;\n                metadataQueryParams.targetId = new tsjs_xpx_chain_sdk__WEBPACK_IMPORTED_MODULE_2__[\"MosaicId\"](mosaic);\n                let fetchMetadata = yield _state_appState__WEBPACK_IMPORTED_MODULE_1__[\"AppState\"].chainAPI.metadataAPI.searchMetadatas(metadataQueryParams);\n                fetchMetadata.metadataEntries.forEach(metadataEntry => {\n                    assetMetadata = {\n                        scopedMetadataKeyUtf8: metadataEntry.scopedMetadataKey.toHex() == this.convertUtf8(metadataEntry.scopedMetadataKey.toHex()) ? null : this.convertUtf8(metadataEntry.scopedMetadataKey.toHex()),\n                        scopedMetadataKeyHex: metadataEntry.scopedMetadataKey.toHex(),\n                        value: metadataEntry.value\n                    };\n                    assetMetadataList.push(assetMetadata);\n                });\n                return assetMetadataList;\n            }\n            catch (e) {\n                console.error(e);\n            }\n        });\n    }\n    static getNamespaceMetadata(namespaceName) {\n        return Object(tslib__WEBPACK_IMPORTED_MODULE_0__[\"__awaiter\"])(this, void 0, void 0, function* () {\n            try {\n                let namespaceMetadata;\n                let namespaceMetadataList = [];\n                let metadataQueryParams = new tsjs_xpx_chain_sdk__WEBPACK_IMPORTED_MODULE_2__[\"MetadataQueryParams\"]();\n                metadataQueryParams.metadataType = tsjs_xpx_chain_sdk__WEBPACK_IMPORTED_MODULE_2__[\"MetadataType\"].NAMESPACE;\n                metadataQueryParams.targetId = new tsjs_xpx_chain_sdk__WEBPACK_IMPORTED_MODULE_2__[\"NamespaceId\"](namespaceName);\n                let fetchMetadata = yield _state_appState__WEBPACK_IMPORTED_MODULE_1__[\"AppState\"].chainAPI.metadataAPI.searchMetadatas(metadataQueryParams);\n                fetchMetadata.metadataEntries.forEach(metadataEntry => {\n                    namespaceMetadata = {\n                        scopedMetadataKeyUtf8: metadataEntry.scopedMetadataKey.toHex() == this.convertUtf8(metadataEntry.scopedMetadataKey.toHex()) ? null : this.convertUtf8(metadataEntry.scopedMetadataKey.toHex()),\n                        scopedMetadataKeyHex: metadataEntry.scopedMetadataKey.toHex(),\n                        value: metadataEntry.value\n                    };\n                    namespaceMetadataList.push(namespaceMetadata);\n                });\n                return namespaceMetadataList;\n            }\n            catch (e) {\n                console.error(e);\n            }\n        });\n    }\n}\n\n\n//# sourceURL=webpack:///./src/util/metadataUtil.ts?");

/***/ })

}]);