<template>
    <div class="row">
        <div class="col-md-8 col-12" v-if="$organizations.current" :style="pageLoading">
            <div class="row">
                <card
                    class="col-md-8 col-12 organization-header"
                    style="
                        margin-left: auto;
                        margin-right: auto;
                        padding: unset;
                    "
                >
                    <img
                        slot="image"
                        class="card-img-top organization-image"
                        :src="organization.logo ? organization.logo + '?h=400' : ''"
                    />
                    <div class="row">
                        <div class="col-12">
                            <h1 class="title text-center">
                                <base-input
                                    v-if="editMode"
                                    v-model="newName"
                                    type="name"
                                    placeholder="Full Name"
                                >
                                </base-input>
                                <div v-else>{{ $organizations.current.name }}</div>
                            </h1>
                            <input
                                type="file"
                                @change="handleImage"
                                ref="imageUpload"
                                accept="image/*"
                                style="display: none;"
                            />

                            <div class="float-left">
                                <base-button
                                    v-if="editMode"
                                    type="info"
                                    @click="$refs.imageUpload?.click()"
                                    >{{
                                        fileName !== ''
                                            ? fileName
                                            : `${$t('image.upload')}`.toUpperCase()
                                    }}</base-button
                                >
                                <base-button
                                    v-if="editMode && fileName"
                                    type="success"
                                    :loading="loading.uploadImage"
                                    @click="submitImage()"
                                    >{{
                                        `${$t('common.upload')}`.toUpperCase()
                                    }}</base-button
                                >
                            </div>
                            <div v-if="currentUserIsOwner" class="float-right">
                                <base-button
                                    v-if="editMode"
                                    type="primary"
                                    :loading="loading.saveOrganization"
                                    @click="saveOrganization()"
                                    >{{
                                        !loading.saveOrganization
                                            ? $t('common.save').toString().toUpperCase()
                                            : ''
                                    }}</base-button
                                >
                                <base-button
                                    type="primary"
                                    @click="editOrganization()"
                                    >{{
                                        editMode
                                            ? $t('common.cancel').toString().toUpperCase()
                                            : $t('common.edit').toString().toUpperCase()
                                    }}</base-button
                                >
                                <base-alert
                                    dismissible
                                    v-if="alert.failedSave"
                                    type="danger"
                                    >Failed to save Organization</base-alert
                                >
                                <base-alert
                                    dismissible
                                    v-if="alert.successSave"
                                    type="success"
                                    >Saved Organization</base-alert
                                >
                            </div>

                            <base-alert v-if="modal.updatedImage" type="success"
                                >Image updated.</base-alert
                            >
                            <base-alert
                                v-if="modal.updateImageFail"
                                type="danger"
                                >Failed to update image</base-alert
                            >
                        </div>
                    </div>
                </card>
            </div>
            <div class="row">
                <div
                    v-for="team in teams"
                    :key="team.id"
                    class="col-md-4 col-12"
                >
                    <team-card :team="team" :edit="editMode"></team-card>
                </div>
                <div class="col-md-4 col-12" v-if="editMode">
                    <card class="create-team">
                        <h1 class="title text-center">CREATE TEAM</h1>
                        <base-button
                            type="info"
                            @click="modal.selectCaptain = true"
                            >{{
                                newTeam.captainId
                                    ? members.find(i => i.playerId === newTeam.captainId)?.player?.name
                                    : 'SELECT CAPTAIN'
                            }}
                        </base-button>
                        <base-dropdown
                            title-classes="btn btn-secondary"
                            :title="
                                selectedGame
                                    ? selectedGame
                                    : this.$t('common.game').toString().toUpperCase()
                            "
                        >
                            <a
                                v-for="game in games"
                                :key="game.id"
                                class="dropdown-item"
                                @click="selectGameForTeam(game)"
                                style="cursor: pointer;"
                                >{{ game.name }}</a
                            >
                        </base-dropdown>
                        <base-button type="primary" :loading="loading.createTeam" @click="createTeam()">{{
                            $t('common.create').toString().toUpperCase()
                        }}</base-button>

                        <base-alert
                            dismissible
                            v-if="modal.createdTeam"
                            type="success"
                            >Created Team (refresh to view changes)</base-alert
                        >
                    </card>
                </div>
            </div>
        </div>
        <div :style="pageLoading" class="col-md-4 col-12">
            <div class="row">
                <member-list :edit="editMode" :members="members" :pending="pending"></member-list>
                <div class="col-12 pr-md-1" v-if="editMode">
                    <base-input
                        :placeholder="$t('common.search')"
                        type="text"
                        v-model="searchField"
                    ></base-input>
                </div>
                <div class="col-12" v-if="editMode">
                    <base-button type="success" @click="search()">{{
                        $t('common.search')
                    }}</base-button>
                    <base-button type="info" @click="searchThroughDiscord()"
                        >Discord</base-button
                    >
                </div>
                <base-table
                    :data="searchResult.members"
                    v-if="searchResult.members.length > 0"
                    :columns="['name', 'discordUser', 'email']"
                >
                    <template slot="columns">
                        <th></th>
                        <th>Name</th>
                        <th>Discord</th>
                    </template>
                    <template slot-scope="{ row }">
                        <td>
                            <base-button
                                type="success"
                                @click="addMember(row)"
                                icon
                                :loading="loading.addMember == row._id"
                                ><i class="fas fa-plus"
                            /></base-button>
                        </td>
                        <td>{{ row.nickname }}</td>
                        <td>{{ row.discordUser }}</td>
                    </template>
                </base-table>
                <base-table
                    :data="searchResult.discord"
                    v-if="searchResult.discord.length > 0"
                    :columns="['displayName', 'id', 'nickname']"
                >
                    <template slot="columns">
                        <th></th>
                        <th>Name</th>
                        <th>ID</th>
                    </template>
                    <template slot-scope="{ row }">
                        <td>
                            <base-button
                                type="success"
                                @click="addMember(null, row.userID)"
                                icon
                                :loading="loading.addMember == row.userID"
                                ><i class="fas fa-plus"
                            /></base-button>
                        </td>
                        <td>{{ row.displayName }}</td>
                        <td>{{ row.userID }}</td>
                    </template>
                </base-table>
                <div style="width: 100%;">
                    <base-alert v-if="alert.successAdd" type="success" class="org-alert"
                        >Added player</base-alert
                    >
                    <base-alert v-if="alert.failedAdd" type="danger" class="org-alert"
                        >Failed to find user/user already added</base-alert
                    >
                </div>
            </div>
        </div>
        <div v-if="loading.page" 
            style="position: fixed; width: 100%; height: 100%; top: 0; left: 0;">
            <semipolar-spinner
                style="margin: auto; top: 40%; opacity:0.6"
                :animation-duration="2000"
                :size="200"
                color="#ff1d5e"
            />
        </div>
        <select-member :members="members" :show.sync="modal.selectCaptain" :handleMember="(member) => { selectCaptain(member) }"></select-member>
    </div>
</template>
<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import { mapState } from 'vuex';
import { SelectMember, MemberList } from '../components/Organizations';
import { BaseTable, BaseAlert, Modal } from '../components';
import http from '../services/http';
import { TranslateResult } from 'vue-i18n';
import discord from '../services/discord';
import { uniqueId } from 'lodash';
import { SemipolarSpinner } from 'epic-spinners';
import { Member, Organization, Team } from '../classes';
import { TeamCard } from './Organizations/';
import { ApiGame, ApiPlayer, ApiTeamCreateOptions } from 'buk-gg';
import api from '@/services/api';

@Component({
    components: {
        TeamCard,
        BaseTable,
        BaseAlert,
        SemipolarSpinner,
        Modal,
        MemberList,
        SelectMember,
    },
})

export default class OrganizationDetails extends Vue {
    public teams: Team[] = [];
    public fileName: string = '';
    public uploadedFile: any;
    public currentUserIsOwner: boolean = false;
    public editMode: boolean = false;
    public updateKey: number = 0;
    public addCaptainField: string = '';
    public newName: string = '';

    public get currentUser() {
        return this.$organizations.current?.members.find((m: Member) => m.playerId === this.$session.currentUser.id);
    }

    public get members() {
        return this.$organizations.current?.members ?? [];
    }

    public get pending() {
        return this.$organizations.current?.invitations ?? [];
    }

    public get pageLoading() {
        return this.loading.page ? 'opacity: 0; transition: opacity 0.2s' : 'opacity: 1; transition: opacity 0.2s';
    }

    public alert: {
        [key: string]: boolean;
    } = {
        failedAdd: false,
        successAdd: false,
        failedSave: false,
        successSave: false,
    };
    public modal = {
        selectCaptain: false,
        updatedImage: false,
        updateImageFail: false,
        createdTeam: false,
    };
    public successSave: boolean = false;
    public selectedImage?: string;
    public searchField: string = '';
    public newTeam: ApiTeamCreateOptions = {
        name: '',
        organizationId: this.$organizations.currentId ?? '',
        captainId: '',
        gameId: ''
    };
    public loading = {
        saveOrganization: false,
        uploadImage: false,
        page: true,
        createTeam: false,
        addMember: '',
        leaveOrganization: false,
        joinRequest: false,
    };
    public selectedGame: string = '';
    public searchResult = {
        discord: [],
        members: [],
    };

    public get organization() {
        if (!this.$organizations.current)
            throw new Error("Org not found");
        
        return this.$organizations.current;
    }

    public get games() {
        return this.$session.state.games;
    }

    public tempAlert(value: string, timer: number) {
        this.alert[value] = true;
        setTimeout(() => {
            this.alert[value] = false;
        }, timer);
    }

    public async mounted() {
        this.loading.page = true;
        if (this.$route.params.id) {
            await this.$organizations.load(this.$route.params.id);
            this.teams = await this.$teams.getInOrganization(this.$route.params.id);
        } else {
            this.$router.push('/organizations');
        }

        if (
            this.currentUser
                ? ['owner', 'officer'].includes(this.currentUser.role)
                : false
        ) {
            this.currentUserIsOwner = true;
        }
        await new Promise((resolve) => setTimeout(resolve, 200));
        this.loading.page = false;
    }

    public editOrganization() {
        // this.$router.push(`${this.$route.path}/edit`);
        this.editMode = !this.editMode;
    }

    public selectGameForTeam(game: ApiGame) {
        this.selectedGame = game.name;
        this.newTeam.gameId = game.id;
    }

    public selectCaptain(member: Member) {
        this.newTeam.captainId = member.playerId;
        this.modal.selectCaptain = false;
    }

    public async createTeam() {
        this.loading.createTeam = true;
        this.newTeam.organizationId = this.$organizations.current?.id ?? '';
        this.newTeam.name = `${this.$organizations.current?.name}`;
        await api.teams.create(this.newTeam);
        this.loading.createTeam = false;
    }

    public async search() {
        this.searchResult.discord = [];
        // if (this.searchField !== '') {
        //     const result = await this.$organizations.searchForPlayers(
        //         this.searchField,
        //     );
        //     this.searchResult.members = result;
        // }
    }

    public async searchThroughDiscord() {
        this.searchResult.members = [];
        if (this.searchField !== '') {
            const result = await discord.searchForMember(this.searchField);
            this.searchResult.discord = result;
        }
    }

    public async addMember(player: ApiPlayer, discordId?: any) {
        this.searchField = '';
        this.loading.addMember = player?.id || discordId;
        this.organization.members.push(new Member({
            playerId: player.id,
            role: 'member',
        }));
        await this.organization.save();
        this.searchResult = {
            discord: [],
            members: [],
        };
        this.tempAlert('successAdd', 4000);
        this.loading.addMember = '';
    }

    public async saveOrganization() {
        this.loading.saveOrganization = true;
        try {
            await this.$organizations.current?.save();
            this.alert.successSave = true;
            this.loading.saveOrganization = false;
            setTimeout(() => {
                this.alert.successSave = false;
            }, 4000);
        } catch {
            this.loading.saveOrganization = false;
            this.alert.failedSave = true;
            setTimeout(() => {
                this.alert.failedSave = false;
            }, 4000);
        }
    }

    public async submitImage() {
        this.loading.uploadImage = true;
        const result = await this.$organizations.current?.save(
            this.selectedImage,
        );
        if (result) {
            this.modal.updatedImage = true;
            this.loading.uploadImage = false;
            this.fileName = '';
            setTimeout(() => {
                this.modal.updatedImage = false;
            }, 5000);
        } else {
            this.modal.updateImageFail = true;
            this.loading.uploadImage = false;
            this.fileName = '';
        }
    }

    public async handleImage(e: any) {
        this.createBase64Image(e.target?.files[0]);
        this.fileName = e.target.files[0]?.name;
    }
    public async createBase64Image(file: Blob) {
        const reader = new FileReader();

        reader.onload = (e) => {
            this.selectedImage = e.target?.result as string;
        };
        reader.readAsDataURL(file);
    }
}
</script>
<style></style>
