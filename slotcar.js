
// Start with your template
// ● Create a function based class using Javascript, make an instance and call functions on it
function Race(name, raceTrackDetails) {

    if (name == undefined) {
        name = `race-${(new Date).getMilliseconds()}`;
    }
    this.raceName = name;
    this.trackDetails = raceTrackDetails;
    this.Init = () => {
        console.log(`Welcome to slot racer. Insert coin to start the ${this.raceName}.`);
    }
    this.Init();

}

// ● Extend the functionality of the base class to include:
// ○ A function to start the race( interval checks and updates)
Race.prototype.startRace = function () {
    console.log("Coin Inserted");
    console.log(`${this.raceName} starts in... %c3, %c2, %c1 GO`,'color:red','color:orange','color:green');
    this.trackPosition();
}
Race.prototype.stopRace = function () {
    //stop calculating race progress\
    clearInterval(this.calcTracPosition);
    console.log(`\u{1F3C1}\u{1F3C1}\u{1F3C1} ${this.raceName} Finished \u{1F3C1}\u{1F3C1}\u{1F3C1}`);
    this.findWinner();
}

// ○ A function to filter for only cars that are in working order
Race.prototype.getWorkingCars = function () {
    return this.trackDetails.carName.filter(car => car.workingStatus && !car.raceWinner);
};

Race.prototype.getWether = function() {
    return this.trackDetails.wether[Math.floor(Math.random() * this.trackDetails.wether.length)];
};

// ○ A function to determine if and what cars have broken down in the current round
Race.prototype.setBrokenCars = function () {

    // for each working car
    this.trackDetails.carName.filter(car => car.workingStatus == true && car.raceWinner == false).forEach(car => {

        //generate random number
        let chance = Math.random();

        //if breakdown chance greater than random
        if (car.chanceOfBreakDown > chance) {
            console.warn(`\u{1F525} ${car.driverName} car broke down!!!`);
            //set car working status to false
            car.workingStatus = false;
        }
    });
}

// ○ A function to determine speed and if a nitro will be used
Race.prototype.nitroSpeed = function (car) {

    if (car.nitroBoost > 0) {
        //generate random number
        let chance = Math.random();

        //if breakdown chance greater than random
        if (car.chanceOfNitroBoostPerTrack > chance) {
            console.log(`\u{23E9} ${car.driverName} used nitro`);
            //reduce boost available
            car.nitroBoost = car.nitroBoost - 1;
            return Math.floor(car.maxSpeed * 0.5);
        }
    }
    return 0;
}

// ○ A function to determine track position
Race.prototype.trackPosition = function () {
    let updateCount = 0;
    this.calcTracPosition = setInterval(() => {
        updateCount = updateCount + 1;
        let wether = this.getWether();
        console.log(`%c ${this.raceName} UPDATE#%c${updateCount} %cWether is ${wether.type} ${wether.emoji}`, 'color:green', 'color:red', 'color:black');

        //calculate broken cars
        this.setBrokenCars();

        let workingCars = this.getWorkingCars();
        //console.log(workingCars);

        //console.log((new Date()).getSeconds());

        //if no working cars
        if (workingCars.length == 0) {
            this.stopRace();
            //stop race and exit calculate track position
            return;
        }

        workingCars.forEach(car => {
            //console.log( `${this.getCarSpeed(car.minSpeed, car.maxSpeed)} * ${wether.speed} + ${this.nitroSpeed(car)}`);
            car.trackPosition = Math.floor(car.trackPosition + (this.getCarSpeed(car.minSpeed, car.maxSpeed) * wether.speed) + this.nitroSpeed(car));
                
            //console.log(`car.trackPosition >= this.trackDetails.trackLength ${car.trackPosition} ${this.trackDetails.trackLength}`)
            if (car.trackPosition >= this.trackDetails.trackLength) {
                console.log(`\u{1F3C1}${car.name} finished`);
                // add winner to winner array
                this.trackDetails.winner.push(car);
                car.raceWinner = true;
            }
        });
        //console.log(workingCars);


        console.log(`-${this.raceName} board-`);

        //display array according to distance travelled/position
        console.table(workingCars.sort((car1, car2) => car1.trackPosition > car2.trackPosition ? 1 : -1));
    }, 1000);

}

// ○ A function to get speed of the car
Race.prototype.getCarSpeed = function (min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min; //so that the the maximum is inclusive and the minimum is inclusive 
  }

// ○ A function to find the winner of the race
Race.prototype.findWinner = function () {
    console.log(`--${this.raceName} WINNERS--`);
    console.table(this.trackDetails.winner);
}

// ● Your project must be run from the console of the development tools
// ● Your project must use the array filtering and searching functions studied in class
// ● Your project must use template literals
// ● All functions must show updates using console log.
// ● The final project must allow for multiple instances to be run simultaneously



// ● Create an object for your racetrack containing
const raceTrack = {
    // ○ Weather conditions(min 3) each with an effect on speed
    wether: [
        { type: "sunny", speed: 1, emoji: "\u{2600}"},
        { type: "rainy", speed: 0.5, emoji: "\u{1F327}"},
        { type: "foggy", speed: 0.8, emoji: "\u{1F32B}"}
    ],

    // ○ Length of track
    trackLength: 10000,


    // ○ Winner
    winner: [],


    // ● Create an array of objects(minimum 3) with the following information
    // ○ Car Name(string)
    // ○ Car working status(boolean)
    // ○ Car Min speed(number)
    // ○ Car Max speed(number)   
    // ○ Track position(number starting at 0)
    // ○ Chance of breakdown(number between 0 and 1)
    // ○ Driver Name(string)
    // ○ Number of Nitro Boosts(number)
    // ○ Chance of using a Nitro Boost per turn(number between 0 and 1)
    // ○ raceWinner(boolean)
    carName: [
        {
            name: "car1",
            workingStatus: true,
            minSpeed: 20,
            maxSpeed: 200,
            trackPosition: 0,
            chanceOfBreakDown: 0.01,
            driverName: "someDude1",
            nitroBoost: 3,
            chanceOfNitroBoostPerTrack: 0.2
        },
        { name: "car2", workingStatus: true, minSpeed: 5, maxSpeed: 250, trackPosition: 0, chanceOfBreakDown: 0.05, driverName: "someDude2", nitroBoost: 2, chanceOfNitroBoostPerTrack: 0.1, raceWinner: false },
        { name: "car3", workingStatus: true, minSpeed: 30, maxSpeed: 230, trackPosition: 0, chanceOfBreakDown: 0.03, driverName: "someDude3", nitroBoost: 2, chanceOfNitroBoostPerTrack: 0.15, raceWinner: false },
    ]

}

let race = new Race("race1", raceTrack);
race.startRace();

let race2 = new Race("race2", {
    // ○ Weather conditions(min 3) each with an effect on speed
    wether: [
        { type: "sunny", speed: 1, emoji: "\u{2600}"},
        { type: "rainy", speed: 0.5, emoji: "\u{1F327}"},
        { type: "foggy", speed: 0.8, emoji: "\u{1F32B}"}
    ],

    // ○ Length of track
    trackLength: 2000,


    // ○ Winner
    winner: undefined,


    // ● Create an array of objects(minimum 3) with the following information
    // ○ Car Name(string)
    // ○ Car working status(boolean)
    // ○ Car Min speed(number)
    // ○ Car Max speed(number)   
    // ○ Track position(number starting at 0)
    // ○ Chance of breakdown(number between 0 and 1)
    // ○ Driver Name(string)
    // ○ Number of Nitro Boosts(number)
    // ○ Chance of using a Nitro Boost per turn(number between 0 and 1)
    // ○ raceWinner(boolean)
    carName: [
        {
            name: "car1",
            workingStatus: true,
            minSpeed: 0,
            maxSpeed: 200,
            trackPosition: 0,
            chanceOfBreakDown: 0.01,
            driverName: "someDude1",
            nitroBoost: 3,
            chanceOfNitroBoostPerTrack: 0.2,
            raceWinner: false
        },
        { name: "car2", workingStatus: true, minSpeed: 0, maxSpeed: 250, trackPosition: 0, chanceOfBreakDown: 0.05, driverName: "someDude2", nitroBoost: 2, chanceOfNitroBoostPerTrack: 0.1, raceWinner: false },
        { name: "car3", workingStatus: true, minSpeed: 0, maxSpeed: 230, trackPosition: 0, chanceOfBreakDown: 0.03, driverName: "someDude3", nitroBoost: 2, chanceOfNitroBoostPerTrack: 0.15, raceWinner: false },
    ]

});
//race2.startRace();