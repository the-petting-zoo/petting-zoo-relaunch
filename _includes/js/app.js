(function($) {
  
  // ================================================================
  // pettingzoo behaviors
  // ================================================================

  var pettingzoo = { // namespace setup

    config : {

      // Settings
      // -> global vars go here
      // --------------------------------------------------------------- 
      carousel: ".carousel" // class of carousel elements
    },

    // Setup
    // ---------------------------------------------------------------
    init : function(config) {
      $.extend(pettingzoo.config, config);

      $(pettingzoo.config.carousel).flexslider({
        selector: "ul > li",
        allowOneSlide: false,
        namespace: "carousel-",
        directionNav: false
      });
    },

    // Methods
    // ---------------------------------------------------------------

    
  };

  
  $(window).load(function() {
    pettingzoo.init();
  });
})(jQuery);
