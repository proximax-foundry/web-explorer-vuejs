import{aa as b,ab as X,ac as oe,k as _,ad as se,A as P}from"./index-f176f711.js";var I={exports:{}},U={exports:{}},S,G;function ue(){if(G)return S;G=1;var p=null;return S=p,S}var q,Q;function fe(){if(Q)return q;Q=1;function p(c){if(typeof c!="string")throw new TypeError("Path must be a string. Received "+JSON.stringify(c))}function n(c,r){for(var e="",a=0,i=-1,u=0,t,s=0;s<=c.length;++s){if(s<c.length)t=c.charCodeAt(s);else{if(t===47)break;t=47}if(t===47){if(!(i===s-1||u===1))if(i!==s-1&&u===2){if(e.length<2||a!==2||e.charCodeAt(e.length-1)!==46||e.charCodeAt(e.length-2)!==46){if(e.length>2){var v=e.lastIndexOf("/");if(v!==e.length-1){v===-1?(e="",a=0):(e=e.slice(0,v),a=e.length-1-e.lastIndexOf("/")),i=s,u=0;continue}}else if(e.length===2||e.length===1){e="",a=0,i=s,u=0;continue}}r&&(e.length>0?e+="/..":e="..",a=2)}else e.length>0?e+="/"+c.slice(i+1,s):e=c.slice(i+1,s),a=s-i-1;i=s,u=0}else t===46&&u!==-1?++u:u=-1}return e}function d(c,r){var e=r.dir||r.root,a=r.base||(r.name||"")+(r.ext||"");return e?e===r.root?e+a:e+c+a:a}var o={resolve:function(){for(var r="",e=!1,a,i=arguments.length-1;i>=-1&&!e;i--){var u;i>=0?u=arguments[i]:(a===void 0&&(a=b.cwd()),u=a),p(u),u.length!==0&&(r=u+"/"+r,e=u.charCodeAt(0)===47)}return r=n(r,!e),e?r.length>0?"/"+r:"/":r.length>0?r:"."},normalize:function(r){if(p(r),r.length===0)return".";var e=r.charCodeAt(0)===47,a=r.charCodeAt(r.length-1)===47;return r=n(r,!e),r.length===0&&!e&&(r="."),r.length>0&&a&&(r+="/"),e?"/"+r:r},isAbsolute:function(r){return p(r),r.length>0&&r.charCodeAt(0)===47},join:function(){if(arguments.length===0)return".";for(var r,e=0;e<arguments.length;++e){var a=arguments[e];p(a),a.length>0&&(r===void 0?r=a:r+="/"+a)}return r===void 0?".":o.normalize(r)},relative:function(r,e){if(p(r),p(e),r===e||(r=o.resolve(r),e=o.resolve(e),r===e))return"";for(var a=1;a<r.length&&r.charCodeAt(a)===47;++a);for(var i=r.length,u=i-a,t=1;t<e.length&&e.charCodeAt(t)===47;++t);for(var s=e.length,v=s-t,g=u<v?u:v,x=-1,m=0;m<=g;++m){if(m===g){if(v>g){if(e.charCodeAt(t+m)===47)return e.slice(t+m+1);if(m===0)return e.slice(t+m)}else u>g&&(r.charCodeAt(a+m)===47?x=m:m===0&&(x=0));break}var T=r.charCodeAt(a+m),k=e.charCodeAt(t+m);if(T!==k)break;T===47&&(x=m)}var M="";for(m=a+x+1;m<=i;++m)(m===i||r.charCodeAt(m)===47)&&(M.length===0?M+="..":M+="/..");return M.length>0?M+e.slice(t+x):(t+=x,e.charCodeAt(t)===47&&++t,e.slice(t))},_makeLong:function(r){return r},dirname:function(r){if(p(r),r.length===0)return".";for(var e=r.charCodeAt(0),a=e===47,i=-1,u=!0,t=r.length-1;t>=1;--t)if(e=r.charCodeAt(t),e===47){if(!u){i=t;break}}else u=!1;return i===-1?a?"/":".":a&&i===1?"//":r.slice(0,i)},basename:function(r,e){if(e!==void 0&&typeof e!="string")throw new TypeError('"ext" argument must be a string');p(r);var a=0,i=-1,u=!0,t;if(e!==void 0&&e.length>0&&e.length<=r.length){if(e.length===r.length&&e===r)return"";var s=e.length-1,v=-1;for(t=r.length-1;t>=0;--t){var g=r.charCodeAt(t);if(g===47){if(!u){a=t+1;break}}else v===-1&&(u=!1,v=t+1),s>=0&&(g===e.charCodeAt(s)?--s===-1&&(i=t):(s=-1,i=v))}return a===i?i=v:i===-1&&(i=r.length),r.slice(a,i)}else{for(t=r.length-1;t>=0;--t)if(r.charCodeAt(t)===47){if(!u){a=t+1;break}}else i===-1&&(u=!1,i=t+1);return i===-1?"":r.slice(a,i)}},extname:function(r){p(r);for(var e=-1,a=0,i=-1,u=!0,t=0,s=r.length-1;s>=0;--s){var v=r.charCodeAt(s);if(v===47){if(!u){a=s+1;break}continue}i===-1&&(u=!1,i=s+1),v===46?e===-1?e=s:t!==1&&(t=1):e!==-1&&(t=-1)}return e===-1||i===-1||t===0||t===1&&e===i-1&&e===a+1?"":r.slice(e,i)},format:function(r){if(r===null||typeof r!="object")throw new TypeError('The "pathObject" argument must be of type Object. Received type '+typeof r);return d("/",r)},parse:function(r){p(r);var e={root:"",dir:"",base:"",ext:"",name:""};if(r.length===0)return e;var a=r.charCodeAt(0),i=a===47,u;i?(e.root="/",u=1):u=0;for(var t=-1,s=0,v=-1,g=!0,x=r.length-1,m=0;x>=u;--x){if(a=r.charCodeAt(x),a===47){if(!g){s=x+1;break}continue}v===-1&&(g=!1,v=x+1),a===46?t===-1?t=x:m!==1&&(m=1):t!==-1&&(m=-1)}return t===-1||v===-1||m===0||m===1&&t===v-1&&t===s+1?v!==-1&&(s===0&&i?e.base=e.name=r.slice(1,v):e.base=e.name=r.slice(s,v)):(s===0&&i?(e.name=r.slice(1,t),e.base=r.slice(1,v)):(e.name=r.slice(s,t),e.base=r.slice(s,v)),e.ext=r.slice(t,v)),s>0?e.dir=r.slice(0,s-1):i&&(e.dir="/"),e},sep:"/",delimiter:":",win32:null,posix:null};return o.posix=o,q=o,q}var y={},O;function ce(){return O||(O=1,y.endianness=function(){return"LE"},y.hostname=function(){return typeof location<"u"?location.hostname:""},y.loadavg=function(){return[]},y.uptime=function(){return 0},y.freemem=function(){return Number.MAX_VALUE},y.totalmem=function(){return Number.MAX_VALUE},y.cpus=function(){return[]},y.type=function(){return"Browser"},y.release=function(){return typeof navigator<"u"?navigator.appVersion:""},y.networkInterfaces=y.getNetworkInterfaces=function(){return{}},y.arch=function(){return"javascript"},y.platform=function(){return"browser"},y.tmpdir=y.tmpDir=function(){return"/tmp"},y.EOL=`
`,y.homedir=function(){return"/"}),y}var B,Z;function le(){if(Z)return B;Z=1;var p=ue(),n=fe(),d=ce(),o=typeof __webpack_require__=="function"?__non_webpack_require__:X,c=b.config&&b.config.variables||{},r=!!{}.PREBUILDS_ONLY,e=b.versions.modules,a=ee()?"electron":Y()?"node-webkit":"node",i={}.npm_config_arch||d.arch(),u={}.npm_config_platform||d.platform(),t={}.LIBC||(re(u)?"musl":"glibc"),s={}.ARM_VERSION||(i==="arm64"?"8":c.arm_version)||"",v=(b.versions.uv||"").split(".")[0];B=g;function g(f){return o(g.resolve(f))}g.resolve=g.path=function(f){f=n.resolve(f||".");try{var h=o(n.join(f,"package.json")).name.toUpperCase().replace(/-/g,"_");b.env[h+"_PREBUILD"]&&(f=b.env[h+"_PREBUILD"])}catch{}if(!r){var l=m(n.join(f,"build/Release"),T);if(l)return l;var A=m(n.join(f,"build/Debug"),T);if(A)return A}var C=K(f);if(C)return C;var w=K(n.dirname(b.execPath));if(w)return w;var te=["platform="+u,"arch="+i,"runtime="+a,"abi="+e,"uv="+v,s?"armv="+s:"","libc="+t,"node="+b.versions.node,b.versions.electron?"electron="+b.versions.electron:"",typeof __webpack_require__=="function"?"webpack=true":""].filter(Boolean).join(" ");throw new Error("No native build was found for "+te+`
    loaded from: `+f+`
`);function K(H){var ne=x(n.join(H,"prebuilds")).map(k),j=ne.filter(M(u,i)).sort(L)[0];if(j){var V=n.join(H,"prebuilds",j.name),ae=x(V).map(N),ie=ae.filter(E(a,e)),F=ie.sort(D(a))[0];if(F)return n.join(V,F.file)}}};function x(f){try{return p.readdirSync(f)}catch{return[]}}function m(f,h){var l=x(f).filter(h);return l[0]&&n.join(f,l[0])}function T(f){return/\.node$/.test(f)}function k(f){var h=f.split("-");if(h.length===2){var l=h[0],A=h[1].split("+");if(l&&A.length&&A.every(Boolean))return{name:f,platform:l,architectures:A}}}function M(f,h){return function(l){return l==null||l.platform!==f?!1:l.architectures.includes(h)}}function L(f,h){return f.architectures.length-h.architectures.length}function N(f){var h=f.split("."),l=h.pop(),A={file:f,specificity:0};if(l==="node"){for(var C=0;C<h.length;C++){var w=h[C];if(w==="node"||w==="electron"||w==="node-webkit")A.runtime=w;else if(w==="napi")A.napi=!0;else if(w.slice(0,3)==="abi")A.abi=w.slice(3);else if(w.slice(0,2)==="uv")A.uv=w.slice(2);else if(w.slice(0,4)==="armv")A.armv=w.slice(4);else if(w==="glibc"||w==="musl")A.libc=w;else continue;A.specificity++}return A}}function E(f,h){return function(l){return!(l==null||l.runtime!==f&&!W(l)||l.abi!==h&&!l.napi||l.uv&&l.uv!==v||l.armv&&l.armv!==s||l.libc&&l.libc!==t)}}function W(f){return f.runtime==="node"&&f.napi}function D(f){return function(h,l){return h.runtime!==l.runtime?h.runtime===f?-1:1:h.abi!==l.abi?h.abi?-1:1:h.specificity!==l.specificity?h.specificity>l.specificity?-1:1:0}}function Y(){return!!(b.versions&&b.versions.nw)}function ee(){return b.versions&&b.versions.electron||{}.ELECTRON_RUN_AS_NODE?!0:typeof window<"u"&&window.process&&window.process.type==="renderer"}function re(f){return f==="linux"&&p.existsSync("/etc/alpine-release")}return g.parseTags=N,g.matchTags=E,g.compareTags=D,g.parseTuple=k,g.matchTuple=M,g.compareTuples=L,B}var z;function ve(){if(z)return U.exports;z=1;const p=typeof __webpack_require__=="function"?__non_webpack_require__:X;return typeof p.addon=="function"?U.exports=p.addon.bind(p):U.exports=le(),U.exports}var R,$;function de(){if($)return R;$=1;function p(n){const d=n.length;let o=0;for(;o<d;)if(!(n[o]&128))o++;else if((n[o]&224)===192){if(o+1===d||(n[o+1]&192)!==128||(n[o]&254)===192)return!1;o+=2}else if((n[o]&240)===224){if(o+2>=d||(n[o+1]&192)!==128||(n[o+2]&192)!==128||n[o]===224&&(n[o+1]&224)===128||n[o]===237&&(n[o+1]&224)===160)return!1;o+=3}else if((n[o]&248)===240){if(o+3>=d||(n[o+1]&192)!==128||(n[o+2]&192)!==128||(n[o+3]&192)!==128||n[o]===240&&(n[o+1]&240)===128||n[o]===244&&n[o+1]>143||n[o]>244)return!1;o+=4}else return!1;return!0}return R=p,R}try{I.exports=ve()(__dirname)}catch{I.exports=de()}var me=I.exports;const he=oe(me);class J{static removeDoubleZero(n){return n.endsWith("00")&&(n=n.substring(0,n.length-2),n=this.removeDoubleZero(n)),n}static convertUtf8(n){n=J.removeDoubleZero(n);const d=_.Convert.hexToUint8(n);return he(se.Buffer.from(d))&&(n=_.Convert.decodeHexToUtf8(n)),n}static async getAccountMetadata(n){if(!P.chainAPI)throw new Error("Service Unavailable");try{let d;const o=[],c=new _.MetadataQueryParams;return c.metadataType=_.MetadataType.ACCOUNT,c.targetKey=n,(await P.chainAPI.metadataAPI.searchMetadatas(c)).metadataEntries.forEach(e=>{d={compositeHash:e.compositeHash,scopedMetadataKeyUtf8:e.scopedMetadataKey.toHex()==this.convertUtf8(e.scopedMetadataKey.toHex())?null:this.convertUtf8(e.scopedMetadataKey.toHex()),scopedMetadataKeyHex:e.scopedMetadataKey.toHex(),value:e.value},o.push(d)}),o}catch(d){throw d}}static async getAssetMetadata(n){if(!P.chainAPI)throw new Error("Service Unavailable");try{let d;const o=[],c=new _.MetadataQueryParams;return c.metadataType=_.MetadataType.MOSAIC,c.targetId=new _.MosaicId(n),(await P.chainAPI.metadataAPI.searchMetadatas(c)).metadataEntries.forEach(e=>{d={compositeHash:e.compositeHash,scopedMetadataKeyUtf8:e.scopedMetadataKey.toHex()==this.convertUtf8(e.scopedMetadataKey.toHex())?null:this.convertUtf8(e.scopedMetadataKey.toHex()),scopedMetadataKeyHex:e.scopedMetadataKey.toHex(),value:e.value},o.push(d)}),o}catch(d){throw d}}static async getNamespaceMetadata(n){if(!P.chainAPI)throw new Error("Service Unavailable");try{let d;const o=[],c=new _.MetadataQueryParams;return c.metadataType=_.MetadataType.NAMESPACE,c.targetId=new _.NamespaceId(n),(await P.chainAPI.metadataAPI.searchMetadatas(c)).metadataEntries.forEach(e=>{d={compositeHash:e.compositeHash,scopedMetadataKeyUtf8:e.scopedMetadataKey.toHex()==this.convertUtf8(e.scopedMetadataKey.toHex())?null:this.convertUtf8(e.scopedMetadataKey.toHex()),scopedMetadataKeyHex:e.scopedMetadataKey.toHex(),value:e.value},o.push(d)}),o}catch(d){throw d}}}export{J as M};