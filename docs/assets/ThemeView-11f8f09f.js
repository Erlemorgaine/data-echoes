import{d as I,l as N,B as x,c as U,a as G,t as z,u as v,i as B,w as l,m as y,S as H,e as J,q,g as W,h as d,j as h,s as Z,v as s,x as i,_ as K}from"./index-a23e43c2.js";var f=typeof globalThis<"u"?globalThis:typeof window<"u"?window:typeof global<"u"?global:typeof self<"u"?self:{};function Y(e){return e&&e.__esModule&&Object.prototype.hasOwnProperty.call(e,"default")?e.default:e}function Nr(e){if(e.__esModule)return e;var t=e.default;if(typeof t=="function"){var r=function o(){return this instanceof o?Reflect.construct(t,arguments,this.constructor):t.apply(this,arguments)};r.prototype=t.prototype}else r={};return Object.defineProperty(r,"__esModule",{value:!0}),Object.keys(e).forEach(function(o){var a=Object.getOwnPropertyDescriptor(e,o);Object.defineProperty(r,o,a.get?a:{enumerable:!0,get:function(){return e[o]}})}),r}var Q=typeof f=="object"&&f&&f.Object===Object&&f,X=Q,ee=X,re=typeof self=="object"&&self&&self.Object===Object&&self,te=ee||re||Function("return this")(),oe=te,ae=oe,ne=ae.Symbol,m=ne;function se(e,t){for(var r=-1,o=e==null?0:e.length,a=Array(o);++r<o;)a[r]=t(e[r],r,e);return a}var ie=se,ce=Array.isArray,ue=ce,S=m,R=Object.prototype,fe=R.hasOwnProperty,le=R.toString,c=S?S.toStringTag:void 0;function de(e){var t=fe.call(e,c),r=e[c];try{e[c]=void 0;var o=!0}catch{}var a=le.call(e);return o&&(t?e[c]=r:delete e[c]),a}var _e=de,pe=Object.prototype,me=pe.toString;function be(e){return me.call(e)}var ge=be,T=m,ve=_e,ye=ge,he="[object Null]",Se="[object Undefined]",$=T?T.toStringTag:void 0;function Te(e){return e==null?e===void 0?Se:he:$&&$ in Object(e)?ve(e):ye(e)}var $e=Te;function je(e){return e!=null&&typeof e=="object"}var Oe=je,Ae=$e,Re=Oe,we="[object Symbol]";function Ce(e){return typeof e=="symbol"||Re(e)&&Ae(e)==we}var ke=Ce,j=m,Pe=ie,Ee=ue,Me=ke,Ve=1/0,O=j?j.prototype:void 0,A=O?O.toString:void 0;function w(e){if(typeof e=="string")return e;if(Ee(e))return Pe(e,w)+"";if(Me(e))return A?A.call(e):"";var t=e+"";return t=="0"&&1/e==-Ve?"-0":t}var Le=w,Fe=Le;function De(e){return e==null?"":Fe(e)}var C=De;function Ie(e,t,r){var o=-1,a=e.length;t<0&&(t=-t>a?0:a+t),r=r>a?a:r,r<0&&(r+=a),a=t>r?0:r-t>>>0,t>>>=0;for(var n=Array(a);++o<a;)n[o]=e[o+t];return n}var Ne=Ie,xe=Ne;function Ue(e,t,r){var o=e.length;return r=r===void 0?o:r,!t&&r>=o?e:xe(e,t,r)}var Ge=Ue,ze="\\ud800-\\udfff",Be="\\u0300-\\u036f",He="\\ufe20-\\ufe2f",Je="\\u20d0-\\u20ff",qe=Be+He+Je,We="\\ufe0e\\ufe0f",Ze="\\u200d",Ke=RegExp("["+Ze+ze+qe+We+"]");function Ye(e){return Ke.test(e)}var k=Ye;function Qe(e){return e.split("")}var Xe=Qe,P="\\ud800-\\udfff",er="\\u0300-\\u036f",rr="\\ufe20-\\ufe2f",tr="\\u20d0-\\u20ff",or=er+rr+tr,ar="\\ufe0e\\ufe0f",nr="["+P+"]",_="["+or+"]",p="\\ud83c[\\udffb-\\udfff]",sr="(?:"+_+"|"+p+")",E="[^"+P+"]",M="(?:\\ud83c[\\udde6-\\uddff]){2}",V="[\\ud800-\\udbff][\\udc00-\\udfff]",ir="\\u200d",L=sr+"?",F="["+ar+"]?",cr="(?:"+ir+"(?:"+[E,M,V].join("|")+")"+F+L+")*",ur=F+L+cr,fr="(?:"+[E+_+"?",_,M,V,nr].join("|")+")",lr=RegExp(p+"(?="+p+")|"+fr+ur,"g");function dr(e){return e.match(lr)||[]}var _r=dr,pr=Xe,mr=k,br=_r;function gr(e){return mr(e)?br(e):pr(e)}var vr=gr,yr=Ge,hr=k,Sr=vr,Tr=C;function $r(e){return function(t){t=Tr(t);var r=hr(t)?Sr(t):void 0,o=r?r[0]:t.charAt(0),a=r?yr(r,1).join(""):t.slice(1);return o[e]()+a}}var jr=$r,Or=jr,Ar=Or("toUpperCase"),Rr=Ar,wr=C,Cr=Rr;function kr(e){return Cr(wr(e).toLowerCase())}var Pr=kr;const Er=Y(Pr),Mr={class:"theme-view__theme"},Vr=I({__name:"ThemeView",setup(e){const t=s(()=>i(()=>import("./NostalgiaPage-873a0874.js"),["assets/NostalgiaPage-873a0874.js","assets/sumBy-73281da8.js","assets/globals-eebd16d7.js","assets/index-a23e43c2.js","assets/index-4a3519f6.css","assets/AppModal-1f653710.js","assets/AppModal-8491b7b7.css","assets/NostalgiaPage-5584004a.css"])),r=s(()=>i(()=>import("./MoviesPage-0a63721f.js"),["assets/MoviesPage-0a63721f.js","assets/index-a23e43c2.js","assets/index-4a3519f6.css","assets/MoviesPage-45c4d5f8.css"])),o=s(()=>i(()=>import("./MusicPage-aa5237bf.js"),["assets/MusicPage-aa5237bf.js","assets/index-a23e43c2.js","assets/index-4a3519f6.css","assets/globals-eebd16d7.js","assets/sumBy-73281da8.js","assets/MusicPage-cd1b159e.css"])),a=s(()=>i(()=>import("./CulturePage-980b3810.js"),["assets/CulturePage-980b3810.js","assets/index-a23e43c2.js","assets/index-4a3519f6.css","assets/globals-eebd16d7.js","assets/AppModal-1f653710.js","assets/AppModal-8491b7b7.css","assets/CulturePage-070f742a.css"])),n=s(()=>i(()=>import("./PresidentsRoyalsPage-1dc61a87.js"),["assets/PresidentsRoyalsPage-1dc61a87.js","assets/globals-eebd16d7.js","assets/index-a23e43c2.js","assets/index-4a3519f6.css","assets/PresidentsRoyalsPage-70aa835c.css"])),u=q(),b={nostalgia:{component:t,dark:!0},music:{component:o,dark:!1},culture:{component:a,dark:!0},"presidents-royals":{component:n,dark:!0},movies:{component:r,dark:!1}},g=N(()=>u.params.theme);return x({title:Er(u.params.theme).replaceAll("-"," ")}),(Fr,Dr)=>{const D=W("RouterLink");return d(),U("article",{id:"theme-view",class:J(["theme-view",g.value,{dark:b[g.value].dark}])},[G("h1",Mr,z(v(u).params.theme),1),B(D,{class:"theme-view__back-btn",to:{name:"home"}},{default:l(()=>[h("home")]),_:1}),(d(),y(H,null,{default:l(()=>[(d(),y(Z(b[v(u).params.theme].component)))]),fallback:l(()=>[h(" Loading ... ")]),_:1}))],2)}}});const Lr=K(Vr,[["__scopeId","data-v-167c7784"]]),xr=Object.freeze(Object.defineProperty({__proto__:null,default:Lr},Symbol.toStringTag,{value:"Module"}));export{xr as T,$e as _,Nr as a,oe as b,f as c,m as d,Oe as e,X as f,Y as g,ke as h,ue as i,C as t,Rr as u};
