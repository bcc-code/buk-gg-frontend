<template>
    <base-table :data="team?.members">
        <template slot="columns">
            <th v-if="edit">Captain</th>
            <th>Name</th>
            <th v-if="!edit">Discord</th>
            <th v-if="edit || isCaptain">Remove</th>
        </template>
        <template slot-scope="{ row }" class="row text-left">
            <td v-if="edit">
                <base-button
                    v-if="
                        captain
                            ? row._id !== captain.playerId
                            : false
                    "
                    icon
                    type="success"
                    ><i
                        class="fas fa-check"
                        @click="setCaptain(row.playerId)"
                /></base-button>
                <base-button v-else icon type="success" disabled
                    ><i class="fas fa-check"
                /></base-button>
            </td>
            <td>{{ row.player.displayName }}</td>
            <td
                v-if="!edit"
                :class="
                    row.playerId === captain?.playerId ? 'text-bold' : ''
                "
            >
                {{ row.player.discordTag }}
            </td>
            <td v-if="edit || isCaptain">
                <base-button
                    v-if="
                        captain
                            ? row.playerId !== captain.playerId
                            : false || edit
                    "
                    class="btn-red"
                    type="danger"
                    icon
                    ><i
                        @click="removeTeamMember(row.playerId)"
                        class="fas fa-times"
                /></base-button>
            </td>
        </template>
    </base-table>
</template>
<script lang="ts">
import { BaseTable } from '..';
import { Component, Vue } from 'vue-property-decorator';
import { Team } from '../../classes';

@Component({
    components: {
        BaseTable,
    },
    props: {
        team: {
            required: true,
            type: Object,
            default: {},
        },
        edit: {
            type: Boolean,
            default: false,
        },
    },
})

export default class TeamPlayerList extends Vue {
    public team?: Team;
    public edit?: boolean;

    public get isCaptain() {
        return this.team?.members.some(i => i.playerId === this.$session.currentUser.id && i.role === 'captain') === true;
    }

    public get captain() {
        return this.team?.members.find(i => i.role === 'captain');
    }

    public removeTeamMember(id: string) {
        this.team?.removeMember(id);
    }

    public setCaptain(id: string) {
        this.team?.setCaptain(id);
    }
}
</script>