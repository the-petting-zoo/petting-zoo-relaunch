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
import ButtonDropdown from './components/ButtonDropdown'
import ContactForm from './components/ContactForm'
import StickyNav from './components/StickyNav'

export default new Vue({
  el: '#js-main'
})
