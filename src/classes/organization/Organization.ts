import api from "@/services/api";
import { ApiOrganization, ApiOrganizationUpdateOptions } from "buk-gg";
import { Member, MemberUpdateOptions } from "..";
import OrganizationUpdateOptions from "./OrganizationUpdateOptions";

export default class Organization implements ApiOrganization {
    private _original: ApiOrganization;
    public id;
    public name;
    public invitations;
    public members: Member[];
    public logo;

    constructor(i: ApiOrganization) {
        this._original = i;
        this.id = i.id;
        this.invitations = i.invitations;
        this.logo = i.logo;
        this.members = i.members.map(i => new Member(i));
        this.name = i.name;
    }

    public getModel(): ApiOrganization {
        return {
            id: this.id,
            invitations: this.invitations,
            logo: this.logo,
            members: this.members.map(i => i.getModel()),
            name: this.name,
        }
    }

    public async save(image?: string) {
        const options = new OrganizationUpdateOptions(this._original, this.getModel());

        if (image) {
            options.setImage(image);
        }

        if (options.updated) {
            await api.organizations.update(this.id, options.getModel());
        }
    }
}