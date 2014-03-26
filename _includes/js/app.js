(function($) {
  
  // ================================================================
  // pettingzoo behaviors
  // ================================================================

  var pettingzoo = { // namespace setup

    config : {

      // Settings
      // -> global vars go here
      // --------------------------------------------------------------- 
      carousel: ".carousel", // class of carousel elements
      tabs: ".js-tabs",
      fallback: "fallback", // "fallback" data attribute value

      menuMobile: "#js-menu-mobile",

      postImg: "js-post-img", // class to add to images in posts (workaround for jekyll markdown parsing)
      postTxt: "js-post-text" // class to add to body text in posts (workaround for jekyll markdown parsing)
    },

    // Setup
    // ---------------------------------------------------------------
    init : function(config) {
      $.extend(pettingzoo.config, config);

      // fall back to .animate() frame animation is CSS transitions are not supported
      // -> for transit.js
      if (!$.support.transition) {
        $.fn.transition = $.fn.animate;
      }

      // if SVG isn't supported, swap out SVGs for corresponding PNGs
      // looks for a "data-fallback" attribute on the img tag
      if (!Modernizr.svg) {
        $("img").each(function() {
          var $img = $(this);
          if ($img.data("fallback")) $img.attr("src", $img.data(pettingzoo.config.fallback));
        });
      }

      // set up enquire.js stuff
      pettingzoo.registerBreakpoints();
      pettingzoo.tabs.init(pettingzoo.config.tabs); // set up accordion version of tabs (mobile/default)

      $("#js-menu-mobile").change(function(){
        if ($(this).val()!='') {
          window.location.href = $(this).val();
          console.log("menu: " + $(this).val());
        }
      });

      // set up hero carousel
      $(pettingzoo.config.carousel).flexslider({
        selector: "ul > li",
        allowOneSlide: false,
        namespace: "carousel-",
        directionNav: false
      });

      $("#js-catalogs").equalsize({ children: 'li' });

      $(".post > p").has("img").addClass(pettingzoo.config.postImg); // add a class to images in the blog so we can float them to the left (jekyll/markdown workaround)
    },

    // Methods
    // ------------------------------------------------------------------

    // --- Enquire.js breakpoints --------------------------------------
    registerBreakpoints : function() {

      // iPad screens and up: > 768px
      // ---------------------------------------------------------------------
      enquire.register("only screen and (min-width: 48em)", {

        deferSetup : true,

        setup : function() {
          // pettingzoo.tabs.init(pettingzoo.config.tabs);
        },

        match : function() {
          console.log("match");
          pettingzoo.tabs.kill(pettingzoo.config.tabs);
          pettingzoo.tabs.multiple = false;
          pettingzoo.tabs.reset(pettingzoo.config.tabs);
          // pettingzoo.tabs.init(pettingzoo.config.tabs);
        },

        unmatch : function() {
          console.log("unmatch");
          pettingzoo.tabs.kill(pettingzoo.config.tabs);
          pettingzoo.tabs.multiple = true;
          // pettingzoo.tabs.init(pettingzoo.config.accordion);
        }
      });
    },

    // --- Local navigation (tabs & accordion) --------------------------------------
    tabs : {

      // settings
      // ----------------------------------------------------------------------------------
      active : "active", // the class of the active (current) tab
      open: "is-open", // the class of the content currently displayed
      content: ".tabs-content-body", // content that we need to leave alone
      multiple: true, // can multiple tabs be open? (for accordion state)

      // methods
      // ----------------------------------------------------------------------------------

      init : function(el) {
        // ----- Local nav (tabs) -------------------------------------------------------------
        //  -> http://www.jacklmoore.com/notes/jquery-tabs/


        $(el).each(function(){
          // For each set of tabs, we want to keep track of
          // which tab is active and it's associated content
          var $active, $content, $links = $(this).find('a');

          // If the location.hash matches one of the links, use that as the active tab.
          // If no match is found, use the first link as the initial active tab.
          $active = $links.filter("." + pettingzoo.tabs.active);
          console.log("content init: " + $active.attr('href'));
          $content = $($active.attr('href'));

          // console.log("active tab: " + $active);

          // if multiple active tabs are not allowed...
          if (pettingzoo.tabs.multiple != true) {
            // Hide the remaining content
            $links.not($active).each(function () {
              $($(this).attr('href')).removeClass(pettingzoo.tabs.open);
            });
          }

          // Bind the click event handler
          $(this).on('click', 'a', function(e){
            $active = $links.filter("." + pettingzoo.tabs.active);
            $content = $($active.attr('href'));

            // console.log("multiple: " + pettingzoo.tabs.multiple);
            // console.log("content id: " + $content.attr('id'));

            // if multiple active tabs are not allowed...
            if (pettingzoo.tabs.multiple != true) {
              // Make the old tab inactive.
              $active.removeClass(pettingzoo.tabs.active);
              $content.removeClass(pettingzoo.tabs.open);

              // Update the variables with the new link and content
              $active = $(this);
              $content = $($(this).attr('href'));

              // Make the tab active.
              $active.addClass(pettingzoo.tabs.active);
              $content.addClass(pettingzoo.tabs.open);
            } else {
              // Update the variables with the new link and content
              $active = $(this);
              $content = $($(this).attr('href'));
              // console.log("content: " + $content.attr('id'));

              // Make the tab active.
              $active.toggleClass(pettingzoo.tabs.active);
              $content.toggleClass(pettingzoo.tabs.open);
            }

            // Prevent the anchor's default click action
            e.preventDefault();
          });
        });
      },

      update : function(el) {},

      kill : function(el) {
        $(el).each(function() {
          $(this).find('a').each(function() {
            $(this).removeClass(pettingzoo.tabs.active);
            $($(this).attr('href')).removeClass(pettingzoo.tabs.open);
          });
        });
      },

      reset : function(el) {
        var $link = $(el).find('a').first();
        $link.addClass(pettingzoo.tabs.active);
        $($link.attr('href')).addClass(pettingzoo.tabs.open);
      }
    }
    
  };


// Ajax Form Submit
// ----------------------------------------------------------------------------------
  
      $('#ajax-form').submit(function(){

          var email_text = $('input[name="email"]').val();
          var name = $('input[name="name"]').val();
          var mailchimp = $('#ajax-form input:checkbox:checked').val();

        //Send email via ajax & simpleform
        $.ajax({
          dataType: 'jsonp',
          url: "http://getsimpleform.com/messages/ajax?form_api_token=40adcbc671a42a6b6a2bf078797161d4",
          data: $('#ajax-form').serialize() 
        }).done(function() {
          //Remove form and show success message.
          $("footer h3.callout").prepend( '<div class="success"><h2>Success!</h2></div>' );
          $("footer aside" ).fadeOut(1000);
          $("#ajax-form" ).fadeOut(1000);
        });

        //If Mailchimp checked submit mailchimp form
        if(mailchimp){
          $('input#mc-email').val(email_text);
          $('input#mc-FNAME ').val(name);  
          
          //Sets up form for ajax submit
          $('#mc-form').ajaxChimp({
              callback: mailchimpResult,
              url: 'http://bivee.us8.list-manage1.com/subscribe/post?u=0eb271cf853e657ebe61f0e9f&id=ceab22e526'
          });
          //Submits mailchimp form
          $("#mc-form").submit();
        }

        return false; //to stop the form from submitting
      
      });

      function mailchimpResult (resp) {
        if (resp.result === 'success') {
          //Show success if sucessful
          $("footer div.success").append( '<div class="mailchimp-email"><h3><em>Thank you for subscribing. We have sent you a confirmation email.</em></h3></div>' );
        }
      }

// Flip PDF JS
// ----------------------------------------------------------------------------------

$('#listing').directorySlider({ height: 400 });


// Google Maps
// ----------------------------------------------------------------------------------
  var map;
  var address = new google.maps.LatLng(39.17943,-76.730038);

  function initialize() {

    var mapOptions = {
      zoom:15,
      center: address,
      mapTypeControlOptions: {
         mapTypeIds: [google.maps.MapTypeId.ROADMAP, 'div']
      }
    };
    
    map = new google.maps.Map(document.getElementById("map_canvas"),
        mapOptions);

    var marker = new google.maps.Marker({
      position: address,
      map: map,
      title:"div",
      zIndex: 3
    });
  }
  google.maps.event.addDomListener(window, 'load', initialize);

// ----------------------------------------------------------------------------------

  $(window).load(function() {
    pettingzoo.init();
  });
})(jQuery);
