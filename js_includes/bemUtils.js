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
 * @param {int} displayTime Milliseconds that each words will be displayed.
 * @param {int} waitTime Milliseconds to wait between each word.
 */
function generateElementsDisplayWords(words, displayTime, waitTime) {
    var elemsShowWords = []
    words.forEach( word => {
        elemsShowWords.push.apply(elemsShowWords, [
            newText("word"+word, word)
                .css("font-size", "24pt")
                .center()
                .print()
            ,
            newTimer("timerWord"+word, displayTime)
                .start()
                .wait()
            ,
            getText("word"+word).remove()
            ,
            newTimer("timerWait"+word, waitTime)
                .start()
                .wait()
        ])
    });
    
    return elemsShowWords
}

/**
 * Returns a custom trial where the sequence of ALL words is displayed.
 * @param {String} trialName Machine name of the trial.
 * @param {Array} words An array containing the words to display.
 * @param {int} displayTime Milliseconds that each words will be displayed.
 * @param {int} waitTime Milliseconds to wait between each word.
 */
newTrialDisplayAllWords = (trialName, words, displayTime = 3000, waitTime = 100) =>
    newTrial(trialName, ...generateElementsDisplayWords(words, displayTime, waitTime))

/**
 * Returns a custom trial where the sequence of all the words in a category words is displayed.
 * @param {String} trialName Machine name of the trial.
 * @param {String} category Name of the category to display.
 * @param {Array} words An array containing the words to display.
 * @param {int} displayTime Milliseconds that each words will be displayed.
 * @param {int} waitTime Milliseconds to wait between each word.
 */    
newTrialDisplayCategoryWords = (trialName, category, words, displayTime, waitTime) => newTrial(trialName,
    newText('text-'+category, 'You will now see 6 ' + category.toUpperCase() + ' words').print()
    ,
    newButton('next-'+category, 'Next')
        .print()
        .wait()
    ,    
    getText('text-'+category).remove()
    ,
    getButton('next-'+category).remove()
    ,
    newText('title-'+category, category.toUpperCase()+' words').print()
    ,
    ...generateElementsDisplayWords(words, displayTime, waitTime)
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
                newTargetButton('button'+word, word).print(pos_X*200, pos_Y*40,getCanvas("container")),
            );
        } else {
            trialElems.push(
                newFillerButton('button'+word, word).print(pos_X*200, pos_Y*40,getCanvas("container")),
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
            .css("color","red")
        ,
        getVar("targetsLeft")
            .set(v=>v-1)
            .test.is(0)
            .success( getButton("Next").click() )
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
newFillerButton = (name,text) => newButton(name, (text||name))
    .selector("buttons");

/**
 * Returns a custom trial where the subject has to click on all words of a given category.
 * @param {String} trialName Machine name of the trial.
 * @param {String} category Name of the category of the words the subject has to click on.
 * @param {Array} targetWords An array containing all the target words.
 * @param {Array} categoryWords An array containing the target words of the given category.
 */
newTrialClickCategoryWords = (trialName, category, targetWords, categoryWords) => newTrial(trialName,
    newText("Please click on all " + category.toUpperCase() + " words.").print()
    ,
    newVar("targetsLeft", 6)
    ,
    newCanvas("container", 800, 250)
    ,
    newSelector("buttons").disableClicks()
    ,
    ...generateButtons(targetWords, categoryWords)
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
);

/**
 * Returns a custom trial where the subject has to enter all words of a given category.
 * @param {String} trialName Machine name of the trial.
 * @param {String} category Name of the category of the words the subject has to click on.
 * @param {Array} words An array containing the target words of the given category.
 */
newTrialEnterCategoryWords = (trialName, category, words) => newTrial(trialName,
    newText("Enter all the " + category.toUpperCase() + " words:").print()
    ,
    newCanvas("container", 400, 250)
    ,
    newText("labelWord0",words[0]).print(0, 0, getCanvas("container")),
    newText("labelWord1",words[1]).print(0, 40, getCanvas("container")),
    newText("labelWord2",words[2]).print(0, 80, getCanvas("container")),
    newText("labelWord3",words[3]).print(0, 120, getCanvas("container")),
    newText("labelWord4",words[4]).print(0, 160, getCanvas("container")),
    newText("labelWord5",words[5]).print(0, 200, getCanvas("container"))
    ,
    newTextInput("inputWord0").print(150, 0, getCanvas("container")),
    newTextInput("inputWord1").print(150, 40, getCanvas("container")),
    newTextInput("inputWord2").print(150, 80, getCanvas("container")),
    newTextInput("inputWord3").print(150, 120, getCanvas("container")),
    newTextInput("inputWord4").print(150, 160, getCanvas("container")),
    newTextInput("inputWord5").print(150, 200, getCanvas("container"))
    ,
    getCanvas("container").print()
    ,
    newButton("Next")
        .print()
        .wait(
            getTextInput("inputWord0").test.text(getText("labelWord0").value)
            .and(getTextInput("inputWord0").test.text(getText("labelWord0").value)
                .failure(getText('labelWord0').css("color","red"))
                .success(getText('labelWord0').css("color","blue"))
            )    
            .and(getTextInput("inputWord1").test.text(getText("labelWord1").value)
                .failure(getText('labelWord1').css("color","red"))
                .success(getText('labelWord1').css("color","blue"))
            )    
            .and(getTextInput("inputWord2").test.text(getText("labelWord2").value)
                .failure(getText('labelWord2').css("color","red"))
                .success(getText('labelWord2').css("color","blue"))
            )
            .and(getTextInput("inputWord3").test.text(getText("labelWord3").value)
                .failure(getText('labelWord3').css("color","red"))
                .success(getText('labelWord3').css("color","blue"))
                )
            .and(getTextInput("inputWord4").test.text(getText("labelWord4").value)
                .failure(getText('labelWord4').css("color","red"))
                .success(getText('labelWord4').css("color","blue"))
                )
            .and(getTextInput("inputWord5").test.text(getText("labelWord5").value)
                .failure(getText('labelWord5').css("color","red"))
                .success(getText('labelWord5').css("color","blue"))
                )                
        )
);