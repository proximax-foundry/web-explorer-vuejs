import{d as B,r as p,o as Q,a as W,b as O,e as i,f as _,g as m,w as d,h as T,i as e,j as g,t as o,u as w,l as y,_ as z,s as J,C as X,n as Y,x as Z,y as ee,A as I,H as $,k as n,T as V}from"./index-e4a1c41c.js";import{s as A,a as te}from"./column.esm-4c5bc5e3.js";import{M as ae}from"./metadataUtil-3956011e.js";import"./index.esm-57398726.js";const se={key:0,class:"ml-10 text-tsm"},oe={key:1},le={class:"mb-2"},ie={class:"grid grid-cols-3"},ce={class:"grid-cols-1"},re=e("div",{class:"uppercase text-xs text-gray-300 font-bold mb-2"}," Block ",-1),ne={class:"text-xs mb-2"},de={class:"grid-cols-1"},ue=e("div",{class:"uppercase text-xs text-gray-300 font-bold mb-2"}," Timestamp ",-1),pe={class:"text-xs mb-2"},_e={class:"grid-cols-1"},ve=e("div",{class:"uppercase text-xs text-gray-300 font-bold mb-2"}," Value ",-1),me={class:"text-xs mb-2"},ye={class:"text-xs"},be={class:"text-xs"},he={class:"text-xs"},xe=B({__name:"MetadataComponent",props:{metadata:{type:Array,required:!0}},setup(v){const u=p(!1),b=()=>{window.innerWidth<1024?u.value=!1:u.value=!0};return b(),Q(()=>{window.addEventListener("resize",b)}),W(()=>{window.removeEventListener("resize",b)}),(H,h)=>{const k=O("router-link");return i(),_("div",null,[v.metadata.length==0?(i(),_("div",se," No record found ")):(i(),_("div",oe,[m(w(te),{value:v.metadata,paginator:!1,rows:20,responsiveLayout:"scroll",scrollDirection:"horizontal",alwaysShowPaginator:!1,paginatorTemplate:"CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown",currentPageReportTemplate:"",tableStyle:"",class:"w-full"},{default:d(()=>[u.value?y("v-if",!0):(i(),T(w(A),{key:0,style:{width:"300px"}},{body:d(({data:r})=>[e("div",le,[e("div",ie,[e("div",ce,[re,e("div",ne,[m(k,{to:{name:"ViewBlock",params:{blockHeight:r.block}},class:"text-blue-600 hover:text-blue-primary hover:underline"},{default:d(()=>[g(o(r.block),1)]),_:2},1032,["to"])])]),e("div",de,[ue,e("div",pe,o(r.timestamp),1)]),e("div",_e,[ve,e("div",me,o(r.value),1)])])])]),_:1})),u.value?(i(),T(w(A),{key:1,style:{width:"10px"}})):y("v-if",!0),u.value?(i(),T(w(A),{key:2,field:"Block",header:"Block",style:{width:"130px","font-size":"12px"}},{body:d(({data:r})=>[e("span",ye,[m(k,{to:{name:"ViewBlock",params:{blockHeight:r.block}},class:"text-blue-600 hover:text-blue-primary hover:underline"},{default:d(()=>[g(o(r.block),1)]),_:2},1032,["to"])])]),_:1})):y("v-if",!0),u.value?(i(),T(w(A),{key:3,field:"Timestamp",header:"Timestamp",style:{width:"170px","font-size":"12px"}},{body:d(({data:r})=>[e("span",be,o(r.timestamp),1)]),_:1})):y("v-if",!0),u.value?(i(),T(w(A),{key:4,field:"Value",header:"Value",style:{width:"100px","font-size":"12px"}},{body:d(({data:r})=>[e("span",he,o(r.value),1)]),_:1})):y("v-if",!0)]),_:1},8,["value"])]))])}}}),fe=z(xe,[["__file","/home/runner/work/web-explorer-vuejs/web-explorer-vuejs/src/modules/metadata/components/MetadataComponent.vue"]]),c=v=>(Z("data-v-2ca92b6a"),v=v(),ee(),v),ge={key:0},ke={class:"p-3 bg-yellow-100 text-yellow-700"},we={key:1},Me=c(()=>e("div",{class:"text-gray-500 mb-1 text-sm font-bold"},"Metadata History",-1)),Te={key:0},Ae=c(()=>e("div",{class:"flex justify-center items-center border-gray-400 mt-10 mb-20"},[e("div",{class:"animate-spin rounded-full h-5 w-5 border-b-2 border-navy-primary mr-2"}),e("span",{class:"text-tsm"},"Fetching Metadata Details")],-1)),Ce=[Ae],Ne={key:1,class:"mt-3"},Pe={class:"md:grid md:grid-cols-2"},Ie={class:"filter shadow-xl border border-gray-50 p-5 mb-15 md:mr-2"},Ve=c(()=>e("div",{class:"text-xs font-bold mb-5 ml-2"},"Overview",-1)),He={class:"txn-div"},De={class:"py-4 text-xs grid grid-cols-5 border-b border-gray-100"},Se=c(()=>e("div",{class:"font-bold col-span-2"},"Owner's Public Key",-1)),Ee={class:"break-all col-span-3"},Ke={key:0,class:"py-4 text-xs grid grid-cols-5 border-b border-gray-100"},$e=c(()=>e("div",{class:"font-bold col-span-2"},"Asset Id",-1)),Be={class:"col-span-3"},Oe={key:1,class:"py-4 text-xs grid grid-cols-5 border-b border-gray-100"},ze=c(()=>e("div",{class:"font-bold col-span-2"},"Namespace",-1)),Le={class:"col-span-3"},Re={class:"py-4 text-xs grid grid-cols-5 border-b border-gray-100"},Ue=c(()=>e("div",{class:"font-bold col-span-2"},"Scoped Metadata Key",-1)),je={class:"flex flex-col"},Fe={class:"flex flex-row"},qe={class:"uppercase"},Ge=c(()=>e("div",{class:"inline-block ml-2 font-semibold text-gray-400"}," hex ",-1)),Qe=c(()=>e("div",{class:"inline-block ml-2 font-semibold text-gray-400"}," utf-8 ",-1)),We={class:"py-4 text-xs grid grid-cols-5 border-b border-gray-100"},Je=c(()=>e("div",{class:"font-bold col-span-2"},"Metadata Type",-1)),Xe={class:"py-4 text-xs grid grid-cols-5 border-b border-gray-100"},Ye=c(()=>e("div",{class:"font-bold col-span-2"},"Current Value",-1)),Ze={class:"filter shadow-xl border border-gray-50 p-5 mb-15 sm:ml-2"},et=c(()=>e("div",{class:"text-xs font-bold mb-5 ml-2"},"More Info",-1)),tt={class:"txn-div"},at={class:"py-4 text-xs grid grid-cols-5 border-b border-gray-100"},st=c(()=>e("div",{class:"font-bold col-span-2"},"Creation Block",-1)),ot={class:"col-span-3"},lt={class:"py-4 text-xs grid grid-cols-5 border-b border-gray-100"},it=c(()=>e("div",{class:"font-bold col-span-2"},"Creation Timestamp",-1)),ct={class:"col-span-3"},rt={class:"filter shadow-xl border border-gray-50 p-5 mb-15"},nt=B({__name:"ViewMetadata",props:{compositeHash:{type:String,required:!0}},setup(v){const u=v,b=Y(),H=b==null?void 0:b.appContext.config.globalProperties.emitter,h=p(!1),k=p([]),r=p(null),x=p(null),M=p([]),s=p(null),C=p(""),D=p(!1),S=p(!1),L=J(()=>X.chainNetworkName),E=async()=>{var a;if(I.isReady||setTimeout(E,1e3),!u.compositeHash){h.value=!0;return}let t=await((a=I.chainAPI)==null?void 0:a.metadataAPI.getMetadata(u.compositeHash));if(t)return t;h.value=!0},R=async t=>{let a=[],l=$.createTransactionQueryParams();switch(l.embedded=!0,l.publicKey=t.targetKey,t.metadataType){case n.MetadataType.ACCOUNT:l.type=[n.TransactionType.ACCOUNT_METADATA_V2],C.value="Account";break;case n.MetadataType.MOSAIC:l.type=[n.TransactionType.MOSAIC_METADATA_V2],C.value="Asset";break;case n.MetadataType.NAMESPACE:l.type=[n.TransactionType.NAMESPACE_METADATA_V2],C.value="Namespace";break;default:l.type=void 0;break}const N=await V.searchTransactions(n.TransactionGroupType.CONFIRMED,l);for(const P of N.transactions){let f=null;switch(P.type){case n.TransactionType.ACCOUNT_METADATA_V2:f=P;break;case n.TransactionType.MOSAIC_METADATA_V2:f=P;break;case n.TransactionType.NAMESPACE_METADATA_V2:f=P;break;default:f=null;break}f&&f.scopedMetadataKey.toHex()===t.scopedMetadataKey.toHex()&&a.push(f)}return a},U=async()=>{let t=await E();return t?await R(t):[]},j=async()=>{let t=k.value;for(const a of t){let l=a.transactionInfo.height.compact();const N=await I.chainAPI.blockAPI.getBlockByHeight(l);M.value.push({block:N.height.compact(),timestamp:$.convertDisplayDateTimeFormat24(new Date(N.timestamp.compact()+n.Deadline.timestampNemesisBlock*1e3).toISOString()),scopedMetadataKeyHex:a.scopedMetadataKey.toHex(),scopedMetadataKeyUtf8:ae.convertUtf8(a.scopedMetadataKey.toHex()),accPublicKey:a.targetPublicKey.publicKey,assetId:F(a),namespace:await q(a),type:C.value,value:await G(a)})}s.value=M.value[M.value.length-1],h.value=!1},F=t=>t.targetMosaicId?(D.value=!0,t.targetMosaicId.toHex()):null,q=async t=>t.targetNamespaceId?(S.value=!0,(await I.chainAPI.namespaceAPI.getNamespacesName([t.targetNamespaceId]))[0].name):null,G=async t=>{if(x.value){const a=V.applyValueChange(x.value,n.Convert.uint8ArrayToHex(t.valueDifferences),t.valueSizeDelta);x.value=a}else{const a=V.applyValueChange("",n.Convert.uint8ArrayToHex(t.valueDifferences),t.valueSizeDelta);x.value=a}return x.value?x.value:""},K=async()=>{k.value=await U(),j()};return K(),H.on("CHANGE_NETWORK",t=>{t&&(h.value=!0,r.value=null,x.value=null,k.value=[],M.value=[],s.value=null,K())}),(t,a)=>{const l=O("router-link");return h.value?(i(),_("div",ge,[e("div",ke," Metadata is not available in "+o(L.value),1)])):(i(),_("div",we,[Me,!h.value&&!s.value?(i(),_("div",Te,[...Ce])):s.value?(i(),_("div",Ne,[e("div",Pe,[e("div",Ie,[Ve,e("div",He,[e("div",De,[Se,e("div",Ee,[m(l,{to:{name:"ViewAccount",params:{accountParam:s.value.accPublicKey}},class:"text-blue-600 hover:text-blue-primary hover:underline"},{default:d(()=>[g(o(s.value.accPublicKey),1)]),_:1},8,["to"])])]),D.value?(i(),_("div",Ke,[$e,e("div",Be,[m(l,{to:{name:"ViewAsset",params:{id:s.value.assetId}},class:"uppercase text-blue-600 hover:text-blue-primary hover:underline"},{default:d(()=>[g(o(s.value.assetId),1)]),_:1},8,["to"])])])):y("v-if",!0),S.value?(i(),_("div",Oe,[ze,e("div",Le,[m(l,{to:{name:"ViewNamespace",params:{namespaceParam:s.value.namespace}},class:"text-blue-600 hover:text-blue-primary hover:underline"},{default:d(()=>[g(o(s.value.namespace),1)]),_:1},8,["to"])])])):y("v-if",!0),e("div",Re,[Ue,e("div",je,[e("div",Fe,[e("div",qe,o(s.value.scopedMetadataKeyHex),1),Ge]),e("div",null,[g(o(s.value.scopedMetadataKeyUtf8)+" ",1),Qe])])]),e("div",We,[Je,e("div",null,o(s.value.type),1)]),e("div",Xe,[Ye,e("div",null,o(s.value.value),1)])])]),e("div",Ze,[et,e("div",tt,[e("div",at,[st,e("div",ot,[m(l,{to:{name:"ViewBlock",params:{blockHeight:s.value.block}},class:"text-blue-600 hover:text-blue-primary hover:underline"},{default:d(()=>[g(o(s.value.block),1)]),_:1},8,["to"])])]),e("div",lt,[it,e("div",ct,o(s.value.timestamp),1)])])])])])):y("v-if",!0),e("div",rt,[m(fe,{metadata:M.value},null,8,["metadata"])])]))}}});const vt=z(nt,[["__scopeId","data-v-2ca92b6a"],["__file","/home/runner/work/web-explorer-vuejs/web-explorer-vuejs/src/modules/metadata/views/ViewMetadata.vue"]]);export{vt as default};
