let warps = game.buildings.Warpstation.owned;
let gigas = game.upgrades.Gigastation.done;

let b = 0;
while (true) {
    a = warps - (gigas * b);
    if (a < 0) break;
    console.log(a, b);
    b += 1;
}