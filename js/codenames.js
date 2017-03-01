// NOTE: var words contains words array, loaded in index.html

$(document).ready(function() {
  $('#scores-row').hide();
  $('#form-gen').on('submit', function(e) {
    e.preventDefault();
    $('#btn-generate').trigger('click');
  });

  $('#btn-generate').click(function() {
    var seed = $('#seed').val();
    // apply seed
    Math.seedrandom(seed);
    createGame();
    $(document).attr('title', 'Codenames' + ' | ' + seed);
  });
});

function createGame() {
  var isBlueStartFirst = Math.round(Math.random() * 2) == 0 ? true : false;
  var cards = pickRandomCards(isBlueStartFirst);
  var role = $('input[name="role"]:checked').val();
  renderBoard(cards, role, isBlueStartFirst);
}

function renderBoard(cards, role, isBlueStartFirst) {
  // main rendering
  var $table = $('#main-table');
  $table
  .empty()
  .off('click', '.click-once');

  for (var i = 0; i < 5; i++) {
    var $row = $('<tr></tr>');
    for (var j = 0; j < 5; j++) {
      var $cell = $('<td></td>');
      var $card = $('<p></p>');
      // take next card and render
      var currentCard = cards.shift();
      $card.addClass('card').addClass('click-once');
      $card.attr('data-color', currentCard.color);
      if (role == 'spymaster') {
        $card.addClass(currentCard.color);
      }
      $card.html(currentCard.word);
      $cell.append($card);
      $row.append($cell);
    }
    $table.append($row);
  }

  // card click events
  if (role == 'spymaster') {
    $table
    .on('click', '.click-once', function(e) {
      $(this)
      .addClass('grey')
      .addClass('card-done')
      .removeClass('click-once');
      var color = $(this).data('color');
      incrementScore(color);
    });
  }else if (role == 'player') {
    $table
    .on('click', '.click-once', function() {
      $(this)
      .addClass($(this)
      .data('color'))
      .addClass('card-done')
      .removeClass('click-once');

      var color = $(this).data('color');
      incrementScore(color);
    });
  }

  // set initial score values
  $('#red-score,#blue-score').text(0);
  if (isBlueStartFirst) {
    $('#blue-total').text(9);
    $('#red-total').text(8);
  }else {
    $('#red-total').text(9);
    $('#blue-total').text(8);
  }

  // set turn initial value
  var startingColor = isBlueStartFirst ? 'blue' : 'red';
  // show row
  $('#scores-row').show();
}

function incrementScore(color) {
  if (color == 'red') {
    var score = $('#red-score').text();
    $('#red-score').text(++score);
  }else if (color == 'blue') {
    var score = $('#blue-score').text();
    $('#blue-score').text(++score);
  }
}

function pickRandomCards(isBlueStartFirst) {
  var wordsPool = words.slice(0);
  var cards = [];
  // blue
  cards = cards.concat(createCards(8, 'blue', wordsPool));
  // red
  cards = cards.concat(createCards(8, 'red', wordsPool));
  // yellow
  cards = cards.concat(createCards(7, 'yellow', wordsPool));
  // black
  cards = cards.concat(createCards(1, 'black', wordsPool));
  // starting team extra card
  if (isBlueStartFirst) {
    cards = cards.concat(createCards(1, 'blue', wordsPool));
  }else {
    cards = cards.concat(createCards(1, 'red', wordsPool));
  }

  // shuffle to make the order of colors random
  shuffle(cards);
  return cards;
}

function createCards(number, color, wordsPool) {
  var cards = [];

  for (var i = 0; i < number; i++) {
    var idx = Math.floor((Math.random() * wordsPool.length));
    var chosenWord = wordsPool.splice(idx, 1)[0];
    cards.push({word: chosenWord, color: color});
  }
  return cards;
}

function shuffle(arr) {
  var j, x, i;
  for (i = arr.length; i; i--) {
    j = Math.floor(Math.random() * i);
    x = arr[i - 1];
    arr[i - 1] = arr[j];
    arr[j] = x;
  }
}
