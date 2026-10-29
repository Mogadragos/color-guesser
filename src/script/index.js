(async () => {
    // Get scores
    const api = new Api();

    const scores = await api.getScores();

    if (scores) {
        const scoresDOM = document.getElementById("scoresBody");
        for (const score of scores) {
            const row = scoresDOM.insertRow();
            row.insertCell(0).innerHTML = score.pseudo;
            row.insertCell(1).innerHTML = score.score;
        }
    }
    // Get store
    const store = new Store();

    // Generate images
    const imageGetter = new ImagesGetter(store, api);

    await imageGetter.loadImages("images");

    const imageScanner = new ImageScanner(imageGetter.getRandomImage());

    imageScanner.generateStats("stats");
})();
