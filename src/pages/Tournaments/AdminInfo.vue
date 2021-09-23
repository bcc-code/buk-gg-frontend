<template>
    <div class="tournament-admin-info">
        <base-table
            :data="participants ?? []"
            :columns="['id', 'nickname', 'discordUser']"
            v-if="tournament.signupType === 'player'"
        >
            <template slot="columns">
                <th>Name</th>
                <th>Nickname</th>
                <th>Phone</th>
                <th>Location</th>
                <th>Discord</th>
                <th v-for="field in tournament.requiredInfo" :key="field">{{field}}</th>
            </template>
            <template slot-scope="{ row }">
                <td>{{ row.item.name }}</td>
                <td>{{ row.item.nickname }}</td>
                <td>{{ row.item.phoneNumber }}</td>
                <td>{{ row.item.location }}</td>
                <td>{{ row.item.discordUser }}</td>
                <td v-for="field in row.information" :key="field">{{field.split(' | ').splice(1).join(' | ')}}</td>
            </template>
        </base-table>
        <table class="table tablesorter">   
            <thead>
                <th>Name</th>
                <th>ToornamentId</th>
                <th>Captain</th>
                <th>Location</th>
                <th>Organization</th>
                <th>Players</th>
                <th v-for="field in tournament.requiredInfo" :key="field">{{field}}</th>
            </thead>
            <tbody>
                <tr v-for="p in Participants" :key="p.id">
                    <td>{{ p.team?.name }}</td>
                    <td>{{ p.toornamentId }}</td>
                    <td style="cursor: pointer" @click="showCaptain(p)">{{ getCaptain(p) ? getCaptain(p)?.name : 'NO CAPTAIN' }}</td>
                    <td>{{ getCaptain(p) }}</td>
                    <td style="cursor: pointer" @click="$router.push(`/organization/${p.team?.organizationId}`)">{{ p.team?.name }}</td>
                    <td><base-button  @click="showPlayers(p)">Players</base-button></td>
                    <td v-for="field in p.information" :key="field">{{field.split(' | ').splice(1).join(' | ')}}</td>
                </tr>
            </tbody>
        </table>
        <modal :show.sync="modal.captain"
            body-classes="p-0"
            modal-classes="modal-sm">
            <card style="margin-bottom: 0" type="user">
                
                <p class="card-text"></p>
                <div class="author" v-if="captain">
                    <div class="block block-one"></div>
                    <div class="block block-two"></div>
                    <div class="block block-three"></div>
                    <div class="block block-four"></div>
                    <a>
                        <img
                            class="avatar"
                            src="/img/icons/ms-icon-310x310.png"
                            alt="..."
                        />
                    </a>
                    <h3 style="margin-bottom: 10px;">
                        {{ captain.name }}
                    </h3>
                    <h3 style="margin-bottom: 10px;">
                        {{ captain.displayName }}
                    </h3>
                    <h4>
                        <a
                            target="_blank"
                            :href="`mailto:${captain.email}`"
                            >{{ captain.email }}</a
                        >
                    </h4>
                    <h4 v-if="captain.phoneNumber">{{ captain.phoneNumber }}</h4>
                    <h4 type="primary" v-if="captain.discordTag">
                        <i class="fab fa-discord"></i> {{ captain.discordTag }}
                    </h4>
                </div>
                <p></p>
                <base-button
                    class="ml-lg-3 center-mobile float-right"
                    @click="modal.captain = false"
                    >Close</base-button
                >
            </card>
        </modal>
        <modal :show.sync="modal.players"
            body-classes="p-0"
            modal-classes="modal-lg">
            <card style="margin-bottom: 0">
                <base-button
                    class="ml-lg-3 center-mobile float-right"
                    @click="modal.players = false"
                    >Close</base-button
                >
                <base-table
                    :data="players"
                    :columns="['_id', 'nickname', 'discordUser']"
                >
                    <template slot="columns">
                        <th>Name</th>
                        <th>Nickname</th>
                        <th>Phone</th>
                        <th>Location</th>
                        <th>Discord</th>
                        <th>ToornamentId</th>
                    </template>
                    <template slot-scope="{ row }">
                        <td>{{ row.name }}</td>
                        <td>{{ row.nickname }}</td>
                        <td>{{ row.phoneNumber }}</td>
                        <td>{{ row.location }}</td>
                        <td>{{ row.discordUser }}</td>
                    </template>
                </base-table>
            </card>
        </modal>
    </div>
</template>

<script lang="ts">
import User from '@/classes/User';
import { ApiAdminPlayer, ApiParticipant, ApiTeam } from 'buk-gg';
import { Component, Vue } from 'vue-property-decorator';
import { BaseTable, Modal } from '../../components';
import api from '../../services/api';
import UserCard from '../Profile/UserCard.vue';

@Component({
    props: {
    },
    components: {
        BaseTable,
        Modal,
        UserCard,
    },
})

export default class TournamentAdminDetails extends Vue {
    public modal = {
        captain: false,
        players: false,
    };
    public captain?: ApiAdminPlayer;
    public players?: ApiAdminPlayer[];

    public participants?: ApiParticipant[];

    public get Participants() {
        return this.participants ?? [];
    }

    public get tournament() {
        if (!this.$tournaments.current)
            throw new Error("Tournament not found");
        return this.$tournaments.current;
    }

    public async mounted() {
        this.participants = await api.tournaments.getParticipants(this.tournament.id);
    }

    public getCaptain(participant: ApiParticipant) {
        return participant.players.find(p => p.id === participant.team?.members.find(m => m.role === "captain")?.playerId);
    }

    public showCaptain(participant: ApiParticipant) {
        const captain = participant.team?.members.find(m => m.role === "captain");
        this.captain = participant.players.find(p => p.id === captain?.playerId);
        this.modal.captain = true;
    }

    public showPlayers(participant: ApiParticipant) {
        this.players = participant.players;
        this.modal.players = true;
    }
}
</script>
