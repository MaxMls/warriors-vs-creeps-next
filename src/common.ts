/*async function genRoom() {
	return Math.random().toString()
}*/
export type ArrayElement<ArrayType extends readonly unknown[]> =
	ArrayType extends readonly (infer ElementType)[] ? ElementType : never;
const fixedEncodeURIComponent = (str) => {
	return encodeURIComponent(str).replace(/[!'()*]/g, (c) => {
		return '%' + c.charCodeAt(0).toString(16);
	});
}

const genEvent = (...values) => {
	return values.map(v => fixedEncodeURIComponent(v)).join('/')
}

export const dynamicSort = (property) => (a, b) => (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;


export class GlobalEventEmitter {
	constructor(private readonly url) {}

	private sources = new Map<string, EventSource>()
	private events = new Map<string, Set<(...args: any[]) => void>>()

	async on(event: string | string[], listener: (...args: any[]) => void): Promise<void> {
		if (Array.isArray(event)) event = genEvent(...event)

		if (this.events.has(event)) {
			this.events.get(event)?.add(listener)
		} else {
			await new Promise<void>((resolve, reject) => {
				const source = new EventSource(this.url + event, {
					withCredentials: false
				})
				const eventListeners = new Set<(...args: any[]) => void>([listener])

				source.onmessage = (e) => {
					if (e.data === 'ok') {
						console.log('ok', event, e.data)
						this.sources.set(event as string, source)
						this.events.set(event as string, eventListeners)
						resolve()
					} else {
						//console.log('on', event, e.data)
						//console.log('on', {eventListeners})
						eventListeners.forEach(l => l(JSON.parse(e.data)))
					}
				}
				source.onerror = (e) => {
					reject(e)
				}
			})
		}
	}

	off(event: string | string[], listener: (...args: any[]) => void): void {
		if (Array.isArray(event)) event = genEvent(...event)

		const eventListeners = this.events.get(event)
		if (eventListeners) {
			eventListeners.delete(listener)

			if (eventListeners.size === 0) {
				this.events.delete(event);
				(this.sources.get(event) as EventSource).close()
				this.sources.delete(event)
			}
		}
	}

	async emit(event: string | string[], data: any): Promise<void> {
		if (Array.isArray(event)) event = genEvent(...event)
		const res = await fetch(this.url + event, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(data)
		})

		if (!res.ok) throw new Error(res.statusText)
	}

}

/*
const globalEventEmitter = new GlobalEventEmitter()
*/


export type TAnswerCallback = (data: IAnswerData, sendAnswer: (answer: any, name: string) => void) => void

export interface IOfferData {
	initName: string,
	offer: any
}

export interface IAnswerData {
	answer: any
}

export class HostRoom {

	eventRequestFromInit: string

	constructor(
		private readonly roomId: string,
		private readonly peerName: string
	) {
		console.log({peerName})
		this.eventRequestFromInit = genEvent('room', this.roomId, 'peer', this.peerName, 'request')
	}

	onConnection: ((name: string, connection: RTCPeerConnection) => void) | null = null

	async start() {
		//return globalEventEmitter.on(this.eventRequestFromInit, (v) => this.onInitiatorRequest(v))
	}

	stop() {
		console.log('stop room')
	}

	// receive request
	private async onInitiatorRequest({initName}) {
		const {peerName, roomId} = this

		const eventSignalingFromInit = genEvent('room', roomId, 'peer', peerName, 'init', initName, 'signaling')
		const eventSignalingFromPeer = genEvent('room', roomId, 'init', initName, 'peer', peerName, 'signaling')


		/*await globalEventEmitter.on(eventSignalingFromInit, async ({type, data}) => {
			if (type === 'ice') {

			} else if (type === 'offer') {


				console.log('connected!')
			}

		})

		await globalEventEmitter.emit(eventSignalingFromPeer, {type: 'ok'})
*/
	}

}


export class JoinRoom {

	constructor(
		private readonly roomId: string,
		private readonly initName: string
	) {}

	//private events = new Map<string, TAnswerCallback>()

	public async connect(peerName: string) {
		const {initName, roomId} = this

		const eventSignalingFromInit = genEvent('room', roomId, 'peer', peerName, 'init', initName, 'signaling')
		const eventSignalingFromPeer = genEvent('room', roomId, 'init', initName, 'peer', peerName, 'signaling')


	}

	stop() {
		//for (const event of this.events.keys()) {
		//globalEventEmitter.off(event)
		//}
		//this.events.clear()
	}

}


///////////////////////


const servers = [
	"iphone-stun.strato-iphone.de:3478",
	"numb.viagenie.ca:3478",
	"stun.12connect.com:3478",
	"stun.12voip.com:3478",
	"stun.1und1.de:3478",
	"stun.3cx.com:3478",
	"stun.acrobits.cz:3478",
	"stun.actionvoip.com:3478",
	"stun.advfn.com:3478",
	"stun.altar.com.pl:3478",
	"stun.antisip.com:3478",
	"stun.avigora.fr:3478",
	"stun.bluesip.net:3478",
	"stun.cablenet-as.net:3478",
	"stun.callromania.ro:3478",
	"stun.callwithus.com:3478",
	"stun.cheapvoip.com:3478",
	"stun.cloopen.com:3478",
	"stun.commpeak.com:3478",
	"stun.cope.es:3478",
	"stun.counterpath.com:3478",
	"stun.counterpath.net:3478",
	"stun.dcalling.de:3478",
	"stun.demos.ru:3478",
	"stun.dus.net:3478",
	"stun.easycall.pl:3478",
	"stun.easyvoip.com:3478",
	"stun.ekiga.net:3478",
	"stun.epygi.com:3478",
	"stun.etoilediese.fr:3478",
	"stun.faktortel.com.au:3478",
	"stun.freecall.com:3478",
	"stun.freeswitch.org:3478",
	"stun.freevoipdeal.com:3478",
	"stun.gmx.de:3478",
	"stun.gmx.net:3478",
	"stun.halonet.pl:3478",
	"stun.hoiio.com:3478",
	"stun.hosteurope.de:3478",
	"stun.infra.net:3478",
	"stun.internetcalls.com:3478",
	"stun.intervoip.com:3478",
	"stun.ipfire.org:3478",
	"stun.ippi.fr:3478",
	"stun.ipshka.com:3478",
	"stun.it1.hr:3478",
	"stun.ivao.aero:3478",
	"stun.jumblo.com:3478",
	"stun.justvoip.com:3478",
	"stun.l.google.com:19302",
	"stun.linphone.org:3478",
	"stun.liveo.fr:3478",
	"stun.lowratevoip.com:3478",
	"stun.lundimatin.fr:3478",
	"stun.mit.de:3478",
	"stun.miwifi.com:3478",
	"stun.modulus.gr:3478",
	"stun.myvoiptraffic.com:3478",
	"stun.netappel.com:3478",
	"stun.netgsm.com.tr:3478",
	"stun.nfon.net:3478",
	"stun.nonoh.net:3478",
	"stun.nottingham.ac.uk:3478",
	"stun.ooma.com:3478",
	"stun.ozekiphone.com:3478",
	"stun.pjsip.org:3478",
	"stun.poivy.com:3478",
	"stun.powervoip.com:3478",
	"stun.ppdi.com:3478",
	"stun.qq.com:3478",
	"stun.rackco.com:3478",
	"stun.rockenstein.de:3478",
	"stun.rolmail.net:3478",
	"stun.rynga.com:3478",
	"stun.schlund.de:3478",
	"stun.sigmavoip.com:3478",
	"stun.sip.us:3478",
	"stun.sipdiscount.com:3478",
	"stun.sipgate.net:10000",
	"stun.sipgate.net:3478",
	"stun.siplogin.de:3478",
	"stun.sipnet.net:3478",
	"stun.sipnet.ru:3478",
	"stun.sippeer.dk:3478",
	"stun.siptraffic.com:3478",
	"stun.sma.de:3478",
	"stun.smartvoip.com:3478",
	"stun.smsdiscount.com:3478",
	"stun.solcon.nl:3478",
	"stun.solnet.ch:3478",
	"stun.sonetel.com:3478",
	"stun.sonetel.net:3478",
	"stun.sovtest.ru:3478",
	"stun.srce.hr:3478",
	"stun.stunprotocol.org:3478",
	"stun.t-online.de:3478",
	"stun.tel.lu:3478",
	"stun.telbo.com:3478",
	"stun.tng.de:3478",
	"stun.twt.it:3478",
	"stun.uls.co.za:3478",
	"stun.unseen.is:3478",
	"stun.usfamily.net:3478",
	"stun.viva.gr:3478",
	"stun.vivox.com:3478",
	"stun.vo.lu:3478",
	"stun.voicetrading.com:3478",
	"stun.voip.aebc.com:3478",
	"stun.voip.blackberry.com:3478",
	"stun.voip.eutelia.it:3478",
	"stun.voipblast.com:3478",
	"stun.voipbuster.com:3478",
	"stun.voipbusterpro.com:3478",
	"stun.voipcheap.co.uk:3478",
	"stun.voipcheap.com:3478",
	"stun.voipgain.com:3478",
	"stun.voipgate.com:3478",
	"stun.voipinfocenter.com:3478",
	"stun.voipplanet.nl:3478",
	"stun.voippro.com:3478",
	"stun.voipraider.com:3478",
	"stun.voipstunt.com:3478",
	"stun.voipwise.com:3478",
	"stun.voipzoom.com:3478",
	"stun.voys.nl:3478",
	"stun.voztele.com:3478",
	"stun.webcalldirect.com:3478",
	"stun.wifirst.net:3478",
	"stun.xtratelecom.es:3478",
	"stun.zadarma.com:3478",
	"stun1.faktortel.com.au:3478",
	"stun1.l.google.com:19302",
	"stun2.l.google.com:19302",
	"stun3.l.google.com:19302",
	"stun4.l.google.com:19302",
	"stun.nextcloud.com:443",
	"relay.webwormhole.io:3478"
];

export const rtcConfig = {iceServers: servers.map(v => ({urls: 'stun:' + v})).slice(4, 5)}


/*

export const waitName = (connection: RTCPeerConnection) => {
	return new Promise<string>(async (resolve, reject) => {
		connection.ondatachannel = (event) => {
			// console.log('ondatachannel')
			const channel = event.channel
			// channel.onopen = event => console.log('onopen', event);
			// channel.onmessage = event => console.log('onmessage', event);
			channel.onmessage = (event) => {
				resolve(event.data)
			}
		}
	})
}
*/

export const coordsToString = ({x, y}: { x: number, y: number }) => {
	return `${x},${y}`
}

export const coordsFromString = (str: string) => {
	const [x, y] = str.split(',').map(v => +v)
	return {x, y}
}
