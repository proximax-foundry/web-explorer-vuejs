const elements = {
  searchTextBar: 'input[type="text"]',
  submit: 'img.search',
  node: '#node',
  currentFilter: '.current-search-filter',
  noFilterOption: '.search-filter > div:first-child',
  TxnHashOption: '.search-filter > div:nth-child(2)',
  BlockOption: '.search-filter > div:nth-child(3)',
  AssetIdOption: '.search-filter > div:nth-child(4)',
  NamespaceOption: '.search-filter > div:nth-child(5)',
  AddressOption: '.search-filter > div:nth-child(6)',
  PublicKeyOption: '.search-filter > div:nth-child(7)',
}

const commands = {
  setNetworkTestnet1(node){
    return this
      .waitForElementVisible('@node')
      .assert.containsText('@node', node);
  },

  searchTransaction(){
    return this
      .waitForElementVisible('@searchTextBar')
      .setValue('@searchTextBar', '8A67561D52DE7B8083E3D98864F0794D99B3A4438FFD84003626BC9558CF21E5')
      .pause(1000)
      .click('@submit')
      .pause(1000)
      .assert.containsText('div[copysubject="Transaction hash"]', '8A67561D52DE7B8083E3D98864F0794D99B3A4438FFD84003626BC9558CF21E5');
  },

  searchBlockHeight(){
    return this
      .waitForElementVisible('@searchTextBar')
      .setValue('@searchTextBar', '4815294')
      .pause(1000)
      .click('@submit')
      .pause(1000)
      .assert.containsText('p.text-gray-500.mb-5.text-sm.font-bold', 'Block Details');
  },

  searchAssetID(){
    return this
      .waitForElementVisible('@searchTextBar')
      .setValue('@searchTextBar', '13bfc518e40549d7')
      .pause(1000)
      .click('@submit')
      .pause(1000)
      .assert.containsText('p.text-gray-500.mb-5.text-sm.font-bold', 'Asset Details');
  },

  searchNamespaceID(){
    return this
      .waitForElementVisible('@searchTextBar')
      .setValue('@searchTextBar', 'BFFB42A19116BDF6')
      .pause(1000)
      .click('@submit')
      .pause(1000)
      .assert.containsText('div.text-txs.text-gray-400.font-normal.mt-1', 'Namespace');
  },

  searchNamespace(){
    return this
      .waitForElementVisible('@searchTextBar')
      .setValue('@searchTextBar', 'commonnamespace')
      .pause(1000)
      .click('@submit')
      .pause(1000)
      .assert.containsText('div.text-txs.text-gray-400.font-normal.mt-1', 'Namespace');
  },

  searchNamespaceAsset(){
    return this
      .waitForElementVisible('@searchTextBar')
      .setValue('@searchTextBar', 'PRX.XPX')
      .pause(1000)
      .click('@submit')
      .pause(1000)
      .assert.containsText('p.text-gray-500.mb-5.text-sm.font-bold', 'Asset Details');
  },

  searchNamespaceAddress(){
    return this
      .waitForElementVisible('@searchTextBar')
      .setValue('@searchTextBar', 'testns2.addresslinked')
      .pause(1000)
      .click('@submit')
      .pause(1000)
      .assert.containsText('p.text-gray-500.mb-5.text-sm.font-bold', 'Account Details');
  },

  searchAddress(){
    return this
      .waitForElementVisible('@searchTextBar')
      .setValue('@searchTextBar', 'VCMCJP-RMJ6IU-BOZ7HC-YBQOSE-OVGISX-6AMUJ4-ESTN')
      .pause(1000)
      .click('@submit')
      .pause(1000)
      .assert.containsText('p.text-gray-500.mb-5.text-sm.font-bold', 'Account Details');
  },

  searchPublicKey(){
    return this
      .waitForElementVisible('@searchTextBar')
      .setValue('@searchTextBar', '81298A6EBA208AAAE1BD3278B30BB047D33CEABA4E13FF144753825C499ADB98')
      .pause(1000)
      .click('@submit')
      .pause(1000)
      .assert.containsText('p.text-gray-500.mb-5.text-sm.font-bold', 'Account Details');
  },

  searchTxnHashWithTxnFilter(){
    return this
      .waitForElementVisible('@searchTextBar')
      .setValue('@searchTextBar', '8A67561D52DE7B8083E3D98864F0794D99B3A4438FFD84003626BC9558CF21E5')
      .click('@currentFilter')
      .click('@TxnHashOption')
      .pause(1000)
      .click('@submit')
      .pause(1000)
      .assert.containsText('div[copysubject="Transaction hash"]', '8A67561D52DE7B8083E3D98864F0794D99B3A4438FFD84003626BC9558CF21E5');
  },

  searchBlockWithBlockFilter(){
    return this
      .waitForElementVisible('@searchTextBar')
      .setValue('@searchTextBar', '4815294')
      .click('@currentFilter')
      .click('@BlockOption')
      .pause(1000)
      .click('@submit')
      .pause(1000)
      .assert.containsText('p.text-gray-500.mb-5.text-sm.font-bold', 'Block Details');
  },

  searchAssetIdWithAssetIdFilter(){
    return this
      .waitForElementVisible('@searchTextBar')
      .setValue('@searchTextBar', '13bfc518e40549d7')
      .click('@currentFilter')
      .click('@AssetIdOption')
      .pause(1000)
      .click('@submit')
      .pause(1000)
      .assert.containsText('p.text-gray-500.mb-5.text-sm.font-bold', 'Asset Details');
  },

  searchNamespaceIdWithNamespaceFilter(){
    return this
      .waitForElementVisible('@searchTextBar')
      .setValue('@searchTextBar', 'BFFB42A19116BDF6')
      .click('@currentFilter')
      .click('@NamespaceOption')
      .pause(1000)
      .click('@submit')
      .pause(1000)
      .assert.containsText('div.text-txs.text-gray-400.font-normal.mt-1', 'Namespace');
  },

  searchNamespaceWithNamespaceFilter(){
    return this
      .waitForElementVisible('@searchTextBar')
      .setValue('@searchTextBar', 'commonnamespace')
      .click('@currentFilter')
      .click('@NamespaceOption')
      .pause(1000)
      .click('@submit')
      .pause(1000)
      .assert.containsText('div.text-txs.text-gray-400.font-normal.mt-1', 'Namespace');
  },

  searchNamespaceWithNamespaceFilterAsset(){
    return this
      .waitForElementVisible('@searchTextBar')
      .setValue('@searchTextBar', 'PRX.XPX')
      .click('@currentFilter')
      .click('@NamespaceOption')
      .pause(1000)
      .click('@submit')
      .pause(1000)
      .assert.containsText('p.text-gray-500.mb-5.text-sm.font-bold', 'Asset Details');
  },

  searchNamespaceWithNamespaceFilterAddress(){
    return this
      .waitForElementVisible('@searchTextBar')
      .setValue('@searchTextBar', 'testns2.addresslinked')
      .click('@currentFilter')
      .click('@NamespaceOption')
      .pause(1000)
      .click('@submit')
      .pause(1000)
      .assert.containsText('p.text-gray-500.mb-5.text-sm.font-bold', 'Account Details');
  },

  searchAddressWithAddressFilter(){
    return this
      .waitForElementVisible('@searchTextBar')
      .setValue('@searchTextBar', 'VCMCJP-RMJ6IU-BOZ7HC-YBQOSE-OVGISX-6AMUJ4-ESTN')
      .click('@currentFilter')
      .click('@AddressOption')
      .pause(1000)
      .click('@submit')
      .pause(1000)
      .assert.containsText('p.text-gray-500.mb-5.text-sm.font-bold', 'Account Details');
  },

  searchPublicKeyWithPublicKeyFilter(){
    return this
      .waitForElementVisible('@searchTextBar')
      .setValue('@searchTextBar', '81298A6EBA208AAAE1BD3278B30BB047D33CEABA4E13FF144753825C499ADB98')
      .click('@currentFilter')
      .click('@PublicKeyOption')
      .pause(1000)
      .click('@submit')
      .pause(1000)
      .assert.containsText('p.text-gray-500.mb-5.text-sm.font-bold', 'Account Details');
  },
}


module.exports = {
  elements: elements,
  commands: commands,
  url: function () {
    return this.url;
  }
}
