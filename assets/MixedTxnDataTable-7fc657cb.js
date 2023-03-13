import{d as L,r as M,a as C,o as H,s as D,A,b as j,c as R,e as t,f as n,g as y,w as i,j as u,h as l,i as r,u as s,H as p,l as o,m as x,t as a,F as N,v as F,_ as B}from"./index-8eb0da8f.js";import{s as h,a as O}from"./column.esm-ee224857.js";const V="/web-explorer-vuejs/assets/icon-txn-out-302bb37d.svg",E="/web-explorer-vuejs/assets/icon-txn-in-c7b02fa4.svg",I="/web-explorer-vuejs/assets/icon-message-a45e72fc.svg",z={class:"ml-2"},U={key:0,src:V,class:"inline-block"},X={key:1,src:E,class:"inline-block"},G=r("div",{class:"uppercase text-xs text-gray-300 font-bold mb-1 break-all"}," TX HASH ",-1),K={class:"text-xs inline-flex text-ellipsis overflow-hidden hover:underline hover:text-blue-primary w-40"},W=r("div",{class:"uppercase text-xs text-gray-300 font-bold mb-1 mt-5"}," Type ",-1),Y={class:"flex items-center"},$={class:"uppercase font-bold text-xs mr-2"},q={key:0,class:"ml-2"},J={key:0,src:V,class:"inline-block"},Q={key:1,src:E,class:"inline-block"},Z=r("div",{class:"uppercase text-xs text-gray-300 font-bold mb-1 mt-5"}," Recipient ",-1),ee={class:"uppercase font-bold text-xs"},te={key:0},se={class:"text-ellipsis overflow-hidden"},re=r("div",{class:"uppercase text-xs text-gray-300 font-bold mb-1"}," Timestamp ",-1),ie={class:"uppercase font-bold text-xs"},ne=r("div",{class:"uppercase text-xs text-gray-300 font-bold mb-1 mt-5"}," From ",-1),oe={class:"uppercase font-bold text-xs"},ae={key:0},le={class:"text-ellipsis overflow-hidden"},ce=r("div",{class:"uppercase text-xs text-gray-300 font-bold mb-1 mt-5"}," Tx Amount ",-1),de={class:"text-xs uppercase font-bold"},ue={key:0},pe={class:"text-ellipsis overflow-hidden w-44"},he={class:"text-xs"},me={class:"text-xs"},ve={key:0},xe={class:"text-ellipsis overflow-hidden"},_e={key:0},ye={class:"text-ellipsis overflow-hidden"},fe={class:"text-xs"},be={key:0},ke={key:0,class:"text-xs"},ge={key:1},we={key:0},Ae={key:0},Te={key:1},Se={class:"flex justify-center"},Pe={key:0,src:I,class:"inline-block"},De={key:1,class:"w-full text-center"},Ne=L({__name:"MixedTxnDataTable",props:{transactions:Array,accountAddress:String,pages:Number},setup(m){const d=M(!1),k=()=>{window.innerWidth<1024?d.value=!1:d.value=!0};k(),C(()=>{window.removeEventListener("resize",k)}),H(()=>{window.addEventListener("resize",k)});const g=D(()=>A.nativeToken.label),T=_=>{let f=[];if(_.length>0){for(const c of _)c.currentAlias&&c.currentAlias.length?c.currentAlias[0].name&&f.push({amount:c.amount,name:c.currentAlias[0].name}):f.push({amount:c.amount,name:c.id});return f}},S=_=>!!(_&&_.length>0),P=D(()=>A.nativeToken.divisibility);return(_,f)=>{const c=j("router-link"),v=R("tooltip");return t(),n("div",null,[y(s(O),{value:m.transactions,paginator:!1,rows:Number(m.pages),scrollDirection:"horizontal",alwaysShowPaginator:!1,responsiveLayout:"scroll",paginatorTemplate:"CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown",currentPageReportTemplate:"",globalFilterFields:["recipient","sender","signerAddress","type"]},{empty:i(()=>[u(" No transaction found ")]),loading:i(()=>[u(" Fetching transactions ")]),default:i(()=>[d.value&&m.accountAddress?(t(),l(s(h),{key:0,field:"In/Out",header:"IN/OUT",headerStyle:"width:100px"},{body:i(({data:e})=>[r("div",z,[e.sender===s(p).createAddress(m.accountAddress).plain()&&e.type==="Transfer"?(t(),n("img",U)):e.sender!=s(p).createAddress(m.accountAddress).plain()&&e.type==="Transfer"?(t(),n("img",X)):o("v-if",!0)])]),_:1})):o("v-if",!0),d.value?o("v-if",!0):(t(),l(s(h),{key:1,style:{width:"200px"}},{body:i(({data:e})=>[r("div",null,[G,y(c,{class:"uppercase font-bold text-xs block text-blue-600 hover:text-blue-primary hover:underline",to:{name:"ViewTransaction",params:{hash:e.hash}}},{default:i(()=>[x((t(),n("span",K,[u(a(e.hash),1)])),[[v,e.hash,void 0,{right:!0}]]),u("... ")]),_:2},1032,["to"])]),r("div",null,[W,r("div",Y,[r("div",$,a(e.type),1),m.accountAddress?(t(),n("div",q,[e.sender===s(p).createAddress(m.accountAddress).plain()?(t(),n("img",J)):(t(),n("img",Q))])):o("v-if",!0)])]),r("div",null,[Z,r("div",ee,[e.recipient===""||e.recipient===null?(t(),n("span",te,"-")):x((t(),l(c,{key:1,to:{name:"ViewAccount",params:{accountParam:e.recipient}},class:"truncate inline-flex text-xs text-blue-600 hover:text-blue-primary hover:underline w-40"},{default:i(()=>[r("span",se,a(s(p).createAddress(e.recipient).pretty()),1),u("...")]),_:2},1032,["to"])),[[v,s(p).createAddress(e.recipient).pretty(),void 0,{right:!0}]])])])]),_:1})),d.value?o("v-if",!0):(t(),l(s(h),{key:2,style:{width:"200px"}},{body:i(({data:e})=>[r("div",null,[re,r("div",ie,a(s(p).convertDisplayDateTimeFormat24(e.timestamp)),1)]),r("div",null,[ne,r("div",oe,[e.signerAddress===""||e.signerAddress===null?(t(),n("span",ae,"-")):x((t(),l(c,{key:1,to:{name:"ViewAccount",params:{accountParam:e.signerAddress}},class:"truncate inline-flex text-xs text-blue-600 hover:text-blue-primary hover:underline w-40"},{default:i(()=>[r("span",le,a(s(p).createAddress(e.signerAddress).pretty()),1),u("...")]),_:2},1032,["to"])),[[v,s(p).createAddress(e.signerAddress).pretty(),void 0,{bottom:!0}]])])]),r("div",null,[ce,r("div",de,[u(a(e.amountTransfer?s(p).toCurrencyFormat(e.amountTransfer,s(P)):"-")+" ",1),e.amountTransfer?(t(),n("b",ue,a(s(g)),1)):o("v-if",!0)])])]),_:1})),d.value?(t(),l(s(h),{key:3,field:"hash",header:"TX HASH",headerStyle:"width:90px"},{body:i(({data:e})=>[x((t(),l(c,{to:{name:"ViewTransaction",params:{hash:e.hash}},class:"text-xs text-blue-600 hover:text-blue-primary inline-flex hover:underline"},{default:i(()=>[r("span",pe,a(e.hash),1),u("...")]),_:2},1032,["to"])),[[v,e.hash,void 0,{bottom:!0}]])]),_:1})):o("v-if",!0),d.value?(t(),l(s(h),{key:4,field:"timestamp",header:"TIMESTAMP",headerStyle:"width:200px"},{body:i(({data:e})=>[r("span",he,a(s(p).convertDisplayDateTimeFormat24(e.timestamp)),1)]),_:1})):o("v-if",!0),d.value?(t(),l(s(h),{key:5,field:"type",header:"TYPE",headerStyle:"width:120px"},{body:i(({data:e})=>[r("span",me,a(e.type),1)]),_:1})):o("v-if",!0),d.value?(t(),l(s(h),{key:6,field:"block",header:"BLOCK",headerStyle:"width:60px"},{body:i(({data:e})=>[y(c,{to:{name:"ViewBlock",params:{blockHeight:e.block}},class:"text-blue-600 hover:text-blue-primary hover:underline text-xs"},{default:i(()=>[u(a(e.block),1)]),_:2},1032,["to"])]),_:1})):o("v-if",!0),d.value?(t(),l(s(h),{key:7,field:"signer",header:"FROM",headerStyle:"width:120px"},{body:i(({data:e})=>[e.signerAddress===""||e.signerAddress===null?(t(),n("span",ve)):x((t(),l(c,{key:1,to:{name:"ViewAccount",params:{accountParam:e.signerAddress}},class:"truncate inline-flex text-xs text-blue-600 hover:text-blue-primary hover:underline w-32"},{default:i(()=>[r("span",xe,a(s(p).createAddress(e.signerAddress).pretty()),1),u("...")]),_:2},1032,["to"])),[[v,s(p).createAddress(e.signerAddress).pretty(),void 0,{bottom:!0}]])]),_:1})):o("v-if",!0),d.value?(t(),l(s(h),{key:8,field:"recipient",header:"RECIPIENT",headerStyle:"width:120px"},{body:i(({data:e})=>[e.recipient===""||e.recipient===null?(t(),n("span",_e)):x((t(),l(c,{key:1,to:{name:"ViewAccount",params:{accountParam:e.recipient}},class:"truncate inline-flex text-xs text-blue-600 hover:text-blue-primary hover:underline w-32"},{default:i(()=>[r("span",ye,a(s(p).createAddress(e.recipient).pretty()),1),u("... ")]),_:2},1032,["to"])),[[v,s(p).createAddress(e.recipient).pretty(),void 0,{bottom:!0}]])]),_:1})):o("v-if",!0),d.value?(t(),l(s(h),{key:9,header:"TX FEE",headerStyle:"width:110px"},{body:i(({data:e})=>[r("div",fe,[u(a(e.fee)+" ",1),e.fee==0||e.fee>0?(t(),n("b",be,a(s(g)),1)):o("v-if",!0)])]),_:1})):o("v-if",!0),d.value?(t(),l(s(h),{key:10,header:"AMOUNT",headerStyle:"width:110px"},{body:i(({data:e})=>[e.amountTransfer?(t(),n("div",ke,a(s(p).toCurrencyFormat(e.amountTransfer,s(P))),1)):o("v-if",!0),S(e.sda)?(t(),n("div",ge,[(t(!0),n(N,null,F(T(e.sda),(b,w)=>(t(),n("div",{key:w},a(b.amount),1))),128))])):o("v-if",!0)]),_:1})):o("v-if",!0),d.value?(t(),l(s(h),{key:11,header:"SDA",headerStyle:"width:40px"},{body:i(({data:e})=>[e.amountTransfer?(t(),n("div",we,[e.amountTransfer?(t(),n("span",Ae,[y(c,{to:{name:"ViewNamespace",params:{namespaceParam:s(A).nativeToken.fullNamespace}},class:"text-blue-600 hover:text-blue-primary hover:underline"},{default:i(()=>[u(a(s(g)),1)]),_:1},8,["to"])])):o("v-if",!0)])):o("v-if",!0),S(e.sda)?(t(),n("div",Te,[(t(!0),n(N,null,F(T(e.sda),(b,w)=>(t(),n("span",{key:w},[y(c,{to:{name:"ViewNamespace",params:{namespaceParam:b.name}},class:"text-blue-600 hover:text-blue-primary hover:underline"},{default:i(()=>[u(a(b.name),1)]),_:2},1032,["to"]),u(" "+a(e.sda.length),1)]))),128))])):o("v-if",!0)]),_:1})):o("v-if",!0),d.value?(t(),l(s(h),{key:12,header:"MESSAGE",headerStyle:"width:40px"},{body:i(({data:e})=>[r("div",Se,[e.message&&e.messageType!==1?x((t(),n("img",Pe,null,512)),[[v,"<tiptitle>"+e.messageTypeTitle+"</tiptitle><tiptext>"+e.message+"</tiptext>",void 0,{left:!0}]]):(t(),n("div",De,"-"))])]),_:1})):o("v-if",!0)]),_:1},8,["value","rows"])])}}}),Ee=B(Ne,[["__file","/home/runner/work/web-explorer-vuejs/web-explorer-vuejs/src/modules/transaction/components/txnDataTables/MixedTxnDataTable.vue"]]);export{Ee as M,V as _,E as a,I as b};