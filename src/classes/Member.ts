import { ApiMember } from 'buk-gg';

export default class Member implements ApiMember {
    public playerId;
    public role;
    public player;

    constructor(i: ApiMember) {
        this.playerId = i.playerId;
        this.role = i.role;
        this.player = i.player;
    }
}