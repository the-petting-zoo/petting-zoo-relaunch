import 

// set up various plugins, behaviors
pettingzoo.tabs.init(pettingzoo.config.tabs); // set up accordion version of tabs (mobile/default)
pettingzoo.contactForm.init(); // contact form & mailing list opt-in
if ($("body#contact-us").length > 0) pettingzoo.map.init(); // google map embed (only on contact page)
pettingzoo.pdfViewer.init(); // set up PDF viewer carousels

// set up filters on the catalog pages
pettingzoo.buttonFilter.init();
      
// Instantiate MixItUp
$('#filter-container').mixItUp({
  controls: {
    enable: false // we won't be needing these
  },
  animation: {
    effects: 'fade',
    duration: '300'
  },
  callbacks: {
    onMixFail: function(){
      //Do whatever when no results found
    }
  }
});   

// the menu select on mobile screens
$("#js-menu-mobile").change(function(){
  if ($(this).val()!='') {
    window.location.href = $(this).val();
    console.log("menu: " + $(this).val());
  }
});

// set up hero carousel
var $carousel = $(pettingzoo.config.carousel);

$carousel.flexslider({
  animation: Modernizr.touch ? "slide" : "fade",
  selector: "ul > li",
  allowOneSlide: false,
  // namespace: "carousel-",
  directionNav: false
});

$(pettingzoo.config.carousel + " > " + pettingzoo.config.carouselPrev).on('click', function(){
  $carousel.flexslider('prev');
  return false;
});

$(pettingzoo.config.carousel + " > " + pettingzoo.config.carouselNext).on('click', function(){
  $carousel.flexslider('next');
  return false;
});