<template>
    <div>
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
                    <div class="card-body text-white" v-else>Only showing your teams in {{ tournament.title }}.<br/>Required members: {{ tournament.teamSize.min }}</div>
                    <base-table :data="teams" :columns="['name']" v-if="teams.length > 0">
                        <template slot="columns">
                            <th>Name</th>
                        </template>
                        <template slot-scope="{ row }">
                            <td>{{ row.name }}</td>
                            <td>
                                <base-button
                                    :type="
                                        !eligibleTeams.includes(row.id)
                                            ? 'warning'
                                            : 'success'
                                    "
                                    :disabled="
                                        !eligibleTeams.includes(row.id) ||
                                        tournament.teams.find(
                                            (t) => t._id === row.id,
                                        )
                                            ? true
                                            : tournament.teams.find(
                                                  (t) => t.id === row.id,
                                              )
                                            ? true
                                            : false
                                    "
                                    @click="fillInfo(row)"
                                    >{{
                                        !eligibleTeams.includes(row.id)
                                            ? 'NOT ELIGIBLE'
                                            : tournament.teams.find(
                                                  (t) => t.id === row.id,
                                              )
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
                v-if="tournament.signupType == 'solo'"
                style="margin-bottom: 0;"
            >
                <h3>{{ $t('registration.title') }}</h3>
                <div
                    class="card-body text-white"
                    v-if="!$session.state.currentUser.phoneNumber"
                >
                    {{ $t('tournaments.phoneNumberIsRequired') }}
                    <base-input
                        :label="$t('registration.phoneNumber')"
                        v-model="player.phoneNumber"
                        :placeholder="$t('registration.phoneNumber')"
                    >
                        <small slot="helperText" class="text-muted">{{
                            $t('registration.phoneNumberDescription')
                        }}</small>
                    </base-input>
                    <base-button

                        :loading="loading.saveUser"
                        type="info"
                        @click="savePhonenumber()"
                        >{{ $t('common.save').toUpperCase() }}</base-button
                    >
                </div>

                <div class="card-body" v-if="$session.state.currentUser.phoneNumber">
                    <div
                        class="text-white"
                        v-for="field in requiredFields"
                        :key="field.number"
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
                            !$session.state.currentUser.phoneNumber ||
                            fieldsNotAnswered
                        "
                        v-if="$session.state.currentUser.phoneNumber"
                        @click="playerSignUp()"
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
                        v-for="field in requiredFields"
                        :key="field.number"
                    >
                        {{ field.question }}
                        <base-input v-model="field.answer"></base-input>
                    </div>
                </div>
                <div class="card-body">
                    <base-button
                        type="success"
                        :disabled="!$session.state.currentUser.phoneNumber"
                        v-if="$session.state.currentUser.phoneNumber"
                        @click="teamSignUp(selectedTeam)"
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
import Tournament from '@/classes/Tournament';

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

    public get isSignedUp() {
        return this.tournament?.signedUp === true;
    }

    public get user() {
        return this.$session.currentUser;
    }

    public get teams() {
        return this.tournament?.teams ?? [];
    }
}
</script>
<style></style>
