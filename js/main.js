const $game = $('#game');
const $btnsWrap = $('.btns-wrap');
const $btnStart = $('.btn-start');
const $roundText = $('.round-text');
let wordCards = [];
let cardTotal = 0;
let isInGame = false;
let isPairing = false;
let isNtoZ = false;

function addCardsType(type) {
  if (type === 'Animal') {
    wordCards = [
      'alligator',
      'bee',
      'cat',
      'dog',
      'elephant',
      'fox',
      'giraffe',
      'hippo',
      'iguana',
      'jellyfish',
      'kangaroo',
      'lion',
      'monkey',
      'nightingale',
      'owl',
      'penguin',
      'quail',
      'raccoon',
      'seal',
      'turtle',
      'unicorn',
      'vulture',
      'whale',
      'x-ray',
      'yak',
      'zebra'
    ];
    return;
  }
  if (type === 'Fruit&Vegetables') {
    wordCards = [
      'apple',
      'broccoli',
      'cabbage',
      'dewberry',
      'eggplant',
      'fig',
      'grapefruit',
      'huckleberry',
      'iceberg lettuce',
      'jalapeno',
      'kiwi fruit',
      'lime',
      'melon',
      'nut',
      'orange',
      'pear',
      'quetsch',
      'raspberry',
      'salad',
      'tomato',
      'ugli fruit',
      'vanilla',
      'watermelon',
      'ximenia',
      'yam',
      'zucchini'
    ];
    return;
  }
}

function createCards() {
  for (let i = 0; i < cardTotal; i++) {
    $roundText.text(isNtoZ ? 'N ~ Z' : 'A ~ M');
    $game.append(`
          <div class="card-wrap">
            <div class="card">
              <div class="front">
              </div>
              <div class="back"></div>
            </div>
          </div>
        `);
    const number = isNtoZ ? (i % (cardTotal / 2)) + cardTotal / 2 : i % (cardTotal / 2); // 13~25 : 0~12
    const word = wordCards[number];
    const addFrontContent =
      i === number
        ? $('.front').eq(i).css('background-image', `url('./images/${word}.jpg')`)
        : $('.front').eq(i).html('<p class="text"></p>').children('.text').text(word);

    $('.card-wrap').eq(i).attr('data-word', word);
  }
}

function randomSort() {
  $('.card-wrap').each(function (index) {
    $(this).insertAfter($('.card-wrap').eq(Math.floor(Math.random() * cardTotal)));
  });
}

function gameEnd() {
  isInGame = false;
  isNtoZ = false;
  wordCards.length = 0;
  cardTotal = 0;
  $game.fadeOut();
  $game.html('');
  $btnsWrap.fadeIn();
  $roundText.text('');
}

$btnStart.on('click', function () {
  isInGame = true;
  addCardsType($(this).val());
  cardTotal = wordCards.length;
  createCards();
  randomSort();
  $btnsWrap.hide();
  $game.fadeIn();
});

$game.on('click', '.card-wrap', function () {
  if (!isInGame || isPairing || $(this).hasClass('clear')) return;
  if ($('.open').length < 2) $(this).addClass('open');

  const openCards = $('.open');
  if (openCards.length !== 2) return;
  if (openCards.eq(0).attr('data-word') === openCards.eq(1).attr('data-word')) {
    const wordAudio = new Audio(`./audio/${openCards.eq(0).attr('data-word')}.mp3`);
    wordAudio.play();

    isPairing = true;
    openCards.addClass('clear').fadeTo(1000, 0, function () {
      isPairing = false;
    });
  }

  setTimeout(() => {
    openCards.removeClass('open');
  }, 1000);

  if ($('.clear').length !== $('.card-wrap').length) return;
  setTimeout(() => {
    const goodJobAudio = new Audio(`./audio/good-job.mp3`);
    goodJobAudio.play();

    if (!isNtoZ) {
      isNtoZ = true;
      $game.html('');
      createCards();
      randomSort();
    } else {
      gameEnd();
    }
  }, 1500);
});
