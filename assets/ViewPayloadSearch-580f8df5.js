import{S as y,X as g,e as r,f as i,R as b,d as T,r as u,s as w,C as k,k as o,i as l,g as m,u as $,l as V,x as A,y as z,at as I,_ as P}from"./index-1253acc1.js";import"./index.esm-a9903af9.js";import{V as S}from"./ViewPayload-210432cb.js";var C=`
@layer primevue {
    .p-inputtextarea-resizable {
        overflow: hidden;
        resize: none;
    }

    .p-fluid .p-inputtextarea {
        width: 100%;
    }
}
`,D={root:function(e){var n=e.instance,a=e.props;return["p-inputtextarea p-inputtext p-component",{"p-filled":n.filled,"p-inputtextarea-resizable ":a.autoResize}]}},M=y.extend({name:"textarea",css:C,classes:D}),R={name:"BaseTextarea",extends:g,props:{modelValue:null,autoResize:Boolean},style:M,provide:function(){return{$parentInstance:this}}},_={name:"Textarea",extends:R,emits:["update:modelValue"],mounted:function(){this.$el.offsetParent&&this.autoResize&&this.resize()},updated:function(){this.$el.offsetParent&&this.autoResize&&this.resize()},methods:{resize:function(){this.$el.style.height="auto",this.$el.style.height=this.$el.scrollHeight+"px",parseFloat(this.$el.style.height)>=parseFloat(this.$el.style.maxHeight)?(this.$el.style.overflowY="scroll",this.$el.style.height=this.$el.style.maxHeight):this.$el.style.overflow="hidden"},onInput:function(e){this.autoResize&&this.resize(),this.$emit("update:modelValue",e.target.value)}},computed:{filled:function(){return this.modelValue!=null&&this.modelValue.toString().length>0},ptmParams:function(){return{context:{disabled:this.$attrs.disabled||this.$attrs.disabled===""}}}}},N=["value"];function j(t,e,n,a,c,s){return r(),i("textarea",b({class:t.cx("root"),value:t.modelValue,onInput:e[0]||(e[0]=function(){return s.onInput&&s.onInput.apply(s,arguments)})},t.ptm("root",s.ptmParams),{"data-pc-name":"textarea"}),null,16,N)}_.render=j;var B=`
@layer primevue {
    .p-accordion-header-action {
        cursor: pointer;
        display: flex;
        align-items: center;
        user-select: none;
        position: relative;
        text-decoration: none;
    }
    
    .p-accordion-header-action:focus {
        z-index: 1;
    }
    
    .p-accordion-header-text {
        line-height: 1;
    }
}
`,E={root:"p-accordion p-component",tab:{root:function(e){var n=e.instance,a=e.index;return["p-accordion-tab",{"p-accordion-tab-active":n.isTabActive(a)}]},header:function(e){var n=e.instance,a=e.tab,c=e.index;return["p-accordion-header",{"p-highlight":n.isTabActive(c),"p-disabled":n.getTabProp(a,"disabled")}]},headerAction:"p-accordion-header-link p-accordion-header-action",headerIcon:"p-accordion-toggle-icon",headerTitle:"p-accordion-header-text",toggleableContent:"p-toggleable-content",content:"p-accordion-content"}};y.extend({name:"accordion",css:B,classes:E});const v=t=>(A("data-v-3a7659a0"),t=t(),z(),t),F={class:"flex justify-center"},O={class:"flex border rounded-lg border-gray-900"},U={key:0,class:"flex justify-center items-center w-10"},H=v(()=>l("div",{class:"flex justify-center items-center border-gray-400"},[l("div",{class:"animate-spin rounded-full h-5 w-5 border-b-2 border-navy-primary mr-2"})],-1)),Y=[H],X=v(()=>l("img",{src:I,class:"w-4 inline-block search"},null,-1)),q=[X],G={key:0},J={key:1},K={key:0},L={key:1},Q=v(()=>l("div",{class:"pb-14 pt-2"},[l("div",{class:"p-3 bg-yellow-100 text-yellow-700"}," Unable to decode transaction payload. Make sure it is a correct payload. ")],-1)),W=[Q],Z={key:2},ee=v(()=>l("div",{class:"pb-14 pt-2"},[l("div",{class:"p-3 bg-yellow-100 text-yellow-700"}," Deprecated transaction type found. ")],-1)),te=[ee],ae=T({__name:"ViewPayloadSearch",setup(t){const e=u(""),n=u(!1),a=u(!0),c=u(!1);u(!0),u("");const s=u("");w(()=>k.chainNetworkName);const h=[o.TransactionType.MODIFY_ACCOUNT_METADATA,o.TransactionType.MODIFY_MOSAIC_METADATA,o.TransactionType.MODIFY_NAMESPACE_METADATA],x=async()=>{if(c.value=!1,e.value.length==0)n.value=!1,a.value=!1;else{if(n.value=!0,e.value=e.value.trim(),!o.Convert.isHexString(e.value)||e.value.length<=122*2){a.value=!1,n.value=!1;return}let f=parseInt(o.Convert.hexReverse(e.value.substring(0,8)),16);if(e.value.length!==f*2){a.value=!1,n.value=!1;return}try{let d=o.TransactionMapping.createFromPayload(e.value);if(h.includes(d.type))c.value=!0;else if(d instanceof o.AggregateTransaction){for(const p of d.innerTransactions)if(p instanceof o.UnknownTransaction){a.value=!1;break}else if(h.includes(p.type)){c.value=!0;break}a.value=!0,s.value=e.value}else d instanceof o.UnknownTransaction?a.value=!1:(a.value=!0,s.value=e.value)}catch{a.value=!1}n.value=!1}};return(f,d)=>(r(),i("div",null,[l("div",F,[l("div",O,[m($(_),{modelValue:e.value,"onUpdate:modelValue":d[0]||(d[0]=p=>e.value=p),placeholder:"Transaction payload to decode",class:"rounded-lg bg-transparent p-1",autoResize:"",rows:"6",cols:"80"},null,8,["modelValue"]),n.value?(r(),i("div",U,[...Y])):(r(),i("div",{key:1,class:"hover:bg-blue-100 cursor-pointer flex justify-center items-center rounded-r-lg w-10",onClick:x},[...q]))])]),s.value.length==0?(r(),i("div",G)):(r(),i("div",J,[a.value&&!c.value?(r(),i("div",K,[m(S,{payload:s.value,class:"mt-3"},null,8,["payload"])])):a.value?c.value?(r(),i("div",Z,[...te])):V("v-if",!0):(r(),i("div",L,[...W]))]))]))}});const re=P(ae,[["__scopeId","data-v-3a7659a0"],["__file","/home/runner/work/web-explorer-vuejs/web-explorer-vuejs/src/modules/transaction/views/ViewPayloadSearch.vue"]]);export{re as default};
