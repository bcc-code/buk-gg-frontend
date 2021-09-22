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
            currentId: '',
        });

        this.mutations = {
            ...this.mutations,
            setAll: (state: TournamentState, items: Tournament[]) => {
                state.all = items;
            },
            setCurrent: (state: TournamentState, item: string) => {
                state.currentId = item;
            },
        };

        this.actions = {
            ...this.actions,
        };

        // GETTERS //
        this.getters = {
            ...this.getters,
            current: (state: TournamentState) => {
                return state.all.find(i => i.id === state.currentId);
            },
        };
    }

    protected getItemId(item?: object | Tournament | undefined) {
        if (item) {
            return (item as Tournament).id;
        }
    }
    protected async loadAllFromSource(): Promise<Tournament[]> {
        const tournaments = (await api.tournaments.getAll()).map(i => new Tournament(i));
        this.commit("setAll", tournaments);
        return tournaments;
    }
}
