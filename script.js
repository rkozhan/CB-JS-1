/* Web - Kompetenzcheck JavaScript 1
Schere, Stein, Papier ✂️ 🗿 🧻

Jeder kennt das Spiel. Nun versuch daraus ein Browserspiel zu machen 😉

Was passiert im Spiel:
Der Computer denkt sich zu Beginn jeder Runde aus, was er macht
Dann gibt der User ein, was er wählt
Es wird dann verglichen, wer die Runde gewonnen hat.
Haben beide das gleiche Symbol, ist die Runde unentschieden

Regeln:
Schere gewinnt gegen Papier
Papier gewinnt gegen Stein
Stein gewinnt gegen die Schere

Anforderungen:
Die Rundenzahl kann von den Benutzer:innen selbst ausgewählt werden (Eingabe über ein Input-Field)
Gib den Spieler:innen Feedback über den Spielverlauf, welche Option haben beide gewählt? Gewinner:in der Runde? Gewinner:in des gesamten Spiels.
Versuch dein Program so dynamisch wie möglich zu machen (keine 3 Methoden für Schere, Stein und Papier)
Gestalte das Spiel ansehnlich, es soll ja auch Spaß machen ;)
Bonusaufgabe: Gestalte das Programm so, dass du mit wenig Refactoring eine weitere Option dem Spiel hinzufügen kannst. (z.B.: Lizard, Spock) */

"use strict";
let state = {
    'rounds': 0,
    'animate': false
}
let roundResults = [];

const init = () => {
    const form = document.querySelector('form');
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        let value = document.getElementById('rounds').value;
        if (value > 0) {
            state.rounds = value;
            form.reset();
            startGame();
        }
    });  
    
    document.querySelector('.ui').addEventListener('click', (e) => {
        if (e.target.closest('button') && state.rounds > 0 && !state.animate) nextMove(Number(e.target.value));
    })

    document.getElementById('again').addEventListener('click', () => gameAgain());

}

const startGame = () => {    
    document.querySelector('form').classList.add('hidden');
}

const nextMove = (userValue) => {
    state.animate = true;
    const compValue = Math.floor(Math.random() * 3);
    updateResult(userValue, compValue);
    state.rounds--;

}

const updateResult = (userValue, compValue) => {
    const user = document.getElementById('user'),
        comp = document.getElementById('comp'),
        res = document.getElementById('move-res');

    user.textContent = transformValue(userValue);                   //  update user result
    zoomIt(user);

    setTimeout(() => {                                              //  update computer result
        document.getElementById('comp').textContent = transformValue(compValue);
        zoomIt(comp);
    }, 600);
                                                                    //  update result
    setTimeout(() => {
        const currentRes = getResult(userValue, compValue);
        document.getElementById('move-res').textContent = currentRes;
        roundResults.push(currentRes);
        zoomIt(res);
    }, 1200);

    setTimeout(() => {                                               // ready for next move
        const results = document.querySelector('.results');
        user.closest('.move-result').classList.add('translate');

        const p = document.createElement('p');
        p.innerHTML = `<span>${comp.textContent}</span>
                        <span>${res.textContent}</span>
                        <span>${user.textContent}</span>`
        results.prepend(p);
        
        setTimeout(() => {
            [user, comp, res].forEach(el => el.textContent = '?');

            user.closest('.move-result').classList.remove('translate');
            state.animate = false;

            if (state.rounds === 0) {
                finishGame();
            }
        }, 500)
    }, 1800);
}

const transformValue = (value) => {
    if (value === 0) return '✂️';
    else if (value === 1) return '🗿';
    else return '🧻';
}

const zoomIt = (el) => {
    el.classList.add('zoom');
    setTimeout(() => {
        el.classList.remove('zoom');
    }, 800);
}

const getResult = (user, comp) => {
    if (comp === user) return '=';
    if (comp === 0 && user === 2) return '>';
    if (comp === 2 && user === 0 || comp < user) return '<';
    return '>';
}

const finishGame = () => {
    document.querySelector('.end').classList.remove('hide');
    document.querySelector('.ui').classList.add('hide');

    let userTotal = 0, compTotal = 0;
    roundResults.forEach(el => {
        if (el === '>') compTotal++;
        if (el === '<') userTotal++;
    });
    document.getElementById('comp').textContent = compTotal;
    document.getElementById('user').textContent = userTotal;

    let TotalRes = '=';
    if (compTotal > userTotal) TotalRes = '>';
    if (compTotal < userTotal) TotalRes = '<'
    document.getElementById('move-res').textContent = TotalRes;
}

const gameAgain = () => {
    roundResults = [];
    document.querySelector('.results').innerHTML = '';
    document.querySelector('form').classList.remove('hidden');
    document.querySelector('.end').classList.add('hide');
    document.querySelector('.ui').classList.remove('hide');
    document.querySelectorAll('.move-result span').forEach(el => el.textContent = '?');
}


window.onload = init();