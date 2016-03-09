var myKey = config.myKey;
var wordsToIgnore = ["FOR", "AND", "NOR", "BUT", "OR", "YET", "SO", "AFTER", "ALTHOUGH", "AS", "BECAUSE", "BEFORE", "EVEN", "IF", "LEST", "NOW", "THAN", "THAT", "THOUGH",
"TIL", "UNLESS", "UNTIL", "WHEN", "WHENEVER", "WHEREAS", "WHERE", "WHEREVER", "WHETHER", "WHICH", "WHILE", "WHO", "WHOEVER", "WHY", "WHAT", "BOTH", "ALSO", "EITHER", "NEITHER", "I",
"ME", "WE", "US", "YOU", "SHE", "HER", "HE", "HIM", "IT", "THEY", "THEM", "THIS", "THESE", "THOSE", "MYSELF", "OURSELVES", "YOURSELF", "YOURSELVES", "HIMSELF", "HERSELF",
"ITSELF", "THEMSELVES", "ONE", "TWO", "THREE", "FOUR", "FIVE", "SIX", "SEVEN", "EIGHT", "NINE", "TEN", "TWENTY", "THIRTY", "FORTY", "FIFTY", "SIXTY", "SEVENTY", "EIGHTY", "NINETY",
"HUNDRED", "THOUSAND", "MILLION", "BILLION", "TRILLION", "INTO", "IN", "THE", "OF", "WITH", "SOME", "A", "IT", "TO", "IS"];
var $text;
var $textArray = [];
var newArray = [];
var $resultsSection = $('#results-section');
var suffix = '';

function convertNoun(responseData, indexNumber) {
  var arrayLength = responseData.noun.syn.length - 1;
  var random = function() {
    return Math.round(Math.random() * arrayLength)
  }

  newArray[indexNumber] = responseData.noun.syn[random()] + suffix;
};

function convertAdjective(responseData, indexNumber) {
  var arrayLength = responseData.adjective.syn.length - 1;
  var random = function() {
    return Math.round(Math.random() * arrayLength)
  }

  newArray[indexNumber] = responseData.adjective.syn[random()] + suffix;
};

function convertVerb(responseData, indexNumber) {
  var arrayLength = responseData.verb.syn.length - 1;
  var random = function() {
    return Math.round(Math.random() * arrayLength)
  }

  newArray[indexNumber] = responseData.verb.syn[random()] + suffix;
};

function convertAdverb(responseData, indexNumber) {
  var arrayLength = responseData.adverb.syn.length - 1;
  var random = function() {
    return Math.round(Math.random() * arrayLength)
  }

  newArray[indexNumber] = responseData.adverb.syn[random()] + suffix;
};

function setSuffix(wordToCheck) {
  if (wordToCheck.slice(-1) === ',') {
    suffix = ','
  }
  else if (wordToCheck.slice(-1) === '.') {
    suffix = '.'
  }
  else if (wordToCheck.slice(-1) === 's') {
    suffix = 's'
  }
  else if (wordToCheck.slice(-2) === 'ed') {
    suffix = 'ed'
  }
  else if (wordToCheck.slice(-3) === 'ing') {
    suffix = 'ing'
  }
  else {
    suffix = ''
  }
}

function convertWord(word, index) {
  setSuffix(word);
  $.ajax({
    type: 'GET',
    dataType: 'json',
    url: 'http://words.bighugelabs.com/api/2/' + myKey + '/' + word + '/json',
    error: function() {
      newArray[index] = word;
      console.log('"' + word + '" was ignored because of an error');
    },
    success: function(data) {
      if (data.noun && !(wordsToIgnore.includes(word.toUpperCase()))) {
        convertNoun(data, index)
      }
      else if (data.adjective && !(wordsToIgnore.includes(word.toUpperCase()))) {
        convertAdjective(data, index)
      }
      else if (data.verb && !(wordsToIgnore.includes(word.toUpperCase()))) {
        convertVerb(data, index)
      }
      else if (data.adverb && !(wordsToIgnore.includes(word.toUpperCase()))) {
        convertAdverb(data, index)
      }
      else {
        newArray[index] = word;
        console.log('"' + word + '" was ignored because it\'s a boring word');
      }
    }
  }).done(function () {
    $('#results').remove();
    $resultsSection.append('<p id="results">' + newArray.join(' ') + '</p>');
  })
};

$('textarea').on('change', function() {
  $text = $('textarea').val();
  $textArray = $text.split(' ');
});

$('#convert').on('click', function() {
  var length = $textArray.length;
  newArray = [];

  if ($('textarea').val() === '') {
    $('textarea')[0].style.backgroundColor = "red";
    $('textarea')[0].focus();
    window.setTimeout(setTextAreaBG, 300);
  }
  else {
    for (i = 0; i < length; i++) {
      if (Math.random() > 0.5) {
        convertWord($textArray[i], i);
      } else {
        newArray[i] = $textArray[i];
        console.log('"' + $textArray[i] + '" was ignored at random');
      }
    }
  }
});

function setTextAreaBG() {
  $('textarea')[0].style.backgroundColor = "white";
};

//need to get rid of periods, commas, etc from the text array
//allow for -ing, -s, and -ed
