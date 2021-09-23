import api from "@/services/api";
import { ApiUser } from "buk-gg";

export default class User implements ApiUser {
    public id;
    public dateLastActive;
    public dateRegistered;
    public discordId;
    public discordIsConnected;
    public discordUser;
    public displayName;
    public email;
    public enableMoreDiscords;
    public isO18;
    public isRegistered;
    public location;
    public moreDiscordUsers;
    public name;
    public nickname;
    public noNbIsStandard;
    public personId;
    public phoneNumber;

    constructor(i: ApiUser){
        this.id = i.id;
        this.dateLastActive = i.dateLastActive;
        this.dateRegistered = i.dateRegistered;
        this.discordId = i.discordId;
        this.discordIsConnected = i.discordIsConnected;
        this.discordUser = i.discordUser;
        this.displayName = i.displayName;
        this.email = i.email;
        this.enableMoreDiscords = i.enableMoreDiscords;
        this.isO18 = i.isO18;
        this.isRegistered = i.isRegistered;
        this.location = i.location;
        this.moreDiscordUsers = i.moreDiscordUsers;
        this.name = i.name;
        this.nickname = i.nickname;
        this.noNbIsStandard = i.noNbIsStandard;
        this.personId = i.personId;
        this.phoneNumber = i.phoneNumber;
    }

    public loading = false;

    public async save() {
        this.loading = true;
        await api.session.updateCurrentUser({
            discordId: this.discordId,
            discordUser: this.discordUser,
            nickname: this.nickname,
            phoneNumber: this.phoneNumber,
        });
        this.loading = false;
    }
}