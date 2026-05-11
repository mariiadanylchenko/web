$(function () {

  // слайдер
  var currentSlide = 0;
  var $slides = $('.slide');
  var $dots = $('.dot');
  var slideCount = $slides.length;
  var autoTimer;

  function goToSlide(n) {
    $slides.eq(currentSlide).removeClass('active');
    $dots.eq(currentSlide).removeClass('active');
    currentSlide = (n + slideCount) % slideCount;
    $slides.eq(currentSlide).addClass('active');
    $dots.eq(currentSlide).addClass('active');
  }

  function startAuto() {
    autoTimer = setInterval(function () {
      goToSlide(currentSlide + 1);
    }, 5000);
  }

  if (slideCount > 0) {
    goToSlide(0);
    startAuto();

    $('.slider-btn.next').on('click', function () {
      clearInterval(autoTimer);
      goToSlide(currentSlide + 1);
      startAuto();
    });

    $('.slider-btn.prev').on('click', function () {
      clearInterval(autoTimer);
      goToSlide(currentSlide - 1);
      startAuto();
    });

    $dots.on('click', function () {
      clearInterval(autoTimer);
      goToSlide($(this).index());
      startAuto();
    });
  }

  // фільтрація в галереї
  $('.filter-btn').on('click', function () {
    var filter = $(this).data('filter');
    $('.filter-btn').removeClass('active');
    $(this).addClass('active');

    if (filter === 'all') {
      $('.gallery-item').show(300);
    } else {
      $('.gallery-item').hide(200).filter('[data-cat="' + filter + '"]').show(300);
    }
  });

  // лайтбокс
  $('.gallery-item').on('click', function () {
    var src = $(this).find('img').attr('src');
    var title = $(this).find('h4').text();
    $('#lightboxImg').attr('src', src).attr('alt', title);
    $('#lightbox').addClass('open');
  });

  $('#lightboxClose, #lightbox').on('click', function (e) {
    if (e.target === this) {
      $('#lightbox').removeClass('open');
    }
  });

  $(document).on('keydown', function (e) {
    if (e.key === 'Escape') $('#lightbox').removeClass('open');
  });

  // навігація
  var path = window.location.pathname.split('/').pop() || 'index.html';
  $('.navbar-nav .nav-link').each(function () {
    var href = $(this).attr('href');
    if (href === path) $(this).addClass('active');
  });

  // форма для повідомлення
  if ($('#contactForm').length) {
    $('#contactName, #contactEmail, #contactMessage').on('focus', function () {
      $(this).closest('.field-wrap').find('label').animate({ top: -18, fontSize: '0.75rem' }, 200);
    }).on('blur', function () {
      if (!$(this).val()) {
        $(this).closest('.field-wrap').find('label').animate({ top: 10, fontSize: '0.9rem' }, 200);
      }
    });

    $('#contactForm').on('submit', function (e) {
      e.preventDefault();
      $('<div>').dialog({
        title: 'Повідомлення надіслано',
        modal: true,
        width: 480,
        dialogClass: 'museum-dialog',
        buttons: [{
          text: 'OK',
          click: function () { $(this).dialog('close'); },
          class: 'museum-dialog-btn'
        }],
        open: function () {
          $(this).html(
            '<div class="museum-dialog-icon">&#10003;</div>' +
            '<p class="museum-dialog-text">Дякуємо! Ваше повідомлення успішно надіслано.<br>Ми зв\'яжемося з вами найближчим часом.</p>'
          );
        }
      });
      this.reset();
    });
  }

  // читати далі
  $('.read-more-btn').on('click', function () {
    var $extra = $(this).closest('.news-list-body').find('.extra-text');
    if ($extra.is(':visible')) {
      $extra.slideUp(200);
      $(this).text('Читати далі');
    } else {
      $extra.slideDown(300);
      $(this).text('Згорнути');
    }
  });

  // --- ANIMATE NEWS CARDS on scroll (simple) ---
  function animateOnScroll() {
    $('.news-card, .news-list-item, .gallery-item, .museum-card').each(function () {
      var top = $(this).offset().top;
      var winBottom = $(window).scrollTop() + $(window).height();
      if (top < winBottom - 60) {
        $(this).addClass('visible');
      }
    });
  }

  $(window).on('scroll', animateOnScroll);
  animateOnScroll();

});
