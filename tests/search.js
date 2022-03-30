module.exports = {
  "Set network to Sirius Testnet 1": (browser) => {
    let search = browser.page.search();
    browser
      .url('http://localhost:8080/')
    search
      .setNetworkTestnet1(browser.globals.node)
  },

  "Search transaction without filter": (browser) => {
    let search = browser.page.search();
    browser
      .url('http://localhost:8080/')
    search
      .searchTransaction()
  },

  "Search block height without filter": (browser) => {
    let search = browser.page.search();
    browser
      .url('http://localhost:8080/')
    search
      .searchBlockHeight()
  },

  "Search asset ID without filter": (browser) => {
    let search = browser.page.search();
    browser
      .url('http://localhost:8080/')
    search
      .searchAssetID()
  },

  "Search Namespace ID without filter": (browser) => {
    let search = browser.page.search();
    browser
      .url('http://localhost:8080/')
    search
      .searchNamespaceID()
  },

  "Search Namespace without filter": (browser) => {
    let search = browser.page.search();
    browser
      .url('http://localhost:8080/')
    search
      .searchNamespace()
  },

  "Search Address without filter": (browser) => {
    let search = browser.page.search();
    browser
      .url('http://localhost:8080/')
    search
      .searchAddress()
  },

  "Search Public Key without filter": (browser) => {
    let search = browser.page.search();
    browser
      .url('http://localhost:8080/')
    search
      .searchPublicKey()
  },
}