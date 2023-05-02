import{a2 as x,a3 as ie,k as M,a4 as oe,A as P}from"./index-eab3c8f7.js";var I={},se={get exports(){return I},set exports(v){I=v}},U={},ue={get exports(){return U},set exports(v){U=v}};function fe(v){throw new Error('Could not dynamically require "'+v+'". Please configure the dynamicRequireTargets or/and ignoreDynamicRequires option of @rollup/plugin-commonjs appropriately for this require call to work.')}var B,F;function le(){if(F)return B;F=1;var v=null;return B=v,B}var E,Q;function ce(){if(Q)return E;Q=1;function v(l){if(typeof l!="string")throw new TypeError("Path must be a string. Received "+JSON.stringify(l))}function n(l,r){for(var e="",a=0,i=-1,u=0,t,s=0;s<=l.length;++s){if(s<l.length)t=l.charCodeAt(s);else{if(t===47)break;t=47}if(t===47){if(!(i===s-1||u===1))if(i!==s-1&&u===2){if(e.length<2||a!==2||e.charCodeAt(e.length-1)!==46||e.charCodeAt(e.length-2)!==46){if(e.length>2){var d=e.lastIndexOf("/");if(d!==e.length-1){d===-1?(e="",a=0):(e=e.slice(0,d),a=e.length-1-e.lastIndexOf("/")),i=s,u=0;continue}}else if(e.length===2||e.length===1){e="",a=0,i=s,u=0;continue}}r&&(e.length>0?e+="/..":e="..",a=2)}else e.length>0?e+="/"+l.slice(i+1,s):e=l.slice(i+1,s),a=s-i-1;i=s,u=0}else t===46&&u!==-1?++u:u=-1}return e}function m(l,r){var e=r.dir||r.root,a=r.base||(r.name||"")+(r.ext||"");return e?e===r.root?e+a:e+l+a:a}var o={resolve:function(){for(var r="",e=!1,a,i=arguments.length-1;i>=-1&&!e;i--){var u;i>=0?u=arguments[i]:(a===void 0&&(a=x.cwd()),u=a),v(u),u.length!==0&&(r=u+"/"+r,e=u.charCodeAt(0)===47)}return r=n(r,!e),e?r.length>0?"/"+r:"/":r.length>0?r:"."},normalize:function(r){if(v(r),r.length===0)return".";var e=r.charCodeAt(0)===47,a=r.charCodeAt(r.length-1)===47;return r=n(r,!e),r.length===0&&!e&&(r="."),r.length>0&&a&&(r+="/"),e?"/"+r:r},isAbsolute:function(r){return v(r),r.length>0&&r.charCodeAt(0)===47},join:function(){if(arguments.length===0)return".";for(var r,e=0;e<arguments.length;++e){var a=arguments[e];v(a),a.length>0&&(r===void 0?r=a:r+="/"+a)}return r===void 0?".":o.normalize(r)},relative:function(r,e){if(v(r),v(e),r===e||(r=o.resolve(r),e=o.resolve(e),r===e))return"";for(var a=1;a<r.length&&r.charCodeAt(a)===47;++a);for(var i=r.length,u=i-a,t=1;t<e.length&&e.charCodeAt(t)===47;++t);for(var s=e.length,d=s-t,g=u<d?u:d,w=-1,h=0;h<=g;++h){if(h===g){if(d>g){if(e.charCodeAt(t+h)===47)return e.slice(t+h+1);if(h===0)return e.slice(t+h)}else u>g&&(r.charCodeAt(a+h)===47?w=h:h===0&&(w=0));break}var T=r.charCodeAt(a+h),k=e.charCodeAt(t+h);if(T!==k)break;T===47&&(w=h)}var _="";for(h=a+w+1;h<=i;++h)(h===i||r.charCodeAt(h)===47)&&(_.length===0?_+="..":_+="/..");return _.length>0?_+e.slice(t+w):(t+=w,e.charCodeAt(t)===47&&++t,e.slice(t))},_makeLong:function(r){return r},dirname:function(r){if(v(r),r.length===0)return".";for(var e=r.charCodeAt(0),a=e===47,i=-1,u=!0,t=r.length-1;t>=1;--t)if(e=r.charCodeAt(t),e===47){if(!u){i=t;break}}else u=!1;return i===-1?a?"/":".":a&&i===1?"//":r.slice(0,i)},basename:function(r,e){if(e!==void 0&&typeof e!="string")throw new TypeError('"ext" argument must be a string');v(r);var a=0,i=-1,u=!0,t;if(e!==void 0&&e.length>0&&e.length<=r.length){if(e.length===r.length&&e===r)return"";var s=e.length-1,d=-1;for(t=r.length-1;t>=0;--t){var g=r.charCodeAt(t);if(g===47){if(!u){a=t+1;break}}else d===-1&&(u=!1,d=t+1),s>=0&&(g===e.charCodeAt(s)?--s===-1&&(i=t):(s=-1,i=d))}return a===i?i=d:i===-1&&(i=r.length),r.slice(a,i)}else{for(t=r.length-1;t>=0;--t)if(r.charCodeAt(t)===47){if(!u){a=t+1;break}}else i===-1&&(u=!1,i=t+1);return i===-1?"":r.slice(a,i)}},extname:function(r){v(r);for(var e=-1,a=0,i=-1,u=!0,t=0,s=r.length-1;s>=0;--s){var d=r.charCodeAt(s);if(d===47){if(!u){a=s+1;break}continue}i===-1&&(u=!1,i=s+1),d===46?e===-1?e=s:t!==1&&(t=1):e!==-1&&(t=-1)}return e===-1||i===-1||t===0||t===1&&e===i-1&&e===a+1?"":r.slice(e,i)},format:function(r){if(r===null||typeof r!="object")throw new TypeError('The "pathObject" argument must be of type Object. Received type '+typeof r);return m("/",r)},parse:function(r){v(r);var e={root:"",dir:"",base:"",ext:"",name:""};if(r.length===0)return e;var a=r.charCodeAt(0),i=a===47,u;i?(e.root="/",u=1):u=0;for(var t=-1,s=0,d=-1,g=!0,w=r.length-1,h=0;w>=u;--w){if(a=r.charCodeAt(w),a===47){if(!g){s=w+1;break}continue}d===-1&&(g=!1,d=w+1),a===46?t===-1?t=w:h!==1&&(h=1):t!==-1&&(h=-1)}return t===-1||d===-1||h===0||h===1&&t===d-1&&t===s+1?d!==-1&&(s===0&&i?e.base=e.name=r.slice(1,d):e.base=e.name=r.slice(s,d)):(s===0&&i?(e.name=r.slice(1,t),e.base=r.slice(1,d)):(e.name=r.slice(s,t),e.base=r.slice(s,d)),e.ext=r.slice(t,d)),s>0?e.dir=r.slice(0,s-1):i&&(e.dir="/"),e},sep:"/",delimiter:":",win32:null,posix:null};return o.posix=o,E=o,E}var y={},O;function ve(){return O||(O=1,y.endianness=function(){return"LE"},y.hostname=function(){return typeof location<"u"?location.hostname:""},y.loadavg=function(){return[]},y.uptime=function(){return 0},y.freemem=function(){return Number.MAX_VALUE},y.totalmem=function(){return Number.MAX_VALUE},y.cpus=function(){return[]},y.type=function(){return"Browser"},y.release=function(){return typeof navigator<"u"?navigator.appVersion:""},y.networkInterfaces=y.getNetworkInterfaces=function(){return{}},y.arch=function(){return"javascript"},y.platform=function(){return"browser"},y.tmpdir=y.tmpDir=function(){return"/tmp"},y.EOL=`
`,y.homedir=function(){return"/"}),y}var R,Z;function de(){if(Z)return R;Z=1;var v=le(),n=ce(),m=ve(),o=typeof __webpack_require__=="function"?__non_webpack_require__:fe,l=x.config&&x.config.variables||{},r=!!{}.PREBUILDS_ONLY,e=x.versions.modules,a=Y()?"electron":W()?"node-webkit":"node",i={}.npm_config_arch||m.arch(),u={}.npm_config_platform||m.platform(),t={}.LIBC||(ee(u)?"musl":"glibc"),s={}.ARM_VERSION||(i==="arm64"?"8":l.arm_version)||"",d=(x.versions.uv||"").split(".")[0];R=g;function g(f){return o(g.resolve(f))}g.resolve=g.path=function(f){f=n.resolve(f||".");try{var p=o(n.join(f,"package.json")).name.toUpperCase().replace(/-/g,"_");x.env[p+"_PREBUILD"]&&(f=x.env[p+"_PREBUILD"])}catch{}if(!r){var c=h(n.join(f,"build/Release"),T);if(c)return c;var b=h(n.join(f,"build/Debug"),T);if(b)return b}var C=K(f);if(C)return C;var A=K(n.dirname(x.execPath));if(A)return A;var re=["platform="+u,"arch="+i,"runtime="+a,"abi="+e,"uv="+d,s?"armv="+s:"","libc="+t,"node="+x.versions.node,x.versions.electron?"electron="+x.versions.electron:"",typeof __webpack_require__=="function"?"webpack=true":""].filter(Boolean).join(" ");throw new Error("No native build was found for "+re+`
    loaded from: `+f+`
`);function K(q){var te=w(n.join(q,"prebuilds")).map(k),j=te.filter(_(u,i)).sort(L)[0];if(j){var V=n.join(q,"prebuilds",j.name),ne=w(V).map(H),ae=ne.filter(N(a,e)),G=ae.sort(D(a))[0];if(G)return n.join(V,G.file)}}};function w(f){try{return v.readdirSync(f)}catch{return[]}}function h(f,p){var c=w(f).filter(p);return c[0]&&n.join(f,c[0])}function T(f){return/\.node$/.test(f)}function k(f){var p=f.split("-");if(p.length===2){var c=p[0],b=p[1].split("+");if(c&&b.length&&b.every(Boolean))return{name:f,platform:c,architectures:b}}}function _(f,p){return function(c){return c==null||c.platform!==f?!1:c.architectures.includes(p)}}function L(f,p){return f.architectures.length-p.architectures.length}function H(f){var p=f.split("."),c=p.pop(),b={file:f,specificity:0};if(c==="node"){for(var C=0;C<p.length;C++){var A=p[C];if(A==="node"||A==="electron"||A==="node-webkit")b.runtime=A;else if(A==="napi")b.napi=!0;else if(A.slice(0,3)==="abi")b.abi=A.slice(3);else if(A.slice(0,2)==="uv")b.uv=A.slice(2);else if(A.slice(0,4)==="armv")b.armv=A.slice(4);else if(A==="glibc"||A==="musl")b.libc=A;else continue;b.specificity++}return b}}function N(f,p){return function(c){return!(c==null||c.runtime!==f&&!J(c)||c.abi!==p&&!c.napi||c.uv&&c.uv!==d||c.armv&&c.armv!==s||c.libc&&c.libc!==t)}}function J(f){return f.runtime==="node"&&f.napi}function D(f){return function(p,c){return p.runtime!==c.runtime?p.runtime===f?-1:1:p.abi!==c.abi?p.abi?-1:1:p.specificity!==c.specificity?p.specificity>c.specificity?-1:1:0}}function W(){return!!(x.versions&&x.versions.nw)}function Y(){return x.versions&&x.versions.electron||{}.ELECTRON_RUN_AS_NODE?!0:typeof window<"u"&&window.process&&window.process.type==="renderer"}function ee(f){return f==="linux"&&v.existsSync("/etc/alpine-release")}return g.parseTags=H,g.matchTags=N,g.compareTags=D,g.parseTuple=k,g.matchTuple=_,g.compareTuples=L,R}var z;function me(){return z||(z=1,function(v){typeof x.addon=="function"?v.exports=x.addon.bind(x):v.exports=de()}(ue)),U}var S,$;function he(){if($)return S;$=1;function v(n){const m=n.length;let o=0;for(;o<m;)if(!(n[o]&128))o++;else if((n[o]&224)===192){if(o+1===m||(n[o+1]&192)!==128||(n[o]&254)===192)return!1;o+=2}else if((n[o]&240)===224){if(o+2>=m||(n[o+1]&192)!==128||(n[o+2]&192)!==128||n[o]===224&&(n[o+1]&224)===128||n[o]===237&&(n[o+1]&224)===160)return!1;o+=3}else if((n[o]&248)===240){if(o+3>=m||(n[o+1]&192)!==128||(n[o+2]&192)!==128||(n[o+3]&192)!==128||n[o]===240&&(n[o+1]&240)===128||n[o]===244&&n[o+1]>143||n[o]>244)return!1;o+=4}else return!1;return!0}return S=v,S}(function(v){try{v.exports=me()(__dirname)}catch{v.exports=he()}})(se);const pe=ie(I);class X{static removeDoubleZero(n){return n.endsWith("00")&&(n=n.substring(0,n.length-2),n=this.removeDoubleZero(n)),n}static convertUtf8(n){n=X.removeDoubleZero(n);const m=M.Convert.hexToUint8(n);return pe(oe.Buffer.from(m))&&(n=M.Convert.decodeHexToUtf8(n)),n}static async getAccountMetadata(n){if(!P.chainAPI)throw new Error("Service Unavailable");try{let m;const o=[],l=new M.MetadataQueryParams;return l.metadataType=M.MetadataType.ACCOUNT,l.targetKey=n,(await P.chainAPI.metadataAPI.searchMetadatas(l)).metadataEntries.forEach(e=>{m={scopedMetadataKeyUtf8:e.scopedMetadataKey.toHex()==this.convertUtf8(e.scopedMetadataKey.toHex())?null:this.convertUtf8(e.scopedMetadataKey.toHex()),scopedMetadataKeyHex:e.scopedMetadataKey.toHex(),value:e.value},o.push(m)}),o}catch(m){throw m}}static async getAssetMetadata(n){if(!P.chainAPI)throw new Error("Service Unavailable");try{let m;const o=[],l=new M.MetadataQueryParams;return l.metadataType=M.MetadataType.MOSAIC,l.targetId=new M.MosaicId(n),(await P.chainAPI.metadataAPI.searchMetadatas(l)).metadataEntries.forEach(e=>{m={scopedMetadataKeyUtf8:e.scopedMetadataKey.toHex()==this.convertUtf8(e.scopedMetadataKey.toHex())?null:this.convertUtf8(e.scopedMetadataKey.toHex()),scopedMetadataKeyHex:e.scopedMetadataKey.toHex(),value:e.value},o.push(m)}),o}catch(m){throw m}}static async getNamespaceMetadata(n){if(!P.chainAPI)throw new Error("Service Unavailable");try{let m;const o=[],l=new M.MetadataQueryParams;return l.metadataType=M.MetadataType.NAMESPACE,l.targetId=new M.NamespaceId(n),(await P.chainAPI.metadataAPI.searchMetadatas(l)).metadataEntries.forEach(e=>{m={scopedMetadataKeyUtf8:e.scopedMetadataKey.toHex()==this.convertUtf8(e.scopedMetadataKey.toHex())?null:this.convertUtf8(e.scopedMetadataKey.toHex()),scopedMetadataKeyHex:e.scopedMetadataKey.toHex(),value:e.value},o.push(m)}),o}catch(m){throw m}}}export{X as M};
