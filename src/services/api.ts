import http from '@/services/http';
import Vue, { PluginObject } from 'vue';

import { LocaleMessageObject } from 'vue-i18n';
import { ApiUser, ApiUserUpdateOptions, ApiOrganization, ApiOrganizationCreateOptions, ApiOrganizationUpdateOptions, ApiTeam, ApiTeamCreateOptions, ApiTeamUpdateOptions, ApiMemberUpdateOptions, ApiTournament, ApiParticipant, ApiGame } from 'buk-gg';

export class Api implements PluginObject<any> {
    public localization = {
        getLang(lang: string) {
            return http.get<LocaleMessageObject>(`localization/${lang}`);
        },
    };

    public session = {
        getCurrentSession() {
            return http.get<ApiUser>('Session');
        },
        updateCurrentUser(options: ApiUserUpdateOptions) {
            return http.put<void>('Session', options);
        },
    };

    public organizations = {
        get(id: string) {
            return http.get<ApiOrganization>(`Organizations/${id}`)
        },
        getAll() {
            return http.get<ApiOrganization[]>('Organizations');
        },
        create(options: ApiOrganizationCreateOptions) {
            return http.post<ApiOrganization>('Organizations', options);
        },
        update(id: string, options: ApiOrganizationUpdateOptions) {
            return http.patch<void>(`Organizations/${id}`, options);
        },
        join(id: string) {
            return http.get<void>(`Organizations/${id}`);
        },
    };

    public teams = {
        getMine() {
            return http.get<ApiTeam[]>('Teams');
        },
        create(options: ApiTeamCreateOptions) {
            return http.post<ApiTeam>('Teams', options);
        },
        getInGame(gameId: string) {
            return http.get<ApiTeam[]>(`Teams/Game/${gameId}`);
        },
        getInOrganization(organizationId: string) {
            return http.get<ApiTeam[]>(`Teams/Organization/${organizationId}`);
        },
        delete(id: string) {
            return http.delete<void>(`Teams/${id}`);
        },
        update(id: string, options: ApiTeamUpdateOptions) {
            return http.patch<void>(`Teams/${id}`, options);
        },
    };

    public tournaments = {
        get(id: string) {
            return http.get<ApiTournament>(`Tournaments/${id}`);
        },
        getAll() {
            return http.get<ApiTournament[]>('Tournaments');
        },
        getParticipants(id: string) {
            return http.get<ApiParticipant[]>(`Tournaments/${id}/Participants`);
        },
        register(id: string, information: string[]) {
            return http.post<void>(`Tournaments/${id}/Participants`, information)
        },
        registerTeam(id: string, teamId: string, information: string[]) {
            return http.post<void>(`Tournaments/${id}/Participants/${teamId}`, information)
        },
    };

    public discord = {
        searchForMember(search: string) {
            return http.get<any>(`discord/search/${search}`);
        },
        isConnected(id: string) {
            return http.get<boolean>(`discord/connected/${id}`);
        },
    };

    public items = {
        getGames() {
            return http.get<ApiGame[]>('Items/Games');
        },
    }

    // Installer
    public install(vue: typeof Vue, options?: any) {
        vue.prototype.$api = this;
    }
}

const api = new Api();

export default api;
