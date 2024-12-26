declare global { 

    type PlayerStats = {
        playerId: number,
        abbrevName: string,
        playerFullName: string,
        player: string,
        pos: string,
        currentTeamName: string,
        currentTeamAbbrevName: string,
        currentTeamId: number,
        currentTeamLocation: string,
        currentTeamLevel: string,
        currentOrg: string,
        newestTeamName: string,
        newestTeamAbbrevName: string,
        newestTeamId: number,
        newestTeamLocation: string,
        newestTeamLevel: string,
        newestOrg: string,
        batsHand: string,
        throwsHand: string,
        PA: number,
        AB: number,
        H: number,
        HR: number,
        BB: number,
        K: number,
        HBP: number,
        SF: number,
        TB: number,
        RBI: number,
        gameId: number,
        opponentId: number,
        opponentToken: string,
        opponent: string,
        date: string,
        result: string,
        win: boolean,
        home: boolean,
        away: boolean,
        playerImage: string,
        teamImage: string,
        oppImage: string
    }

}

export { type PlayerStats };
