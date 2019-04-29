/**
 * equalsize.js
 * Author & copyright (c) 2013: Jorn Bakhuys
 * MIT & GPL license
 *
 * A jQuery plugin for equalizing the size of a parents children.
 *
 * USAGE:
 * $('ul').equalsize(); // equalize the height (default) of a parents children
 * $('ul').equalsize({ type: 'width' }); // equalize the width of a parents children
 * $('ul').equalsize({ children: 'p' }); // equalize specific children of a parent
 */(function(e){e.fn.equalsize=function(t){var n=e.extend({containers:e(this),type:"height",children:!1},t);return n.containers.each(function(){var t=n.children?e(this).find(n.children):e(this).children(),r=0;t.each(function(){var t;t=e(this)[n.type]();t>r&&(r=t)});t.css(n.type,r+"px")})}})(jQuery);