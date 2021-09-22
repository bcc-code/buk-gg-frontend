import { ApiTeam } from 'buk-gg';
import { Member } from '.';

export default class Team implements ApiTeam {
    public id;
    public members;
    public name;
    public organizationId;

    constructor(team: ApiTeam) {
        this.id = team.id;
        this.members = team.members.map(i => new Member(i));
        this.name = team.name;
        this.organizationId = team.organizationId;
    }
}
