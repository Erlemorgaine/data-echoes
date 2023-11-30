import{d as L,u as E,B as N,r as U,c as x,a as G,t as z,i as c,f as I,w as f,j as m,S as B,n as D,o as u,g as _,k as H,l as g,m as p,_ as J}from"./index-a7d96f00.js";var i=typeof globalThis<"u"?globalThis:typeof window<"u"?window:typeof global<"u"?global:typeof self<"u"?self:{};function W(e){return e&&e.__esModule&&Object.prototype.hasOwnProperty.call(e,"default")?e.default:e}var Z=typeof i=="object"&&i&&i.Object===Object&&i,q=Z,Y=q,K=typeof self=="object"&&self&&self.Object===Object&&self,Q=Y||K||Function("return this")(),X=Q,ee=X,re=ee.Symbol,b=re;function te(e,r){for(var t=-1,a=e==null?0:e.length,o=Array(a);++t<a;)o[t]=r(e[t],t,e);return o}var ae=te,oe=Array.isArray,ne=oe,v=b,j=Object.prototype,se=j.hasOwnProperty,ie=j.toString,n=v?v.toStringTag:void 0;function ce(e){var r=se.call(e,n),t=e[n];try{e[n]=void 0;var a=!0}catch{}var o=ie.call(e);return a&&(r?e[n]=t:delete e[n]),o}var fe=ce,ue=Object.prototype,le=ue.toString;function de(e){return le.call(e)}var be=de,y=b,me=fe,_e=be,ge="[object Null]",pe="[object Undefined]",S=y?y.toStringTag:void 0;function ve(e){return e==null?e===void 0?pe:ge:S&&S in Object(e)?me(e):_e(e)}var ye=ve;function Se(e){return e!=null&&typeof e=="object"}var Te=Se,he=ye,$e=Te,je="[object Symbol]";function Ae(e){return typeof e=="symbol"||$e(e)&&he(e)==je}var Oe=Ae,T=b,we=ae,Re=ne,Ce=Oe,ke=1/0,h=T?T.prototype:void 0,$=h?h.toString:void 0;function A(e){if(typeof e=="string")return e;if(Re(e))return we(e,A)+"";if(Ce(e))return $?$.call(e):"";var r=e+"";return r=="0"&&1/e==-ke?"-0":r}var Me=A,Ve=Me;function Pe(e){return e==null?"":Ve(e)}var O=Pe;function Fe(e,r,t){var a=-1,o=e.length;r<0&&(r=-r>o?0:o+r),t=t>o?o:t,t<0&&(t+=o),o=r>t?0:t-r>>>0,r>>>=0;for(var s=Array(o);++a<o;)s[a]=e[a+r];return s}var Le=Fe,Ee=Le;function Ne(e,r,t){var a=e.length;return t=t===void 0?a:t,!r&&t>=a?e:Ee(e,r,t)}var Ue=Ne,xe="\\ud800-\\udfff",Ge="\\u0300-\\u036f",ze="\\ufe20-\\ufe2f",Ie="\\u20d0-\\u20ff",Be=Ge+ze+Ie,De="\\ufe0e\\ufe0f",He="\\u200d",Je=RegExp("["+He+xe+Be+De+"]");function We(e){return Je.test(e)}var w=We;function Ze(e){return e.split("")}var qe=Ze,R="\\ud800-\\udfff",Ye="\\u0300-\\u036f",Ke="\\ufe20-\\ufe2f",Qe="\\u20d0-\\u20ff",Xe=Ye+Ke+Qe,er="\\ufe0e\\ufe0f",rr="["+R+"]",l="["+Xe+"]",d="\\ud83c[\\udffb-\\udfff]",tr="(?:"+l+"|"+d+")",C="[^"+R+"]",k="(?:\\ud83c[\\udde6-\\uddff]){2}",M="[\\ud800-\\udbff][\\udc00-\\udfff]",ar="\\u200d",V=tr+"?",P="["+er+"]?",or="(?:"+ar+"(?:"+[C,k,M].join("|")+")"+P+V+")*",nr=P+V+or,sr="(?:"+[C+l+"?",l,k,M,rr].join("|")+")",ir=RegExp(d+"(?="+d+")|"+sr+nr,"g");function cr(e){return e.match(ir)||[]}var fr=cr,ur=qe,lr=w,dr=fr;function br(e){return lr(e)?dr(e):ur(e)}var mr=br,_r=Ue,gr=w,pr=mr,vr=O;function yr(e){return function(r){r=vr(r);var t=gr(r)?pr(r):void 0,a=t?t[0]:r.charAt(0),o=t?_r(t,1).join(""):r.slice(1);return a[e]()+o}}var Sr=yr,Tr=Sr,hr=Tr("toUpperCase"),$r=hr,jr=O,Ar=$r;function Or(e){return Ar(jr(e).toLowerCase())}var wr=Or;const Rr=W(wr),Cr={class:"theme-view__theme"},kr=L({__name:"ThemeView",setup(e){const r=g(()=>p(()=>import("./NostalgiaPage-1db5c41b.js"),["assets/NostalgiaPage-1db5c41b.js","assets/globals-bb5ae017.js","assets/index-a7d96f00.js","assets/index-0270e627.css","assets/NostalgiaPage-663fb2fe.css"])),t=g(()=>p(()=>import("./MusicPage-823f697a.js"),["assets/MusicPage-823f697a.js","assets/index-a7d96f00.js","assets/index-0270e627.css","assets/globals-bb5ae017.js","assets/MusicPage-17acfc25.css"])),a=E(),o={nostalgia:{component:r,dark:!0},music:{component:t,dark:!1}};return N({title:Rr(a.params.theme)}),(s,Vr)=>{const F=U("RouterLink");return u(),x("div",{class:D(["theme-view",{dark:o[c(a).params.theme].dark}])},[G("h1",Cr,z(c(a).params.theme),1),I(F,{class:"theme-view__back-btn",to:{name:"home"}},{default:f(()=>[_("home")]),_:1}),(u(),m(B,null,{default:f(()=>[(u(),m(H(o[c(a).params.theme].component)))]),fallback:f(()=>[_(" Loading ... ")]),_:1}))],2)}}});const Mr=J(kr,[["__scopeId","data-v-878b6184"]]),Fr=Object.freeze(Object.defineProperty({__proto__:null,default:Mr},Symbol.toStringTag,{value:"Module"}));export{Fr as T,ye as _,X as a,b,i as c,Te as d,q as e,Oe as f,W as g,ne as i,O as t,$r as u};