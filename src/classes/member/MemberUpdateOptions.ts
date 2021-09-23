import { ApiMember, ApiMemberUpdateOptions } from "buk-gg";

export default class MemberUpdateOptions implements ApiMemberUpdateOptions {
    private _original;
    private _updated;
    public addMembers: string[] = [];
    public removeMembers: string[] = [];
    public roleAssignments: {
        [key: string]: string;
    } = {};

    constructor(original: ApiMember[], updated: ApiMember[]) {
        this._original = original;
        this._updated = updated;

        this.load();        
    }

    private load() {
        for (const member of this._updated) {
            const originalMember = this._original.find(i => i.playerId === member.playerId);

            if (!originalMember) {
                this.addMembers.push(member.playerId);
                this.roleAssignments[member.playerId] = member.role;
            }
        }

        for (const member of this._original) {
            const currentMember = this._updated.some(i => i.playerId === member.playerId);

            if (!currentMember) {
                this.removeMembers.push(member.playerId);
            }
        }
    }

    public get updated() {
        return this.addMembers.length || this.removeMembers.length || Object.values(this.roleAssignments).length;
    }

    public getModel(): ApiMemberUpdateOptions {
        return {
            addMembers: this.addMembers,
            removeMembers: this.removeMembers,
            roleAssignments: this.roleAssignments,
        };
    }
}