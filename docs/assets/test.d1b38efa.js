import{V as s,s as t}from"./vue-class-component.esm-bundler.47d45929.js";import{u as a,v as e,x as o,y as r,z as l,o as n,c as u,a as i,t as c,e as h}from"./vendor.a60aa299.js";class f{constructor(){this.ob={g:0},this.a=r(this.ob)}start(){this.t=setInterval((()=>{this.ob.g++,this.a.value=this.ob,l(this.a)}))}destroy(){clearInterval(this.t)}}class v extends s{constructor(){super(...arguments),this.game=t((()=>(()=>{const s=a(null),t=a(null),r=new f;return e((()=>{r.start()})),o((()=>{r.destroy()})),{setRefRef:t=>{s.value=t},setShallowRef:s=>{t.value=s},obj:r}})()))}}const d=h("shallowRef ");v.render=function(s,t,a,e,o,r){return n(),u("div",null,[d,i("b",{ref:s.game.setRefRef},c(s.game.obj.a.value),513)])};export{v as default};