import api from '@/services/api';
import { RootStore, organizations } from '@/store';
import CrudStore, { CrudState } from './base/CrudStore';
import { Organization } from '@/classes';

export interface OrganizationState extends CrudState<Organization, string> {
}

export class OrganizationStore extends CrudStore<
    Organization,
    OrganizationState,
    string
> {
    constructor(rootStore: RootStore) {
        super('organizations', rootStore, {
            all: [],
            item: {},
        });

        this.mutations = {
            ...this.mutations,
        };

        this.actions = {
            ...this.actions,
        };

        // GETTERS //
        this.getters = {
            ...this.getters,
        };
    }

    protected getItemId(item?: object | Organization | undefined) {
        if (item) {
            return (item as Organization).id;
        }
    }
    protected async loadAllFromSource(): Promise<Organization[]> {
        return (await api.organizations.getAll()).map(i => new Organization(i));
    }
}
