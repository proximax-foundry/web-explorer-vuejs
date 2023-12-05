import{d as R,r as k,o as I,a as V,b as K,c as z,e as t,f as o,g as f,w as c,h as y,i as e,m as B,j as _,t as a,u,l,H as N,_ as S,s as j,C as F,F as q,v as G,z as T,D as O,n as W,A as Y,E,k as J,N as Q,x as X,y as Z}from"./index-a4fd390f.js";import{s as b,a as U}from"./column.esm-a35ea8b5.js";import{M as ee}from"./metadataUtil-7f96c1e9.js";import"./index.esm-d62f54ec.js";const te={key:0,class:"ml-10 text-tsm"},se={key:1},oe={class:"mb-2"},ae=e("div",{class:"uppercase text-xs text-gray-300 font-bold mb-2"}," ADDRESS ",-1),ie={class:"text-ellipsis overflow-hidden"},le={class:"grid grid-cols-2"},re={class:"grid-cols-1"},ne=e("div",{class:"uppercase text-xs text-gray-300 font-bold mb-2"}," BALANCE ",-1),de={class:"uppercase font-bold text-xs mb-4"},ce={class:"grid-cols-1"},ue=e("div",{class:"uppercase text-xs text-gray-300 font-bold mb-2"}," PERCENTAGE ",-1),ve={class:"uppercase font-bold text-xs mb-2"},pe={class:"uppercase text-xs"},_e={class:"uppercase font-bold text-xs"},me=R({__name:"RichlistComponent",props:{transactions:{type:Array,required:!0},supply:{type:Number,required:!0},divisibility:{type:Number,required:!0}},setup(p){const r=p,n=k(!1),A=()=>{window.innerWidth<1024?n.value=!1:n.value=!0};A(),I(()=>{window.addEventListener("resize",A)}),V(()=>{window.removeEventListener("resize",A)});const m=h=>N.convertToCurrency(h,r.divisibility),i=h=>(h/Math.pow(10,r.divisibility)/r.supply*100).toFixed(r.divisibility);return(h,L)=>{const s=K("router-link"),P=z("tooltip");return t(),o("div",null,[p.transactions.length?(t(),o("div",se,[f(u(U),{value:p.transactions,paginator:!0,rows:20,responsiveLayout:"scroll",scrollDirection:"horizontal",alwaysShowPaginator:!1,paginatorTemplate:"CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown",currentPageReportTemplate:"",tableStyle:"",class:"w-full"},{default:c(()=>[n.value?l("v-if",!0):(t(),y(u(b),{key:0,style:{width:"300px"}},{body:c(({data:d})=>[e("div",oe,[ae,f(s,{to:{name:"ViewAccount",params:{accountParam:d.address.pretty()}},class:"mb-6 uppercase font-bold text-xs text-blue-600 hover:text-blue-primary hover:underline truncate inline-flex w-80"},{default:c(()=>[B((t(),o("span",ie,[_(a(d.address.pretty()),1)])),[[P,d.address.pretty(),void 0,{bottom:!0}]]),_("...")]),_:2},1032,["to"]),e("div",le,[e("div",re,[ne,e("div",de,a(m(d.amount.compact())),1)]),e("div",ce,[ue,e("div",ve,a(i(d.amount.compact()))+"% ",1)])])])]),_:1})),n.value?(t(),y(u(b),{key:1,style:{width:"30px"}})):l("v-if",!0),n.value?(t(),y(u(b),{key:2,field:"ADDRESS",header:"ADDRESS",style:{width:"450px"}},{body:c(({data:d})=>[e("span",null,[f(s,{to:{name:"ViewAccount",params:{accountParam:d.address.pretty()}},class:"uppercase text-blue-600 hover:text-blue-primary hover:underline inline-flex"},{default:c(()=>[_(a(d.address.pretty()),1)]),_:2},1032,["to"])])]),_:1})):l("v-if",!0),n.value?(t(),y(u(b),{key:3,field:"BALANCE",header:"BALANCE",style:{width:"250px"}},{body:c(({data:d})=>[e("span",pe,a(m(d.amount.compact())),1)]),_:1})):l("v-if",!0),n.value?(t(),y(u(b),{key:4,field:"PERCENTAGE",header:"PERCENTAGE",style:{width:"150px"}},{body:c(({data:d})=>[e("span",_e,a(i(d.amount.compact()))+"%",1)]),_:1})):l("v-if",!0)]),_:1},8,["value"])])):(t(),o("div",te," No record found "))])}}}),ye=S(me,[["__file","/home/runner/work/web-explorer-vuejs/web-explorer-vuejs/src/modules/asset/components/RichlistComponent.vue"]]),be={key:0,class:"ml-10 text-tsm"},he={key:1},xe={class:"mb-2"},fe={class:"grid grid-cols-2"},ge={class:"grid-cols-1"},we=e("div",{class:"uppercase text-xs text-gray-300 font-bold mb-2"}," Scoped Metadata Key ",-1),ke={key:0,class:"text-xs"},Ae=e("div",{class:"inline-block ml-2 font-semibold text-gray-400"}," utf-8 ",-1),Ce={key:1,class:"mt-1 text-xs"},$e=e("div",{class:"inline-block ml-2 font-semibold text-gray-400"}," utf-8 ",-1),Pe={class:"grid-cols-1"},Ee=e("div",{class:"uppercase text-xs text-gray-300 font-bold mb-2"}," Current Value ",-1),Ne={class:"text-xs mb-2"},Le={key:0,class:"text-xs"},Me=e("div",{class:"inline-block ml-2 font-semibold text-gray-400"}," hex ",-1),Re={key:1,class:"mt-1 text-xs"},Se=e("div",{class:"inline-block ml-2 font-semibold text-gray-400"}," utf-8 ",-1),De={class:"text-xs"},Te=R({__name:"MetadataComponent",props:{metadata:{type:Array,required:!0}},setup(p){const r=k(!1),n=()=>{window.innerWidth<1024?r.value=!1:r.value=!0};return n(),I(()=>{window.addEventListener("resize",n)}),V(()=>{window.removeEventListener("resize",n)}),(A,m)=>(t(),o("div",null,[p.metadata.length==0?(t(),o("div",be," No record found ")):(t(),o("div",he,[f(u(U),{value:p.metadata,paginator:!1,rows:20,responsiveLayout:"scroll",scrollDirection:"horizontal",alwaysShowPaginator:!1,paginatorTemplate:"CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown",currentPageReportTemplate:"",tableStyle:"",class:"w-full"},{default:c(()=>[r.value?l("v-if",!0):(t(),y(u(b),{key:0,style:{width:"300px"}},{body:c(({data:i})=>[e("div",xe,[e("div",fe,[e("div",ge,[we,i.scopedMetadataKeyHex?(t(),o("div",ke,[_(a(i.scopedMetadataKeyHex)+" ",1),Ae])):l("v-if",!0),i.scopedMetadataKeyUtf8?(t(),o("div",Ce,[_(a(i.scopedMetadataKeyUtf8)+" ",1),$e])):l("v-if",!0)]),e("div",Pe,[Ee,e("div",Ne,a(i.value),1)])])])]),_:1})),r.value?(t(),y(u(b),{key:1,style:{width:"10px"}})):l("v-if",!0),r.value?(t(),y(u(b),{key:2,field:"SCOPED METADATA KEY",header:"SCOPED METADATA KEY",style:{width:"250px"}},{body:c(({data:i})=>[i.scopedMetadataKeyHex?(t(),o("div",Le,[_(a(i.scopedMetadataKeyHex)+" ",1),Me])):l("v-if",!0),i.scopedMetadataKeyUtf8?(t(),o("div",Re,[_(a(i.scopedMetadataKeyUtf8)+" ",1),Se])):l("v-if",!0),l(' <div class="uppercase text-xs pt-1" v-if="data.scopedMetadataKeyUtf8">{{data.scopedMetadataKeyUtf8 + "  (utf-8)"}}</div> ')]),_:1})):l("v-if",!0),r.value?(t(),y(u(b),{key:3,field:"CURRENT VALUE",header:"CURRENT VALUE",style:{width:"150px"}},{body:c(({data:i})=>[e("span",De,a(i.value),1)]),_:1})):l("v-if",!0)]),_:1},8,["value"])]))]))}}),Ie=S(Te,[["__file","/home/runner/work/web-explorer-vuejs/web-explorer-vuejs/src/modules/asset/components/MetadataComponent.vue"]]),v=p=>(X("data-v-cd9ca62c"),p=p(),Z(),p),Ve={key:0},Ke={key:0,class:"text-gray-500 mb-5 font-bold"},Ue={class:"text-blue-primary text-md font-bold uppercase"},He=v(()=>e("div",{class:"text-txs text-gray-400 font-normal mt-1"},"Asset",-1)),ze={key:1},Be=v(()=>e("p",{class:"text-gray-500 mb-5 text-sm font-bold"},"Asset Details",-1)),je=[Be],Fe={key:2},qe={class:"p-3 bg-yellow-100 text-yellow-700"},Ge={key:3},Oe=v(()=>e("div",{class:"flex justify-center items-center border-gray-400 mt-10 mb-20"},[e("div",{class:"animate-spin rounded-full h-5 w-5 border-b-2 border-navy-primary mr-2"}),e("span",{class:"text-tsm"},"Fetching Asset Details")],-1)),We=[Oe],Ye={key:4},Je={class:"md:grid md:grid-cols-2"},Qe={class:"filter shadow-xl border border-gray-50 p-5 mb-15 md:mr-2"},Xe=v(()=>e("div",{class:"text-xs font-bold mb-5 ml-2"},"Overview",-1)),Ze={class:"txn-div"},et={class:"py-4 text-xs grid grid-cols-5 border-b border-gray-100"},tt=v(()=>e("div",{class:"font-bold col-span-2"},"Asset ID",-1)),st={class:"font-bold uppercase"},ot={class:"py-4 text-xs grid grid-cols-5 border-b border-gray-100"},at=v(()=>e("div",{class:"font-bold col-span-2"},"Alias",-1)),it={key:0,class:"font-bold uppercase"},lt={key:0,class:"text-black mr-1 ml-1"},rt={key:1,class:"text-black mr-1 ml-1"},nt={key:1,class:"font-bold col-span-2"},dt={class:"py-4 text-xs grid grid-cols-5 border-b border-gray-100"},ct=v(()=>e("div",{class:"font-bold col-span-2"},"Total Supply",-1)),ut={class:"py-4 text-xs grid grid-cols-5 border-b border-gray-100"},vt=v(()=>e("div",{class:"font-bold col-span-2"},"Decimals",-1)),pt={class:"filter shadow-xl border border-gray-50 p-5 mb-15 sm:ml-2"},_t=v(()=>e("div",{class:"text-xs font-bold mb-5 ml-2"},"More Info",-1)),mt={class:"txn-div"},yt={class:"py-4 text-xs grid grid-cols-5 border-b border-gray-100"},bt=v(()=>e("div",{class:"font-bold col-span-2"},"Creator Address",-1)),ht={class:"break-all uppercase col-span-3"},xt={class:"py-4 text-xs grid grid-cols-5 border-b border-gray-100"},ft=v(()=>e("div",{class:"font-bold col-span-2"},"Block",-1)),gt={class:"col-span-3"},wt={class:"py-4 text-xs grid grid-cols-5 border-b border-gray-100"},kt=v(()=>e("div",{class:"font-bold col-span-2"},"Expiry",-1)),At={class:"col-span-3"},Ct={class:"py-4 text-xs grid grid-cols-4 border-b border-gray-100"},$t=v(()=>e("div",null,"Supply Mutable",-1)),Pt={class:"font-bold text-green-600 w-24 ml-10"},Et=v(()=>e("div",null,"Transferable",-1)),Nt={class:"font-bold text-green-600 w-24 ml-5"},Lt={class:"filter shadow-xl border border-gray-50 p-5 mb-15"},Mt={class:"flex items-center mb-4 border-b border-gray-100 relative"},Rt={key:0,class:"absolute w-full border-b border-yellow-500 transition-all duration-200",style:{bottom:"-1px"}},St={key:0,class:"absolute w-full border-b border-yellow-500 transition-all duration-200",style:{bottom:"-1px"}},Dt=R({__name:"ViewAsset",props:{id:{type:String,required:!0}},setup(p){const r=p,n=W(),A=n==null?void 0:n.appContext.config.globalProperties.emitter,m=k("rich"),i=k(!1),h=k([]),L=k([]),s=k(null),P=x=>{m.value=x},d=j(()=>F.chainNetworkName),M=async()=>{try{if(!Y.isReady&&!d.value){setTimeout(M,1e3);return}const x=await ee.getAssetMetadata(r.id);L.value=x;const g=await E.getAssetProperties(r.id),$=await E.getRichList(r.id);if(g){i.value=!1,s.value=g,h.value=$;return}else{let C=new J.NamespaceId(r.id.toLowerCase());const w=await Q.fetchNamespaceInfo(C.toHex());if(w)if(i.value=!1,w.alias.type==1){const D=await E.getAssetProperties(w.alias.id),H=await E.getRichList(w.alias.id);D&&(s.value=D,h.value=H)}else i.value=!0;else i.value=!0}}catch(x){i.value=!0,console.log(x)}};return M(),A.on("CHANGE_NETWORK",x=>{x&&(i.value=!1,M())}),(x,g)=>{const $=K("router-link");return s.value?(t(),o("div",Ve,[s.value.name?(t(),o("div",Ke,[e("div",Ue,a(s.value.name),1),He])):(t(),o("div",ze,[...je])),i.value?(t(),o("div",Fe,[e("div",qe," Asset is not available in "+a(d.value),1)])):!i.value&&!s.value?(t(),o("div",Ge,[...We])):(t(),o("div",Ye,[e("div",Je,[e("div",Qe,[Xe,e("div",Ze,[e("div",et,[tt,e("div",st,a(s.value.assetId),1)]),e("div",ot,[at,s.value.namespaceId.length>0?(t(),o("div",it,[(t(!0),o(q,null,G(s.value.namespaceId,(C,w)=>(t(),o("div",{key:w,class:"inline-block"},[f($,{to:{name:"ViewNamespace",params:{namespaceParam:C.name}},class:"text-xs font-semibold text-blue-600 col-span-3 hover:text-blue-primary uppercase hover:underline"},{default:c(()=>[_(a(C.name),1)]),_:2},1032,["to"]),s.value.namespaceId.length>1&&w!=s.value.namespaceId.length-1?(t(),o("span",lt,a("/"))):(t(),o("span",rt,a("")))]))),128))])):(t(),o("div",nt,"-"))]),e("div",dt,[ct,e("div",null,a(u(N).toCurrencyFormat(s.value.supply,s.value.divisibility)=="NaN"?"":u(N).toCurrencyFormat(s.value.supply,s.value.divisibility)),1)]),e("div",ut,[vt,e("div",null,a(s.value.divisibility),1)])])]),e("div",pt,[_t,e("div",mt,[e("div",yt,[bt,e("div",ht,[f($,{to:{name:"ViewAccount",params:{accountParam:s.value.owner}},class:"uppercase text-blue-600 hover:text-blue-primary hover:underline inline-flex"},{default:c(()=>[_(a(u(N).createAddress(s.value.owner).pretty()),1)]),_:1},8,["to"])])]),e("div",xt,[ft,e("div",gt,[f($,{to:{name:"ViewBlock",params:{blockHeight:s.value.height}},class:"truncate inline-block break-all text-blue-600 hover:text-blue-primary hover:underline"},{default:c(()=>[_(a(s.value.height),1)]),_:1},8,["to"])])]),e("div",wt,[kt,e("div",At,a(s.value.expiry==0?"NIL":s.value.expiry),1)]),e("div",Ct,[$t,e("div",Pt,a(s.value.supplyMutable),1),Et,e("div",Nt,a(s.value.transferable),1)])])])]),e("div",Lt,[e("div",Mt,[e("div",{class:T(["w-32 font-bold text-xs text-center p-2 relative",`${m.value=="rich"?"":"cursor-pointer"}`]),onClick:g[0]||(g[0]=C=>P("rich"))},[_(" Richlist "),m.value=="rich"?(t(),o("div",Rt)):l("v-if",!0)],2),e("div",{class:T(["w-32 font-bold text-xs text-center p-2 relative",`${m.value=="metadata"?"":"cursor-pointer"}`]),onClick:g[1]||(g[1]=C=>P("metadata"))},[_(" Metadata "),m.value=="metadata"?(t(),o("div",St)):l("v-if",!0)],2)]),f(O,{name:"slide"},{default:c(()=>[m.value=="rich"?(t(),y(ye,{key:0,transactions:h.value,supply:s.value.supply,divisibility:s.value.divisibility},null,8,["transactions","supply","divisibility"])):m.value=="metadata"?(t(),y(Ie,{key:1,metadata:L.value},null,8,["metadata"])):l("v-if",!0)]),_:1})])]))])):l("v-if",!0)}}});const Ut=S(Dt,[["__scopeId","data-v-cd9ca62c"],["__file","/home/runner/work/web-explorer-vuejs/web-explorer-vuejs/src/modules/asset/views/ViewAsset.vue"]]);export{Ut as default};
