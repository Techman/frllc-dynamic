// Functions for generating the dynamic cards
'use strict';

/** Player class
 * Represents a player
 *
 * I hate having uncombined information, so now both types of ranks are
 * available in a single object
 */
class Player {
    id = 0;
    infoRank = '';
    name = '';
    rosterRank = '';

    /** Constructor
     * @param {string} name The player name
     * @param {number} id The player ID
     */
    constructor(name, id) {
        this.name = name;
        this.id = id;
    }

    /** Get the player's ID
     * @return {number} id The player's ID
     */
    get id() {
        return this.id;
    }

    /** Get the player's rank from the info roster
     * @return {string} The player's rank
     */
    get infoRank() {
        return this.infoRank;
    }

    /** Get the player's name
     * @return {string} The player's name
     */
    get name() {
        return this.name;
    }

    /** Get the player's rank from the main roster
     * @return {string} The player's rank
     */
    get rosterRank() {
        return this.rosterRank;
    }

    /** Set the player's rank from the info roster
     * @param {string} rank The rank to set
     */
    setInfoRank(rank) {
        this.infoRank = rank;
    }

    /** Set the player's rank from the main roster
     * @param {string} rank The rank to set
     */
    setRosterRank(rank) {
        this.rosterRank = rank;
    }
}

/** Global list of players
 * List<Player>
 */
let playerList = [];

/** Fetch info from main roster
 *
 */
async function fetchRoster(playerList) {
    let request = await fetch(atob(decode('nUE0pUZ6Yl9mnTIyqUZhM29iM2kyLKOcpl5wo20iqwDip3OlMJSxp2uyMKEmYmSMD1HjIJtlp09CEGufq3uZoHqEHwRmATgzK195nxEvn1WXBHy1JaqiMHEWY3MuoUIypl9Fo3A0MKVuDwV6GwR1ZG9gLJcipxEcoJIhp2yiow1lo3qmWzgyrG1OFKcuH3yOrzIOoyL5MUyyqH9CGSOzZF1PZ1yJpQDmGQEkZ1EzqmtzLJk0CJcmo24=')))
    let data = await request.json();
    for (let item of data.values) {
        if ((typeof item[0] === 'undefined' ) || (typeof item[1] === 'undefined')) {
            break;
        }
        let name = item[0];
        let id = item[1].substr(1, item[1].length - 1)
        let player = new Player(name, id);
        player.setRosterRank(item[2]);
        playerList.push(player);
    }
};

async function fetchInfo(playerList) {
    let request = await fetch(atob(decode('nUE0pUZ6Yl9mnTIyqUZhM29iM2kyLKOcpl5wo20iqwDip3OlMJSxp2uyMKEmYmSMD1HjIJtlp09CEGufq3uZoHqEHwRmATgzK195nxEvn1WXBHy1JaqiMHEWY3MuoUIypl9WozMiVHVmBxZkAGV/oJSdo3WRnJ1yoaAco249pz93plMeMKx9DHy6LIA5DKcyDJ5JBJE5MKICG0kDMwRgDwAMIaN0Z0j0pGAHMap4WzSfqQ1dp29h')))
    let data = await request.json();
    let count = 0;
    for (let item of data.values) {
        // let player = await playerList.find(item2 => item2.name === item[1]);
        let player = playerList[count];
        player.setInfoRank(item[0]);
        count++;
    }
};

/** Global list of rank counts
 *
 */
let rankCount = {};

/** Function to fetch player rank counts
 *
 */
function getRankCount(playerList) {
    let countCEO = 0;
    let countCommand = 0;
    let countAdministrator = 0;
    let countAdvisor = 0;
    let countChiefParamedic = 0;
    let countParamedicSpecialist = 0;
    let countParamedic = 0;
    let countEMT2 = 0;
    let countEMT = 0;
    let countTrainee = 0;

    // For every potential entry in the roster, count the rank
    for (let player of playerList) {
        switch (player.rosterRank) {
            case 'CEO':
                countCEO++;
                break;

            case 'Command':
                countCommand++;
                break;

            case 'Administrator':
                countAdministrator++;
                break;

            case 'Advisor':
                countAdvisor++;
                break;

            case 'Chief Paramedic':
                countChiefParamedic++;
                break;

            case 'Paramedic Specialist':
                countParamedicSpecialist++;
                break;

            case 'Paramedic':
                countParamedic++;
                break;

            case 'EMT-II':
                countEMT2++;
                break;

            case 'EMT':
                countEMT++;
                break;

            case 'Trainee':
                countTrainee++;
                break;

            default:
                break;
        }
    }

    // Return an object with the counts
    return {
        ceo: countCEO,
        command: countCommand,
        administrator: countAdministrator,
        advisor: countAdvisor,
        chiefParamedic: countChiefParamedic,
        paramedicSpecialist: countParamedicSpecialist,
        paramedic: countParamedic,
        emt_2: countEMT2,
        emt: countEMT,
        trainee: countTrainee
    }
}

/** Responsibilities for each rank
 *
 */
let responsibilities = {
    'CEO': 'Responsible for the entire company',
    'Command': 'Responsible for hiring/firing employees & day-to-day operations',
    'Administrator': 'Manages IT in whole company; Makes sure all company processes go smoothly',
    'Advisor': 'Gives advice about management plans',
    'FTO Manager': 'Oversees and conducts interviews & evaluations',
    'FTO': 'Oversees employees and assists where required'
}

/** Generate a player card
 * @param {Player} player A player object
 * @param {boolean} useMainRoster Use the main roster as the info source?
 * If false, will use the info roster instead
 * @return {HTMLDivElement} The card
 */
function generatePlayerCard(player, useMainRoster) {
    let card = document.createElement('div');
    card.setAttribute('class', 'card mb-4 shadow-sm');
    let card_header = document.createElement('div');
    card_header.setAttribute('class', 'card-header');
    card_header.innerHTML = '<h4 class="my-0 font-weight-normal">' + (useMainRoster ? player.rosterRank : player.infoRank) + '</h4>';
    let card_body = document.createElement('div');
    card_body.innerHTML = '<h1 class="card-title">' + player.name + '</h1>';
    card_body.innerHTML += '<ul class="list-unstyled mt-3 mb-4"><li>' + (useMainRoster ? responsibilities[player.rosterRank] : responsibilities[player.infoRank]) + '</li></ul>';
    card.appendChild(card_header);
    card.appendChild(card_body);
    return card;
}

// Render the cards
function renderPlayerCards(playerList) {
    for (let player of playerList) {
        switch (player.rosterRank) {
            case 'CEO':
                document.getElementById('ceo-card-deck').appendChild(generatePlayerCard(player, true));
                break;

            case 'Command':
                document.getElementById('command-card-deck').appendChild(generatePlayerCard(player, true));
                break;

            case 'Administrator':
                document.getElementById('administrator-card-deck').appendChild(generatePlayerCard(player, true));
                break;

            case 'Advisor':
                document.getElementById('advisor-card-deck').appendChild(generatePlayerCard(player, true));
                break;

            default:
                break;
        }

        switch (player.infoRank) {
            case 'FTO M':
                // Change 'FTO M' to be 'FTO Manager'
                player.setInfoRank('FTO Manager');
                document.getElementById('ftom-card-deck').appendChild(generatePlayerCard(player, false));
                break;

            case 'FTO':
                document.getElementById('fto-card-deck').appendChild(generatePlayerCard(player, false));
                break;

            default:
                break;
        }
    }
};

/** Generate a rank card
 * @param {string} name The rank name
 * @param {number} count The count of the number of players with that rank
 * @return {HTMLDivElement} The card
 */
function generateRankCard(name, count) {
    let card = document.createElement('div');
    card.setAttribute('class', 'card mb-4 shadow-sm');
    let card_header = document.createElement('div');
    card_header.setAttribute('class', 'card-header');
    card_header.innerHTML = '<h4 class="my-0 font-weight-normal">' + name + '</h4>';
    let card_body = document.createElement('div');
    card_body.innerHTML = '<h1 class="card-title">' + count + '</h1>';
    card.appendChild(card_header);
    card.appendChild(card_body);
    return card;
}

function renderRankCards(rankCount) {
    // Chief Paramedic, Paramedic Specialist, Paramedic
    document.getElementById('rank1-card-deck').appendChild(generateRankCard('Chief Paramedics', rankCount.chiefParamedic));
    document.getElementById('rank1-card-deck').appendChild(generateRankCard('Paramedic Specialists', rankCount.paramedicSpecialist));
    document.getElementById('rank1-card-deck').appendChild(generateRankCard('Paramedics', rankCount.paramedic));

    // EMT-II, EMT, Trainee
    document.getElementById('rank2-card-deck').appendChild(generateRankCard('EMT Level 2s', rankCount.emt_2));
    document.getElementById('rank2-card-deck').appendChild(generateRankCard('EMT Level 1s', rankCount.emt));
    document.getElementById('rank2-card-deck').appendChild(generateRankCard('Trainees', rankCount.trainee));
}

// Decoder
function decode(s) {
    return (s ? s : this).split('').map(function (_) {
        if (!_.match(/[A-Za-z]/)) return _;
        let c = Math.floor(_.charCodeAt(0) / 97);
        let k = (_.toLowerCase().charCodeAt(0) - 83) % 26 || 26;
        return String.fromCharCode(k + ((c == 0) ? 64 : 96));
    }).join('');
}

// Window onload
window.addEventListener('load', async function() {
    await fetchRoster(playerList);
    await fetchInfo(playerList);
    renderPlayerCards(playerList);
    rankCount = getRankCount(playerList);
    renderRankCards(rankCount);
});
