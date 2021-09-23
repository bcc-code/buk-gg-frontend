<template>
    <div v-if="tournament">
        <base-button
            type="success"
            class="center-mobile"
            :disabled="isSignedUp"
            @click="viewModal = true"
            >{{ !(isSignedUp) ? $t('registration.title').toUpperCase : "SIGNED UP"}}</base-button
        >
        <base-alert type="success" v-if="successAdd"
            >SUCCESSFULLY SIGNED UP</base-alert
        >
        <modal
            :show.sync="viewModal"
            body-classes="p-0"
            modal-classes="modal-dialog-centered modal-sm"
        >
            <card
                v-if="tournament?.signupType === 'team'"
                style="margin-bottom: 0;"
            >
                <template slot="header">{{ $t('tournaments.myTeams').toUpperCase }}</template>
                <template>
                    <div
                        class="card-body text-white"
                        v-if="!$session.state.currentUser?.phoneNumber"
                    >
                        {{ $t('tournaments.teamRequiredInformation') }}
                        <base-input
                            :label="$t('registration.phoneNumber')"
                            v-model="user.phoneNumber"
                            :placeholder="$t('registration.phoneNumber')"
                        >
                            <small slot="helperText" class="text-muted">{{
                                $t('registration.phoneNumberDescription')
                            }}</small>
                        </base-input>
                        <base-button
                            :loading="user.loading"
                            type="info"
                            @click="user.save()"
                            >{{ $t('common.save').toUpperCase }}</base-button
                        >
                    </div>
                    <div class="card-body text-white" v-else>Only showing your teams in {{ tournament.title }}.<br/>Required members: {{ tournament.minPlayers }}</div>
                    <base-table :data="teams" :columns="['name']" v-if="teams.length > 0">
                        <template slot="columns">
                            <th>Name</th>
                        </template>
                        <template slot-scope="{ row }">
                            <td>{{ row.name }}</td>
                            <td>
                                <base-button
                                    :type="
                                        !Tournament.isEligible(row)
                                            ? 'warning'
                                            : 'success'
                                    "
                                    :disabled="
                                        !Tournament.isEligible(row) ||
                                        Tournament.isSignedUp(row)
                                    "
                                    @click="fillInfo(row)"
                                    >{{
                                        !Tournament.isEligible(row)
                                            ? 'NOT ELIGIBLE'
                                            : Tournament.isSignedUp(row)
                                            ? 'SIGNED UP'
                                            : 'SIGN UP'
                                    }}</base-button
                                >
                            </td>
                        </template>
                    </base-table>
                    <base-button @click="viewModal = false">Close</base-button>
                </template>
            </card>
            <card
                v-if="Tournament.signupType == 'player'"
                style="margin-bottom: 0;"
            >
                <h3>{{ $t('registration.title') }}</h3>
                <div
                    class="card-body text-white"
                    v-if="!user.phoneNumber"
                >
                    {{ $t('tournaments.phoneNumberIsRequired') }}
                    <base-input
                        :label="$t('registration.phoneNumber')"
                        v-model="user.phoneNumber"
                        :placeholder="$t('registration.phoneNumber')"
                    >
                        <small slot="helperText" class="text-muted">{{
                            $t('registration.phoneNumberDescription')
                        }}</small>
                    </base-input>
                    <base-button

                        :loading="user.loading"
                        type="info"
                        @click="user.save()"
                        >{{ $t('common.save').toUpperCase }}</base-button
                    >
                </div>

                <div class="card-body" v-if="user.phoneNumber">
                    <div
                        class="text-white"
                        v-for="(field, i) in requiredFields"
                        :key="i"
                    >
                        {{ field.question }}
                        <base-input
                            :class="
                                !field.answer ? 'has-danger' : 'has-success'
                            "
                            v-model="field.answer"
                        ></base-input>
                    </div>
                </div>
                <div class="card-body">
                    <base-button
                        type="success"
                        :disabled="
                            !user.phoneNumber ||
                            !allAnswered
                        "
                        v-if="user.phoneNumber"
                        @click="Tournament.register(information)"
                        >Sign Up</base-button
                    >
                    <base-button
                        class="ml-lg-3 center-mobile float-right"
                        @click="viewModal = false"
                        >Close</base-button
                    >
                </div>
            </card>
        </modal>
        <modal
            :show.sync="viewInfoModal"
            body-classes="p-0"
            modal-classes="modal-dialog-centered modal-sm"
        >
            <card style="margin-bottom: 0;">
                <h3>{{ $t('registration.title') }}</h3>
                <div class="card-body">
                    <div
                        class="text-white"
                        v-for="(field, i) in requiredFields"
                        :key="i"
                    >
                        {{ field.question }}
                        <base-input v-model="field.answer"></base-input>
                    </div>
                </div>
                <div class="card-body">
                    <base-button
                        type="success"
                        :disabled="!user.phoneNumber"
                        v-if="user.phoneNumber"
                        @click="Tournament.register(information, selectedTeam)"
                        >Sign Up</base-button
                    >
                    <base-button
                        class="ml-lg-3 center-mobile float-right"
                        @click="viewInfoModal = false"
                        >Close</base-button
                    >
                </div>
            </card>
        </modal>
    </div>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { Modal, BaseAlert, BaseTable } from '../../components';
import Tournament from '@/classes/tournament/Tournament';
import { Team } from '@/classes';

@Component({
    props: {
        tournament: {
            type: Object,
            default: () => {
                return {};
            },
        },
    },
    components: {
        Modal,
        BaseAlert,
        BaseTable,
    },
})
export default class TournamentRegistration extends Vue {
    public tournament?: Tournament;

    public successAdd = false;
    public viewModal = false;
    public viewInfoModal = false;

    public selectedTeam?: Team;

    public mounted() {
        this.requiredFields = this.Tournament.requiredInfo.map(i => {
            return {
                question: i,
            }
        });
    }

    public get Tournament() {
        if (!this.tournament)
            throw new Error("Tournament not found");
        return this.tournament;
    }

    public get isSignedUp() {
        return this.tournament?.signedUp === true;
    }

    public get user() {
        return this.$session.currentUser;
    }

    public get teams() {
        return this.tournament?.teams ?? [];
    }

    public fillInfo(team: Team) {
        this.selectedTeam = team;
        this.viewInfoModal = true;
    }
    
    public get allAnswered() {
        return this.requiredFields.every((v) => v.answer !== undefined);
    }

    public get information() {
        if (this.allAnswered)
            return this.requiredFields.map(i => i.answer as string);

        throw new Error("Not all answered");
    }
    public requiredFields: {
        question: string;
        answer?: string;
    }[] = [];
}
</script>
<style></style>
