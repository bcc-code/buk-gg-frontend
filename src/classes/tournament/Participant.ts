import { ApiParticipant } from "buk-gg";
import { Team } from "..";
import User from "../User";

export default class Participant implements ApiParticipant {
    public id;
    public information;
    public players;
    public team;
    public toornamentId;
    public type;

    constructor(i: ApiParticipant) {
        this.id = i.id;
        this.information = i.information;
        this.players = i.players;
        this.team = i.team ? new Team(i.team) : undefined;
        this.toornamentId = i.toornamentId;;
        this.type = i.type;
    }
}