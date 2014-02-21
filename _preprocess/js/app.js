(function($) {
  
  // ================================================================
  // pettingzoo behaviors
  // ================================================================

  var pettingzoo = { // namespace setup

    config : {

      // Settings
      // -> global vars go here
      // --------------------------------------------------------------- 

    },

    // Setup
    // ---------------------------------------------------------------
    init : function(config) {
      $.extend(pettingzoo.config, config);


    },

    // Methods
    // ---------------------------------------------------------------

    
  };

  
  $(window).load(function() {
    pettingzoo.init();
  });
})(jQuery);
