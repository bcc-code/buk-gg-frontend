import { ApiTeam, ApiTeamUpdateOptions } from "buk-gg";
import { UpdateOptions } from "..";

export default class TeamUpdateOptions extends UpdateOptions<ApiTeam> implements ApiTeamUpdateOptions {
    public get updated() {
        return this.name !== undefined || this.members !== undefined;
    }

    public getModel(): ApiTeamUpdateOptions {
        return {
            members: this.members,
            name: this.name,
        }
    }
}