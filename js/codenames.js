// NOTE: var words contains words array, loaded in index.html

$(document).ready(function() {
  $('#form-gen').on('submit', function(e) {
    e.preventDefault();
    $('#btn-generate').trigger('click');
  });

  $('#btn-generate').click(function() {
    var seed = $('#seed').val();
    // apply seed
    Math.seedrandom(seed);
    createGame();
    $(document).attr('title', $(document).attr('title') + ' | ' + seed);
  });
});

function createGame() {
  var isBlueStartFirst = Math.round(Math.random() * 2) == 0 ? true : false;
  var cards = pickRandomCards(isBlueStartFirst);
  var role = $('input[name="role"]:checked').val();
  renderBoard(cards, role, isBlueStartFirst);
}

function renderBoard(cards, role, isBlueStartFirst) {
  var $table = $('#main-table');
  $table.empty();
  for (var i = 0; i < 5; i++) {
    var $row = $('<tr></tr>');
    for (var j = 0; j < 5; j++) {
      var $cell = $('<td></td>');
      var $card = $('<p></p>');
      // take next card and render
      var currentCard = cards.shift();
      $card.addClass('card');
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

  if (role == 'spymaster') {
    $table
    .off('click', '.card')
    .on('click', '.card', function() {
      $(this)
      .addClass('grey')
      .addClass('card-done');
      incrementScore($(this).data('color'));
    });
  }else if (role == 'player') {
    $table
    .off('click', '.card')
    .on('click', '.card', function() {
      $(this)
      .addClass($(this).data('color'))
      .addClass('card-done');
      incrementScore($(this).data('color'));
    });
  }

  // set score values
  $('#red-score,#blue-score').text(0);
  if (isBlueStartFirst) {
    $('#blue-total').text(9);
    $('#red-total').text(8);
  }else {
    $('#red-total').text(9);
    $('#blue-total').text(8);
  }
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
  var cards = [];
  // blue
  cards = cards.concat(createCards(8, 'blue'));
  // red
  cards = cards.concat(createCards(8, 'red'));
  // yellow
  cards = cards.concat(createCards(7, 'yellow'));
  // black
  cards = cards.concat(createCards(1, 'black'));
  // starting team extra card
  if (isBlueStartFirst) {
    cards = cards.concat(createCards(1, 'blue'));
  }else {
    cards = cards.concat(createCards(1, 'red'));
  }

  // shuffle to make the order of colors random
  shuffle(cards);
  return cards;
}

function createCards(number, color) {
  var cards = [];
  var idx;
  for (var i = 0; i < number; i++) {
    idx = Math.floor((Math.random() * words.length));
    cards.push({word: words[idx], color: color});
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
