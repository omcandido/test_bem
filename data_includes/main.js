// This is to avoid writing "PennController.{something}" everytime
PennController.ResetPrefix(null)

// Merge all category words into a single array.
var rndWords = baseFood.concat(baseAnimals, baseOccupations, baseClothes)
// Shuffle the array in place.
shuffle(rndWords)

// Draw 6 words from each category and store them in a constant.
const targetFood = drawRandomSample(baseFood, 6)
const targetAnimals = drawRandomSample(baseAnimals, 6)
const targetOccupations = drawRandomSample(baseOccupations, 6)
const targetClothes = drawRandomSample(baseClothes, 6)

// Merge all drawn words for convenience to log them.
const targetWords = targetFood.concat(targetAnimals, targetOccupations, targetClothes)

// Parameters regarding the display and waiting time of single words.
const displayTime = 300;
const waitTime = 10;

// DebugOff()   // Uncomment this line only when you are 100% done designing your experiment

// ------------- Welcome screen -------------
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
// Log the target words (the remaining are control words).
.log( "targetWords", targetWords.join(' '));


// ------------- Relaxation screen -------------
newTrial("instructions-relaxation",
    newVar("secondsLeft", 180)
    ,
    newText("Watch the following video for 3 min and try to relax:")
        .css("margin-bottom", "1em")
    ,
    newVideo("myVideo", "relax_video.mp4")
        .center()
        .size("600","337.5")
        .print()
        .disable(0.01)
        .play()
    ,
    newText("counter", '180')
        .before( newText("Seconds left: ") )
        .print()
    ,
    newTimer("timer", 1000)
        .callback(
            getVar("secondsLeft")
                .set(v=>v-1)
                .test.is(0)
                .success( getButton("Next").click() )
            ,
            getText("counter")
                .text( getVar("secondsLeft") )
            ,
            getTimer("timer").start()
        )
        .start()
    ,
    newButton('Next').wait()
);

// ------------- Instructions training -------------
newTrial("instructions-show-words",
    defaultText.center().print()
    ,
    newText("Now the 48 words will be shown. TODO: elaborate more. We can use Bem's wording from the paper whenever possible. Note that words are displayed for a short time to debug it faster.")
    ,
    newButton("Click to start the experiment")
        .center()
        .print()
        .wait()
);

// ------------- Display: show one word every 3s -------------
newTrialDisplayAllWords("show-all-words-trial", rndWords, displayTime, waitTime);

// ------------- Recall screen -------------
newTrial("recall-trial",
    // The recall screen is an html list of boxes with text inputs.
    newHtml("recall", "recall.html")
        .log()
        .print()
    ,
    newButton("next", "Next")
        .print()
        .wait()
)

// ------------- Training 1: show all target words per category -------------
newTrialDisplayCategoryWords("show-food-words-trial", 'food', targetFood, displayTime, waitTime)
newTrialDisplayCategoryWords("show-animals-words-trial", 'animals', targetAnimals, displayTime, waitTime)
newTrialDisplayCategoryWords("show-occupations-words-trial", 'occupations', targetOccupations, displayTime, waitTime)
newTrialDisplayCategoryWords("show-clothes-words-trial", 'clothes', targetClothes, displayTime, waitTime)

// ------------- Training 2: click on every category word and then write it down -------------
newTrialClickCategoryWords('click-food-words-trial', 'food', targetWords, targetFood);
newTrialEnterCategoryWords("enter-food-words-trial", 'food', targetFood);

newTrialClickCategoryWords('click-animals-words-trial', 'animals', targetWords, targetAnimals);
newTrialEnterCategoryWords("enter-food-words-trial", 'animals', targetAnimals);

newTrialClickCategoryWords('click-occupations-words-trial', 'occupations', targetWords, targetOccupations);
newTrialEnterCategoryWords("enter-occupations-words-trial", 'occupations', targetOccupations);

newTrialClickCategoryWords('click-clothes-words-trial', 'clothes', targetWords, targetClothes);
newTrialEnterCategoryWords("enter-clothes-words-trial", 'clothes', targetClothes);
