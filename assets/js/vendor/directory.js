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
       // if (config.height) {
       //  $(elem).css('height', config.height);
       // }
       // if (config.width) {
       //  $(elem).css('width', config.width);
       // }

       // $(elem).css('overflow', 'hidden');


       // Get slides
       var slides = [],
       slideNumber = 1;

       while(slideNumber <= config.numslides){
         
         //@Bivee change to add 0 infront of < 10 numbers  
         if (slideNumber < 10) {
         slideNumber = ('0' + slideNumber).slice(-2);
         }
         var imgURL = config.directory + config.filebase + slideNumber + '.' + config.extension;
         slides.push('<li data-thumb="' + imgURL +'"><img src="' + imgURL + '" /></li>');
         slideNumber++;
       }


       //@Bivee Converted to use FlexSlider2 - https://github.com/woothemes/FlexSlider
  
       var slideWrap = $('<ul class="slides"></ul>');
           slideWrap.appendTo(elem);

        // append slide and position absolutley
       $.each(slides, function(index, val) {
         $(val).appendTo(slideWrap);
       });

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