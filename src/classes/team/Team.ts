import api from '@/services/api';
import { ApiTeam } from 'buk-gg';
import { Member } from '..';
import TeamUpdateOptions from './TeamUpdateOptions';

export default class Team implements ApiTeam {
    private _original;
    public id;
    public members;
    public name;
    public organizationId;

    constructor(i: ApiTeam) {
        this._original = i;
        this.id = i.id;
        this.members = i.members.map(i => new Member(i));
        this.name = i.name;
        this.organizationId = i.organizationId;
    }

    public getModel(): ApiTeam {
        return {
            id: this.id,
            members: this.members.map(i => i.getModel()),
            name: this.name,
            organizationId: this.organizationId,
        }
    }

    public async save() {
        const options = new TeamUpdateOptions(this._original, this.getModel());

        if (options.updated) {
            await api.teams.update(this.id, options.getModel());
        }
    }
}
