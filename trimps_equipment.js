
function buyBestEquipment() {
    let iterations = 50;
    let equipments = document.querySelectorAll('div.efficientYes.thingColorCanAfford');

    while (iterations > 0 && equipments.length === 2) {
        for (const equipment of equipments) {
            console.log((new Date()).toLocaleTimeString() + ' Buying equipment: ' + equipment.id);
            equipment.click();
        }
        equipments = document.querySelectorAll('div.efficientYes.thingColorCanAfford');
        iterations -= 1;
    }
}