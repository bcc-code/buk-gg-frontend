import api from '@/services/api';
import { RootStore } from '@/store';
import CrudStore, { CrudState } from './base/CrudStore';
import { Team } from '@/classes';

export interface TeamState extends CrudState<Team, string> {
    teams: KeyedTeamEntry[];
}

export type KeyedTeamEntry = {
    key: string;
    items: Team[];
}

export class TeamStore extends CrudStore<Team, TeamState, string> {
    constructor(rootStore: RootStore) {
        super('teams', rootStore, {
            all: [],
            item: {},
            teams: [],
        });

        this.mutations = {
            ...this.mutations,
            addTeamEntry(state, entry: KeyedTeamEntry) {
                state.teams.push(entry);
            }
        };

        this.actions = {
            ...this.actions,
            getTeamsInGame: async (store, id: string) => {
                const key = "game_" + id;
                let entry: KeyedTeamEntry | undefined = store.state.teams.find(e => e.key === key);

                if (!entry) {
                    entry = {
                        key,
                        items: (await api.teams.getInGame(id)).map(i => new Team(i)),
                    };
                    store.commit('addTeamEntry', entry);
                }

                return entry;
            },
            getTeamsInOrganization: async (store, id: string) => {
                const key = "organization_" + id;
                let entry: KeyedTeamEntry | undefined = store.state.teams.find(e => e.key === key);

                if (!entry) {
                    entry = {
                        key,
                        items: (await api.teams.getInOrganization(id)).map(i => new Team(i)),
                    };
                    store.commit('addTeamEntry', entry);
                }
                
                return entry;
            },
            // getTeamsInTournament: async (store, id: string) => {
            //     const key = "tournament_" + id;
            //     let entry: KeyedTeamEntry | undefined = store.state.teams.find(e => e.key === key);

            //     if (!entry) {
            //         entry = {
            //             key,
            //             items: (await api.tournaments.getTeams(id)).map(i => new Team(i)),
            //         };
            //         store.commit('addTeamEntry', entry);
            //     }
                
            //     return entry;
            // }
        };

        this.getters = {
            ...this.getters,
        };
    }

    public getInGame(id: string) {
        return this.dispatch("getTeamsInGame", id) as Promise<Team[]>
    }
    public getInOrganization(id: string) {
        return this.dispatch("getTeamsInOrganization", id) as Promise<Team[]>
    }

    protected getItemId(item?: object | Team | undefined) {
        if (item) {
            return (item as Team).id;
        }
    }

    protected async loadAllFromSource(): Promise<Team[]> {
        return (await api.teams.getMine()).map(i => new Team(i));
    }
}
