let input = document.getElementById("input");
let overviewOutput = document.getElementById("overview-output");
let wordsOutput = document.getElementById("words-output");
let lettersOutput = document.getElementById("letters-output");
let substitutionOutput = document.getElementById("sub-output");
let substitutionKeyboard = document.getElementById("keyboard");
let charList = [];

String.prototype.replaceAll = function(str1, str2, ignore)
{
    return this.replace(new RegExp(str1.replace(/([\/\,\!\\\^\$\{\}\[\]\(\)\.\*\+\?\|\<\>\-\&])/g,"\\$&"),(ignore?"gi":"g")),(typeof(str2)=="string")?str2.replace(/\$/g,"$$$$"):str2);
}

function process() {

    //reset our output divs
    overviewOutput.innerHTML = "";
    wordsOutput.innerHTML = "";
    lettersOutput.innerHTML = "";
    substitutionOutput.innerHTML ="";

    let string = input.valueOf().value;

    let charCount  = document.createElement("p");
    let wordCount = document.createElement("p");

    charCount.innerText = "total characters = "+string.length;
    wordCount.innerText = "total words = "+countWords(string);

    overviewOutput.appendChild(charCount);
    overviewOutput.appendChild(wordCount);

    //word frequency and letter testing
    getWordAndLetterFrequency(string);

    //call our letter substitution function
    performSubstitution(null, null);

    //create our keyboard
    createKeyboard();

    substitutionKeyboard.addEventListener('keypress', function (key) {
        performSubstitution(key.key,document.activeElement.id);
    })
}

function getWordAndLetterFrequency(string) {

    let words = string.split(" ");
    let tested = {};
    let testedChars = {};

    words.forEach(function (currentValue) {

        //trim all the white space from the word
        currentValue = currentValue.trim();

        //explode the string and count the chars
        let localChars = Array.from(currentValue);
        localChars.forEach(function (char) {
            if(testedChars[char] === undefined){
                testedChars[char] = 1;
            }else{
                let lastValue = testedChars[char];
                testedChars[char] = lastValue+1;
            }
        })

        //check if we have counted this word before, if not then it is undefined and thus we set its value to 1
        if(tested[currentValue] === undefined){
            tested[currentValue] = 1;
        }else{
            //else we get the current value then increment it by 1
            let lastValue = tested[currentValue];
            tested[currentValue] = lastValue+1;
        }

    })

    //render our word counts
    Object.entries(tested).sort(compareSecondColumn).reverse().forEach(function (currentValue) {
        let div = document.createElement("div");
        let word = document.createElement("p");
        let count = document.createElement("p");

        count.innerText = "x"+currentValue[1];
        word.innerText = currentValue[0];

        //style the elements
        div.style.display = "flex";
        div.style.flexDirection = "row";
        div.style.width = "45%";

        word.style.overflow = "scroll";
        word.style.paddingLeft = "16px";
        word.className = "center";

        count.style.backgroundColor = "#3962a2";
        count.style.width = "64px";
        count.style.color = "white";
        count.style.textAlign = "center";
        count.className = "center";

        div.appendChild(count);
        div.appendChild(word);

        wordsOutput.appendChild(div);
    })

    charList = Object.entries(testedChars);

    //render our char counts
    Object.entries(testedChars).sort(compareSecondColumn).reverse().forEach(function (currentChar) {

        //create our elements
        let div = document.createElement("div");
        let count = document.createElement("p");
        let char = document.createElement("p");
        let percentage =document.createElement("p");

        //set the text values
        count.innerText = "x"+currentChar[1];
        char.innerText = currentChar[0];
        percentage.innerText = parseFloat(currentChar[1]/string.length*100).toFixed(2)+"%";

        //style the elements
        percentage.style.fontWeight = "bold";
        percentage.style.height = "21.333px";

        char.style.backgroundColor = "#3962a2";
        char.style.height = "21.333px";
        char.style.color = "white";

        count.style.height = "21.333px";

        //append our element to the parent div
        div.appendChild(char);
        div.appendChild(percentage);
        div.appendChild(count);

        //finally append the div to the output
        lettersOutput.appendChild(div);
    })

}

//substitution functions
function performSubstitution(letter, target){


    if(letter === null){
        let p = document.createElement("p");
        p.style.borderRadius = "0.5px";
        p.style.borderColor = "white";
        p.style.borderStyle = "solid";
        p.style.padding = "8px";
        p.innerText = input.valueOf().value;
        p.id = "sub-replace-text";
        substitutionOutput.appendChild(p);

    }else{

        let text = document.getElementById("sub-replace-text");
        let textLast = text.innerText;
        text.innerText = replaceAllOneCharAtATime(textLast,target,letter)
    }

}

function createKeyboard(){
    charList.forEach(function (char) {
        let div =  document.createElement("div");
        let p = document.createElement("p");
        let input = document.createElement("input");

        //set the text
        p.innerText = char[0];
        input.value = char[0];
        //append the children
        div.appendChild(p);
        div.appendChild(input);
        input.id = char[0];
        substitutionKeyboard.appendChild(div);

        console.log(char[0])
    })
}


//simple get word count function
function countWords(string) {
    let words = string.split(" ");
    return words.length;
}


//sorting function created by jahory
//https://stackoverflow.com/questions/16096872/how-to-sort-2-dimensional-array-by-column-value
function compareSecondColumn(a, b) {
    if (a[1] === b[1]) {
        return 0;
    }
    else {
        return (a[1] < b[1]) ? -1 : 1;
    }
}

//find and replace script created by Rick Velde
//https://stackoverflow.com/questions/2116558/fastest-method-to-replace-all-instances-of-a-character-in-a-string
function replaceAllOneCharAtATime(inSource, inToReplace, inReplaceWith) {
    var output="";
    var firstReplaceCompareCharacter = inToReplace.charAt(0);
    var sourceLength = inSource.length;
    var replaceLengthMinusOne = inToReplace.length - 1;
    for(var i = 0; i < sourceLength; i++){
        var currentCharacter = inSource.charAt(i);
        var compareIndex = i;
        var replaceIndex = 0;
        var sourceCompareCharacter = currentCharacter;
        var replaceCompareCharacter = firstReplaceCompareCharacter;
        while(true){
            if(sourceCompareCharacter != replaceCompareCharacter){
                output += currentCharacter;
                break;
            }
            if(replaceIndex >= replaceLengthMinusOne) {
                i+=replaceLengthMinusOne;
                output += inReplaceWith;
                //was a match
                break;
            }
            compareIndex++; replaceIndex++;
            if(i >= sourceLength){
                // not a match
                break;
            }
            sourceCompareCharacter = inSource.charAt(compareIndex)
            replaceCompareCharacter = inToReplace.charAt(replaceIndex);
        }
        replaceCompareCharacter += currentCharacter;
    }
    return output;
}