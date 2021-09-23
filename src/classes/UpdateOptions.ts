import { ApiMemberUpdateOptions, ApiObject, ApiUpdateOptions } from "buk-gg";
import { MemberUpdateOptions } from ".";

export default abstract class UpdateOptions<T extends ApiObject> implements ApiUpdateOptions {
    protected _original;
    protected _updated;

    public name?: string;
    public members?: ApiMemberUpdateOptions;

    constructor(original: T, updated: T) {
        this._original = original;
        this._updated = updated;

        this.load();
    }

    protected load() {
        const members = new MemberUpdateOptions(this._original.members, this._updated.members);

        this.members = members.updated ? members.getModel() : undefined;
        this.name = this._original.name !== this._updated.name ? this._updated.name : undefined;
    }

    public abstract getModel(): ApiUpdateOptions;
    public abstract get updated(): boolean;
}