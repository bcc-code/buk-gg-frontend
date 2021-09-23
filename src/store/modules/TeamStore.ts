import api from '@/services/api';
import { RootStore } from '@/store';
import CrudStore, { CrudState } from './base/CrudStore';
import { Team } from '@/classes';

export interface TeamState extends CrudState<Team, string> {
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
        });

        this.mutations = {
            ...this.mutations,
        };

        this.actions = {
            ...this.actions,
        };

        this.getters = {
            ...this.getters,
        };
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
