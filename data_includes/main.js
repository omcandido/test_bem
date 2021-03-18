PennController.ResetPrefix(null) // Keep here

var rndWords = baseFood.concat(baseAnimals, baseOccupations, baseClothes)
shuffle(rndWords)

const trialFood = drawRandomSample(baseFood, 6)
const trialAnimals = drawRandomSample(baseAnimals, 6)
const trialOccupations = drawRandomSample(baseOccupations, 6)
const trialClothes = drawRandomSample(baseClothes, 6)

const trialWords = trialFood.concat(trialAnimals, trialOccupations, trialClothes)

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
.log( "trialWords", trialWords.join(' '));

newTrial("instructions-relaxation",
    defaultText.center().print()
    ,
    newText("Relaxation screen. TODO: This is supposed to be a 3-min relaxing video screen.")
    ,
    newButton("Click to start the experiment")
        .center()
        .print()
        .wait()
);

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


var elemsShowAllWords = generateElementsDisplayWords(rndWords);
newTrial("show-all-words-trial", ...elemsShowAllWords);

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
newTrial("show-target-words-trial",
    // FOOD
    newText('text-food', 'You will now see 6 FOOD words').print()
    ,
    newButton('next-food', 'Next')
        .print()
        .wait()
    ,    
    getText('text-food').remove()
    ,
    getButton('next-food').remove()
    ,
    newText('title-food', 'FOOD words').print()
    ,
    ...generateElementsDisplayWords(trialFood)
    ,
    getText('title-food').remove()
    ,

    // ANIMALS
    newText('text-animals', 'You will now see 6 ANIMALS words').print()
    ,
    newButton('next-animals', 'Next')
        .print()
        .wait()
    ,    
    getText('text-animals').remove()
    ,
    getButton('next-animals').remove()
    ,
    newText('title-animals','ANIMALS words').print()
    ,
    ...generateElementsDisplayWords(trialAnimals)
    ,
    getText('title-animals').remove()
    ,

    // OCCUPATIONS
    newText('text-occupations', 'You will now see 6 OCCUPATIONS words').print()
    ,
    newButton('next-occupations', 'Next')
        .print()
        .wait()
    ,    
    getText('text-occupations').remove()
    ,
    getButton('next-occupations').remove()
    ,
    newText('title-occupations','OCCUPATIONS words').print()
    ,
    ...generateElementsDisplayWords(trialOccupations)
    ,
    getText('title-occupations').remove()
    ,

    // CLOTHES
    newText('text-clothes', 'You will now see 6 CLOTHES words').print()
    ,
    newButton('next-clothes', 'Next')
        .print()
        .wait()
    ,    
    getText('text-clothes').remove()
    ,
    getButton('next-clothes').remove()
    ,
    newText('title-clothes','CLOTHES words').print()
    ,
    ...generateElementsDisplayWords(trialClothes)
    ,
    getText('title-clothes').remove()
    ,
);

// ------------- TRAIN 2 -------------
newTrial('train-2-trial',
    newText("Please click on all FOOD words.").print()
    ,
    newVar("targetsLeft", 6)
    ,
    newCanvas("container", 800, 250)
    ,
    newSelector("buttons").disableClicks()
    ,
    ...generateButtons(trialWords, trialFood)
    ,
    getCanvas("container").print()
    ,
    getSelector("buttons").shuffle()
    ,
    newText("counter", '6')
        .before( newText("# words left: ") )
        .print()
    ,
    newButton("Next").wait()
)

newTrial('train-2-trial',
    newText("Please click on all ANIMALS words.").print()
    ,
    newVar("targetsLeft", 6)
    ,
    newCanvas("container", 800, 250)
    ,
    newSelector("buttons").disableClicks()
    ,
    ...generateButtons(trialWords, trialAnimals)
    ,
    getCanvas("container").print()
    ,
    getSelector("buttons").shuffle()
    ,
    newText("counter", '6')
        .before( newText("# words left: ") )
        .print()
    ,
    newButton("Next").wait()
)

newTrial('train-2-trial',
    newText("Please click on all OCCUPATIONS words.").print()
    ,
    newVar("targetsLeft", 6)
    ,
    newCanvas("container", 800, 250)
    ,
    newSelector("buttons").disableClicks()
    ,
    ...generateButtons(trialWords, trialOccupations)
    ,
    getCanvas("container").print()
    ,
    getSelector("buttons").shuffle()
    ,
    newText("counter", '6')
        .before( newText("# words left: ") )
        .print()
    ,
    newButton("Next").wait()
)

newTrial('train-2-trial',
    newText("Please click on all CLOTHES words.").print()
    ,
    newVar("targetsLeft", 6)
    ,
    newCanvas("container", 800, 250)
    ,
    newSelector("buttons").disableClicks()
    ,
    ...generateButtons(trialWords, trialClothes)
    ,
    getCanvas("container").print()
    ,
    getSelector("buttons").shuffle()
    ,
    newText("counter", '6')
        .before( newText("# words left: ") )
        .print()
    ,
    newButton("Next").wait()
)

// ------------- TRAIN 3 -------------
newTrial('test',
    newText("Enter all the words:").print()
    ,
    newCanvas("container", 400, 250)
    ,
    newText("word1", 'word1').print(0, 0, getCanvas("container")),
    newText("word2", 'word2').print(0, 40, getCanvas("container")),
    newText("word3", 'word3').print(0, 80, getCanvas("container")),
    newText("word4", 'word4').print(0, 120, getCanvas("container")),
    newText("word5", 'word5').print(0, 160, getCanvas("container")),
    newText("word6", 'word6').print(0, 200, getCanvas("container"))
    ,
    newTextInput("inputWord1").print(150, 0, getCanvas("container")),
    newTextInput("inputWord2").print(150, 40, getCanvas("container")),
    newTextInput("inputWord3").print(150, 80, getCanvas("container")),
    newTextInput("inputWord4").print(150, 120, getCanvas("container")),
    newTextInput("inputWord5").print(150, 160, getCanvas("container")),
    newTextInput("inputWord6").print(150, 200, getCanvas("container"))
    ,
    getCanvas("container").print()
    ,
    newButton("Next")
        .print()
        .wait(
            getTextInput("inputWord1").test.text(getText("word1").value)
            .and(getTextInput("inputWord1").test.text(getText("word1").value)
                .failure(getText('word1').css("color","red"))
                .success(getText('word1').css("color","blue"))
            )    
            .and(getTextInput("inputWord2").test.text(getText("word2").value)
                .failure(getText('word2').css("color","red"))
                .success(getText('word2').css("color","blue"))
            )
            .and(getTextInput("inputWord3").test.text(getText("word3").value)
                .failure(getText('word3').css("color","red"))
                .success(getText('word3').css("color","blue"))
                )
            .and(getTextInput("inputWord4").test.text(getText("word4").value)
                .failure(getText('word4').css("color","red"))
                .success(getText('word4').css("color","blue"))
                )
            .and(getTextInput("inputWord5").test.text(getText("word5").value)
                .failure(getText('word5').css("color","red"))
                .success(getText('word5').css("color","blue"))
                )
            .and(getTextInput("inputWord6").test.text(getText("word6").value)
                .failure(getText('word6').css("color","red"))
                .success(getText('word6').css("color","blue"))
                )
                
        )
);