let pause_at_40 = true;

let interval_balance = setInterval(() => {

    // run map to lower balance stacks
    if (!game.global.preMapsActive && !game.global.mapsActive && game.challenges.Balance.balanceStacks >= 90) {
        mapsClicked(true);
        selectMap('map1');
        runMap();
    }

    // pause at end of zone 40
    if (pause_at_40 && game.global.world == 40 && game.global.lastClearedCell >= 95 && !game.global.preMapsActive && !game.global.mapsActive) {
        mapsClicked(true);
        pause_at_40 = false;
    }

}, 1000);