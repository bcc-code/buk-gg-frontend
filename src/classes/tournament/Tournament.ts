import api from "@/services/api";
import { ApiTournament } from "buk-gg";
import { Team } from "..";
import BaseTournament from "./BaseTournament";

export default class Tournament extends BaseTournament implements ApiTournament {
    public body;
    public image;
    public contacts;
    public maxPlayers;
    public minPlayers;
    public registrationOpen;
    public requiredInfo;
    public signupType;
    public teams;
    public winner;
    public telegramLink;
    public toornamentId;
    public platform;

    constructor(i: ApiTournament) {
        super(i);
        this.image = i.image;
        this.body = i.body;
        this.contacts = i.contacts;
        this.maxPlayers = i.maxPlayers;
        this.minPlayers = i.minPlayers;
        this.registrationOpen = i.registrationOpen;
        this.requiredInfo = i.requiredInfo;
        this.signupType = i.signupType;
        this.teams = i.teams.map(i => new Team(i));
        this.winner = i.winner ? new Team(i.winner) : null;
        this.telegramLink = i.telegramLink;
        this.toornamentId = i.toornamentId;
        this.platform = i.platform;
    }

    public async register(information: string[], team?: Team) {
        if (this.signupType === "player") {
            if (this.signedUp) return;
            await api.tournaments.register(this.id, information);
            this.signedUp = true;
        } else if (team?.id) {
            await api.tournaments.registerTeam(this.id, team.id, information);
            this.teams.push(team);
        }
    }

    public isEligible(team: Team): boolean {
        return team.members.length >= this.minPlayers && team.members.length <= this.maxPlayers;
    }

    public isSignedUp(team: Team): boolean {
        return this.teams.some(i => i.id === team.id);
    }
}