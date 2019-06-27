import Vue from 'vue'
import jsonp from 'jsonp'
import queryString from 'query-string'

// See README_ContactForm for details on simpleform configuration

export default Vue.component('contact-form', {
  props: {
    url: String
  },
  data () {
    return {
      simpleForm: {
        url: 'https://getsimpleform.com/messages/ajax?',
        token: '9e785bffbf9337d08052b2b07bb8ef67'
      },
      mailChimpUrl: 'https://gpoba.us8.list-manage.com/subscribe/post?u=0eb271cf853e657ebe61f0e9f&amp;id=a142a0b83f',
      formContent: {},
      sent: false,
      error: false,
      subscribed: false,
      mcMessage:'',
      errors: []
    }
  },
  methods: {
    checkForm: function (event) {
      this.errors = []
      event.preventDefault()

      if (!this.formContent.name) {
        this.errors.push("Name required.")
      }

      if (!this.formContent.subject) {
        this.errors.push("Email subject required.")
      }

      if (!this.formContent.message) {
        this.errors.push("Email body required.")
      }

      if (!this.formContent.email) {
        this.errors.push('Email required.')
      } else if (!this.validEmail(this.formContent.email)) {
        this.errors.push('Valid email required.')
      }

      if (!this.errors.length) {
        this.submitForm()
      }
      
    },
    validEmail: function (email) {
      var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return re.test(email);
    },
    submitForm () {
      // Add API token for simpleform (note form_api_token must remain the name of thie variable)
      // convert to URL string
      this.formContent.form_api_token = this.simpleForm.token
      const urlData = queryString.stringify(this.formContent)

      jsonp(
        `${this.simpleForm.url}${urlData}`,
        null,
        (err, data) => {
          if (err) {
            this.errors.push(err.message)
            this.sent = false
          } else {
            this.sent = true
            // If checkbox for subscribe, then send to mailchimp
            if (this.subscribed) {
              this.subscribe()
            }
          }
        }
      )
    },
    subscribe () {
      // @JAY 
      // This will need to be updated with whatever fields PZP's MC has.
      const params = {
        EMAIL: this.formContent.email,
        FNAME: this.formContent.name.split(' ')[0],
        LNAME: this.formContent.name.split(' ')[1]
      }
      const url = this.mailChimpUrl.replace("/post?", "/post-json?")      
      const urlData = queryString.stringify(this.params)

      jsonp(
        `${url}&${urlData}`,
        {
          param: "c"
        },
         (err, data) => {
          if (err || data.result === "error") {
            this.mcMessage = data.msg
            this.errors.push(this.mcMessage)
            this.sent = false
          } else {
            this.mcMessage = data.msg
          }
        }
      )
    }
  },
  template: `
    <div>    
      <!-- @JAY - Error message -->
      <p v-if="errors.length">
        <b>Please correct the following error(s):</b>
        <ul>
          <li v-for="error in errors">{{ error }}</li>
        </ul>
      </p>

      <form v-if="!sent" action="#">

        <!-- contact form -->
        <div class="padding-bottom-xnarrow">
          <label class="form-label padding-bottom-xnarrow" for="name">Your name</label>
          <input 
            v-model="formContent.name"
            type="text"
            class="form-textbox"
            id="contact-name"
            size="20"
            value=""
            required
          />
        </div>
        <div class="padding-bottom-xnarrow">
          <label class="form-label padding-bottom-xnarrow" for="email">Your email</label>
          <input
            v-model="formContent.email"
            type="email"
            class="form-textbox"
            id="contact-email"
            size="20"
            value=""
            required
          />
        </div>
        <div class="padding-bottom-xnarrow">
          <label class="form-label padding-bottom-xnarrow" for="email">How can we help?</label>
          <select
            v-model="formContent.subject"
            class="form-dropdown"
            id="contact-subject"
            name="subject"
          >
            <slot></slot>
          </select>
        </div>
        <div class="padding-bottom-xnarrow">
          <label class="form-label padding-bottom-xnarrow" for="message">Your message</label>
          <textarea
            v-model="formContent.message"
            id="contact-message"
            class="form-textarea"
            cols="40"
            name="message"
            rows="6"
            required
          ></textarea>
        </div>
        <input type="hidden" class="form-hidden" :value="url" id="contact-url" name="url" />
        <div class="padding-bottom-xnarrow mailing-list">
          <input
            v-model="subscribed"
            type="checkbox"
            id="contact-mailing-list"
            class="form-checkbox"
          />
          <label class="form-label display-inline-block padding-left-xxnarrow padding-bottom-xnarrow" for="mailing-list">Add me to <strong>The Petting Zoo's</strong> mailing list.</label>
        </div>
        <button
          @click="checkForm"
          data-ui-button="primary"
          id="contact-submit"
          type="submit"
        >
          Send
        </button>
      </form>

      <!-- Success message -->
      <div v-if="sent" class="t-align-center border border-round padding">
        <h3 class="t-scale-beta padding-bottom-xnarrow">Thanks for contacting us!</h3>
        <p>We'll be in touch with you soon.</p>
        <p v-if="subscribed && sent" class="padding-top-narrow margin-top-narrow border-top c-text-tertiary">
          Thank you for subscribing to our mailing list. We have sent you a confirmation email.
        </p>
      </div>
    </div>
  `
})