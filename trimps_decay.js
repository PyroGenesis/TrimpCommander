let do_not_pause = false;

let curr_world = game.global.world;
let curr_cell = game.global.lastClearedCell;
let worlds_to_stop = [16,21,26,31,36,41,45,50,55];
let cell_attempt = 0;

let y = setInterval(() => {
	// if game is paused, don't do anything
	if (game.options.menu.pauseGame.enabled) {
		return;
	}
	
	// for Decay
	if (!game.global.mapsActive && game.global.lastClearedCell == curr_cell) {
		cell_attempt += 1;
	} else if (!game.global.mapsActive) {
		cell_attempt = 0;
	}
	if (game.global.challengeActive == 'Decay' && !do_not_pause) {
		let pause_world = game.global.world > curr_world && worlds_to_stop.includes(game.global.world);
		let stuck = !game.global.mapsActive && cell_attempt === 2;
		
		if (pause_world || stuck) {
			// pause game
			console.log((new Date()).toLocaleTimeString() + ' Pausing');
			document.getElementById('portalTimer').click()
			cell_attempt = 0;
		}
	}
	curr_world = game.global.world;
	curr_cell = game.global.lastClearedCell;

}, 10*1000);