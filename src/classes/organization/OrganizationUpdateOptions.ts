import { ApiMemberUpdateOptions, ApiOrganization, ApiOrganizationUpdateOptions } from "buk-gg";
import { MemberUpdateOptions } from "..";

export default class OrganizationUpdateOptions implements ApiOrganizationUpdateOptions {
    private _original: ApiOrganization;
    private _updated: ApiOrganization;
    public image?: string;
    public members?: ApiMemberUpdateOptions;
    public name?: string;

    constructor(original: ApiOrganization, updated: ApiOrganization) {
        this._original = original;
        this._updated = updated;

        this.load();
    }

    private load() {
        const members = new MemberUpdateOptions(this._original.members, this._updated.members);

        this.members = members.updated ? members.getModel() : undefined;
        this.name = this._original.name !== this._updated.name ? this._updated.name : undefined;
    }

    public setImage(image: string) {
        this.image = image;
    }

    public get updated() {
        return this.image !== undefined || this.name !== undefined || this.members !== undefined;
    }

    public getModel(): ApiOrganizationUpdateOptions {
        return {
            image: this.image,
            members: this.members,
            name: this.name,
        }
    }
}