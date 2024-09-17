let curr_science = game.resources.science.owned;

function switchToScience() {
    if (game.global.playerGathering !== "science" && (curr_science - game.resources.science.owned) > (curr_science * 0.01)) {
		console.log((new Date()).toLocaleTimeString() + ' Gathering: Science');
        setGather('science');
        setTimeout(() => { 
            console.log((new Date()).toLocaleTimeString() + ' Gathering: Metal');
            setGather('metal'); 
        }, 30*1000);
    }
    curr_science = game.resources.science.owned;
}

let interval_player = setInterval(switchToScience, 10*1000);
