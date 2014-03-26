/**
 * directorySlider v0.9 - Loads all images in a specified directory and creates a slide show
 * Author: Justin W. Hall
 * http://www.justinwhall.com/directory-jquery-slider/
 *
 * License: GPL v3
 */

(function($){
   var directorySlider = function(element, options)
   {
       var elem = $(element),
           obj = this,
           elemId = elem[0].id;

       //@Bivee Data Atrribute Overrides
       var filebase = ($(elem).data('filebase')) ? $(elem).data('filebase') :'slide_';
       var extension = ($(elem).data('extension')) ? $(elem).data('extension') :'jpg';
       var directory = ($(elem).data('directory')) ? $(elem).data('directory') : null;
       var numslides = ($(elem).data('numslides')) ? $(elem).data('numslides') : null;

       // Merge config settings
       var config = $.extend({
           animation: 'slide',
           filebase: filebase,
           extension: extension,
           speed: 1000,
           timeout: 4000,
           directory: directory,
           numslides: numslides,
           height: null,
           width: null
       }, options || {});

       // set slideshow dimensions if set
       if (config.height) {
        $(elem).css('height', config.height);
       }
       if (config.width) {
        $(elem).css('width', config.width);
       }

       $(elem).css('overflow', 'hidden');


       // Get slides
       var slides = [],
       slideNumber = 1;

       while(slideNumber <= config.numslides){
         
         //@Bivee change to add 0 infront of < 10 numbers  
         if (slideNumber < 10) {
         slideNumber = ('0' + slideNumber).slice(-2);
         }
         var imgURL = config.directory + config.filebase + slideNumber + '.' + config.extension;
         slides.push('<li data-thumb="imgURL"<img src="' + imgURL + '" />');
         slideNumber++;
       }


       //@Bivee Converted to use FlexSlider2 - https://github.com/woothemes/FlexSlider
       


       // append slideshow
       // apply slide wrap 1st
       var slideWrap = $('<div class="' + elemId + '-slide-wrap" ></div>');
           slideWrap.appendTo(elem);

        // append slide and position absolutley
       $.each(slides, function(index, val) {
         $(val).css({
           position: 'absolute',
           top: 0,
           left: 0
         }).appendTo(slideWrap);
       });

    setInterval(function(){
       var firstSlide = elem.find('img:first-child'),
           lastSlide = elem.find('img:last-child');
       // Apply animation
       switch(config.animation){

        case 'fade':
            $(lastSlide).animate({
              opacity: 0},
              config.speed, function() {
              $(this).insertBefore(firstSlide).css('opacity', 1);
            });
        break;

        case 'uncover':
            lastSlide.animate({
              marginLeft: -$(this).width()},
              config.speed, function() {
              $(this).insertBefore(firstSlide).css('marginLeft', 0);
            });
            break;
        default:
            $(lastSlide).animate({
              opacity: 0},
              config.speed, function() {
              $(this).insertBefore(firstSlide).css('opacity', 1);
            });
       }
    }, config.timeout);

   };

   $.fn.directorySlider = function(options)
   {
       return this.each(function()
       {
           var element = $(this);

           // Return early if this element already has a plugin instance
           if (element.data('directoryslider')) return;

           // pass options to plugin constructor
           var directoryslider = new directorySlider(this, options);

           // Store plugin object in this element's data
           element.data('directoryslider', directoryslider);

       });
   };
})(jQuery);