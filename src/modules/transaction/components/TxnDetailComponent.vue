<template>
  <div class="txn-div">
    <div>
      <div>Tx Hash</div>
      <div>BE089CAE983847311E2EAB4ACB6B8EB6F0C9A505CE2A286BD859761642FD488648226</div>
    </div>
    <div>
      <div>Status</div>
      <div>
        <div class="flex items-center px-2 py-1 rounded-sm border border-green-100 bg-green-100 text-green-700 text-xs"><span class="material-icons md-16">done</span>&nbsp;Success</div>
      </div>
    </div>
    <div>
      <div>Timestamp</div>
      <div>25th Aug 2021 12:34:10 +8GMT</div>
    </div>
    <div>
      <div>Height</div>
      <div class="text-blue-primary">2865249</div>
    </div>
    <div>
      <div>Tx Type</div>
      <div>Aggregate Bonded <span class="text-xxs text-gray-500">(Version: 3)</span></div>
    </div>
    <div>
      <div>Tx Fee</div>
      <div class="relative"><span class="font-bold">0.</span><span class="text-xxs">043076</span> <span class="font-bold">XPX</span> <img src="@/assets/img/icon-xpx.svg" class="ml-2 inline-block absolute" style="top: -1px; width:14px;" /></div>
    </div>
    <div>
      <div>Signature</div>
      <div class="break-all">6516323A4E20D9A4CB3FCA5B5677AB0179F6894060E557F4FD3E3295D0C65B59ACBC7F98AB70CD60AC872FC9808D53B49</div>
    </div>
    <div>
      <div>Signer</div>
      <div class="flex justify-start">
        <div class="text-blue-primary mr-2">VCGC4I-D4G72C-4EZIWM-COZEJJ-SRID4A-BS25RC-SVR3</div>
        <img src="@/assets/img/icon-copy.svg" />
      </div>
    </div>
    <div>
      <div>Cosigner</div>
      <div class="flex justify-start">
        <div class="text-blue-primary mr-2">VDQONC-3U7ETT-WA5G5M-N3ZQ6G-LJRKLY-XZQSDB-F2Y2</div>
        <img src="@/assets/img/icon-copy.svg" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TxnDetailComponent',
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.txn-div{
  @apply text-gray-800 text-xs;
  > div{
    @apply flex justify-start items-center border-b border-gray-100 py-4;

    > div:first-child{
      @apply w-40 text-xs pl-4;
    }

    > div:nth-child(2){
      @apply text-xs;
    }

    > div:last-child{
      @apply border-none;
    }
  }
}
</style>
