import{d as le,r as c,a as Te,o as ye,H as D,s as P,A as V,G as me,C as fe,b as ge,c as he,e as t,f as p,g as M,w as x,j as m,h as l,i as n,m as L,t as d,u as e,l as E,F as ie,v as ce,_ as ue,J as re,K as ke,n as _e,T as y,x as Ee,y as Ce,L as Ae}from"./index-1898c150.js";import{T as a,E as Ne,a as we,A as Ge,b as Se,c as De,d as Re,N as Ie,M as Fe,e as Le,L as Oe,f as Pe,R as Me,S as He,C as Ve,g}from"./ExportCSVComponent-26d674eb.js";import{M as $e}from"./MixedTxnDataTable-524e4731.js";import{s as S,a as Be}from"./column.esm-a5ed373b.js";import"./proximax-logo-gray-d9718656.js";const Ke=n("div",{class:"uppercase text-xs text-gray-300 font-bold mb-1"}," TX Hash ",-1),Xe={class:"text-xs break-all hover:underline hover:text-blue-primary truncate inline-flex text-ellipsis overflow-hidden w-44"},je=n("div",{class:"uppercase text-xs text-gray-300 font-bold mb-1 mt-5"}," Type ",-1),Ue={class:"flex items-center"},ze={class:"uppercase font-bold text-xs mr-2"},Qe=n("div",{class:"text-xs text-gray-300 font-bold mb-1 mt-5"},"Block",-1),We={class:"flex items-center"},Je={key:0},qe=n("div",{class:"uppercase text-xs text-gray-300 font-bold mb-1"}," Timestamp ",-1),Ye={class:"uppercase font-bold text-xs"},Ze=n("div",{class:"uppercase text-xs text-gray-300 font-bold mb-1 mt-5"}," Duration ",-1),ea={class:"flex items-center"},aa={class:"text-xs font-bold"},ta={class:"text-ellipsis overflow-hidden w-44"},sa={class:"text-xs"},na={class:"text-xs"},oa={class:"text-xs"},ra={key:0},la={class:"inline-block ml-2"},ia={class:"inline-block ml-2"},ca=le({__name:"SdaExchangeTxnDataTable",props:{transactions:Array,pages:Number,selectedGroupType:String},setup(C){const f=c(!1),O=()=>{window.innerWidth<1024?f.value=!1:f.value=!0};O(),Te(()=>{window.removeEventListener("resize",O)}),ye(()=>{window.addEventListener("resize",O)});const s=D.getTransactionGroupType(),G=P(()=>V.nativeToken.label),H=R=>D.convertDisplayDateTimeFormat24(R);let u=new me(fe.chainNetworkName);u.init();let h=parseInt(u.blockGenerationTargetTime);const A=R=>R/(60/h*60)/24;return(R,$)=>{const N=ge("router-link"),I=he("tooltip");return t(),p("div",null,[M(e(Be),{value:C.transactions,paginator:!1,rows:Number(C.pages),scrollDirection:"horizontal",alwaysShowPaginator:!1,responsiveLayout:"scroll",paginatorTemplate:"CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown",currentPageReportTemplate:""},{empty:x(()=>[m(" No transaction found ")]),loading:x(()=>[m(" Fetching transactions ")]),default:x(()=>[f.value?E("v-if",!0):(t(),l(e(S),{key:0,style:{width:"200px"}},{body:x(({data:o})=>[n("div",null,[Ke,M(N,{class:"uppercase font-bold text-xs block text-blue-600 hover:text-blue-primary hover:underline",to:{name:"ViewTransaction",params:{hash:o.hash}}},{default:x(()=>[L((t(),p("span",Xe,[m(d(o.hash),1)])),[[I,o.hash,void 0,{right:!0}]]),m("... ")]),_:2},1032,["to"])]),n("div",null,[je,n("div",Ue,[n("div",ze,d(o.typeName),1)])]),n("div",null,[Qe,n("div",We,[M(N,{to:{name:"ViewBlock",params:{blockHeight:o.block}},class:"text-blue-600 hover:text-blue-primary hover:underline text-xs"},{default:x(()=>[m(d(o.block),1)]),_:2},1032,["to"])])])]),_:1})),f.value?E("v-if",!0):(t(),l(e(S),{key:1,style:{width:"200px"}},{body:x(({data:o})=>[C.selectedGroupType===e(s).CONFIRMED?(t(),p("div",Je,[qe,n("div",Ye,d(H(o.timestamp)),1)])):E("v-if",!0),n("div",null,[Ze,n("div",ea,[L((t(),p("span",aa,[m(d(o.duration?o.duration+" Block"+(o.duration>1?"s":""):"-"),1)])),[[I,{value:`<tiptext>Approximately ${A(o.duration)} Day${A(o.duration)>1?"s":""}</tiptext>`,escape:!0},void 0,{left:!0}]])])])]),_:1})),f.value?(t(),l(e(S),{key:2,field:"hash",header:"TX Hash",headerStyle:"width:100px;text-transform:uppercase"},{body:x(({data:o})=>[L((t(),l(N,{to:{name:"ViewTransaction",params:{hash:o.hash}},class:"text-xs text-blue-600 hover:text-blue-primary hover:underline inline-flex"},{default:x(()=>[n("span",ta,d(o.hash),1),m("...")]),_:2},1032,["to"])),[[I,o.hash,void 0,{bottom:!0}]])]),_:1})):E("v-if",!0),C.selectedGroupType===e(s).CONFIRMED&&f.value?(t(),l(e(S),{key:3,field:"timestamp",header:"Timestamp",headerStyle:"width:110px;text-transform:uppercase"},{body:x(({data:o})=>[n("span",sa,d(H(o.timestamp)),1)]),_:1})):E("v-if",!0),f.value?(t(),l(e(S),{key:4,field:"typeName",header:"Type",headerStyle:"width:110px;text-transform:uppercase"},{body:x(({data:o})=>[n("span",na,d(o.typeName),1)]),_:1})):E("v-if",!0),C.selectedGroupType===e(s).CONFIRMED&&f.value?(t(),l(e(S),{key:5,field:"block",header:"Block",headerStyle:"width:110px;text-transform:uppercase"},{body:x(({data:o})=>[M(N,{to:{name:"ViewBlock",params:{blockHeight:o.block}},class:"text-blue-600 hover:text-blue-primary hover:underline text-xs"},{default:x(()=>[m(d(o.block),1)]),_:2},1032,["to"])]),_:1})):E("v-if",!0),C.selectedGroupType===e(s).CONFIRMED&&f.value?(t(),l(e(S),{key:6,header:"TX FEE",headerStyle:"width:110px;text-transform:uppercase"},{body:x(({data:o})=>[n("div",oa,[m(d(o.fee)+" ",1),o.fee==0||o.fee>0?(t(),p("b",ra,d(e(G)),1)):E("v-if",!0)])]),_:1})):E("v-if",!0),f.value?(t(),l(e(S),{key:7,header:"OFFERS(GET/GIVE/DURATION)",headerStyle:"width:150px"},{body:x(({data:o})=>[(t(!0),p(ie,null,ce(o.sdaExchange,(v,B)=>L((t(),p("span",{class:"inline-block bg-blue-100 font-bold text-xs py-1 px-2 my-1 mx-1 rounded",key:B},[n("div",null,[n("span",null,d(v.amountGet),1),n("div",la,[v.sdaGetNamespace?(t(),l(N,{key:0,to:{name:"ViewAsset",params:{id:v.sdaIdGet}},class:"text-blue-600 hover:text-blue-primary flex hover:underline"},{default:x(()=>[m(d(v.sdaGetNamespace),1)]),_:2},1032,["to"])):(t(),l(N,{key:1,to:{name:"ViewAsset",params:{id:v.sdaIdGet}},class:"text-blue-600 hover:text-blue-primary flex hover:underline"},{default:x(()=>[m(d(v.sdaIdGet),1)]),_:2},1032,["to"]))])]),n("div",null,[n("span",null,d(v.amountGive),1),n("div",ia,[v.sdaGiveNamespace?(t(),l(N,{key:0,to:{name:"ViewAsset",params:{id:v.sdaIdGive}},class:"text-blue-600 hover:text-blue-primary flex hover:underline"},{default:x(()=>[m(d(v.sdaGiveNamespace),1)]),_:2},1032,["to"])):(t(),l(N,{key:1,to:{name:"ViewAsset",params:{id:v.sdaIdGive}},class:"text-blue-600 hover:text-blue-primary flex hover:underline"},{default:x(()=>[m(d(v.sdaIdGive),1)]),_:2},1032,["to"]))])]),n("div",null,d(v.duration?v.duration+" Block"+(v.duration>1?"s":""):"-"),1)])),[[I,{value:`<tiptext>Approximately ${A(v.duration)} Day${A(v.duration)>1?"s":""}</tiptext>`,escape:!0},void 0,{left:!0}]])),128))]),_:1})):E("v-if",!0)]),_:1},8,["value","rows"])])}}}),ua=ue(ca,[["__file","/home/runner/work/web-explorer-vuejs/web-explorer-vuejs/src/modules/transaction/components/txnDataTables/SdaExchangeTxnDataTable.vue"]]),X=C=>(Ee("data-v-5bf67df9"),C=C(),Ce(),C),da={class:"flex justify-between"},pa=X(()=>n("p",{class:"text-gray-500 mb-5 text-sm font-bold"},"Transactions",-1)),va={class:"bg-gray-50"},xa=X(()=>n("option",{value:"all",class:"text-sm"},"All",-1)),ba=["value"],Ta={key:0},ya=X(()=>n("div",{class:"flex justify-center items-center border-gray-400 mt-5"},[n("div",{class:"animate-spin rounded-full h-5 w-5 border-b-2 border-navy-primary mr-2"}),n("span",{class:"text-tsm"},"Fetching transactions")],-1)),ma=[ya],fa={key:1},ga={key:15,class:"sm:flex sm:justify-between my-5 mb-15"},ha={class:"text-xs text-gray-700 mb-3 sm:mb-0 text-center sm:text-left"},ka=Ae('<option value="10" data-v-5bf67df9>10</option><option value="20" data-v-5bf67df9>20</option><option value="30" data-v-5bf67df9>30</option><option value="40" data-v-5bf67df9>40</option><option value="50" data-v-5bf67df9>50</option>',5),_a=[ka],Ea={class:"sm:flex sm:items-center text-center sm:text-right"},Ca={key:1,class:"bg-gray-50 inline-block border border-gray-50 rounded-sm px-2 py-1 text-gray-700 text-xs mx-1"},Aa={key:3,class:"bg-gray-50 inline-block border border-gray-50 rounded-sm px-2 py-1 text-gray-700 text-xs mx-1"},Na={class:"bg-gray-50 inline-block border border-gray-50 rounded-sm px-2 py-1 text-gray-700 text-xs"},wa={key:5,class:"bg-gray-50 inline-block border border-gray-50 rounded-sm px-2 py-1 text-gray-700 text-xs mx-1"},Ga={key:7,class:"bg-gray-50 inline-block border border-gray-50 rounded-sm px-2 py-1 text-gray-700 text-xs mx-1"},Sa=le({__name:"ViewTransactionList",setup(C){const f=_e(),O=f==null?void 0:f.appContext.config.globalProperties.emitter;let s=c("all");const G=c(!0);let H=Object.entries(a).map(([r,i])=>({label:r,value:i}));const u=c(20),h=c(1),A=c(0),R=P(()=>h.value>1),$=P(()=>h.value>1),N=P(()=>A.value-h.value>0),I=P(()=>h.value<A.value),o=()=>{h.value=1,w()},v=()=>{--h.value,w()},B=()=>{++h.value,w()},de=()=>{h.value=A.value,w()},pe=()=>{h.value=1,w()},F=c([]),j=c([]),U=c([]),z=c([]),Q=c([]),W=c([]),J=c([]),q=c([]),Y=c([]),Z=c([]),ee=c([]),ae=c([]),te=c([]),se=c([]),ne=c([]),oe=c([]),b=c(void 0);let k=D.getTransactionGroupType(),ve=D.createTransactionFieldOrder(D.getTransactionSortField().BLOCK,D.getQueryParamOrder_v2().DESC),w=async()=>{if(G.value=!0,!V.isReady){setTimeout(w,1e3);return}if(!V.chainAPI)return;let r=D.createTransactionQueryParams(),i=await V.chainAPI.chainAPI.getBlockchainHeight();r.pageSize=u.value,r.pageNumber=h.value,s.value==null||s.value=="all"?r.embedded=!1:r.embedded=!0;let _=i-2e5;_<=0&&(_=1),r.fromHeight=_,b.value!=null&&(r.type=b.value),r.updateFieldOrder(ve);let K=await y.searchTxns(k.CONFIRMED,r);if(K.transactions.length>0){let T=await be(K.transactions);F.value=T,s.value=="all"&&(j.value=T),s.value==a.TRANSFER&&(U.value=T),s.value==a.ACCOUNT&&(z.value=T),s.value==a.AGGREGATE&&(Q.value=T),s.value==a.ALIAS&&(W.value=T),s.value==a.ASSET&&(J.value=T),s.value==a.NAMESPACE&&(q.value=T),s.value==a.METADATA&&(Y.value=T),s.value==a.EXCHANGE&&(Z.value=T),s.value==a.LOCK&&(ee.value=T),s.value==a.LINK&&(ae.value=T),s.value==a.RESTRICTION&&(te.value=T),s.value==a.SECRET&&(se.value=T),s.value==a.CHAIN&&(ne.value=T),s.value==a["SDA EXCHANGE"]&&(oe.value=T),A.value=K.pagination.totalPages}else F.value=[];G.value=!1};w();const xe=()=>{switch(G.value=!0,F.value=[],s.value){case a.TRANSFER:b.value=g.getTransferTypes();break;case a.ACCOUNT:b.value=g.getAccountTypes();break;case a.ASSET:b.value=g.getAssetTypes();break;case a.ALIAS:b.value=g.getAliasTypes();break;case a.NAMESPACE:b.value=g.getNamespaceTypes();break;case a.METADATA:b.value=g.getMetadataTypes();break;case a.CHAIN:b.value=g.getChainTypes();break;case a.EXCHANGE:b.value=g.getExchangeTypes();break;case a.AGGREGATE:b.value=g.getAggregateTypes();break;case a.LINK:b.value=g.getLinkTypes();break;case a.LOCK:b.value=g.getLockTypes();break;case a.SECRET:b.value=g.getSecretTypes();break;case a.RESTRICTION:b.value=g.getRestrictionTypes();break;case a["SDA EXCHANGE"]:b.value=g.getSdaExchangeTypes();break;default:b.value=void 0;break}w()},be=async r=>{let i=[];switch(s.value){case a.TRANSFER:i=await y.formatConfirmedMixedTxns(r);break;case a.ACCOUNT:i=await y.formatConfirmedAccountTransaction(r);break;case a.AGGREGATE:i=await y.formatConfirmedAggregateTransaction(r);break;case a.RESTRICTION:i=await y.formatConfirmedRestrictionTransaction(r);break;case a.SECRET:i=await y.formatConfirmedSecretTransaction(r);break;case a.ALIAS:i=await y.formatConfirmedAliasTransaction(r);break;case a.ASSET:i=await y.formatConfirmedAssetTransaction(r);break;case a.METADATA:i=await y.formatConfirmedMetadataTransaction(r);break;case a.CHAIN:i=await y.formatConfirmedChainTransaction(r);break;case a.EXCHANGE:i=await y.formatConfirmedExchangeTransaction(r);break;case a.LINK:i=await y.formatConfirmedLinkTransaction(r);break;case a.LOCK:i=await y.formatConfirmedLockTransaction(r);break;case a.NAMESPACE:i=await y.formatConfirmedNamespaceTransaction(r);break;case a["SDA EXCHANGE"]:i=await y.formatConfirmedSdaExchangeTransaction(r);break;default:i=await y.formatConfirmedMixedTxns(r);break}return i};return O.on("CHANGE_NETWORK",r=>{G.value=!0,r&&w()}),(r,i)=>(t(),p("div",null,[n("div",da,[pa,n("div",va,[M(Ne,{selectedTxnType:e(s),transactions:F.value,disabled:G.value||F.value.length==0},null,8,["selectedTxnType","transactions","disabled"]),L(n("select",{"onUpdate:modelValue":i[0]||(i[0]=_=>ke(s)?s.value=_:s=_),onChange:xe,class:"border border-gray-200 px-2 py-1 focus:outline-none"},[xa,(t(!0),p(ie,null,ce(e(H),_=>(t(),p("option",{key:_.value,value:_.value,class:"text-sm"},d(_.label),9,ba))),128))],544),[[re,e(s)]])])]),G.value?(t(),p("div",Ta,ma)):(t(),p("div",fa,[e(s)=="all"?(t(),l($e,{key:0,transactions:j.value,pages:u.value},null,8,["transactions","pages"])):e(s)===e(a).TRANSFER?(t(),l(we,{key:1,transactions:U.value,pages:u.value},null,8,["transactions","pages"])):e(s)===e(a).ACCOUNT?(t(),l(Ge,{key:2,transactions:z.value,pages:u.value},null,8,["transactions","pages"])):e(s)===e(a).AGGREGATE?(t(),l(Se,{key:3,transactions:Q.value,pages:u.value,selectedGroupType:e(k).CONFIRMED},null,8,["transactions","pages","selectedGroupType"])):e(s)===e(a).ALIAS?(t(),l(De,{key:4,transactions:W.value,pages:u.value,selectedGroupType:e(k).CONFIRMED},null,8,["transactions","pages","selectedGroupType"])):e(s)===e(a).ASSET?(t(),l(Re,{key:5,transactions:J.value,pages:u.value,selectedGroupType:e(k).CONFIRMED},null,8,["transactions","pages","selectedGroupType"])):e(s)===e(a).NAMESPACE?(t(),l(Ie,{key:6,transactions:q.value,pages:u.value,selectedGroupType:e(k).CONFIRMED},null,8,["transactions","pages","selectedGroupType"])):e(s)===e(a).METADATA?(t(),l(Fe,{key:7,transactions:Y.value,pages:u.value,selectedGroupType:e(k).CONFIRMED},null,8,["transactions","pages","selectedGroupType"])):e(s)===e(a).EXCHANGE?(t(),l(Le,{key:8,transactions:Z.value,pages:u.value,selectedGroupType:e(k).CONFIRMED},null,8,["transactions","pages","selectedGroupType"])):e(s)===e(a).LOCK?(t(),l(Oe,{key:9,transactions:ee.value,pages:u.value,selectedGroupType:e(k).CONFIRMED},null,8,["transactions","pages","selectedGroupType"])):e(s)===e(a).LINK?(t(),l(Pe,{key:10,transactions:ae.value,pages:u.value,selectedGroupType:e(k).CONFIRMED},null,8,["transactions","pages","selectedGroupType"])):e(s)===e(a).RESTRICTION?(t(),l(Me,{key:11,transactions:te.value,pages:u.value,selectedGroupType:e(k).CONFIRMED},null,8,["transactions","pages","selectedGroupType"])):e(s)===e(a).SECRET?(t(),l(He,{key:12,transactions:se.value,pages:u.value,selectedGroupType:e(k).CONFIRMED},null,8,["transactions","pages","selectedGroupType"])):e(s)===e(a).CHAIN?(t(),l(Ve,{key:13,transactions:ne.value,pages:u.value,selectedGroupType:e(k).CONFIRMED},null,8,["transactions","pages","selectedGroupType"])):e(s)===e(a)["SDA EXCHANGE"]?(t(),l(ua,{key:14,transactions:oe.value,pages:u.value,selectedGroupType:e(k).CONFIRMED},null,8,["transactions","pages","selectedGroupType"])):E("v-if",!0),A.value>1&&F.value.length>0?(t(),p("div",ga,[n("div",ha,[m(" Show "),L(n("select",{"onUpdate:modelValue":i[1]||(i[1]=_=>u.value=_),class:"border border-gray-300 rounded-md p-1",onChange:pe},_a,544),[[re,u.value]]),m(" Records ")]),n("div",Ea,[e(R)?(t(),p("div",{key:0,onClick:o,class:"bg-blue-100 inline-block border border-blue-100 rounded-sm px-2 py-1 text-blue-700 text-xs mx-1 cursor-pointer hover:bg-blue-200 duration-300 transition-all"}," First ")):(t(),p("div",Ca," First ")),e($)?(t(),p("div",{key:2,onClick:v,class:"bg-blue-100 inline-block border border-blue-100 rounded-sm px-2 py-1 text-blue-700 text-xs mx-1 cursor-pointer hover:bg-blue-200 duration-300 transition-all"}," Previous ")):(t(),p("div",Aa," Previous ")),n("div",Na," Page "+d(h.value)+" of "+d(A.value),1),e(N)?(t(),p("div",{key:4,onClick:B,class:"bg-blue-100 inline-block border border-blue-100 rounded-sm px-2 py-1 text-blue-700 text-xs mx-1 cursor-pointer hover:bg-blue-200 duration-300 transition-all"}," Next ")):(t(),p("div",wa," Next ")),e(I)?(t(),p("div",{key:6,onClick:de,class:"bg-blue-100 inline-block border border-blue-100 rounded-sm px-2 py-1 text-blue-700 text-xs ml-1 cursor-pointer hover:bg-blue-200 duration-300 transition-all"}," Last ")):(t(),p("div",Ga," Last "))])])):E("v-if",!0)]))]))}});const Oa=ue(Sa,[["__scopeId","data-v-5bf67df9"],["__file","/home/runner/work/web-explorer-vuejs/web-explorer-vuejs/src/modules/transaction/views/ViewTransactionList.vue"]]);export{Oa as default};
