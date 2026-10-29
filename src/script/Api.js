class Api {
    path = ".";

    async getScores() {
        console.warn("Scores are unavailable");
        return;

        try {
            const scoresReq = new Request(
                this.path + "/api/scores/getScores.php"
            );
            const scoresRes = await fetch(scoresReq);
            const scores = await scoresRes.json();

            return scores;
        } catch (err) {
            console.error(err);
        }
    }

    async saveScore(pseudo, score) {
        console.warn("Scores are unavailable");
        return;
        
        try {
            const scoresReq = new Request(
                this.path + "/api/scores/saveScore.php",
                {
                    method: "POST",
                    body: JSON.stringify({ pseudo, score }),
                }
            );

            return await fetch(scoresReq);
        } catch (err) {
            console.error(err);
        }
    }
}
