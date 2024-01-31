# TrimpCommander

A collection of scripts to automate some tedious parts of playing Trimps. The idea is to make playing Trimps more fun without automating everything away.

## Contents

Below is the list of files and what automation it performs. You can mix and match files based on what you want to automate.

### `trimps.js`
The general automation file. It performs the following operations (in order) every 10 seconds:
- Buys any available upgrades
- Prestiges weapons
- Runs a small and easy map (for worlds ending in 5)
- Activate MagnetoShriek (for worlds ending in 5)
- Assigns workers, trainers and explorers
- Buys housing and other buildings
- Buys storage (if needed)
- Assigns Geneticists
- Buys Gigastations

### `trimps_balance.js`
Useful for Balance runs
- Runs the first map whenever unbalance >= 90
  - The idea is to prevent unbalance from reaching 100
- Pauses at the end of world 40
  - So you can run your void maps before Balance is over

### `trimps_decay.js`
Useful for Decay runs
- Pauses game on defined levels so that you can run maps
- Pauses game when you're losing too much to prevent Decay increasing to max

### `trimps_equalize.js`
Utility methods to change number of workers
- `equalize()` assigns an equal number of trimps as Farmers, Lumberjacks and Miners from unemployed trimps
- `fireAndEqualize()` assigns an equal number of trimps as Farmers, Lumberjacks and Miners from total trimps, firing any existing workers first

### `trimps_equipment.js`
Utility methods to buy equipment. Useful for runs where you can't prestige equipment, like Scientist.
- `buyBestEquipment()` tries to buy the best equipment available 50 times.

### `trimps_life.js`
Useful for Life runs
- Pauses at world 100
  - So you can run Void Maps

## How to run

Copy and paste any of these scripts into into your browser's Devtools Console window. Please take frequent backups of your game to prevent any issues.