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
    defaultText.center().print().css('margin-bottom', '2em')
    ,
    newText("<h1>Welcome!</h1>")
    ,
    newText("Thank you for participating in this experiment.<br>The session takes <strong>approximately 15 minutes</strong>, so it is important that you do not get interrupted during this time. Some of the tasks require that you look at some video or some words for a certain amount of time, so we would like to ask you in advance to really <strong>focus on the tasks</strong>, even if you do not understand the purpose of what you are doing. At the end of the session, a short explanation of the aim of the experiment will be given.")
    ,
    newButton("Start")
        .center()
        .print()
        .wait()
)
// Log the target words (the remaining are control words).
.log( "targetWords", targetWords.join(' '));

// ------------- Demographics questions -------------
newTrial( "demographics-age",
    newText("What is your age?")
        .print()
    ,
    newTextInput("age-input").print()
    ,
    newText("warning", "Enter a valid number (e.g. 25)").css("color", "red")
    ,
    newButton('Next')
        .print()
        .wait(getTextInput("age-input").test.text(/^[0-9]+$/)
            .failure(getText("warning").print())
        )
)

newTrial( "demographics-gender" ,
  newText("What is your gender?")
    .print()
  ,
  newScale("gender", "male", "female", "other")
    .labelsPosition("top")
    .print()
    .wait()
)


newTrial("demographics-bored",
    newText("I am easily bored")
        .print()
    ,
    newScale(5)
        .before( newText("Very untrue") )
        .after( newText("Very true") )
        .keys()
        .print()
        .wait()
)

newTrial("demographics-movies",
    newText("I often enjoy seeing movies I’ve seen before")
        .print()
    ,
    newScale(5)
        .before( newText("Very untrue") )
        .after( newText("Very true") )
        .keys()
        .print()
        .wait()
)


// ------------- Relaxation screen -------------
newTrial("instructions-relaxation",
    newVar("secondsLeft", 180)
    ,
    newText("Watch the following video for 3 min and try to relax:")
        .print()
        .css('margin-bottom', '2em')
    ,
    newVideo("myVideo", "relax_video.mp4")
        .center()
        .size("600", "337.5")
        .css('margin-bottom', '2em')
        .print()
        .disable(0.01)
        .play()
    ,
    newText("counter", '180')
        .before(newText("Time left: "))
        .after(newText("s"))
        .center()
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

// ------------- Instructions display -------------
newTrial("instructions-show-words",
    defaultText.center().print()
    ,
    newText("Now 48 words will be displayed in intervals of 3 seconds. We ask you to <strong>visualise each word</strong> (for example, if the word is \"tree\", try to visualise a tree).<br> Click on the button when you are ready.")
        .css("margin-bottom", "2em")
    ,
    newButton("Click to start the experiment")
        .center()
        .print()
        .wait()
);

// ------------- Display: show one word every 3s -------------
newTrial("show-all-words-trial",
    newVar("seenWords", 1)
    ,
    newText("counter", '1')
        .after(newText(" /48"))
        .center()
        .css("margin-bottom", "3em")
        .print()
    ,
    newTimer("timerDisplay", displayTime)
    ,
    newTimer("timerWait", waitTime)
    ,
    ...generateElementsDisplayWords(rndWords)
);

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

// ------------- Instructions training 1 -------------
newTrial("instructions-training-1",
    defaultText.center().print().css("margin-bottom", "2em")
    ,
    newText("Now you will be asked to visualise again some of the words you saw before. As in the first exercise, try to picture in your mind what each word represents. Click on the button when you are ready.")    
    ,
    newButton("Next")
        .center()
        .print()
        .wait()
);

// ------------- Training 1: show all target words per category -------------
newTrialDisplayCategoryWords("show-food-words-trial", 'food', targetFood, displayTime, waitTime)
newTrialDisplayCategoryWords("show-animals-words-trial", 'animals', targetAnimals, displayTime, waitTime)
newTrialDisplayCategoryWords("show-occupations-words-trial", 'occupations', targetOccupations, displayTime, waitTime)
newTrialDisplayCategoryWords("show-clothes-words-trial", 'clothes', targetClothes, displayTime, waitTime)

// ------------- Instructions training 2-------------
newTrial("instructions-training-2",
    defaultText.center().print().css("margin-bottom", "2em")
    ,
    newText("Finally, you will be shown 24 of the previous words. Please follow the instructions in the following screens. Click on the button when you are ready.")
    ,
    newButton("Next")
        .center()
        .print()
        .wait()
);

// ------------- Training 2: click on every category word and then write it down -------------
newTrialClickCategoryWords('click-food-words-trial', 'food', targetWords, targetFood);
newTrialEnterCategoryWords("enter-food-words-trial", 'food', targetFood);

newTrialClickCategoryWords('click-animals-words-trial', 'animals', targetWords, targetAnimals);
newTrialEnterCategoryWords("enter-food-words-trial", 'animals', targetAnimals);

newTrialClickCategoryWords('click-occupations-words-trial', 'occupations', targetWords, targetOccupations);
newTrialEnterCategoryWords("enter-occupations-words-trial", 'occupations', targetOccupations);

newTrialClickCategoryWords('click-clothes-words-trial', 'clothes', targetWords, targetClothes);
newTrialEnterCategoryWords("enter-clothes-words-trial", 'clothes', targetClothes);
