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

function generateElementsDisplayWords(words, displayTime = 300, waitTime = 10) {
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

function generateButtons(allWords, targetWords) {
    var trialElems = [];
    allWords.forEach((word, idx) => {
        var pos_Y = Math.floor(idx / 4);
        var pos_X = idx % 4;
        
        if (targetWords.includes(word)) {
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
    
newFillerButton = (name,text) => newButton(name, (text||name))
    .selector("buttons")