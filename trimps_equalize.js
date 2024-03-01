
function setTrimpAmt(amt) {
	numTab(5);
	game.global.buyAmt = amt;
}

function fireAll() {
    let max_button = document.getElementById('tab6Text');
    let fire_button = document.getElementById('fireBtn');

    let jobs = ['Farmer', 'Lumberjack', 'Miner', 'Scientist'];
    let job_btns = [];
    for (const job of jobs) {
        const job_btn = document.getElementById(job);
        if (job_btn !== null) {
            job_btns.push(job_btn);
        }
    }

    if (fire_button != null && !game.global.firing) {
        fire_button.click();
    }

    max_button.click();
    for (const job_btn of job_btns) {
        job_btn.click();
    }
    fire_button.click();
}

function equalize() {
    let jobs = ['Farmer', 'Lumberjack', 'Miner'];
    let job_btns = [];
    for (const job of jobs) {
        const job_btn = document.getElementById(job);
        if (job_btn !== null) {
            job_btns.push(job_btn);
        }
    }

    const unemployed = Math.ceil(game.resources.trimps.realMax() / 2) - game.resources.trimps.employed;
    const employees_per_job = Math.floor(unemployed / job_btns.length);

    setTrimpAmt(employees_per_job)
    for (const job_btn of job_btns) {
        job_btn.click();
    }
    document.querySelector('#tab1').click();    
}

function fireAndEqualize() {
    fireAll();
    equalize();
}
