import 'jquery'
import flexslider from 'flexslider'
import directorySlider from './vendor/directory.js'

export default function ({
  viewer: "#pdf-viewer",
  thumbNav : "#pdf-thumb",
  controlPrev : ".prev",
  controlNext : ".next"
} = {}) {
  const $ = jquery;
  const $viewer = $(viewer)
  const $thumbNav = $(thumbNav)
  // pull in slides from the specified directory
  $viewer.directorySlider()
  $thumbNav.directorySlider()

  // set up carousels
  $viewer.flexslider({
    animation: Modernizr.touch ? "slide" : "fade",
    controlNav: false,
    directionNav: false,
    animationLoop: false,
    slideshow: false,
    sync: thumbNav
  })

  $(viewer + " > " + controlPrev).on('click', function(){
    $viewer.flexslider('prev')
    return false
  })

  $(viewer + " > " + controlNext).on('click', function(){
    $viewer.flexslider('next')
    return false
  })

  $thumbNav.flexslider({
    animation: "slide",
    controlNav: false,
    animationLoop: false,
    slideshow: false,
    itemWidth: 160,
    itemMargin: 5,
    asNavFor: viewer
  })
}