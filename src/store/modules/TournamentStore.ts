import api from '@/services/api';
import { RootStore } from '@/store';
import CrudStore, { CrudState } from './base/CrudStore';
import { BaseTournament, Tournament } from '@/classes';

export interface TournamentState extends CrudState<Tournament, string> {
    tournaments: BaseTournament[];
}

export class TournamentStore extends CrudStore<
    Tournament,
    TournamentState,
    string
> {
    constructor(rootStore: RootStore) {
        super('tournaments', rootStore, {
            all: [],
            item: {},
            tournaments: [],
        });

        this.mutations = {
            ...this.mutations,
            tournaments: (state, tournaments: BaseTournament[]) => {
                state.tournaments = tournaments;
            }
        };

        this.actions = {
            ...this.actions,
            load: async ({state}, id: string) => {
                const tournament = state.tournaments.find(i => i.id === id || i.slug === id);
                if (tournament) {
                    this.setCurrent(tournament.id);
                    if (!this.getItem(tournament.id)) {
                        this.updateItem(new Tournament(await api.tournaments.get(tournament.id)));
                    }
                }
            }
        };

        // GETTERS //
        this.getters = {
            ...this.getters,
            tournaments: (state) => state.tournaments,
        };
    }

    private async loadTournaments() {
        const tournaments = await api.tournaments.getAll();
        this.commit('tournaments', tournaments.map(i => new BaseTournament(i)));
    }

    public load(id: string) {
        return this.dispatch('load', id);
    }

    protected getItemId(item?: object | Tournament | undefined) {
        if (item) {
            return (item as Tournament).id;
        }
    }
    protected async loadAllFromSource(): Promise<Tournament[]> {
        await this.loadTournaments();
        return [];
    }
}
