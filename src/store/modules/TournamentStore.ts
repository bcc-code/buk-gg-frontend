import api from '@/services/api';
import { RootStore } from '@/store';
import CrudStore, { CrudState } from './base/CrudStore';
import { Team } from '@/classes';
import Tournament from '@/classes/Tournament';

export interface TournamentState extends CrudState<Tournament, string> {}

export class TournamentStore extends CrudStore<
    Tournament,
    TournamentState,
    string
> {
    constructor(rootStore: RootStore) {
        super('tournaments', rootStore, {
            all: [],
            item: {},
        });

        this.mutations = {
            ...this.mutations,
        };

        this.actions = {
            ...this.actions,
        };

        // GETTERS //
        this.getters = {
            ...this.getters,
        };
    }

    protected getItemId(item?: object | Tournament | undefined) {
        if (item) {
            return (item as Tournament).id;
        }
    }
    protected async loadAllFromSource(): Promise<Tournament[]> {
        return (await api.tournaments.getAll()).map(i => new Tournament(i));
    }
}
