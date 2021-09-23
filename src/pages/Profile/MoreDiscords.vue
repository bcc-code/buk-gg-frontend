<template>
    <div>
        <card>
            <!-- <h5 slot="header" class="card-title">Connections</h5> -->
            <base-table :data="player?.moreDiscordUsers">
                <template slot="columns">
                    <th>Name</th>
                    <th>DiscordId</th>
                    <th></th>
                </template>
                <template slot-scope="{ row }" class="row text-left">
                    <td>{{ row.name }}</td>
                    <td>{{ row.discordId }}</td>
                    <td>
                        <base-button
                            class="btn-red"
                            type="danger"
                            icon
                            ><i
                                @click="removeDiscord(row.discordId)"
                                class="fas fa-times"
                        /></base-button>
                    </td>
                </template>
            </base-table>
            <base-button @click="addDiscord = true" type="success" class="float-right" icon><i class="fas fa-plus"/></base-button>
        </card>
        <modal :show.sync="addDiscord"
            body-classes="p-0"
            modal-classes="modal-dialog-centered modal-sm">
            <card type="secondary"
                  header-classes="bg-white pb-5"
                  body-classes="px-lg-5 py-lg-5"
                  class="border-0 mb-0">
                <template>
                    <div class="text-center mb-4">
                        <h3>Add Discord User</h3>
                    </div>
                    <form role="form">
                        <base-input alternative
                                    class="mb-3"
                                    placeholder="Full Name"
                                    v-model="newDiscordName"
                                    >
                        </base-input>
                        <base-input alternative
                                    class="mb-3"
                                    placeholder="DiscordId"
                                    v-model="newDiscordId"
                                    >
                        </base-input>
                        <div class="text-center">
                            <base-button :loading="loading" @click="addDiscordUser()" type="success" class="my-4">Add</base-button>
                            <base-button class="ml-2" @click="addDiscord = false">Cancel</base-button>
                        </div>
                    </form>
                </template>
            </card>
        </modal>
    </div>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { Modal, BaseTable } from '../../components';
import Discord from '../../services/discord';
import api from '../../services/api';

@Component({
    components: {
        Modal,
        BaseTable,
    },
})

export default class MoreDiscords extends Vue {
    public addDiscord: boolean = false;

    public newDiscordName: string = '';
    public newDiscordId: string = '';

    public get player() {
        return this.$session.state.currentUser
    };

    public loading: boolean = false;

    public async addDiscordUser() {
        this.loading = true;
        if (this.player?.enableMoreDiscords === true) {
            this.player.moreDiscordUsers ??= [];
            this.player.moreDiscordUsers.push({
                name: this.newDiscordName,
                discordId: this.newDiscordId,
            });
            await this.player.save();
        }
        this.loading = false;
        this.newDiscordName = '';
        this.newDiscordId = '';
        this.addDiscord = false;
    }

    public async removeDiscord(id: string) {
        this.loading = true;
        if (this.player?.moreDiscordUsers.some(d => d.discordId === id)) {
            this.player.moreDiscordUsers = this.player.moreDiscordUsers.filter(i => i.discordId !== id);
            await this.player.save();
        }
        this.loading = false;
    }

}
</script>
<style></style>
