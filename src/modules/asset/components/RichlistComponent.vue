<template>
  <div>
    <div v-if="transactions==false" class="ml-5">
      No record found
    </div>
    <div v-else>
      <DataTable
        :value="transactions"
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
            <div class="mb-2">
              <div class="uppercase text-xxs text-gray-300 font-bold mb-1">ADDRESS</div>
              <div class="uppercase font-bold text-txs">{{data.address.pretty()}}</div>
              <div class="uppercase text-xxs text-gray-300 font-bold mb-1">BALANCE</div>
              <div class="uppercase font-bold text-txs">{{getCurrency(data.amount.compact())}}</div>
            </div>
          </template>
        </Column>
        <Column style="width: 250px" v-if="!wideScreen">
          <template #body="{data}">
            <div>
              <div class="uppercase text-xxs text-gray-300 font-bold mb-1">PERCENTAGE</div>
              <div class="uppercase font-bold text-txs">{{getPercentage(data.amount.compact())}}%</div>
              <div class="uppercase text-xxs text-gray-300 font-bold mt-2 mb-1">NAMESPACE</div>
              <div class="uppercase font-bold text-txs">{{getLinkedNamespace(data.address)&&linkednamespaceID==null?"No Linked Namespace":linkednamespaceID}}</div>
            </div>
          </template>
        </Column>
        <Column style="width: 30px" v-if="wideScreen">
        </Column>
        <Column field="ADDRESS" header="ADDRESS" style="width:380px" v-if="wideScreen">
          <template #body="{data}">
             <span><router-link :to="{ name: 'ViewAccount', params: { accountParam: data.address.pretty()}}" class="uppercase font-bold text-txs text-blue-600 hover:text-blue-primary hover:underline">{{data.address.pretty()}}</router-link></span>
          </template>
        </Column>
        <Column field="BALANCE" header="BALANCE" style="width: 200px" v-if="wideScreen">
          <template #body="{data}">
            <span class="uppercase text-txs">{{getCurrency(data.amount.compact())}}</span>
          </template>
        </Column>
        <Column field="PERCENTAGE" header="PERCENTAGE" style="`wideScreen?'min-width: 180px'?'width: 180px'`" v-if="wideScreen">
          <template #body="{data}">
            <span class="uppercase font-bold text-txs">{{getPercentage(data.amount.compact())}}%</span>
          </template>
        </Column>
        <Column field="NAMESPACE" header="NAMESPACE" style="`wideScreen?'min-width: 180px'?'width: 180px'`" v-if="wideScreen">
          <template #body="{data}">
            <span class="text-txs">{{getLinkedNamespace(data.address)&&linkednamespaceID==null?"No Linked Namespace":linkednamespaceID }}</span>
          </template>
        </Column>
        <!-- <template #empty>
          No record found
        </template>
        <template #loading>
          Fetching richlist
        </template> -->
      </DataTable>
    </div>
  </div>
</template>

<script>
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import { ref, onMounted, onUnmounted } from "vue";
import { Helper } from '@/util/typeHelper';
import { AppState } from '@/state/appState';
import { text } from '@fortawesome/fontawesome-svg-core';
import { ChainUtils } from '@/util/chainUtils';

export default {
  name: 'RichlistComponent',
  components: { DataTable, Column },
  props:{
    transactions: Array,
    supply : Number,
    divisibility :Number
    },
  setup(p){
    const linkednamespaceID = ref(null);
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

    const getCurrency = (amount) =>{
      return Helper.toCurrencyFormat(amount,p.divisibility);
    }
    const getPercentage =(amount)=>{
      return ((amount / p.supply) * 100).toFixed(p.divisibility); 
    }
    const getLinkedNamespace = async(address) =>{
    let namespaceID = null;
    const getNamespacesFromAccount = await ChainUtils.getNamespacesFromAccount(address);
      for(let i = 0; i < getNamespacesFromAccount.length; ++i){
        if(getNamespacesFromAccount[i].alias.type == 2){
          namespaceID = getNamespacesFromAccount[i].levels[0].id.toHex();
          linkednamespaceID.value = namespaceID;
        }
      } 
      return namespaceID;
    }

    return{
      getPercentage,
      wideScreen,
      getCurrency,
      getLinkedNamespace,
      linkednamespaceID
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">

</style>
