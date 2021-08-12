let e=e=>crypto.getRandomValues(new Uint8Array(e));var t,n={exports:{}},r="object"==typeof Reflect?Reflect:null,o=r&&"function"==typeof r.apply?r.apply:function(e,t,n){return Function.prototype.apply.call(e,t,n)};t=r&&"function"==typeof r.ownKeys?r.ownKeys:Object.getOwnPropertySymbols?function(e){return Object.getOwnPropertyNames(e).concat(Object.getOwnPropertySymbols(e))}:function(e){return Object.getOwnPropertyNames(e)};var s=Number.isNaN||function(e){return e!=e};function i(){i.init.call(this)}n.exports=i,n.exports.once=function(e,t){return new Promise((function(n,r){function o(n){e.removeListener(t,s),r(n)}function s(){"function"==typeof e.removeListener&&e.removeListener("error",o),n([].slice.call(arguments))}m(e,t,s,{once:!0}),"error"!==t&&function(e,t,n){"function"==typeof e.on&&m(e,"error",t,n)}(e,o,{once:!0})}))},i.EventEmitter=i,i.prototype._events=void 0,i.prototype._eventsCount=0,i.prototype._maxListeners=void 0;var a=10;function l(e){if("function"!=typeof e)throw new TypeError('The "listener" argument must be of type Function. Received type '+typeof e)}function h(e){return void 0===e._maxListeners?i.defaultMaxListeners:e._maxListeners}function c(e,t,n,r){var o,s,i,a;if(l(n),void 0===(s=e._events)?(s=e._events=Object.create(null),e._eventsCount=0):(void 0!==s.newListener&&(e.emit("newListener",t,n.listener?n.listener:n),s=e._events),i=s[t]),void 0===i)i=s[t]=n,++e._eventsCount;else if("function"==typeof i?i=s[t]=r?[n,i]:[i,n]:r?i.unshift(n):i.push(n),(o=h(e))>0&&i.length>o&&!i.warned){i.warned=!0;var c=new Error("Possible EventEmitter memory leak detected. "+i.length+" "+String(t)+" listeners added. Use emitter.setMaxListeners() to increase limit");c.name="MaxListenersExceededWarning",c.emitter=e,c.type=t,c.count=i.length,a=c,console&&console.warn&&console.warn(a)}return e}function u(){if(!this.fired)return this.target.removeListener(this.type,this.wrapFn),this.fired=!0,0===arguments.length?this.listener.call(this.target):this.listener.apply(this.target,arguments)}function p(e,t,n){var r={fired:!1,wrapFn:void 0,target:e,type:t,listener:n},o=u.bind(r);return o.listener=n,r.wrapFn=o,o}function f(e,t,n){var r=e._events;if(void 0===r)return[];var o=r[t];return void 0===o?[]:"function"==typeof o?n?[o.listener||o]:[o]:n?function(e){for(var t=new Array(e.length),n=0;n<t.length;++n)t[n]=e[n].listener||e[n];return t}(o):v(o,o.length)}function d(e){var t=this._events;if(void 0!==t){var n=t[e];if("function"==typeof n)return 1;if(void 0!==n)return n.length}return 0}function v(e,t){for(var n=new Array(t),r=0;r<t;++r)n[r]=e[r];return n}function m(e,t,n,r){if("function"==typeof e.on)r.once?e.once(t,n):e.on(t,n);else{if("function"!=typeof e.addEventListener)throw new TypeError('The "emitter" argument must be of type EventEmitter. Received type '+typeof e);e.addEventListener(t,(function o(s){r.once&&e.removeEventListener(t,o),n(s)}))}}Object.defineProperty(i,"defaultMaxListeners",{enumerable:!0,get:function(){return a},set:function(e){if("number"!=typeof e||e<0||s(e))throw new RangeError('The value of "defaultMaxListeners" is out of range. It must be a non-negative number. Received '+e+".");a=e}}),i.init=function(){void 0!==this._events&&this._events!==Object.getPrototypeOf(this)._events||(this._events=Object.create(null),this._eventsCount=0),this._maxListeners=this._maxListeners||void 0},i.prototype.setMaxListeners=function(e){if("number"!=typeof e||e<0||s(e))throw new RangeError('The value of "n" is out of range. It must be a non-negative number. Received '+e+".");return this._maxListeners=e,this},i.prototype.getMaxListeners=function(){return h(this)},i.prototype.emit=function(e){for(var t=[],n=1;n<arguments.length;n++)t.push(arguments[n]);var r="error"===e,s=this._events;if(void 0!==s)r=r&&void 0===s.error;else if(!r)return!1;if(r){var i;if(t.length>0&&(i=t[0]),i instanceof Error)throw i;var a=new Error("Unhandled error."+(i?" ("+i.message+")":""));throw a.context=i,a}var l=s[e];if(void 0===l)return!1;if("function"==typeof l)o(l,this,t);else{var h=l.length,c=v(l,h);for(n=0;n<h;++n)o(c[n],this,t)}return!0},i.prototype.addListener=function(e,t){return c(this,e,t,!1)},i.prototype.on=i.prototype.addListener,i.prototype.prependListener=function(e,t){return c(this,e,t,!0)},i.prototype.once=function(e,t){return l(t),this.on(e,p(this,e,t)),this},i.prototype.prependOnceListener=function(e,t){return l(t),this.prependListener(e,p(this,e,t)),this},i.prototype.removeListener=function(e,t){var n,r,o,s,i;if(l(t),void 0===(r=this._events))return this;if(void 0===(n=r[e]))return this;if(n===t||n.listener===t)0==--this._eventsCount?this._events=Object.create(null):(delete r[e],r.removeListener&&this.emit("removeListener",e,n.listener||t));else if("function"!=typeof n){for(o=-1,s=n.length-1;s>=0;s--)if(n[s]===t||n[s].listener===t){i=n[s].listener,o=s;break}if(o<0)return this;0===o?n.shift():function(e,t){for(;t+1<e.length;t++)e[t]=e[t+1];e.pop()}(n,o),1===n.length&&(r[e]=n[0]),void 0!==r.removeListener&&this.emit("removeListener",e,i||t)}return this},i.prototype.off=i.prototype.removeListener,i.prototype.removeAllListeners=function(e){var t,n,r;if(void 0===(n=this._events))return this;if(void 0===n.removeListener)return 0===arguments.length?(this._events=Object.create(null),this._eventsCount=0):void 0!==n[e]&&(0==--this._eventsCount?this._events=Object.create(null):delete n[e]),this;if(0===arguments.length){var o,s=Object.keys(n);for(r=0;r<s.length;++r)"removeListener"!==(o=s[r])&&this.removeAllListeners(o);return this.removeAllListeners("removeListener"),this._events=Object.create(null),this._eventsCount=0,this}if("function"==typeof(t=n[e]))this.removeListener(e,t);else if(void 0!==t)for(r=t.length-1;r>=0;r--)this.removeListener(e,t[r]);return this},i.prototype.listeners=function(e){return f(this,e,!0)},i.prototype.rawListeners=function(e){return f(this,e,!1)},i.listenerCount=function(e,t){return"function"==typeof e.listenerCount?e.listenerCount(t):d.call(e,t)},i.prototype.listenerCount=d,i.prototype.eventNames=function(){return this._eventsCount>0?t(this._events):[]};var y=n.exports;const g=((e,t,n)=>{let r=(2<<Math.log(e.length-1)/Math.LN2)-1,o=-~(1.6*r*t/e.length);return()=>{let s="";for(;;){let i=n(o),a=o;for(;a--;)if(s+=e[i[a]&r]||"",s.length===t)return s}}})("abdefghijklmnqrstuvxyzABDEFGHIJKLMNQRSTUVXYZ0123456789-_",15,e);const w="https://my-events-server.herokuapp.com/e/";class L{constructor(){this.players=[],this.openRoomId=null,this.networkEvents=null,this.roomListenerThis=this.roomListener.bind(this),this.localEvents=new y,this.on=this.localEvents.on.bind(this.localEvents),this.off=this.localEvents.off.bind(this.localEvents)}setCurrentPlayerData(e){const t=g();this.player={selfId:t,ownerId:t,data:e},this.addPlayerLocal(this.player)}async openRoom(){if(!this.openRoomId){this.openRoomId=g(),this.networkEvents=new b(w);const e=await this.networkEvents.on(["room",this.openRoomId],this.roomListenerThis);this.changeCurrentId(e)}return this.openRoomId}changeCurrentId(e){this.players.forEach((t=>{t.ownerId===this.player.selfId&&(t.ownerId=e)})),this.player.selfId=e}async joinRoom(e){if(!this.openRoomId){this.openRoomId=e,this.networkEvents=new b(w);const t=await this.networkEvents.on(["room",this.openRoomId],this.roomListenerThis);this.changeCurrentId(t)}}addPlayerLocal(e){this.players.find((t=>t.selfId===e.selfId))||this.players.push(e),this.localEvents.emit("players")}addPlayer(e){this.addPlayerLocal(e),this.roomEmitter("addPlayer_NE",e)}updatePlayerDataLocal(e,t){const n=this.players.find((t=>t.selfId===e));if(void 0===n)throw new Error("Impossible error");Object.assign(n.data,t),this.localEvents.emit("players")}updatePlayerData(e,t){this.updatePlayerDataLocal(e,t),this.roomEmitter("updatePlayerData_NE",e,t)}removePlayerLocal(e){this.players=this.players.filter((t=>t.selfId!==e&&t.ownerId!==e)),this.localEvents.emit("players")}removePlayer(e){this.removePlayerLocal(e),this.roomEmitter("removePlayer_NE",e)}roomEmitter(e,...t){var n;null==(n=this.networkEvents)||n.emit(["room",this.openRoomId],{fun:e,params:t})}roomListener({type:e,id:t,data:n}){t===this.player.selfId?"on"===e&&this.roomEmitter("addPlayer_NE",this.player):"off"===e?this.removePlayerLocal(t):"on"===e?(this.roomEmitter("addPlayer_NE",this.player),this.players.filter((e=>e.ownerId===this.player.selfId)).forEach((e=>{this.roomEmitter("addPlayer_NE",e)}))):"data"===e&&{addPlayer_NE:this.addPlayerLocal.bind(this),updatePlayerData_NE:this.updatePlayerDataLocal.bind(this),removePlayer_NE:this.removePlayerLocal.bind(this)}[n.fun](...n.params)}async destroy(){var e;null==(e=this.networkEvents)||e.off(["room",this.openRoomId],this.roomListenerThis)}}const E=(...e)=>e.map((e=>encodeURIComponent(e).replace(/[!'()*]/g,(e=>"%"+e.charCodeAt(0).toString(16))))).join("/"),_=e=>(t,n)=>t[e]<n[e]?-1:t[e]>n[e]?1:0;class b{constructor(e,t=g()){this.url=e,this.id=t,this.sources=new Map,this.events=new Map}async on(e,t){var n;return Array.isArray(e)&&(e=E(...e)),this.events.has(e)?(null==(n=this.events.get(e))||n.add(t),console.log({event:e})):(console.log({event:e}),await new Promise(((n,r)=>{const o=new EventSource(this.url+e+"?id="+this.id,{withCredentials:!1}),s=new Set([t]);this.sources.set(e,o),this.events.set(e,s),o.onmessage=t=>{const r=JSON.parse(t.data);"ok"===r.type?(console.log("ok",e,t.data),n()):s.forEach((e=>e(r)))},o.onerror=t=>{o.close(),this.sources.delete(e),this.events.delete(e),r(t)}}))),this.id}off(e,t){Array.isArray(e)&&(e=E(...e));const n=this.events.get(e);n&&(n.delete(t),0===n.size&&(this.events.delete(e),this.sources.get(e).close(),this.sources.delete(e)))}async emit(e,t){Array.isArray(e)&&(e=E(...e));const n=await fetch(this.url+e+"?id="+this.id,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(t)});if(!n.ok)throw new Error(n.statusText)}}class I{constructor(e,t){this.roomId=e,this.peerName=t,this.onConnection=null,console.log({peerName:t}),this.eventRequestFromInit=E("room",this.roomId,"peer",this.peerName,"request")}async start(){}stop(){console.log("stop room")}async onInitiatorRequest({initName:e}){const{peerName:t,roomId:n}=this;E("room",n,"peer",t,"init",e,"signaling"),E("room",n,"init",e,"peer",t,"signaling")}}class P{constructor(e,t){this.roomId=e,this.initName=t}async connect(e){const{initName:t,roomId:n}=this;E("room",n,"peer",e,"init",t,"signaling"),E("room",n,"init",t,"peer",e,"signaling")}stop(){}}export{b as G,I as H,P as J,L as R,_ as d,w as e,g};
