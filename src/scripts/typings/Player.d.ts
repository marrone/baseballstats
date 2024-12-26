declare global { 

    type Player = {
        playerId: number,
        playerFullName: string,
        playerImage: string,
        teamImage: string,
    }

    type PlayerMap = {[id:number]: Player}
}

export { type Player, type PlayerMap };
