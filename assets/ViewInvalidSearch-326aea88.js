import{d as o,s as n,C as d,r as l,e as i,f as p,i as t,t as s,u,x as _,y as v,_ as h}from"./index-8eb0da8f.js";const b=a=>(_("data-v-b82c860d"),a=a(),v(),a),m={class:"pb-14"},k=b(()=>t("p",{class:"text-gray-500 mb-5 text-sm font-bold"},"Search not found",-1)),w={class:"p-3 bg-yellow-100 text-yellow-700"},y=o({__name:"ViewInvalidSearch",props:{type:{type:String,required:!0},param:{type:String,required:!0}},setup(a){const r=a,c=n(()=>d.chainNetworkName),e=l("Search");switch(r.type){case"Hash":e.value="Transaction";break;case"Block":e.value="Block";break;case"Asset":e.value="Asset";break;case"Namespace":e.value="Namespace";break;case"Address":e.value="Address";break;case"PublicKey":e.value="Public Key";break;default:e.value="Search";break}return(S,f)=>(i(),p("div",m,[k,t("div",w,s(e.value)+" is not found in "+s(u(c)),1)]))}});const I=h(y,[["__scopeId","data-v-b82c860d"],["__file","/home/runner/work/web-explorer-vuejs/web-explorer-vuejs/src/modules/search/views/ViewInvalidSearch.vue"]]);export{I as default};