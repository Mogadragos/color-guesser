class ImagesGetter {
    images = [];

    size = 400;
    defaultNumber = 3;
    number;
    score;

    rightIndex;

    store;
    api;

    constructor(store, api) {
        this.store = store;
        this.api = api;

        this.score = store.getScore();
        document.getElementById("score").innerHTML = this.score;
        this.number = this.score + this.defaultNumber;
    }

    async loadImages(parentId) {
        const promises = [];
        const sources = [];
        let delta = 0;

        const parent = document.getElementById(parentId);

        for (let i = 0; i < this.number; i++) {
            const canvas = document.createElement("canvas");
            canvas.width = this.size;
            canvas.height = this.size;
            canvas.style.cursor = "pointer";
            const currentIndex = i;
            canvas.addEventListener("click", () =>
                this.isRightImage(currentIndex)
            );
            const ctx = canvas.getContext("2d");

            const img = new Image();
            img.crossOrigin = "anonymous";

            // get random src
            let source = (
                await fetch(
                    `https://picsum.photos/${this.size}?random=${i + delta}`
                )
            ).url;
            while (sources.includes(source)) {
                delta++;
                source = (
                    await fetch(
                        `https://picsum.photos/${this.size}?random=${i + delta}`
                    )
                ).url;
            }
            sources.push(source);

            img.src = source;

            promises.push(
                new Promise((resolve) => {
                    img.addEventListener("load", () => {
                        ctx.drawImage(img, 0, 0);
                        img.style.display = "none";
                        resolve();
                    });
                })
            );

            this.images.push(ctx);
            parent.appendChild(canvas);
        }

        return Promise.all(promises);
    }

    getRandomImage() {
        this.rightIndex = Math.floor(Math.random() * this.images.length);
        return this.images[this.rightIndex];
    }

    async isRightImage(index) {
        if (this.rightIndex == index) {
            this.store.addScore();
            const restart = confirm("Well done !!! Continue ?");
            if (restart) {
                location.reload();
            }
        } else {
            this.store.resetScore();
            window.scroll(0, this.images[this.rightIndex].canvas.offsetTop);
            this.images[this.rightIndex].canvas.style.border = "solid 5px red";

            await new Promise((resolve) => setTimeout(resolve, 10));

            alert("Looser !!! Score : " + this.score);

            /*
            let pseudo = "";

            do {
                pseudo = prompt(
                    "Looser !!! Score : " +
                        this.score +
                        "\nTo save, enter your nickname (length < 21). Leave empty to ignore."
                );
            } while (pseudo && pseudo.length > 20);

            if (pseudo) await this.api.saveScore(pseudo, this.score);
            */

            const restart = confirm("Restart ?");

            if (restart) {
                location.reload();
            }
        }
    }
}
