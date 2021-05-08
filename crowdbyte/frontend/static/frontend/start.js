const prompt = document.getElementById('prompt');
const answer1 = document.getElementById('answer-1');
const answer2 = document.getElementById('answer-2');
const answer3 = document.getElementById('answer-3');
const answer4 = document.getElementById('answer-4');
const answer5 = document.getElementById('answer-5');
const answer6 = document.getElementById('answer-6');
const mu = document.getElementById('mu');
const m = document.getElementById('m');
const charge = document.getElementById('charge');
const roomJoin = document.getElementById('room-join');

var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890';
var charactersLength = characters.length;

function makeid(length) {
    var result = '';
    
    for (var i=0; i<length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }

    return result;
}

roomJoin.addEventListener('click', (event) => {
    if (mu.value && m.value && charge.value) {
        window.location.replace('/host/' + makeid(16)
        + '?prompt=' + prompt.value
        + '&answer1=' + answer1.value
        + '&answer2=' + answer2.value
        + '&answer3=' + answer3.value
        + '&answer4=' + answer4.value
        + '&answer5=' + answer5.value
        + '&answer6=' + answer6.value
        + '&mu=' + mu.value
        + '&m=' + m.value
        + '&charge=' + charge.value
        );
    }
});