<template>
  <input v-model="name" placeholder="Member name" /><br />
  <input v-model="peerName" placeholder="Host name" /><br />
  <input v-model="roomId" placeholder="Room id" /><br />
  <button @click="joinRoom"><b>[join]</b></button>
</template>

<script lang="ts">
import { Vue } from "vue-class-component";
import { JoinRoom } from "../../common";

export default class RTMemberTest extends Vue {
  name: string = "mymember";
  roomId: string = "myroom";
  peerName: string = "myhost";
  room: JoinRoom | null = null;

  async joinRoom() {
    if (!this.peerName || !this.roomId || !this.name) return;
    this.room = new JoinRoom(this.roomId, this.name);

    console.log("instanse cnct");
    const connection = await this.room.connect(this.peerName);
    console.log("instanse cncted");

    console.log(this.peerName, connection);
  }

  beforeUnmount() {
    this.room?.stop();
  }
}
</script>
