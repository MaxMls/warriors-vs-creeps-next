import{A as e}from"./index.92c54a80.js";import{R as a}from"./common.44480256.js";import{_ as r,R as o}from"./request-error.8cc07275.js";import{d as s,J as t,K as m,L as l,u as n,v as u,O as i,r as f,o as c,E as v,w as d,e as p,t as g}from"./vendor.a60aa299.js";var b=s({components:{Form:r},setup(){const r=t(m(e)),s=l(),f=n({values:{name:""},errors:{name:null}});return u((()=>{let e=localStorage.getItem("name");f.value.values.name=e||""})),i(f.value.values,(()=>{localStorage.setItem("name",f.value.values.name)})),{form:f,fields:[{name:"name",label:"form.0"}],async submit(){var e,t;const{name:m}=f.value.values;if(m)if(m.length>25)f.value.errors.name="form.3";else try{const o=null!=(e=localStorage.getItem("skin"))?e:"ame";null==(t=r.room)||t.destroy(),r.room=new a,r.room.setCurrentPlayerData({skin:o,name:m}),await s.push("/room")}catch(l){if(!(l instanceof o))throw l;f.value.errors=l.data}else f.value.errors.name="form.2"}}}});b.render=function(e,a,r,o,s,t){const m=f("Form");return c(),v(m,{fields:e.fields,modelValue:e.form,"onUpdate:modelValue":a[0]||(a[0]=a=>e.form=a),onFormSubmit:e.submit},{title:d((()=>[p(g(e.$t("pages.create.8803")),1)])),next:d((()=>[p(g(e.$t("pages.create.6548")),1)])),_:1},8,["fields","modelValue","onFormSubmit"])};export{b as default};
