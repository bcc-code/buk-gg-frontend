import { ApiOrganization, ApiOrganizationUpdateOptions } from "buk-gg";
import { UpdateOptions } from "..";

export default class OrganizationUpdateOptions extends UpdateOptions<ApiOrganization> implements ApiOrganizationUpdateOptions {
    public image?: string;
    
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