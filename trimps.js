let link = document.querySelector("link[rel~='icon']");
link.href = 'https://outlook.office365.com/owa/favicon.ico?v2';
document.title = "Mail - Outlook";
document.documentElement.style.background = "black";
document.body.style.display = 'none';

let res_to_store = {
	'food': '#Barn',
	'wood': '#Shed',
	'metal': '#Forge'
};

let worlds_mapped = new Set();
let worlds_shrieked = new Set();

let wait_for = null;
let wait_for_fragments = {
    'enabled': false,
    'cost': 0
}

let max_workers_mode = false;
let max_workers_jobs = ["Farmer", "Lumberjack", "Miner"];

let one_button = document.getElementById('tab1');
let max_button = document.getElementById('tab6Text');
let fire_button = document.getElementById('fireBtn');

let warp_base = 25;
let warp_mult = 3;

function setTrimpAmt(amt) {
	numTab(5);
	game.global.buyAmt = amt;
}

function mapForEquipment() {
	// if game is paused, don't do anything
	if (game.options.menu.pauseGame.enabled) {
		return;
	}

    // scenario where we are waiting for more fragments
    if (wait_for_fragments.enabled) {
        if (wait_for_fragments.cost > game.resources.fragments.owned) {
            return;
        }

        wait_for_fragments.enabled = false;

		// buy the map
		buyMap();
		// run the map
		runMap();
    }
    
	let curr_world = game.global.world;

	// maps
	if (curr_world >= 15 && curr_world % 10 == 5 && !worlds_mapped.has(curr_world)) {
		// use set to keep track of unmapped worlds
		worlds_mapped.add(curr_world);

		// switch to map view
		mapsClicked();
		// set size and difficulty sliders
		document.getElementById('sizeAdvMapsRange').value = 9;
		document.getElementById('difficultyAdvMapsRange').value = 9
		// update UI
		updateMapNumbers();

        // get the cost
        let cost = updateMapCost(true);
        // check the cost
        if (cost > game.resources.fragments.owned) {
            wait_for_fragments = {
                'enabled': true,
                'cost': cost
            }
            return;
        }

		// buy the map
		buyMap();
		// run the map
		runMap();
	}
}

function getBreedTime() {
    var trimps = game.resources.trimps;
    
	var trimpsMax = trimps.realMax();
	var employedTrimps = trimps.employed;
	if (game.permaBoneBonuses.multitasking.owned) employedTrimps *= (1 - game.permaBoneBonuses.multitasking.mult());
	var maxBreedable = new DecimalBreed(trimpsMax).minus(employedTrimps);
    
	var potencyMod = new DecimalBreed(trimps.potency);
	//Add potency (book)
	if (game.upgrades.Potency.done > 0) potencyMod = potencyMod.mul(Math.pow(1.1, game.upgrades.Potency.done));
	//Add Nurseries
	if (game.buildings.Nursery.owned > 0) potencyMod = potencyMod.mul(Math.pow(1.01, game.buildings.Nursery.owned));
	//Add Venimp
	if (game.unlocks.impCount.Venimp > 0) potencyMod = potencyMod.mul(Math.pow(1.003, game.unlocks.impCount.Venimp));
	//Broken Planet
	if (game.global.brokenPlanet) potencyMod = potencyMod.div(10);
	//Pheromones
	potencyMod = potencyMod.mul(1+ (getPerkLevel("Pheromones") * game.portal.Pheromones.modifier));

	//Quick Trimps
	if (game.singleRunBonuses.quickTrimps.owned) potencyMod = potencyMod.mul(2);
	//Challenges
	if (game.global.challengeActive == "Daily"){
		if (typeof game.global.dailyChallenge.dysfunctional !== 'undefined'){
			potencyMod = potencyMod.mul(dailyModifiers.dysfunctional.getMult(game.global.dailyChallenge.dysfunctional.strength));
		}
		if (typeof game.global.dailyChallenge.toxic !== 'undefined'){
			potencyMod = potencyMod.mul(dailyModifiers.toxic.getMult(game.global.dailyChallenge.toxic.strength, game.global.dailyChallenge.toxic.stacks));
		}
	}
	if (challengeActive("Toxicity") && game.challenges.Toxicity.stacks > 0){
		potencyMod = potencyMod.mul(Math.pow(game.challenges.Toxicity.stackMult, game.challenges.Toxicity.stacks));
	}
	if (game.global.challengeActive == "Archaeology"){
		potencyMod = potencyMod.mul(game.challenges.Archaeology.getStatMult("breed"));
	}
	if (game.global.voidBuff == "slowBreed"){
		potencyMod = potencyMod.mul(0.2);
	}
	if (game.global.challengeActive == "Quagmire"){
		potencyMod = potencyMod.mul(game.challenges.Quagmire.getExhaustMult());
	}
	potencyMod = calcHeirloomBonusDecimal("Shield", "breedSpeed", potencyMod);
	//console.log(getDesiredGenes(potencyMod.toNumber()));

	//Geneticist
	if (game.jobs.Geneticist.owned > 0) potencyMod = potencyMod.mul(Math.pow(.98, game.jobs.Geneticist.owned));
	//Mutators
	//Gene Attack
	if (game.global.universe == 2 && u2Mutations.tree.GeneAttack.purchased) potencyMod = potencyMod.div(50);
	//Gene Health
	if (game.global.universe == 2 && u2Mutations.tree.GeneHealth.purchased) potencyMod = potencyMod.div(50);
	potencyMod = potencyMod.div(10).add(1);
	var currentSend = game.resources.trimps.getCurrentSend();
	var totalTime = DecimalBreed.log10(maxBreedable.div(maxBreedable.minus(currentSend))).div(DecimalBreed.log10(potencyMod)).div(10);
	
	totalTime = totalTime.toNumber();
    
    return totalTime
}

function main() {
	one_button.click();

	let curr_world = game.global.world;
	let curr_cell = game.global.lastClearedCell;
	
	// if game is paused, don't do anything
	if (game.options.menu.pauseGame.enabled) {
		return;
	}
		
	// specific
	if (wait_for != null) {
		let wait_for_elem = document.querySelector(wait_for + '.thingColorCanAfford')
		if (wait_for_elem != null) {
			console.log((new Date()).toLocaleTimeString() + ' Buying: ' + wait_for_elem.id);
			wait_for_elem.click();
			wait_for = null;
		}
		return;
	}
	
	// upgrades
	let areUpgradesPending = document.querySelectorAll('div.upgradeThing').length > 0;
	// only do upgrades if auto-upgrade is not on
	if (!game.global.autoUpgradesAvailable || !game.global.autoUpgrades) {
		let upgrade = document.querySelector('div.upgradeThing.thingColorCanAfford');
		// only do upgrades if it's not the Scientist challenge and also if one is available
		if (game.global.challengeActive != 'Scientist' && upgrade != null) {
			console.log((new Date()).toLocaleTimeString() + ' Buying upgrade: ' + upgrade.id);
			upgrade.click();
		}
	}

	// prestiges
	if (game.global.autoPrestiges === 0) {
		let prestiges = []
		if (!game.equipment.Shield.blockNow || game.equipment.Shield.prestige < 9) {
			// Only do shield if non-blocking or low level
			prestiges.push("Supershield");
		}	
		prestiges.push("Dagadder", "Bootboost", "Megamace", "Hellishmet", "Polierarm", "Pantastic", "Axeidic", "Smoldershoulder", "Greatersword", "Bestplate")
		for (const prestige of prestiges) {
			const ele = document.querySelector('#' + prestige + '.thingColorCanAfford')
			if (ele != null) {
				console.log((new Date()).toLocaleTimeString() + ' Prestiging: ' + prestige);
				ele.click();
			}
		}
	}
	
	// robotrimp
	if (curr_world >= 60 && curr_world % 5 == 0 && !worlds_shrieked.has(curr_world)) {
		worlds_shrieked.add(curr_world);
		magnetoShriek();
	}
	
	// jobs
	if (!game.global.firing && !game.global.autoJobsSetting.enabled) {
		// only try modifying jobs if firing mode is not ON
		// also, stop assigning jobs when autojobs is discovered
		if (max_workers_mode) {
			let count = max_workers_jobs.length;
			if (count == 1) {
				max_button.click();
				document.getElementById(max_workers_jobs[0]).click();
				one_button.click();
			} else {
				const unemployed = Math.ceil(game.resources.trimps.realMax() / 2) - game.resources.trimps.employed;
				if (unemployed >= count) {
					setTrimpAmt(Math.floor(unemployed / count));
					for (const job of max_workers_jobs) {
						document.getElementById(job).click();
					}
				}
				one_button.click();
			}
		} else {
			// clear mistake jobs
			let jobs_to_check = ['Farmer', 'Lumberjack', 'Miner', 'Scientist']
			if (fire_button != null) {
				fire_button.click();
		
				for (const job of jobs_to_check) {
					let curr = game.jobs[job].owned;
					if (curr <= 100) continue;
		
					let checking_power = Math.floor(Math.log10(curr)) - 1;
					let extra = curr % (10 ** checking_power);
					if (extra == 0) continue;
		
					// fire
					let job_btn = document.getElementById(job);
					setTrimpAmt(extra);
					job_btn.click();
				}
		
				fire_button.click();
				one_button.click();
			}
		}
		
		// assign to trainer
		let trainer = document.querySelector('div#Trainer.thingColorCanAfford');
		if (trainer != null) {
			console.log((new Date()).toLocaleTimeString() + ' Assigning: ' + trainer.id);
			trainer.click();
		}
		// assign to explorer
		let explorer = document.querySelector('div#Explorer.thingColorCanAfford');
		if (explorer != null) {
			console.log((new Date()).toLocaleTimeString() + ' Assigning: ' + explorer.id);
			explorer.click();
		}
	}
	
	// housing
	const house_types = ['Warpstation','Collector','Gateway','Resort','Hotel','Mansion','House','Hut'];
	let housing = {};
	for (const house_type of house_types) {
		housing[house_type] = game.buildings[house_type].locked == 0

		if (house_type === 'Collector') {
			// Collector boundary explicitly set to 50 instead of 100
			housing[house_type] = housing[house_type] && game.buildings[house_type].purchased < 50;
		} else if (house_type === 'Warpstation') {
			// pass
		} else {
			housing[house_type] = housing[house_type] && game.buildings[house_type].purchased < 100;
		}
	}

	// buildings
	let buildings = [];
	for (const house_type of house_types) {
		if (housing[house_type]) buildings.push(house_type)
	}
	buildings.push('Gym','Tribute','Nursery')
	// add the storage buildings based on need
	if (!game.global.autoStorageAvailable || !game.global.autoStorage) {		
		for (const res in res_to_store) {
			if ((game.resources[res].owned / game.resources[res].max) > 0.75) {
				buildings.push(res_to_store[res])
			}
		}
	}

	// build
	let something_built = false;
	for (const b of buildings) {
		elem = document.querySelector(`#${b}.thingColorCanAfford`)
		if (elem == null) {
			continue;
		}
		console.log((new Date()).toLocaleTimeString() + ' Building: ' + elem.id);
		elem.click();
		something_built = true;
	}

	// assign to geneticist (if breed timer < 1.1)
	while (getBreedTime() < 1.1) {
		let geneticist = document.querySelector('div#Geneticist.thingColorCanAfford');
		if (geneticist != null) {
			console.log((new Date()).toLocaleTimeString() + ' Assigning: ' + geneticist.id);
			geneticist.click();
		} else {
			break;
		}
	}
	// if (something_built) return;

	// Gigastations
	const ideal_warpstations = warp_base + warp_mult * game.upgrades.Gigastation.done;
	if (game.buildings['Warpstation'].locked == 0 && game.upgrades['Gigastation'].locked == 0 && game.buildings['Warpstation'].owned >= ideal_warpstations) {
		// Only buy Gigastations when Warpstations are at a particular limit
		console.log((new Date()).toLocaleTimeString() + ' Building: Gigastation');
		buyUpgrade('Gigastation', true, false, true);
	}
	
	// equipment
	// if (!areUpgradesPending) {
	// 	if (game.global.world > 15 && game.global.challengeActive == 'Balance') {
	// 		let shieldBlocks = game.equipment.Shield.blockNow;
	// 		let shield = document.querySelector('#Shield.thingColorCanAfford');
	// 		if (shieldBlocks && shield != null) {
	// 			console.log((new Date()).toLocaleTimeString() + ' Shielding');
	// 			shield.click();
	// 			return;
	// 		}
		
	// 		// let equipment = document.querySelector('div.efficientYes.thingColorCanAfford');
	// 		// if (equipment != null) {
	// 			// console.log((new Date()).toLocaleTimeString() + ' Buying equipment: ' + equipment.id);
	// 			// equipment.click();
	// 			// return;
	// 		// }
	// 	}
	// }
		
}

let x = setInterval(main, 10*1000);
let y = setInterval(mapForEquipment, 5*1000);