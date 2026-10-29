class Store {
    getScore() {
        const score = sessionStorage.getItem("score");
        if (score == null || isNaN(score)) {
            return this.resetScore();
        }
        return parseInt(score);
    }

    addScore() {
        const score = this.getScore() + 1;
        sessionStorage.setItem("score", score.toString());
        return score;
    }

    resetScore() {
        sessionStorage.setItem("score", "0");
        return 0;
    }
}
