<template>
  <div>
    <div>
      <DataTable
        :value="richlistDatatable"
        :paginator="true"
        :rows="20"
        responsiveLayout="scroll"
        scrollDirection="horizontal"
        :alwaysShowPaginator="false"
        paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
        currentPageReportTemplate=""
        tableStyle=""
        class="w-full"
        >
        <Column style="width: 250px" v-if="!wideScreen">
          <template #body="{data}">
            <div>
              <div class="uppercase text-xxs text-gray-300 font-bold mb-1">ADDRESS</div>
              <div class="uppercase font-bold text-txs">{{data.address}}</div>
              <div class="uppercase text-xxs text-gray-300 font-bold mb-1">BALANCE</div>
              <div class="uppercase font-bold text-txs">{{data.balance}}</div>
            </div>
          </template>
        </Column>
        <Column style="width: 250px" v-if="!wideScreen">
          <template #body="{data}">
            <div>
              <div class="uppercase text-xxs text-gray-300 font-bold mb-1">IMPORTNACE</div>
              <div class="uppercase font-bold text-txs">{{data.importance}}</div>
              <div class="uppercase text-xxs text-gray-300 font-bold mt-2 mb-1">NAMESPACE</div>
              <div class="uppercase font-bold text-txs">{{data.namespace}}</div>
            </div>
          </template>
        </Column>
        <Column style="width: 50px" v-if="wideScreen">
        </Column>
        <Column field="ADDRESS" header="ADDRESS" style="`wideScreen?'min-width: 200px'?'width: 200px'`" v-if="wideScreen">
          <template #body="{data}">
            <span class="uppercase font-bold text-txs">{{data.address}}</span>
          </template>
        </Column>
        <Column field="BALANCE" header="BALANCE" style="`wideScreen?'min-width: 180px'?'width: 180px'`" v-if="wideScreen">
          <template #body="{data}">
            <span class="uppercase text-txs">{{data.balance}}</span>
          </template>
        </Column>
        <Column field="IMPORTANCE" header="IMPORTANCE" style="`wideScreen?'min-width: 180px'?'width: 180px'`" v-if="wideScreen">
          <template #body="{data}">
            <span class="uppercase font-bold text-txs">{{data.importance}}</span>
          </template>
        </Column>
        <Column field="NAMESPACE" header="NAMESPACE" style="`wideScreen?'min-width: 180px'?'width: 180px'`" v-if="wideScreen">
          <template #body="{data}">
            <span class="text-txs">{{data.namespace}}</span>
          </template>
        </Column>
        <template #empty>
          No record found
        </template>
        <template #loading>
          Fetching richlist
        </template>
      </DataTable>
    </div>
  </div>
</template>

<script>
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import { ref, onMounted, onUnmounted } from "vue";
export default {
  name: 'RichlistComponent',
  components: { DataTable, Column },
  setup(){
    const richlistDatatable = ref([
      {address: 'address1', balance: '0.000005', importance: '0.000000%', namespace: 'N/A'},
      {address: 'address2', balance: '0.000005', importance: '0.000000%', namespace: 'N/A'},
      {address: 'address3', balance: '0.000005', importance: '0.000000%', namespace: 'N/A'},
      {address: 'address4', balance: '0.000005', importance: '0.000000%', namespace: 'N/A'},
      {address: 'address5', balance: '0.000005', importance: '0.000000%', namespace: 'N/A'},
    ]);
    const wideScreen = ref(false);
    const screenResizeHandler = () => {
      if(window.innerWidth < '1024'){
        wideScreen.value = false;
      }else{
        wideScreen.value = true;
      }
    };
    screenResizeHandler();

    onMounted(() => {
      window.addEventListener("resize", screenResizeHandler);
    });

    onUnmounted(() => {
      window.removeEventListener("resize", screenResizeHandler);
    });

    return{
      richlistDatatable,
      wideScreen,
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">

</style>
