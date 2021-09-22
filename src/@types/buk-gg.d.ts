declare module 'buk-gg' {
    interface ApiTournament {
        id: string;
        title: string;
        body: string;
        registrationOpen: boolean;
        liveStream: string;
        maxPlayers: number;
        minPlayers: number;
        contacts: ApiContact[];
        signupType: ParticipantType;
        requiredInfo: string[];
        winner: ApiTeam | null;
        teams: ApiTeam[];
        signedUp: boolean;
    }

    type ParticipantType = 'team' | 'player';

    interface ApiTeam {
        id: string;
        name: string;
        organizationId: string;
        members: ApiMember[];
    }

    interface ApiTeamCreateOptions {
        name: string;
        organizationId: string;
        captainId: string;
        gameId: string;
    }

    interface ApiTeamUpdateOptions {
        name: string;
        members: ApiMemberUpdateOptions;
    }

    interface ApiPlayer {
        id: string;
        displayName: string;
        discordTag: string;
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
        discordUser: string;
        discordId: string;
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
        nickname: string;
        phoneNumber: string;
        discordId: string;
        discordUser: string;
    }

    interface ApiParticipant {
        id: string;
        type: ParticipantType;
        information: string[];
        toornamentId: string;
        player?: ApiPlayer;
        team?: ApiTeam;
    }

    interface ApiOrganization {
        id: string;
        name: string;
        members: ApiMember[];
        invitations: ApiInvitation[];
        logo: string;
    }

    interface ApiOrganizationCreateOptions {
        name: string;
    }

    interface ApiOrganizationUpdateOptions {
        name: string;
        /**
         * @summary Base64 encoded image.
         */
        image: string;
        members: ApiMemberUpdateOptions;
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
