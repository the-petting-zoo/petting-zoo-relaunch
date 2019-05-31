// JS to keep:
// - tabs
// - contactForm
// - filters?
// - mobile nav

// import flyout from './modules/flyout.js'

// // flyout buttons
// document.addEventListener('DOMContentLoaded', () => {
//   // set up flyout toggle buttons
//   flyout('data-js-toggle')
// })

import Vue from 'vue'

export let navToggle = new Vue({
  el: '#main-nav-toggle',
  data() {
    return {
      show: false
    }
  }
})

// console.log(navToggle.show)