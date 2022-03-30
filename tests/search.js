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

  "Search Namespace without filter with linked to asset": (browser) => {
    let search = browser.page.search();
    browser
      .url('http://localhost:8080/')
    search
      .searchNamespaceAsset()
  },

  "Search Namespace without filter with linked to address": (browser) => {
    let search = browser.page.search();
    browser
      .url('http://localhost:8080/')
    search
      .searchNamespaceAddress()
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

  "Search Transaction Hash with Txn Hash filter": (browser) => {
    let search = browser.page.search();
    browser
      .url('http://localhost:8080/')
    search
      .searchTxnHashWithTxnFilter()
  },

  "Search Block height with Block filter": (browser) => {
    let search = browser.page.search();
    browser
      .url('http://localhost:8080/')
    search
      .searchBlockWithBlockFilter()
  },

  "Search Asset ID with Asset ID filter": (browser) => {
    let search = browser.page.search();
    browser
      .url('http://localhost:8080/')
    search
      .searchAssetIdWithAssetIdFilter()
  },

  "Search Namespace ID with Namespace filter": (browser) => {
    let search = browser.page.search();
    browser
      .url('http://localhost:8080/')
    search
      .searchNamespaceIdWithNamespaceFilter()
  },

  "Search Namespace with Namespace filter with linked to asset": (browser) => {
    let search = browser.page.search();
    browser
      .url('http://localhost:8080/')
    search
      .searchNamespaceWithNamespaceFilterAsset()
  },

  "Search Namespace with Namespace filter with linked to address": (browser) => {
    let search = browser.page.search();
    browser
      .url('http://localhost:8080/')
    search
      .searchNamespaceWithNamespaceFilterAddress()
  },

  "Search Address with Address filter": (browser) => {
    let search = browser.page.search();
    browser
      .url('http://localhost:8080/')
    search
      .searchAddressWithAddressFilter()
  },

  "Search Public Key with Public Key filter": (browser) => {
    let search = browser.page.search();
    browser
      .url('http://localhost:8080/')
    search
      .searchPublicKeyWithPublicKeyFilter()
  },
}