import{a2 as x,a3 as ie,k as M,a4 as oe,A as P}from"./index-1898c150.js";var I={exports:{}},U={exports:{}};function se(y){throw new Error('Could not dynamically require "'+y+'". Please configure the dynamicRequireTargets or/and ignoreDynamicRequires option of @rollup/plugin-commonjs appropriately for this require call to work.')}var R,G;function ue(){if(G)return R;G=1;var y=null;return R=y,R}var S,Q;function le(){if(Q)return S;Q=1;function y(f){if(typeof f!="string")throw new TypeError("Path must be a string. Received "+JSON.stringify(f))}function n(f,r){for(var e="",a=0,i=-1,u=0,t,s=0;s<=f.length;++s){if(s<f.length)t=f.charCodeAt(s);else{if(t===47)break;t=47}if(t===47){if(!(i===s-1||u===1))if(i!==s-1&&u===2){if(e.length<2||a!==2||e.charCodeAt(e.length-1)!==46||e.charCodeAt(e.length-2)!==46){if(e.length>2){var v=e.lastIndexOf("/");if(v!==e.length-1){v===-1?(e="",a=0):(e=e.slice(0,v),a=e.length-1-e.lastIndexOf("/")),i=s,u=0;continue}}else if(e.length===2||e.length===1){e="",a=0,i=s,u=0;continue}}r&&(e.length>0?e+="/..":e="..",a=2)}else e.length>0?e+="/"+f.slice(i+1,s):e=f.slice(i+1,s),a=s-i-1;i=s,u=0}else t===46&&u!==-1?++u:u=-1}return e}function d(f,r){var e=r.dir||r.root,a=r.base||(r.name||"")+(r.ext||"");return e?e===r.root?e+a:e+f+a:a}var o={resolve:function(){for(var r="",e=!1,a,i=arguments.length-1;i>=-1&&!e;i--){var u;i>=0?u=arguments[i]:(a===void 0&&(a=x.cwd()),u=a),y(u),u.length!==0&&(r=u+"/"+r,e=u.charCodeAt(0)===47)}return r=n(r,!e),e?r.length>0?"/"+r:"/":r.length>0?r:"."},normalize:function(r){if(y(r),r.length===0)return".";var e=r.charCodeAt(0)===47,a=r.charCodeAt(r.length-1)===47;return r=n(r,!e),r.length===0&&!e&&(r="."),r.length>0&&a&&(r+="/"),e?"/"+r:r},isAbsolute:function(r){return y(r),r.length>0&&r.charCodeAt(0)===47},join:function(){if(arguments.length===0)return".";for(var r,e=0;e<arguments.length;++e){var a=arguments[e];y(a),a.length>0&&(r===void 0?r=a:r+="/"+a)}return r===void 0?".":o.normalize(r)},relative:function(r,e){if(y(r),y(e),r===e||(r=o.resolve(r),e=o.resolve(e),r===e))return"";for(var a=1;a<r.length&&r.charCodeAt(a)===47;++a);for(var i=r.length,u=i-a,t=1;t<e.length&&e.charCodeAt(t)===47;++t);for(var s=e.length,v=s-t,p=u<v?u:v,w=-1,m=0;m<=p;++m){if(m===p){if(v>p){if(e.charCodeAt(t+m)===47)return e.slice(t+m+1);if(m===0)return e.slice(t+m)}else u>p&&(r.charCodeAt(a+m)===47?w=m:m===0&&(w=0));break}var T=r.charCodeAt(a+m),k=e.charCodeAt(t+m);if(T!==k)break;T===47&&(w=m)}var _="";for(m=a+w+1;m<=i;++m)(m===i||r.charCodeAt(m)===47)&&(_.length===0?_+="..":_+="/..");return _.length>0?_+e.slice(t+w):(t+=w,e.charCodeAt(t)===47&&++t,e.slice(t))},_makeLong:function(r){return r},dirname:function(r){if(y(r),r.length===0)return".";for(var e=r.charCodeAt(0),a=e===47,i=-1,u=!0,t=r.length-1;t>=1;--t)if(e=r.charCodeAt(t),e===47){if(!u){i=t;break}}else u=!1;return i===-1?a?"/":".":a&&i===1?"//":r.slice(0,i)},basename:function(r,e){if(e!==void 0&&typeof e!="string")throw new TypeError('"ext" argument must be a string');y(r);var a=0,i=-1,u=!0,t;if(e!==void 0&&e.length>0&&e.length<=r.length){if(e.length===r.length&&e===r)return"";var s=e.length-1,v=-1;for(t=r.length-1;t>=0;--t){var p=r.charCodeAt(t);if(p===47){if(!u){a=t+1;break}}else v===-1&&(u=!1,v=t+1),s>=0&&(p===e.charCodeAt(s)?--s===-1&&(i=t):(s=-1,i=v))}return a===i?i=v:i===-1&&(i=r.length),r.slice(a,i)}else{for(t=r.length-1;t>=0;--t)if(r.charCodeAt(t)===47){if(!u){a=t+1;break}}else i===-1&&(u=!1,i=t+1);return i===-1?"":r.slice(a,i)}},extname:function(r){y(r);for(var e=-1,a=0,i=-1,u=!0,t=0,s=r.length-1;s>=0;--s){var v=r.charCodeAt(s);if(v===47){if(!u){a=s+1;break}continue}i===-1&&(u=!1,i=s+1),v===46?e===-1?e=s:t!==1&&(t=1):e!==-1&&(t=-1)}return e===-1||i===-1||t===0||t===1&&e===i-1&&e===a+1?"":r.slice(e,i)},format:function(r){if(r===null||typeof r!="object")throw new TypeError('The "pathObject" argument must be of type Object. Received type '+typeof r);return d("/",r)},parse:function(r){y(r);var e={root:"",dir:"",base:"",ext:"",name:""};if(r.length===0)return e;var a=r.charCodeAt(0),i=a===47,u;i?(e.root="/",u=1):u=0;for(var t=-1,s=0,v=-1,p=!0,w=r.length-1,m=0;w>=u;--w){if(a=r.charCodeAt(w),a===47){if(!p){s=w+1;break}continue}v===-1&&(p=!1,v=w+1),a===46?t===-1?t=w:m!==1&&(m=1):t!==-1&&(m=-1)}return t===-1||v===-1||m===0||m===1&&t===v-1&&t===s+1?v!==-1&&(s===0&&i?e.base=e.name=r.slice(1,v):e.base=e.name=r.slice(s,v)):(s===0&&i?(e.name=r.slice(1,t),e.base=r.slice(1,v)):(e.name=r.slice(s,t),e.base=r.slice(s,v)),e.ext=r.slice(t,v)),s>0?e.dir=r.slice(0,s-1):i&&(e.dir="/"),e},sep:"/",delimiter:":",win32:null,posix:null};return o.posix=o,S=o,S}var g={},O;function fe(){return O||(O=1,g.endianness=function(){return"LE"},g.hostname=function(){return typeof location<"u"?location.hostname:""},g.loadavg=function(){return[]},g.uptime=function(){return 0},g.freemem=function(){return Number.MAX_VALUE},g.totalmem=function(){return Number.MAX_VALUE},g.cpus=function(){return[]},g.type=function(){return"Browser"},g.release=function(){return typeof navigator<"u"?navigator.appVersion:""},g.networkInterfaces=g.getNetworkInterfaces=function(){return{}},g.arch=function(){return"javascript"},g.platform=function(){return"browser"},g.tmpdir=g.tmpDir=function(){return"/tmp"},g.EOL=`
`,g.homedir=function(){return"/"}),g}var B,Z;function ce(){if(Z)return B;Z=1;var y=ue(),n=le(),d=fe(),o=typeof __webpack_require__=="function"?__non_webpack_require__:se,f=x.config&&x.config.variables||{},r=!!{}.PREBUILDS_ONLY,e=x.versions.modules,a=Y()?"electron":W()?"node-webkit":"node",i={}.npm_config_arch||d.arch(),u={}.npm_config_platform||d.platform(),t={}.LIBC||(ee(u)?"musl":"glibc"),s={}.ARM_VERSION||(i==="arm64"?"8":f.arm_version)||"",v=(x.versions.uv||"").split(".")[0];B=p;function p(l){return o(p.resolve(l))}p.resolve=p.path=function(l){l=n.resolve(l||".");try{var h=o(n.join(l,"package.json")).name.toUpperCase().replace(/-/g,"_");x.env[h+"_PREBUILD"]&&(l=x.env[h+"_PREBUILD"])}catch{}if(!r){var c=m(n.join(l,"build/Release"),T);if(c)return c;var b=m(n.join(l,"build/Debug"),T);if(b)return b}var C=K(l);if(C)return C;var A=K(n.dirname(x.execPath));if(A)return A;var re=["platform="+u,"arch="+i,"runtime="+a,"abi="+e,"uv="+v,s?"armv="+s:"","libc="+t,"node="+x.versions.node,x.versions.electron?"electron="+x.versions.electron:"",typeof __webpack_require__=="function"?"webpack=true":""].filter(Boolean).join(" ");throw new Error("No native build was found for "+re+`
    loaded from: `+l+`
`);function K(q){var te=w(n.join(q,"prebuilds")).map(k),j=te.filter(_(u,i)).sort(L)[0];if(j){var V=n.join(q,"prebuilds",j.name),ne=w(V).map(H),ae=ne.filter(N(a,e)),F=ae.sort(D(a))[0];if(F)return n.join(V,F.file)}}};function w(l){try{return y.readdirSync(l)}catch{return[]}}function m(l,h){var c=w(l).filter(h);return c[0]&&n.join(l,c[0])}function T(l){return/\.node$/.test(l)}function k(l){var h=l.split("-");if(h.length===2){var c=h[0],b=h[1].split("+");if(c&&b.length&&b.every(Boolean))return{name:l,platform:c,architectures:b}}}function _(l,h){return function(c){return c==null||c.platform!==l?!1:c.architectures.includes(h)}}function L(l,h){return l.architectures.length-h.architectures.length}function H(l){var h=l.split("."),c=h.pop(),b={file:l,specificity:0};if(c==="node"){for(var C=0;C<h.length;C++){var A=h[C];if(A==="node"||A==="electron"||A==="node-webkit")b.runtime=A;else if(A==="napi")b.napi=!0;else if(A.slice(0,3)==="abi")b.abi=A.slice(3);else if(A.slice(0,2)==="uv")b.uv=A.slice(2);else if(A.slice(0,4)==="armv")b.armv=A.slice(4);else if(A==="glibc"||A==="musl")b.libc=A;else continue;b.specificity++}return b}}function N(l,h){return function(c){return!(c==null||c.runtime!==l&&!J(c)||c.abi!==h&&!c.napi||c.uv&&c.uv!==v||c.armv&&c.armv!==s||c.libc&&c.libc!==t)}}function J(l){return l.runtime==="node"&&l.napi}function D(l){return function(h,c){return h.runtime!==c.runtime?h.runtime===l?-1:1:h.abi!==c.abi?h.abi?-1:1:h.specificity!==c.specificity?h.specificity>c.specificity?-1:1:0}}function W(){return!!(x.versions&&x.versions.nw)}function Y(){return x.versions&&x.versions.electron||{}.ELECTRON_RUN_AS_NODE?!0:typeof window<"u"&&window.process&&window.process.type==="renderer"}function ee(l){return l==="linux"&&y.existsSync("/etc/alpine-release")}return p.parseTags=H,p.matchTags=N,p.compareTags=D,p.parseTuple=k,p.matchTuple=_,p.compareTuples=L,B}var z;function ve(){return z||(z=1,typeof x.addon=="function"?U.exports=x.addon.bind(x):U.exports=ce()),U.exports}var E,$;function de(){if($)return E;$=1;function y(n){const d=n.length;let o=0;for(;o<d;)if(!(n[o]&128))o++;else if((n[o]&224)===192){if(o+1===d||(n[o+1]&192)!==128||(n[o]&254)===192)return!1;o+=2}else if((n[o]&240)===224){if(o+2>=d||(n[o+1]&192)!==128||(n[o+2]&192)!==128||n[o]===224&&(n[o+1]&224)===128||n[o]===237&&(n[o+1]&224)===160)return!1;o+=3}else if((n[o]&248)===240){if(o+3>=d||(n[o+1]&192)!==128||(n[o+2]&192)!==128||(n[o+3]&192)!==128||n[o]===240&&(n[o+1]&240)===128||n[o]===244&&n[o+1]>143||n[o]>244)return!1;o+=4}else return!1;return!0}return E=y,E}try{I.exports=ve()(__dirname)}catch{I.exports=de()}var me=I.exports;const he=ie(me);class X{static removeDoubleZero(n){return n.endsWith("00")&&(n=n.substring(0,n.length-2),n=this.removeDoubleZero(n)),n}static convertUtf8(n){n=X.removeDoubleZero(n);const d=M.Convert.hexToUint8(n);return he(oe.Buffer.from(d))&&(n=M.Convert.decodeHexToUtf8(n)),n}static async getAccountMetadata(n){if(!P.chainAPI)throw new Error("Service Unavailable");try{let d;const o=[],f=new M.MetadataQueryParams;return f.metadataType=M.MetadataType.ACCOUNT,f.targetKey=n,(await P.chainAPI.metadataAPI.searchMetadatas(f)).metadataEntries.forEach(e=>{d={scopedMetadataKeyUtf8:e.scopedMetadataKey.toHex()==this.convertUtf8(e.scopedMetadataKey.toHex())?null:this.convertUtf8(e.scopedMetadataKey.toHex()),scopedMetadataKeyHex:e.scopedMetadataKey.toHex(),value:e.value},o.push(d)}),o}catch(d){throw d}}static async getAssetMetadata(n){if(!P.chainAPI)throw new Error("Service Unavailable");try{let d;const o=[],f=new M.MetadataQueryParams;return f.metadataType=M.MetadataType.MOSAIC,f.targetId=new M.MosaicId(n),(await P.chainAPI.metadataAPI.searchMetadatas(f)).metadataEntries.forEach(e=>{d={scopedMetadataKeyUtf8:e.scopedMetadataKey.toHex()==this.convertUtf8(e.scopedMetadataKey.toHex())?null:this.convertUtf8(e.scopedMetadataKey.toHex()),scopedMetadataKeyHex:e.scopedMetadataKey.toHex(),value:e.value},o.push(d)}),o}catch(d){throw d}}static async getNamespaceMetadata(n){if(!P.chainAPI)throw new Error("Service Unavailable");try{let d;const o=[],f=new M.MetadataQueryParams;return f.metadataType=M.MetadataType.NAMESPACE,f.targetId=new M.NamespaceId(n),(await P.chainAPI.metadataAPI.searchMetadatas(f)).metadataEntries.forEach(e=>{d={scopedMetadataKeyUtf8:e.scopedMetadataKey.toHex()==this.convertUtf8(e.scopedMetadataKey.toHex())?null:this.convertUtf8(e.scopedMetadataKey.toHex()),scopedMetadataKeyHex:e.scopedMetadataKey.toHex(),value:e.value},o.push(d)}),o}catch(d){throw d}}}export{X as M};
