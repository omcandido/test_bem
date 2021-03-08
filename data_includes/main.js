PennController.ResetPrefix(null) // Keep here

/**
 * Shuffles array in place.
 * @param {Array} a items An array containing the items.
 */
function shuffle(a) {
    var j, x, i;
    for (i = a.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        x = a[i];
        a[i] = a[j];
        a[j] = x;
    }
    return a;
}

function drawRandomSample(arr, num) {
    var copyArr = [...arr];
    shuffle(copyArr);
    return copyArr.slice(0,num);
}

const baseFood = ["apple", "bagel", "bread", "caviar", "hamburger", "oatmeal", "onion", "potato", "soup", "tofu", "turnip", "yogurt"]
const baseAnimals = ["bird", "cat", "chipmunk", "cow", "dog", "gorilla", "horse", "kangaroo", "ostrich", "skunk", "snake", "walrus"]
const baseOccupations = ["bricklayer", "carpenter", "comedian", "doctor", "engineer", "lawyer", "mortician", "nun", "nurse", "rabbi", "scientist", "teacher"]
const baseClothes = ["bikini", "coat", "dress", "hat", "jockstrap", "pantyhose", "parka", "shirt", "shoes", "shorts", "suspenders", "tuxedo"]

var rndWords = baseFood.concat(baseAnimals, baseOccupations, baseClothes)
shuffle(rndWords)

const trialFood = drawRandomSample(baseFood, 6)
const trialAnimals = shuffle(baseAnimals, 6)
const trialOccupations = shuffle(baseOccupations, 6)
const trialClothes = shuffle(baseClothes, 6)

// DebugOff()   // Uncomment this line only when you are 100% done designing your experiment

// Instructions screen
newTrial("welcome",
    // Automatically print all Text elements, centered
    defaultText.center().print()
    ,
    newText("Welcome!")
    ,
    newText("TODO: this is a test mock-up of the experiments 8 & 9 of [Bem, 2011].")
    ,
    newText("<strong>TODO: Description.</strong>")
    ,
    newButton("Click to start the experiment")
        .center()
        .print()
        .wait()
)

newTrial("instructions-relaxation",
    defaultText.center().print()
    ,
    newText("Relaxation screen. TODO: elaborate more.")
    ,
    newButton("Click to start the experiment")
        .center()
        .print()
        .wait()
)

newTrial("instructions-show-words",
    defaultText.center().print()
    ,
    newText("Now the 48 words will be shown. TODO: elaborate more.")
    ,
    newButton("Click to start the experiment")
        .center()
        .print()
        .wait()
)

rndWords.forEach( word => {
    
    newTrial("show-words-trial",
        newText("word", word)
            .css("font-size", "24pt")
            .center()
            .print()
    ,
        newTimer("timerWord", 3000)
            .start()
            .wait()
    ,
        getText("word").remove()
    ,
        newTimer("timerWait", 100)
            .start()
            .wait()
    );
    
});

// ------------- RECALL -------------
newTrial("recall-trial",
    newHtml("recall", "recall.html")
        .log()
        .print()
    ,
    newButton("next", "Next")
        .print()
        .wait()
)


// ------------- TRAIN 1 -------------


// ------------- TRAIN 2 -------------



