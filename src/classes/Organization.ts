import { ApiOrganization } from "buk-gg";
import { Member } from ".";

export default class Organization implements ApiOrganization {
    public id;
    public name;
    public invitations;
    public members;
    public logo;

    constructor(i: ApiOrganization) {
        this.id = i.id;
        this.invitations = i.invitations;
        this.logo = i.logo;
        this.members = i.members.map(i => new Member(i));
        this.name = i.name;
    }
}