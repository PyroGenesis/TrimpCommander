# TrimpCommander

A collection of scripts to automate some tedious parts of playing Trimps. The idea is to make playing Trimps more fun without automating everything away.

## Contents

Below is the list of files and what automation it performs. You can mix and match files based on what you want to automate.

### `trimps.js`
The general automation file. It performs the following operations:
- (Optional) Blacks out the game in your browser 🤫
- (Optional) Redirects the page to a different URL when the browser tab gains focus 😛
- Auto bone shrine (if full)
- Simple formation switching
- Buys any available upgrades
- Prestiges weapons
- Activate MagnetoShriek (for every 5th world)
- Assigns workers, trainers and explorers
- Buys housing and other buildings
- Buys storage (if needed)
- Assigns / fires Geneticists to approach the ideal breed time
- Buys Gigastations
- Automatically runs maps to unlock prestiges

### `trimps_equalize.js`
Utility methods to change number of workers
- `fireAll()` simply fires all Farmers, Lumberjacks, Miners and Scientists (useful for AutoJobs ratio change)
- `equalize()` assigns an equal number of trimps as Farmers, Lumberjacks and Miners from unemployed trimps
- `fireAndEqualize()` assigns an equal number of trimps as Farmers, Lumberjacks and Miners from total trimps, firing any existing workers first

### `trimps_equipment.js`
Utility methods to buy equipment. Useful for runs where you can't prestige equipment, like Scientist.
- `buyBestEquipment()` tries to buy the best equipment available up to 50 times.

### `trimps_ratio.js`
Helps you figure out base and multiplier values for Warpstations / Gigastations.
- It uses the current number of Warpstations and Gigastations you have
- Then it gives you all possible INTEGER combinations of base and multiplier which would result in the current number of Warpstations and Gigastations
- You can then choose one the combinations and use that to update `warp_base` and `warp_mult` in `trimps.js`
- Useful to run at the end of a run, before portalling

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

### `trimps_life.js`
Useful for Life runs
- Pauses at world 100
  - So you can run Void Maps

## How to run

Copy and paste any of these scripts into into your browser's Devtools Console window. Please take frequent backups of your game to prevent any issues.