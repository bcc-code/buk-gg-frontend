<template>
    <div class="row">
        <div class="col-12">
            <div class="row">
                <div
                    v-for="game in games"
                    :key="game.id"
                    class="col-xl-2 col-lg-3 col-md-4 mb-lg-5 col-sm-6 col-6 link-tile"
                    :class="selectedGame != game.id ? '' : 'selected'"
                    
                >
                    <div @click="selectedGame != game.id ? onSelectGame(game) : ''"
                    
                    :style="
                        selectedGame != game.id
                            ? `cursor: pointer;`
                            : 'cursor: unset;'
                    ">
                        <div class="link-tile-title text-center">
                            {{ game.name.toUpperCase() }}
                        </div>
                        <card
                            text-variant="light"
                            bg-variant="secondary"
                            class="tournament-card"
                        >
                            <img
                                slot="image-bottom"
                                class="card-img-bottom"
                                :src="game.icon ? game.icon + '' : ''"
                            />

                            <!-- {{ item.introduction }} -->
                        </card>
                    </div>
                </div>
            </div>
        </div>
        <!-- <div class="col-md-6 col-12" style="margin:auto;">
            <h1 slot="header" class="text-center">{{ $t('common.teams').toUpperCase() }}</h1>
            <div class="text-center">
                <img style="max-height:200px; margin:auto; margin-bottom: 20px;" :src="selectedGame ? selectedGame.icon ? selectedGame.icon : '' : ''"/>
            </div>
            <br />
            <base-dropdown title-classes="btn btn-primary" :title="selectedGame ? selectedGame.name.toUpperCase() : $t('common.game').toUpperCase()">
                <a v-for="game in games" :key="game._id" class="dropdown-item" @click="onSelectGame(game)">{{ game.name }}</a>
            </base-dropdown>
        </div> -->
        <div class="col-12" v-if="!loading">
            <div class="row">
                <div
                    v-for="team in teams"
                    :key="team.id"
                    class="col-12 col-sm-6 col-lg-3 col-md-4"
                    @click="
                        $router.push(`/organization/${team.organizationId}`)
                    "
                >
                    <team-card
                        style="cursor: pointer;"
                        :team="team"
                        :list="true"
                    ></team-card>
                </div>
            </div>
        </div>
        <div
            class="col-12"
            v-if="selectedGame && teams.length < 1 && !loading"
        >
            <h3 class="text-muted">{{ `No teams in ${games.find(i => i.id === selectedGame)?.name}` }}</h3>
        </div>
        <div v-else></div>
    </div>
</template>
<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import TeamCard from './TeamCard.vue';
import { Team } from '../../classes';
import { ApiGame } from 'buk-gg';
import api from '@/services/api';

@Component({
    components: {
        TeamCard,
    },
})
export default class TeamList extends Vue {
    public games: ApiGame[] = [];
    public teams: Team[] = [];
    public loading = false;
    public selectedGame = '';

    public async mounted() {
        this.games = await api.items.getGames();
    }

    public async onSelectGame(game: ApiGame) {
        this.loading = true;
        this.selectedGame = game.id;
        this.teams = ((await this.$teams.getTeamsInGame(
            game,
        )) as Team[]).filter((t) => t.isPublic);
        this.loading = false;
    }
}
</script>
