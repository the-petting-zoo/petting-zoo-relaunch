import Vue from 'vue'
import _ from 'lodash'

export default Vue.component('sticky-nav', {
  data () {
    return {
      scrollPosition: 0
    }
  },
  computed: {
    fixed () {
      return this.scrollPosition > 43
    },
    reduced () {
      return this.scrollPosition > 300
    },
    attributes () {
      return `${this.fixed ? 'fixed' : ''}${this.reduced ? ' reduced' : ''}`
    }
  },
  created () {
    // watch for scroll events every 50 ms
    window.addEventListener('scroll', _.throttle(this.handleScroll, 50))
  },
  destroyed: function () {
    // stop watching for scroll events
    window.removeEventListener('scroll', this.handleScroll)
  },
  methods: {
    handleScroll (event) {
      // https://developer.mozilla.org/en-US/docs/Web/Events/scroll#Example
      // polyfill for detecting scroll position
      let currentScrollPosition = (window.pageYOffset !== undefined) ? window.pageYOffset : (document.documentElement || document.body.parentNode || document.body).scrollTop
      this.scrollPosition = currentScrollPosition
    },
  },
  template: `
    <div>
      <nav data-theme="default" :data-ui-main-nav="attributes">
        <slot></slot>
      </nav>
      <div v-show="fixed" data-ui-main-nav-padding></div>
    </div>
  `
})