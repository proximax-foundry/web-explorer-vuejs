<template>
  <div class="details">
    <div>
      <div>Namespace Type</div>
      <div>{{ txnDetail.detail.registerTypeName }}</div>
    </div>
    <div>
      <div>Namespace Name</div>
      <div>
        <router-link :to="{ name: 'ViewNamespace', params:{ namespaceParam: txnDetail.detail.namespaceId }}" class="text-blue-600 hover:text-blue-primary hover:underline">
          {{ txnDetail.detail.namespaceName }}
        </router-link>
      </div>
    </div>
    <div v-if="txnDetail.detail.duration">
      <div>Duration</div>
      <div>{{ txnDetail.detail.duration }} Blocks</div>
    </div>
    <div v-if="txnDetail.detail.parentName">
      <div>Parent</div>
      <div>
        <router-link :to="{ name: 'ViewNamespace', params:{ namespaceParam: txnDetail.detail.parentId }}" class="text-blue-600 hover:text-blue-primary hover:underline">
          {{ txnDetail.detail.parentName }}
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'NamespaceDetailComponent',
  props: {
    txnDetail: Object
  },
  setup(props) {
    return {
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.details{
  @apply text-gray-800 text-xs;
  > div{
    @apply flex items-center border-b border-gray-100 py-4;

    > div:first-child{
      @apply w-40 text-xs pl-4;
    }

    > div:nth-child(2){
      @apply text-xs w-full;
    }
  }

  > div:last-child{
    @apply border-none;
  }
}
</style>
