import api from '@/services/api';
import auth from '@/services/auth';
import router from '@/router';
import { RootStore } from '@/store';
import BaseStore from '@/store/modules/base/BaseStore';
import User from '@/classes/User';
import { ApiGame } from 'buk-gg';

export interface SessionState {
    currentUser?: User;
    isAuthenticated: boolean;
    isImpersonating: boolean;
    games: ApiGame[];
}

export class SessionStore extends BaseStore<SessionState> {
    constructor(rootStore: RootStore) {
        super('session', rootStore, {
            currentUser: undefined,
            isAuthenticated: false,
            isImpersonating: false,
            games: [],
        });

        // MUTATIONS //
        this.mutations = {
            ...this.mutations,
            setCurrentSession: (state, value: User) => {
                state.currentUser = value;
                if (value) {
                    state.isAuthenticated = true;
                } else {
                    state.isAuthenticated = false;
                    state.isImpersonating = false;
                }
            },
            clearCurrentSession: (state) => {
                state.currentUser = undefined;
                state.isAuthenticated = false;
            },
            setIsImpersonating: (state, value: boolean) => {
                state.isImpersonating = value;
            },
            setGames: (state, games: ApiGame[]) => {
                state.games = games;
            },
        };

        // ACTIONS //
        this.actions = {
            ...this.actions,
            loadCurrentSession: async (store): Promise<User> => {
                const session = new User(await api.session.getCurrentSession());
                this.setCurrentSession(session);
                store.commit('setGames', await api.items.getGames());
                return session;
            },
            startSession: async (store) => {
                if (auth.isAuthenticated()) {
                    // If already authenticated - load user
                    await this.loadCurrentSession();
                    if (
                        store.state.isImpersonating !== auth.isImpersonating()
                    ) {
                        this.setIsImpersonating(auth.isImpersonating());
                    }
                } else {
                    // If not authenticated - attempt to complete login and then load user
                    if (
                        (await auth.completeLogin()) &&
                        auth.isAuthenticated()
                    ) {
                        await this.loadCurrentSession();
                        router.push('/');
                    } else {
                        // If not authenticated - redirect to login
                        await this.login();
                    }
                }
            },
            login: ({ commit }) => {
                this.clearCurrentSession();
                auth.startLogin();
            },

            logout: ({ commit }) => {
                auth.clearSession();
                this.clearCurrentSession();
                // router.push('/login');
            },

            impersonate: async (store, email: string) => {
                auth.impersonate(email);
                this.setIsImpersonating(true);
                router.push('/');
                await this.loadCurrentSession();
            },
            endImpersonation: async (store) => {
                auth.endImpersonation();
                this.setIsImpersonating(false);
                this.setIsActing(false);
                router.push('/');
                await this.loadCurrentSession();
            },
        };

        // GETTERS //
        this.getters = {
            ...this.getters,
            isLoggedIn: (state) =>
                state.currentUser !== null && state.currentUser !== undefined,
            currentUser: (state) => state.currentUser,
        };
    }

    // TYPED MUTATIONS //
    public setIsImpersonating = (value: boolean) =>
        this.commit('setIsImpersonating', value)
    public setIsActing = (value: boolean) => this.commit('setIsActing', value);
    public clearCurrentSession = () => this.commit('clearCurrentSession');
    public setCurrentSession = (session: User) =>
        this.commit('setCurrentSession', session)

    // TYPED ACTIONS //
    public startSession = () => this.dispatch('startSession');
    public loadCurrentSession = () =>
        this.dispatch('loadCurrentSession') as Promise<User>
    public impersonate = (email: string) => this.dispatch('impersonate', email);
    public endImpersonation = () => this.dispatch('endImpersonation');
    public login = () => this.dispatch('login');
    public logout = () => this.dispatch('logout');

    public get currentUser(): User {
        return this.read('currentUser');
    }

    // TYPED GETTERS //
    public get isLoggedIn(): boolean {
        return this.read('isLoggedIn');
    }
}
