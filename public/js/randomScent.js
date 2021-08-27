const fs = require('fs');

let rawData = fs.readFileSync("./eng_word_list.json")
let wordList = Object.keys(JSON.parse(rawData));
let confMod1 = .5;
let confMod2 = .3;
let confMod3 = .1;
let cf = .47;
let wordMap = new Map();
let confStart = confMod1 * confMod2 * confMod3;
for (word in wordList) {
    wordMap.set(key = word, value = confStart);
}

function generateWords(howmany = 3, conf = .5) {
    let randNum = (max, min = 0) => Math.floor(Math.random() * max) - min + 1;
    let words = [wordList[randNum(wordList.length)], wordList[randNum(wordList.length)], wordList[randNum(wordList.length)]];
    let wordsPassed = 0;

    for (let i = 0; i < howmany; i++) {
        while (wordMap.get(word) < conf) {
            words[i] = words[randNum(wordList.length)];
        }
    }
    return words;
}

console.log(generateWords(3, .5));


