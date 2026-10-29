class ImageScanner {
    image;

    constructor(image) {
        this.image = image;
    }

    generateStats() {
        const data = this.image.getImageData(
            0,
            0,
            this.image.canvas.width,
            this.image.canvas.height
        ).data;

        const statsRefs = {};

        let stats = [];

        // Get all colors
        for (let i = 0; i < data.length; i += 4) {
            const index = `${data[i]},${data[i + 1]},${data[i + 2]}`;
            if (statsRefs[index]) stats[statsRefs[index]].value++;
            else {
                stats.push({
                    label: index,
                    value: 1,
                });
                statsRefs[index] = stats.length - 1;
            }
        }

        // The most present first
        stats.sort((a, b) => b.value - a.value);

        // Group by
        stats = this.groupByDistance(stats, 10);

        // The less present first
        stats.sort((a, b) => a.value - b.value);

        // The last 20th
        stats = stats.slice(stats.length - 20, stats.length);

        this.generateChart(stats);
    }

    groupByDistance(stats, maxDist) {
        const groupedStatsRefs = {};
        const groupedStats = [];
        for (let a = 0; a < stats.length - 1; a++) {
            const statA = stats[a];
            if (!statA.isGrouped) {
                groupedStats.push({
                    label: statA.label,
                    value: 1,
                });
                groupedStatsRefs[statA.label] = groupedStats.length - 1;

                for (let b = a + 1; b < stats.length; b++) {
                    const statB = stats[b];
                    if (!statB.isGrouped) {
                        if (
                            this.calcDistance(statA.label, statB.label) <
                            maxDist
                        ) {
                            groupedStats[groupedStatsRefs[statA.label]].value++;
                            statB.isGrouped = true;
                        }
                    }
                }
            }
        }
        return groupedStats;
    }

    calcDistance(rbg1, rbg2) {
        const rgb1 = rbg1.split(",");
        const rgb2 = rbg2.split(",");

        const lab1 = rgb2lab(rgb1);
        const lab2 = rgb2lab(rgb2);

        return deltaE(lab1, lab2);
    }

    generateChart(stats) {
        const ctx = document.getElementById("chart");

        const labels = [],
            values = [],
            backgroundColor = [];

        for (const stat of stats) {
            labels.push("");
            values.push(stat.value);
            backgroundColor.push(`rgb(${stat.label})`);
        }

        new Chart(ctx, {
            type: "bar",
            data: {
                labels: labels,
                datasets: [
                    {
                        data: values,
                        backgroundColor: backgroundColor,
                        borderWidth: 1,
                    },
                ],
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            display: false,
                        },
                    },
                },
                plugins: {
                    legend: {
                        display: false,
                    },
                },
                animation: {
                    onComplete: function (chart) {
                        if (chart.initial) {
                            document.getElementById("overlay").style.display =
                                "none";
                        }
                    },
                },
            },
        });
    }
}
