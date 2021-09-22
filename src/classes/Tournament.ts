import api from "@/services/api";
import { ApiTournament } from "buk-gg";
import { Team } from ".";

export default class Tournament implements ApiTournament {
    public id;
    public body;
    public contacts;
    public liveStream;
    public maxPlayers;
    public minPlayers;
    public registrationOpen;
    public requiredInfo;
    public signupType;
    public teams;
    public title;
    public winner;
    public signedUp;

    constructor(i: ApiTournament) {
        this.id = i.id;
        this.body = i.body;
        this.contacts = i.contacts;
        this.liveStream = i.liveStream;
        this.maxPlayers = i.maxPlayers;
        this.minPlayers = i.minPlayers;
        this.registrationOpen = i.registrationOpen;
        this.requiredInfo = i.requiredInfo;
        this.signupType = i.signupType;
        this.teams = i.teams.map(i => new Team(i));
        this.title = i.title;
        this.winner = i.winner ? new Team(i.winner) : null;
        this.signedUp = i.signedUp;
    }

    public async Signup(information: string[], teamId?: string) {
        if (this.signedUp) return;
        
        if (this.signupType === "player") {
            await api.tournaments.register(this.id, information);
        } else if (teamId) {
            await api.tournaments.registerTeam(this.id, teamId, information);
        }
    }
}