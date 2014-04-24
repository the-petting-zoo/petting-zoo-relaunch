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
      carouselPrev: ".prev",
      carouselNext: ".next",
      test: "test",

      tabs: ".js-tabs",
      fallback: "fallback", // "fallback" data attribute value

      menuMobile: "#js-menu-mobile",

      postImg: "has-image", // class to add to images in posts (workaround for jekyll markdown parsing)

      scaleHeight: ".js-scale-height img"
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

      // scale product images to window height
      pettingzoo.scaleToWindow.update(pettingzoo.config.scaleHeight, "height");

      // set up filters for catalog pages
      // To keep our code clean and modular, all custom functionality will be contained inside a single object literal called "buttonFilter".

      var buttonFilter = {
        
        // Declare any variables we will need as properties of the object
        
        $filters: null,
        $reset: null,
        groups: [],
        outputArray: [],
        outputString: '',
        
        // The "init" method will run on document ready and cache any jQuery objects we will need.
        
        init: function(){
          var self = this; // As a best practice, in each method we will asign "this" to the variable "self" so that it remains scope-agnostic. We will use it to refer to the parent "buttonFilter" object so that we can share methods and properties between all parts of the object.
          
          self.$filters = $('#filters');
          self.$reset = $('#reset');
          self.$container = $('#filter-container');
          
          self.$filters.find('fieldset').each(function(){
            self.groups.push({
              $buttons: $(this).find('.filter'),
              active: ''
            });
          });
          
          self.bindHandlers();
        },
        
        // The "bindHandlers" method will listen for whenever a button is clicked. 
        
        bindHandlers: function(){
          var self = this;
          
          // Handle filter clicks
          
          self.$filters.on('click', '.filter', function(e){
            e.preventDefault();
            
            var $button = $(this);
            
            // If the button is active, remove the active class, else make active and deactivate others.
            
            $button.hasClass('active') ?
              $button.removeClass('active') :
              $button.addClass('active').siblings('.filter').removeClass('active');
            
            self.parseFilters();
          });
          
          // Handle reset click
          
          self.$reset.on('click', function(e){
            e.preventDefault();
            
            self.$filters.find('.filter').removeClass('active');
            
            self.parseFilters();
          });
        },
        
        // The parseFilters method checks which filters are active in each group:
        
        parseFilters: function(){
          var self = this;
       
          // loop through each filter group and grap the active filter from each one.
          
          for(var i = 0, group; group = self.groups[i]; i++){
            group.active = group.$buttons.filter('.active').attr('data-filter') || '';
          }
          
          self.concatenate();
        },
        
        // The "concatenate" method will crawl through each group, concatenating filters as desired:
        
        concatenate: function(){
          var self = this;
          
          self.outputString = ''; // Reset output string
          
          for(var i = 0, group; group = self.groups[i]; i++){
            self.outputString += group.active;
          }
          
          // If the output string is empty, show all rather than none:
          
          !self.outputString.length && (self.outputString = 'all'); 
          
          console.log(self.outputString); 
          
          // ^ we can check the console here to take a look at the filter string that is produced
          
          // Send the output string to MixItUp via the 'filter' method:
          
          if(self.$container.mixItUp('isLoaded')){
            self.$container.mixItUp('filter', self.outputString);
          }
        }
      };
        
      // On document ready, initialise our code.

      $(function(){
            
        // Initialize buttonFilter code
            
        buttonFilter.init();
            
        // Instantiate MixItUp
            
        $('#filter-container').mixItUp({
          controls: {
            enable: false // we won't be needing these
          },
          callbacks: {
            onMixFail: function(){
              //Do whatever when no results found
            }
          }
        });    
      });


      // set up various plugins, behaviors
      pettingzoo.tabs.init(pettingzoo.config.tabs); // set up accordion version of tabs (mobile/default)
      pettingzoo.contactForm.init(); // contact form & mailing list opt-in
      if ($("body#contact-us").length > 0) pettingzoo.map.init(); // google map embed (only on contact page)
      pettingzoo.pdfViewer.init(); // set up PDF viewer carousels

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

      // make the height of the recent catalog tiles equal
      $("#js-catalogs").equalsize({ children: 'li' });

      // for news page
      // check to see if a post contains an image
      // if so, add a ".has-image" class
      $(".post").each(function() {
        var $post = $(this);
        var $hasImg = $post.find("p").has("img");
        if ($hasImg.length > 0) {
          $post.addClass(pettingzoo.config.postImg);
          $hasImg.addClass(pettingzoo.config.postImg);
        }
      });
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

    // --- Scale an element to the size of the browser window --------------------------
    scaleToWindow : {

      defaultHeight : 70, // percentage of window height
      defaultWidth : 70, // percentage of window width

      update: function(el, axis, percentage) {
        
        // default values for optional params
        var axis = axis || "height";
        var percentage = percentage || pettingzoo.scaleToWindow.defaultHeight;

        // set the size on the right axis
        switch(axis) {
          case "height":
            var size = $(window).height() * (percentage/100);
            $(el).css("max-height", size);
            break;
          case "width":
            var size = $(window).width() * (percentage/100);
            $(el).css("max-width", size);
            break;
        }
      }
    },

    

    // --- PDF viewer carousels ------------------------------------------------
    pdfViewer : {

      // config
      viewer : "#pdf-viewer",
      thumbNav : "#pdf-thumb",
      controlPrev : ".prev",
      controlNext : ".next",

      init : function() {
        var $viewer = $(pettingzoo.pdfViewer.viewer);
        var $thumbNav = $(pettingzoo.pdfViewer.thumbNav);
        // pull in slides from the specified directory
        $viewer.directorySlider();
        $thumbNav.directorySlider();

        // set up carousels
        $viewer.flexslider({
          animation: Modernizr.touch ? "slide" : "fade",
          controlNav: false,
          directionNav: false,
          animationLoop: false,
          slideshow: false,
          sync: pettingzoo.pdfViewer.thumbNav
        });

        $(pettingzoo.pdfViewer.viewer + " > " + pettingzoo.pdfViewer.controlPrev).on('click', function(){
          $viewer.flexslider('prev');
          return false;
        });

        $(pettingzoo.pdfViewer.viewer + " > " + pettingzoo.pdfViewer.controlNext).on('click', function(){
          $viewer.flexslider('next');
          return false;
        });

        $thumbNav.flexslider({
          animation: "slide",
          controlNav: false,
          animationLoop: false,
          slideshow: false,
          itemWidth: 160,
          itemMargin: 5,
          asNavFor: pettingzoo.pdfViewer.viewer
        });
      }
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
    },

    // --- Contact form & mailing list opt-in --------------------------------------

    contactForm : {

      simpleformToken : "9e785bffbf9337d08052b2b07bb8ef67",

      // messages that appear when the form is submitted
      successMessage: '<div class="success"><h3>Thanks for contacting us!</h3><p class="center">We\'ll be in touch with you soon.</p></div>',
      mailChimpMessage: '<p class="center">Thank you for subscribing to our mailing list. We have sent you a confirmation email.</p>',

      mailChimpSuccess : false, // flag -- was the newsletter signup successful?

      init : function() {

        $('#ajax-form').submit(function(){

            var email_text = $('input[name="email"]').val();
            var name = $('input[name="name"]').val();
            var mailchimp = $('#ajax-form input:checkbox:checked').val();

          //Send email via ajax & simpleform
          $.ajax({
            dataType: 'jsonp',
            url: "http://getsimpleform.com/messages/ajax?form_api_token=" + pettingzoo.contactForm.simpleformToken,
            data: $('#ajax-form').serialize() 
          }).done(function() {
            //Remove form and show success message.
            $("footer h3.callout").fadeOut(1000, function() {
              $("footer.global").prepend(pettingzoo.contactForm.successMessage);
              if (pettingzoo.contactForm.mailChimpSuccess == true) {
                console.log("mailchimp success");
                $(".success").append(pettingzoo.contactForm.mailChimpMessage);
              }
            });

            $("footer aside" ).fadeOut(1000);
            $("#ajax-form" ).fadeOut(1000);
          });

          //If Mailchimp checked submit mailchimp form
          if(mailchimp){
            $('input#mc-email').val(email_text);
            $('input#mc-FNAME ').val(name);
            
            //Sets up form for ajax submit
            $('#mc-form').ajaxChimp({
                callback: pettingzoo.contactForm.mailchimpResult,
                url: 'http://pettingzooplush.us8.list-manage.com/subscribe/post?u=63768868a43809514e63f3953&id=0caa307af8'
            });
            //Submits mailchimp form
            $("#mc-form").submit();
          }

          return false; //to stop the form from submitting

        });
      },

      mailchimpResult : function(resp) {
        if (resp.result === 'success') {
          
          //Show success if sucessful
          // $(".success").append( '' ).fadeIn(1000);
          pettingzoo.contactForm.mailChimpSuccess = true;
        }
      }
    },

    // --- Google map embed --------------------------------------------------

    map : {

      address : new google.maps.LatLng(39.17943,-76.730038),
      el : "js-map_canvas",

      init : function() {
        var map;

        var mapOptions = {
          zoom:15,
          center: pettingzoo.map.address,
          mapTypeControlOptions: {
             mapTypeIds: [google.maps.MapTypeId.ROADMAP, 'div']
          }
        };
        
        map = new google.maps.Map(document.getElementById(pettingzoo.map.el),
            mapOptions);

        var marker = new google.maps.Marker({
          position: pettingzoo.map.address,
          map: map,
          title:"div",
          zIndex: 3
        });
      }
    }
    
  };


// Start it all up -- load handlers
// ----------------------------------------------------------------------------------

  $(window).load(function() {
    pettingzoo.init();
  });

  $(window).resize(function() {
    pettingzoo.scaleToWindow.update(pettingzoo.config.scaleHeight, "height")
  });

})(jQuery);
