import api from '@/services/api';
import { RootStore, teams } from '@/store';
import CrudStore, { CrudState } from './base/CrudStore';
import { Team } from '@/classes';

export interface TeamState extends CrudState<Team, string> {
    currentTeams: Team[];
    teams: Team[];
}

export class TeamStore extends CrudStore<Team, TeamState, string> {
    constructor(rootStore: RootStore) {
        super('teams', rootStore, {
            all: [],
            item: {},
            currentTeams: [],
            teams: [],
        });

        this.mutations = {
            ...this.mutations,
            addPlayer: (state, obj: { team: Team; player: Player }) => {
                obj.team.addPlayer(obj.player);
                this.updateItem(obj.team);
            },
            removePlayer: (state, obj: { team: Team; player: Player }) => {
                obj.team.removePlayer(obj.player);
                this.updateItem(obj.team);
            },
            setCaptain: (state, obj: { team: Team; player: Player }) => {
                obj.team.setCaptain(obj.player);
                this.updateItem(obj.team);
            },
            setCurrentTeams: (state, items) => {
                state.currentTeams = items;
            },
            addTeam: (state, item) => {
                state.currentTeams.push(item);
            },
            setTeams: (state, items: Team[]) => {
                state.teams = items;
            },
        };

        this.actions = {
            ...this.actions,
            getTeamsInGame: ({ commit }, gameId: string) => {
                return api.teams.getTeamsInGame(gameId);
            },
            addTeam: async ({ commit }, team: Team) => {
                if (team.organizationId && team.captain && team.gameId) {
                    const result = await api.teams.addTeam(team);
                    this.commit('addTeam', result);
                    return result;
                }
                return new Team();
            },
            updateTeam: ({ commit }, team: Team) => {
                return api.teams.updateTeam(team);
            },
            deleteTeam: async ({ commit }, team: Team) => {
                const result = await api.teams.deleteTeam(team);
                if (result) {
                    this.removeItem(team.id);
                }
                return result;
            },
            loadCurrentTeams: async ({ commit }, organizationId: string) => {
                const items = await api.teams.getTeamsInOrganization(organizationId);
                if (items.length > 0) {
                    this.commit('setCurrentTeams', items);
                    return items;
                }
                this.commit('setCurrentTeams', items);
                return [];
            },
            loadTeams: async ({ commit }) => {
                const items = await api.teams.getTeams();
                if (items?.length > 0) {
                    this.commit('setTeams', items);
                }
            },
        };

        this.getters = {
            ...this.getters,
        };
    }

    // ACTIONS
    public loadTeams = () => {
        return this.dispatch('loadTeams') as Promise<boolean>;
    }

    public getGames = () => {
        return api.teams.getGames();
    }

    public getTeams = (organizationId: string) => {
        return this.dispatch('loadCurrentTeams', organizationId) as Promise<
            Team[]
        >;
    }

    public getTeamsInGame = (game: Game) => {
        return api.teams.getTeamsInGame(game._id);
    }

    public createTeam = (team: Team) => {
        return this.dispatch('addTeam', team) as Promise<Team>;
    }

    // MEMBER MANAGEMENT
    public addPlayer = (team: Team, player: Player) => {
        this.commit('addPlayer', { team, player });
    }

    public removePlayer = (team: Team, player: Player) => {
        this.commit('removePlayer', { team, player });
    }

    public setCaptain = (team: Team, player: Player) => {
        this.commit('setCaptain', { team, player });
    }

    protected getItemId(item?: object | Team | undefined) {
        if (item) {
            return (item as Team).id;
        }
    }

    protected async loadAllFromSource(): Promise<Team[]> {
        await this.loadTeams();
        return [];
    }
}
