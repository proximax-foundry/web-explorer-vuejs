<template>
  <div>
    <div v-if="metadata.length==0" class="ml-10 text-tsm">
      No record found
    </div>
    <div v-else>
      <DataTable
        :value="metadata"
        :paginator="false"
        :rows="20"
        responsiveLayout="scroll"
        scrollDirection="horizontal"
        :alwaysShowPaginator="false"
        paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
        currentPageReportTemplate=""
        tableStyle=""
        class="w-full"
        >
        <Column style="width: 300px" v-if="!wideScreen">
          <template #body="{data}">
            <div class="mb-2">
               <div class="grid grid-cols-2"> 
              <div class="grid-cols-1">
              <div class="uppercase text-xs text-gray-300 font-bold mb-2">Scoped Metadata Key</div>
               <div class="text-xs" v-if="data.scopedMetadataKeyHex">{{data.scopedMetadataKeyHex}}
              <div class="inline-block font-bold ml-2">hex</div>
            </div>
             <div class="mt-1 text-xs" v-if="data.scopedMetadataKeyUtf8">{{data.scopedMetadataKeyUtf8}}
              <div class="inline-block font-bold ml-2">utf-8</div>
            </div>
              </div>
              <div class="grid-cols-1">
                <div class="uppercase text-xs text-gray-300 font-bold mb-2">Current Value</div>
                <div class="uppercase font-bold text-xs mb-2">{{data.value}}</div> 
              </div>
            </div>
            </div>
          </template>
        </Column>
      <Column style="width: 10px" v-if="wideScreen">
      </Column>
        <Column field="SCOPED METADATA KEY" header="SCOPED METADATA KEY" style="width: 250px" v-if="wideScreen">
          <template #body="{data}">
            <div class="text-xs" v-if="data.scopedMetadataKeyHex">{{data.scopedMetadataKeyHex}}
              <div class="inline-block font-bold ml-2">hex</div>
            </div>
             <div class="mt-1 text-xs" v-if="data.scopedMetadataKeyUtf8">{{data.scopedMetadataKeyUtf8}}
              <div class="inline-block font-bold ml-2">utf-8</div>
            </div>
            <!-- <div class="uppercase text-xs pt-1" v-if="data.scopedMetadataKeyUtf8">{{data.scopedMetadataKeyUtf8 + "  (utf-8)"}}</div> -->
          </template>
        </Column>
        <Column field="CURRENT VALUE" header="CURRENT VALUE" style="width: 150px" v-if="wideScreen">
          <template #body="{data}">
            <span class="text-xs">{{data.value}}</span>
          </template>
        </Column>
      </DataTable>
    </div>
  </div>
</template>

<script>
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import { ref, onMounted, onUnmounted } from "vue";
import { Helper } from '@/util/typeHelper';
import { ChainUtils } from '@/util/chainUtils';
import Tooltip from 'primevue/tooltip';
export default {
  name: 'MetadataComponent',
  components: { DataTable,Column },
  props:{
    metadata: Array
  },
  directives: {
    'tooltip': Tooltip
  },
  setup(p) {
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
    console.log(p.metadata);
    console.log("hallo");
    return{
      wideScreen
    }
  }
}
</script>

