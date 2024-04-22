let curr_science = game.resources.science.owned;

function switchToScience() {
    if (game.global.playerGathering !== "science" && (curr_science - game.resources.science.owned) > (curr_science * 0.01)) {
        setGather('science');
        setTimeout(() => { 
            setGather('metal'); 
        }, 30*1000);
    }
    curr_science = game.resources.science.owned;
}

let z = setInterval(switchToScience, 10*1000);
