const toFrenchDate = require('./toFrenchDate');

const timeAgo = (answerDate) => {

    const currentTimestamp = toFrenchDate(new Date());
    const answerTimestamp = Date.parse(answerDate);
    const timeDiffInSeconds = Math.floor((currentTimestamp - answerTimestamp) / 1000);
    if (timeDiffInSeconds < 60) {

        return timeDiffInSeconds == 0 ? `Posté à l'instant ` : `Posté il y a ${timeDiffInSeconds} seconde${timeDiffInSeconds >= 2 ? "s" : ""}`

    } else {

        const minutes = Math.floor(timeDiffInSeconds / 60);
        if (minutes < 60) {

            return `Posté il y a ${minutes} minute${minutes >= 2 ? "s" : ""}`;

        } else {

            const hours = Math.floor(timeDiffInSeconds / 3600);
            if (hours < 24) {
                return `Posté il y a ${hours} heure${hours >= 2 ? "s" : ""}`;

            } else {

                const days = Math.floor(timeDiffInSeconds / (3600 * 24));
                if (days < 365) {
                    return `Posté il y a ${days} jour${days >= 2 ? "s" : ""}`;

                } else {

                    const years = Math.floor(timeDiffInSeconds / (3600 * 24 * 365));
                    return `Posté il y a ${years} an${years >= 2 ? "s" : ""}`;
                }
            }
        }
    }



}

module.exports = timeAgo