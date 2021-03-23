// This is to avoid writing "PennController.{something}" everytime
PennController.ResetPrefix(null)

// Merge all category words into a single array.
var rndWords = basefoods.concat(baseAnimals, baseOccupations, baseclothing)
// Shuffle the array in place.
shuffle(rndWords)

// Draw 6 words from each category and store them in a constant.
const targetfoods = drawRandomSample(basefoods, 6)
const targetAnimals = drawRandomSample(baseAnimals, 6)
const targetOccupations = drawRandomSample(baseOccupations, 6)
const targetclothing = drawRandomSample(baseclothing, 6)

// Merge all drawn words for convenience to log them.
const targetWords = targetfoods.concat(targetAnimals, targetOccupations, targetclothing)

// Parameters regarding the display and waiting time of single words.
const displayTime = 3000;
const waitTime = 100;

// DebugOff()   // Uncomment this line only when you are 100% done designing your experiment

// Wait 300ms between trials.
Header(
    newTimer('waitBeforeTrials', 300).start().wait()
)

// ------------- Welcome screen -------------
newTrial("welcome",
    // Automatically print all Text elements, centered
    defaultText.center().print().css('margin-bottom', '2em')
    ,
    newText("<h1>Welcome!</h1>")
    ,
    newText("Thank you for participating in this experiment.<br>The session takes <strong>approximately 15 minutes</strong>, so it is important that you do not get interrupted during this time. Some of the tasks require that you look at some video or some words for a certain amount of time, so we would like to ask you in advance to really <strong>focus on the tasks</strong>, even if you do not understand the purpose of what you are doing. At the end of the session, a short explanation of the aim of the experiment will be given.")
    ,
    newText("By clicking on the button below you agree to participate in this experiment. All the data collected is anonymous. You can stop your participation in the experiment at any point.")
    ,
    newButton("I have read the above and I want to continue")
        .center()
        .print()
        .wait()
)
// Log the target words (the remaining are control words).
.log( "targetWords", targetWords.join(' '));

// ------------- Demographics questions -------------
newTrial( "demographics-age",
    newText("<h4>We will now ask you a few questions. We remind you that all your answers are anonymous.</h4>")
        .print()
    ,
    newText("What is your age?")
        .css("margin-bottom", "1em")
        .print()
    ,
    newTextInput("age-input")
        .size(50)
        .css("margin-bottom", "2em")
        .print()
    ,
    newText("warning", "Enter a valid number (e.g. 25)").css("color", "red")
    ,
    newButton("Next")
        .print()
        .wait(getTextInput("age-input").test.text(/^[0-9]+$/)
            .failure(getText("warning").print())
        )
)

newTrial("demographics-gender",
    newText("What is your gender?")
        .print()
    ,
    newScale("gender", "male", "female", "other")  
        .button()
        .center()
        .labelsPosition("top")
        .print()
        .wait()
)


newTrial("demographics-bored",
    newText("To what extent do you agree with the following statement?:")
        .css("margin-bottom", "1em")
        .print()
    ,
    newText('"I am easily bored"')
        .css("margin-bottom", "2em")
        .css("font-style", "italic")
        .center()
        .print()
    ,
    newScale("bored", "Very untrue", "Untrue", "Neutral", "True", "Very True")  
        .button()
        .center()
        .labelsPosition("top")
        .print()
        .wait()
)

newTrial("demographics-movies",
    newText("To what extent do you agree with the following statement?:")
        .css("margin-bottom", "1em")
        .print()
    ,
    newText('"I often enjoy seeing movies I’ve seen before"')
        .css("margin-bottom", "2em")
        .css("font-style", "italic")
        .center()
        .print()
    ,
    newScale("movies", "Very untrue", "Untrue", "Neutral", "True", "Very True")
        .button()
        .center()
        .labelsPosition("top")
        .print()
        .wait()
)


// ------------- Relaxation screen -------------
newTrial("instructions-relaxation",
    // newVar("secondsLeft", 180)
    // ,
    newText("We now ask you to try to relax before the main exercise begins. Feel free to watch the following 3-min video if you find it helpful to relax. Click on \"Next\" when you are ready to continue.")
        .print()
        .css('margin-bottom', '2em')
    ,
    newVideo("myVideo", "relax_video.mp4")
        .center()
        .size("600", "337.5")
        .css('margin-bottom', '2em')
        .print()
    ,
    // newText("counter", '180')
    //     .before(newText("Time left: "))
    //     .after(newText("s"))
    //     .center()
    //     .print()
    // ,
    // newTimer("timer", 1000)
    //     .callback(
    //         getVar("secondsLeft")
    //             .set(v=>v-1)
    //             .test.is(0)
    //             .success( getButton("Next").click() )
    //         ,
    //         getText("counter")
    //             .text( getVar("secondsLeft") )
    //         ,
    //         getTimer("timer").start()
    //     )
    //     .start()
    // ,
    newButton("Next")
        .center()
        .print()
        .wait()
);

// ------------- Instructions display -------------
newTrial("instructions-show-words",
    defaultText.center().print()
    ,
    newText("Now 48 words will be displayed in intervals of 3 seconds. We ask you to <strong>visualise each word</strong> (for example, if the word is \"tree\", try to visualise a tree).<br> Click on the button when you are ready.")
        .css("margin-bottom", "2em")
    ,
    newButton("Start")
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
    newButton("Next", "Next")
        .print()
        .wait()
)

// ------------- Instructions training 1 -------------
newTrial("instructions-training-1",
    newText("<h3>Second part</h3>")
        .print()
    ,
    newText("You will now be shown 24 of the words you saw earlier, divided into 4 categories: Foods, Animals, Occupations, and Clothing. As you see each word, try to form an image of the thing it refers to (e.g., if the word is <i>tree</i>, visualize a tree).")
        .center()
        .print()
        .css("margin-bottom", "2em")
    ,
    newButton("Next")
        .center()
        .print()
        .wait()
);

// ------------- Training 1: show all target words per category -------------
newTrialDisplayCategoryWords("show-foods-words-trial", 'foods', targetfoods, displayTime, waitTime)
newTrialDisplayCategoryWords("show-animals-words-trial", 'animals', targetAnimals, displayTime, waitTime)
newTrialDisplayCategoryWords("show-occupations-words-trial", 'occupations', targetOccupations, displayTime, waitTime)
newTrialDisplayCategoryWords("show-clothing-words-trial", 'clothing', targetclothing, displayTime, waitTime)

// ------------- Instructions training 2-------------
newTrial("instructions-training-2",
    newText("Finally, you will be shown a table with 24 of the previous words. Please follow the instructions in the following screens.")
        .center()
        .print()
        .css("margin-bottom", "2em")
    ,
    newButton("Next")
        .center()
        .print()
        .wait()
);

// ------------- Training 2: click on every category word and then write it down -------------
newTrialClickCategoryWords('click-foods-words-trial', 'foods', targetWords, targetfoods);
newTrialEnterCategoryWords("enter-foods-words-trial", 'foods', targetfoods);

newTrialClickCategoryWords('click-animals-words-trial', 'animals', targetWords, targetAnimals);
newTrialEnterCategoryWords("enter-foods-words-trial", 'animals', targetAnimals);

newTrialClickCategoryWords('click-occupations-words-trial', 'occupations', targetWords, targetOccupations);
newTrialEnterCategoryWords("enter-occupations-words-trial", 'occupations', targetOccupations);

newTrialClickCategoryWords('click-clothing-words-trial', 'clothing', targetWords, targetclothing);
newTrialEnterCategoryWords("enter-clothing-words-trial", 'clothing', targetclothing);


// Send results manually
SendResults("send")

// Completion screen
newTrial("completion_screen",
    newText("thanks", "<h3>Well done!</h3>")
        .center()
        .print()
    ,
    newText("thanks", "TODO: explanation about the experiment.")
        .css("margin-bottom","2em")
        .center()
        .print()
    ,
    newText("thanks", "Thank you for participating! You may now exit the window.")
        .css("margin-bottom","2em")
        .center()
        .print()
    ,
    newButton("void", "")
        .wait()
)