/**
 * Shuffles array in place.
 * @param {Array} a An array containing the items.
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

/**
 * Returns a sample array of length num from arr.
 * @param {Array} arr An array containing the items.
 * @param {int} num Number of items to draw.
 */
function drawRandomSample(arr, num) {
    var copyArr = [...arr];
    shuffle(copyArr);
    return copyArr.slice(0,num);
}

/**
 * Returns the necessary PCIbex elements to display a sequence of words.
 * @param {Array} words An array containing the words to display.
 */
function generateElementsDisplayWords(words) {
    var elemsShowWords = []
    words.forEach( word => {
        elemsShowWords.push.apply(elemsShowWords, [
            newText("word"+word, word)
                .css("font-size", "48pt")
                .center()
                .print()
            ,
            getTimer("timerDisplay")
                .start()
                .wait()
            ,
            getText("word"+word).remove()
            ,
            getTimer("timerWait")
                .start()
                .wait()
            ,
            getVar("seenWords")
                .set(v=>v+1)
            ,
            getText("counter")
                .text( getVar("seenWords") )
            ,
        ])
    });
    
    return elemsShowWords
}

/**
 * Returns a custom trial where the sequence of all the words in a category words is displayed.
 * @param {String} trialName Machine name of the trial.
 * @param {String} category Name of the category to display.
 * @param {Array} words An array containing the words to display.
 * @param {int} displayTime Milliseconds that each words will be displayed.
 * @param {int} waitTime Milliseconds to wait between each word.
 */    
newTrialDisplayCategoryWords = (trialName, category, words, displayTime, waitTime) => newTrial(trialName,
    // newText('instructions', 'You will now see 6 ' + category.toUpperCase() + ' words. Please try to visualise each of them.<br>Click on the button when you are ready.')
    //     .css("margin-bottom", "2em")
    //     .print()
    // ,
    // newButton('Start')
    //     .center()
    //     .print()
    //     .wait()
    // ,    
    // getText("instructions").remove()
    // ,
    // getButton('Start').remove()
    // ,
    newVar("seenWords", 1)
    ,
    newText("counter", '1')
        .before(newText(category.toUpperCase() + ": "))
        .after(newText("/6"))
        .center()
        .css("margin-bottom", "3em")
        .print()
    ,
    newTimer("timerDisplay", displayTime)
    ,
    newTimer("timerWait", waitTime)
    ,
    ...generateElementsDisplayWords(words)
)

/**
 * Returns a list of PCIbex buttons for the clicking trial.
 * @param {Array} targetWords An array containing all the target words.
 * @param {Array} categoryWords An array containing words of the given category among the target words.
 */
function generateButtons(targetWords, categoryWords) {
    var trialElems = [];
    targetWords.forEach((word, idx) => {
        var pos_Y = Math.floor(idx / 4);
        var pos_X = idx % 4;
        
        if (categoryWords.includes(word)) {
            trialElems.push(
                newTargetButton('button'+word, word).print(pos_X*183, pos_Y*40,getCanvas("clickingContainer")),
            );
        } else {
            trialElems.push(
                newFillerButton('button'+word, word).print(pos_X*183, pos_Y*40,getCanvas("clickingContainer")),
            );
        }
    });
    
    return trialElems;
}

/**
 * Target button: if clicked, it turns red, gets disabled and the counter is decreased.
 * @param {String} name Machine name of the button.
 * @param {String} text Text of the button.
 */
newTargetButton = (name,text) => newButton(name, (text||name))
    .callback(
        getButton(name)
            .disable()
            .css("background-color", "green")
            .css("color","white")
        ,
        getVar("targetsLeft")
            .set(v=>v-1)
            .test.is(0)
            .success(
                getText("done").print()
                ,
                getButton("Next").print()
                ,
                getText("counter").remove()
            )
        ,
        getText("counter")
            .text( getVar("targetsLeft") )
    )
    .selector("buttons");

/**
 * Filler button: if clicked, nothing happens.
 * @param {String} name Machine name of the button.
 * @param {String} text Text of the button.
 */
newFillerButton = (name, text, category) => newButton(name, (text || name))
    .callback(
        newFunction(()=>window.alert("Wrong: the word " + text.toUpperCase() + " does not belong to this category.\nPlease try again.")).call()
    )
    .selector("buttons");

/**
 * Returns a custom trial where the subject has to click on all words of a given category.
 * @param {String} trialName Machine name of the trial.
 * @param {String} category Name of the category of the words the subject has to click on.
 * @param {Array} targetWords An array containing all the target words.
 * @param {Array} categoryWords An array containing the target words of the given category.
 */
newTrialClickCategoryWords = (trialName, category, targetWords, categoryWords) => newTrial(trialName,
    newText("<h3>Please click on all words of the category: " + category.toUpperCase() + "</h3>")
        .print()
    ,
    newText("There is a total of 6 words.")
        .css("margin-bottom", "2em")
        .print()
    ,
    newVar("targetsLeft", 6)
    ,
    newCanvas("clickingContainer", 640, 250)
    ,
    newSelector("buttons").disableClicks()
    ,
    ...generateButtons(targetWords, categoryWords)
    ,
    getCanvas("clickingContainer").print()
    ,
    getSelector("buttons").shuffle()
    ,
    newText("counter", '6')
        .before( newText("# words left: ") )
        .print()
    ,
    newText("done", "Well done! Click on \"Next\" to move on to the next screen.")
        .css("color", "blue")
        .css("margin", "2em 0 1em 0")
    ,
    newButton("Next")
        .center()
        .wait()
);

/**
 * Returns a custom trial where the subject has to enter all words of a given category.
 * @param {String} trialName Machine name of the trial.
 * @param {String} category Name of the category of the words the subject has to click on.
 * @param {Array} words An array containing the target words of the given category.
 */
newTrialEnterCategoryWords = (trialName, category, words) => newTrial(trialName,
    newText("<h3>Enter all these " + category.toUpperCase() + " words.</h3>")
        .print()
    ,
    newText("Please rewrite each word on the left into its respective box on the right. So, for example, if the word on the left is <i>tree</i>, you type <i>tree</i> in the box to the right of the word.<br>Click on the button when you are done.")
        .css("margin-bottom", "2em")
        .print()
    ,
    newCanvas("enterContainer", 400, 250).center()
    ,
    newText("labelWord0",words[0]).print(0, 0, getCanvas("enterContainer")).css("user-select", "none"),
    newText("labelWord1",words[1]).print(0, 40, getCanvas("enterContainer")).css("user-select", "none"),
    newText("labelWord2",words[2]).print(0, 80, getCanvas("enterContainer")).css("user-select", "none"),
    newText("labelWord3",words[3]).print(0, 120, getCanvas("enterContainer")).css("user-select", "none"),
    newText("labelWord4",words[4]).print(0, 160, getCanvas("enterContainer")).css("user-select", "none"),
    newText("labelWord5",words[5]).print(0, 200, getCanvas("enterContainer")).css("user-select", "none")
    ,
    newTextInput("inputWord0").print(100, 0, getCanvas("enterContainer")).size(100),
    newTextInput("inputWord1").print(100, 40, getCanvas("enterContainer")).size(100),
    newTextInput("inputWord2").print(100, 80, getCanvas("enterContainer")).size(100),
    newTextInput("inputWord3").print(100, 120, getCanvas("enterContainer")).size(100),
    newTextInput("inputWord4").print(100, 160, getCanvas("enterContainer")).size(100),
    newTextInput("inputWord5").print(100, 200, getCanvas("enterContainer")).size(100)
    ,
    getCanvas("enterContainer").print()
    ,
    newText("warning", "Words in red have errors: please enter all the words exactly as they appear. Enter each word in the box on the right.").css("color", "red")
    ,
    newButton("Next")
        .print()
        .css("margin-bottom", "1em")
        .wait(
            getTextInput("inputWord0").test.text(getText("labelWord0").value)
            .and(getTextInput("inputWord0").test.text(getText("labelWord0").value)
                .failure(
                    getText('labelWord0').css("color", "red"),
                    getText('warning').print()
                )
                .success(getText('labelWord0').css("color","blue"))
            )    
            .and(getTextInput("inputWord1").test.text(getText("labelWord1").value)
                .failure(
                    getText('labelWord1').css("color", "red"),
                    getText('warning').print()
                )
                .success(getText('labelWord1').css("color","blue"))
            )    
            .and(getTextInput("inputWord2").test.text(getText("labelWord2").value)
                .failure(
                    getText('labelWord2').css("color", "red"),
                    getText('warning').print()
                )
                .success(getText('labelWord2').css("color","blue"))
            )
            .and(getTextInput("inputWord3").test.text(getText("labelWord3").value)
                .failure(
                    getText('labelWord3').css("color", "red"),
                    getText('warning').print()
                )
                .success(getText('labelWord3').css("color","blue"))
                )
            .and(getTextInput("inputWord4").test.text(getText("labelWord4").value)
                .failure(
                    getText('labelWord4').css("color", "red"),
                    getText('warning').print()
                )
                .success(getText('labelWord4').css("color","blue"))
                )
            .and(getTextInput("inputWord5").test.text(getText("labelWord5").value)
                .failure(
                    getText('labelWord5').css("color", "red"),
                    getText('warning').print()
                )
                .success(getText('labelWord5').css("color","blue"))
                )                
        )
);