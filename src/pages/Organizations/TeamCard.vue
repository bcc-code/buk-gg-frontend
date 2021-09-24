<template>
    <card type="user" v-if="team">
        <p class="card-text"></p>
        <div class="author team-card">
            <div class="block block-one"></div>
            <div class="block block-two"></div>
            <div class="block block-three"></div>
            <div class="block block-four"></div>
            <img class="avatar" :src="$route.name == 'teams' ? team.Organization?.logo + '?h=150' : team.Game?.icon + '?h=150'" alt="..." />
            <!-- <base-button :loading="loading.deleting" v-if="edit && team.id && !deleted" type="danger" class="float-right" style="position: absolute; right: 0; top: 0;" icon><i class="fas fa-times"></i></base-button> -->
            <base-input
                v-if="edit"
                v-model="team.name"
                type="name"
                placeholder="Team Name"
            >
            </base-input>
            <h3 v-else class="title">{{ `${team.name}` }}</h3>
            <div class="card-body">
                <team-player-list :edit="edit" :team="team"></team-player-list>
                <div class="row">
                    <div v-if="currentUserIsCaptain || edit" class="col-12">
                        <base-button
                            class="float-left"
                            type="primary"
                            :loading="loading.saving"
                            @click="team?.save()"
                            >{{
                                !loading.saving
                                    ? $t('common.save').toString().toUpperCase()
                                    : ''
                            }}</base-button
                        >
                        <base-button
                            class="float-right"
                            type="info"
                            icon
                            @click="showAddMemberModal = true"
                            ><i class="fas fa-plus"
                        /></base-button>
                    </div>
                    <!-- <div class="col-12">
                        <base-alert dismissible v-if="failedSave" type="danger"
                            >Failed to save Team</base-alert
                        >
                        <base-alert
                            dismissible
                            v-if="successSave"
                            type="success"
                            >Saved Team</base-alert
                        >
                    </div> -->
                </div>
            </div>
        </div>
        <div class="text-center" v-if="list">
            <h4 type="primary" class="text-muted">
                {{
                    team.Organization?.name != team.name
                        ? team.Organization?.name
                        : ''
                }}
            </h4>
        </div>
        <select-member :show.sync="showAddMemberModal" :members="members" :handleMember="(member) => { addPlayer(member.player) }"></select-member>
    </card>
</template>
<script lang="ts">
import { Vue, Prop, Component } from 'vue-property-decorator';
import { BaseTable, Modal, BaseAlert } from '../../components';
import { SelectMember, TeamPlayerList } from '../../components/Organizations';
import { Member, Team } from '../../classes';
import { ApiPlayer } from 'buk-gg';

@Component({
    name: 'team-card',
    props: {
        team: {
            type: Object,
            default: () => {
                return {};
            },
        },
        edit: {
            type: Boolean,
            default: () => {
                return false;
            },
        },
        list: {
            type: Boolean,
            default: () => {
                return false;
            },
        },
    },
    components: {
        BaseTable,
        Modal,
        BaseAlert,
        SelectMember,
        TeamPlayerList,
    },
})
export default class TeamCard extends Vue {
    public loading = {
        saving: false,
        deleting: false,
    };
    public team?: Team;
    public edit?: boolean;
    public list?: boolean;

    public deleted: boolean = false;

    public addMemberField: string = '';
    public failedAdd: boolean = false;
    public showAddMemberModal: boolean = false;

    public players: ApiPlayer[] = [];

    public mounted() {
        if (this.team) {
            if (this.$organizations.current?.id === this.team.organizationId) {
            }
        }
    }

    public get currentUserIsCaptain() {
        return this.team?.members.some((i: Member) => i.playerId === this.$session.currentUser.id);
    }

    public get members() {
        return this.currentUserIsCaptain || this.edit ? this.$organizations.current?.members ?? [] : [];
    };
}
</script>
<style></style>
