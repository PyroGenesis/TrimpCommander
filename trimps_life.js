let do_not_pause = false;

let curr_world = game.global.world;
let curr_cell = game.global.lastClearedCell;
let worlds_to_stop = [100];

let life_task = setInterval(() => {
	// if game is paused, don't do anything
	if (game.options.menu.pauseGame.enabled) {
		return;
	}

    // If do not pause, do nothing
    if (do_not_pause) {
        return;
    }

    // if we are in maps, don't do anything
    if (game.global.preMapsActive || game.global.mapsActive) {
		return;
    }
    
    // pause
    if (game.global.world > curr_world && worlds_to_stop.includes(game.global.world)) {
        // pause game
        console.log((new Date()).toLocaleTimeString() + ' Pausing');
        document.getElementById('portalTimer').click()
    }
	curr_world = game.global.world;
	curr_cell = game.global.lastClearedCell;

}, 1*1000);