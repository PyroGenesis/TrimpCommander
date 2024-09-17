function maximizeMagmaFuel() {
    if (game.global.world < 230 || game.global.world >= Math.trunc(game.global.highestLevelCleared*0.9) || game.global.generatorMode == 0 || game.global.mapsActive) {
        return;
    }
    const needToWait = game.global.magmaFuel > game.generatorUpgrades.Capacity.modifier*1.5 && !game.global.preMapsActive;
    const needToWorld = game.global.magmaFuel < game.generatorUpgrades.Capacity.modifier*1.33 && game.global.preMapsActive;
    if (needToWait || needToWorld) {
		console.log((new Date()).toLocaleTimeString() + ' Toggling map for magma');
        mapsClicked();
    }
}

let interval_magma = setInterval(maximizeMagmaFuel, 1*1000);
