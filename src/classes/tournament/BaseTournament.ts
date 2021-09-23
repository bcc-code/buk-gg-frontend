import { ApiBaseTournament } from "buk-gg";

export default class BaseTournament implements ApiBaseTournament {
    public id;
    public slug;
    public title;
    public logo;
    public liveStream;
    public signedUp;
    public responsible;

    constructor(i: ApiBaseTournament) {
        this.id = i.id;
        this.slug = i.slug;
        this.title = i.title;
        this.logo = i.logo;
        this.liveStream = i.liveStream;
        this.signedUp = i.signedUp;
        this.responsible = i.responsible;
    }
}