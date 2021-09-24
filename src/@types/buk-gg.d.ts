declare module 'buk-gg' {
    interface ApiObject {
        id: string;
        name: string;
        members: ApiMember[];
    }

    interface ApiUpdateOptions {
        name?: string;
        members?: ApiMemberUpdateOptions;
    }

    interface ApiBaseTournament {
        id: string;
        slug: string;
        title: string;
        logo: string;
        liveStream: string;
        signedUp: boolean;
        responsible: boolean;
    }

    interface ApiTournament extends ApiBaseTournament {
        image: string;
        body: string;
        telegramLink: string;
        registrationOpen: boolean;
        maxPlayers: number;
        minPlayers: number;
        contacts: ApiContact[];
        signupType: ParticipantType;
        requiredInfo: string[];
        winner: ApiTeam | null;
        toornamentId: string;
        teams: ApiTeam[];
        platform: string;
    }

    type ParticipantType = 'team' | 'player';

    interface ApiTeam extends ApiObject {
        organizationId: string;
    }

    interface ApiTeamCreateOptions {
        name: string;
        organizationId: string;
        captainId: string;
        gameId: string;
    }

    interface ApiTeamUpdateOptions extends ApiUpdateOptions {
    }

    interface ApiPlayer {
        id: string;
        displayName: string;
        discordTag: string;
        name: string;
        phoneNumber: string;
        location: string;
        email: string;
    }

    interface ApiAdminPlayer extends ApiPlayer {

    }

    interface ApiUser {
        id: string;
        personId: string;
        email: string;
        phoneNumber: string;
        name: string;
        nickname: string;
        displayName: string;
        location: string;
        noNbIsStandard: boolean;
        isO18: boolean;
        discordUser?: string;
        discordId?: string;
        discordIsConnected: boolean;
        enableMoreDiscords: boolean;
        moreDiscordUsers: Array<{
            name: string;
            discordId: string;
        }>;
        dateRegistered: string;
        dateLastActive: string;
        isRegistered: boolean;
    }

    interface ApiUserUpdateOptions {
        nickname?: string;
        phoneNumber?: string;
        discordId?: string;
        discordUser?: string;
    }

    interface ApiParticipant {
        id: string;
        type: ParticipantType;
        information: string[];
        toornamentId: string;
        players: ApiAdminPlayer[];
        team?: ApiTeam;
    }

    interface ApiOrganization extends ApiObject {
        invitations: ApiInvitation[];
        logo: string;
    }

    interface ApiOrganizationCreateOptions {
        name: string;
    }

    interface ApiOrganizationUpdateOptions extends ApiUpdateOptions {
        /**
         * @summary Base64 encoded image.
         */
        image?: string;
    }

    interface ApiMemberUpdateOptions {
        addMembers: string[];
        removeMembers: string[];
        roleAssignments: {
            [key: string]: string;
        };
    }

    interface ApiMember {
        playerId: string;
        role: ApiRole;
        player?: ApiPlayer;
    }

    type ApiRole = 'member' | 'captain' | 'officer' | 'owner';

    interface ApiInvitation {
        playerId: string;
        type: InvitationType;
        player?: ApiPlayer;
    }

    type InvitationType = 'invitation' | 'request';

    interface ApiBaseItem {
        id: string;
        name: string;
    }

    interface ApiGame extends ApiBaseItem {
        hasTeams: boolean;
        icon: string;
    }

    interface ApiContact {
        name: string;
        email: string;
        discord: string;
        phoneNumber: string;
    }
}
