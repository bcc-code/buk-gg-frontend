import api from '@/services/api';
import store from '@/store';
import { ApiTeam } from 'buk-gg';
import { Member } from '..';
import TeamUpdateOptions from './TeamUpdateOptions';

export default class Team implements ApiTeam {
    private _original;
    public id;
    public members;
    public name;
    public organizationId;
    public gameId;

    constructor(i: ApiTeam) {
        this._original = i;
        this.id = i.id;
        this.members = i.members.map(i => new Member(i));
        this.name = i.name;
        this.organizationId = i.organizationId;
        this.gameId = i.gameId;
    }

    public getModel(): ApiTeam {
        return {
            id: this.id,
            members: this.members.map(i => i.getModel()),
            name: this.name,
            organizationId: this.organizationId,
            gameId: this.gameId,
        }
    }

    public async save() {
        const options = new TeamUpdateOptions(this._original, this.getModel());

        if (options.updated) {
            await api.teams.update(this.id, options.getModel());
        }
    }

    public get Organization() {
        return store.organizations.state.all.find(i => i.id === this.organizationId);
    }

    public get Game() {
        return store.session.state.games.find(i => i.id === this.gameId);
    }
}
