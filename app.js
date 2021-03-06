(function() {
  'use strict';

  $(document).ready(function() {
    var myKey = config.myKey;
    var wordsToIgnore = ['FOR', 'AND', 'NOR','BUT', 'OR', 'YET', 'SO', 'AFTER', 'ALTHOUGH', 'AS', 'BECAUSE', 'BEFORE', 'EVEN', 'IF', 'LEST', 'NOW', 'THAN', 'THAT', 'THOUGH',
    'TIL', 'UNLESS', 'UNTIL', 'WHEN', 'WHENEVER', 'WHEREAS', 'WHERE', 'WHEREVER', 'WHETHER', 'WHICH', 'WHILE', 'WHO', 'WHOEVER', 'WHY', 'WHAT', 'BOTH', 'ALSO', 'EITHER', 'NEITHER', 'I',
    'ME', 'WE', 'US', 'YOU', 'SHE', 'HER', 'HE', 'HIM', 'IT', 'THEY', 'THEM', 'THIS', 'THESE', 'THOSE', 'MYSELF', 'OURSELVES', 'YOURSELF', 'YOURSELVES', 'HIMSELF', 'HERSELF',
    'ITSELF', 'THEMSELVES', 'ONE', 'TWO', 'THREE', 'FOUR', 'FIVE', 'SIX', 'SEVEN', 'EIGHT', 'NINE', 'TEN', 'TWENTY', 'THIRTY', 'FORTY', 'FIFTY', 'SIXTY', 'SEVENTY', 'EIGHTY', 'NINETY',
    'HUNDRED', 'THOUSAND', 'MILLION', 'BILLION', 'TRILLION', 'INTO', 'IN', 'THE', 'OF', 'WITH', 'SOME', 'A', 'IT', 'TO', 'IS', 'YOUR', 'MY', 'HIS', 'HERS', 'OURS'];
    var $text;
    var $textArray = [];
    var newArray = [];
    var $resultsSection = $('#results-section');
    var $portions = $('.portions');
    var isPlural = false;
    var portion = 0.4;

    function convertNoun(responseData, indexNumber) {
      var arrayLength = responseData.noun.syn.length - 1;
      var random = function() {
        return Math.round(Math.random() * arrayLength);
      };
      if (isPlural === false) {
        newArray[indexNumber] = responseData.noun.syn[random()];
      }
      else {
        newArray[indexNumber] = responseData.noun.syn[random()] + 's';
      }
    }

    function convertAdjective(responseData, indexNumber) {
      var arrayLength = responseData.adjective.syn.length - 1;
      var random = function() {
        return Math.round(Math.random() * arrayLength);
      };

      newArray[indexNumber] = responseData.adjective.syn[random()];
    }

    function convertVerb(responseData, indexNumber) {
      var arrayLength = responseData.verb.syn.length - 1;
      var random = function() {
        return Math.round(Math.random() * arrayLength);
      };

      newArray[indexNumber] = responseData.verb.syn[random()];
    }

    function convertAdverb(responseData, indexNumber) {
      var arrayLength = responseData.adverb.syn.length - 1;
      var random = function() {
        return Math.round(Math.random() * arrayLength);
      };

      newArray[indexNumber] = responseData.adverb.syn[random()];
    }

    function convertWord(word, index) {
      $.ajax({
        type: 'GET',
        dataType: 'json',
        url: 'http://words.bighugelabs.com/api/2/' + myKey + '/' + word + '/json',
        error: function() {
          newArray[index] = word;
          console.log('"' + word + '" was ignored because of an error');
        },
        success: function(data) {
          if (data.noun && !wordsToIgnore.includes(word.toUpperCase())) {
            if (word.slice(-1) === 's' && word.slice(-2) !== 'ss') {
              isPlural = true;
            }
            else {
              isPlural = false;
            }
            convertNoun(data, index);
          }
          else if (data.adjective && !wordsToIgnore.includes(word.toUpperCase())) {
            convertAdjective(data, index);
          }
          else if (data.verb && !wordsToIgnore.includes(word.toUpperCase())) {
            convertVerb(data, index);
          }
          else if (data.adverb && !wordsToIgnore.includes(word.toUpperCase())) {
            convertAdverb(data, index);
          }
          else {
            newArray[index] = word;
            console.log('"' + word + '" was ignored because it\'s a boring word');
          }
        }
      }).done(function() {
        $('#results').remove();
        $resultsSection.append('<p id="results">' + newArray.join(' ') + '</p>');
      });
    }

    $('textarea').on('change', function() {
      $text = $('textarea').val();
      $textArray = $text.split(' ');
    });

    function setTextAreaBG() {
      $('textarea')[0].style.backgroundColor = 'white';
      $('textarea')[0].style.borderLeft = '40px solid white';
      $('textarea')[0].style.borderRight = '30px solid white';
    }

    $('#convert').on('click', function() {
      var length = $textArray.length;

      newArray = [];
      if ($('textarea').val() === '') {
        $('textarea')[0].style.backgroundColor = 'red';
        $('textarea')[0].style.borderLeft = '40px solid red';
        $('textarea')[0].style.borderRight = '30px solid red';
        $('textarea')[0].focus();
        window.setTimeout(setTextAreaBG, 300);
      }
      else {
        for (var i = 0; i < length; i++) {
          if (Math.random() < portion) {
            convertWord($textArray[i], i);
          }
          else {
            newArray[i] = $textArray[i];
            console.log('"' + $textArray[i] + '" was ignored at random');
          }
        }
      }
    });

    $('#reload').on('click', function() {
      $('textarea').val($('#results')[0].textContent);
      $('#results').remove();
    });

    $portions.on('click', function(e) {
      var target = e.target;

      $portions[0].style.borderRight = 'none';
      $portions[1].style.borderRight = 'none';
      $portions[2].style.borderRight = 'none';
      target.style.borderRight = '5px solid white';
      if (target.id === 'onethird') {
        portion = 0.4;
      }
      else if (target.id === 'twothirds') {
        portion = 0.67;
      }
      else if (target.id === 'threethirds') {
        portion = 1;
      }
    });

  });
})();
