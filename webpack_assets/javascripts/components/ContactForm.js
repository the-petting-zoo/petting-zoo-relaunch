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
        url: 'https://getsimpleform.com/messages',
        ajax: '/ajax?',
        post: '?form_api_token=',
        token: '9e785bffbf9337d08052b2b07bb8ef67'
      },
      // @TODO pull in PZP submit url
      mailChimpUrl: 'https://gpoba.us8.list-manage.com/subscribe/post?u=0eb271cf853e657ebe61f0e9f&amp;id=a142a0b83f',
      formContent: {},
      sent: false,
      error: false,
      subscribed: false,
      mcMessage:'',
      errors: [],
      errorMessages: {
        name: "Your <strong class='c-highlight'>name</strong> is required.",
        subject: "Please select an <strong class='c-highlight'>email subject</strong>.",
        message: "The <strong class='c-highlight'>email body</strong> is required.",
        email: "Your <strong class='c-highlight'>email address</strong> is required, so we can respond.",
        invalidEmail: "Your <strong class='c-highlight'>email address</strong> appears to be invalid; please check to make sure it has been entered correctly."
      }
    }
  },
  methods: {
    validateForm: function (event) {
      console.log(`${this.simpleForm.url}${this.simpleForm.ajax}`)

      this.errors = []
      event.preventDefault()

      if (!this.formContent.name) {
        this.errors.push(this.errorMessages.name)
      }

      if (!this.formContent.subject) {
        this.errors.push(this.errorMessages.subject)
      }

      if (!this.formContent.message) {
        this.errors.push(this.errorMessages.message)
      }

      if (!this.formContent.email) {
        this.errors.push(this.errorMessages.email)
      } else if (!this.validEmail(this.formContent.email)) {
        this.errors.push(this.errorMessages.invalidEmail)
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
        `${this.simpleForm.url}${this.simpleForm.ajax}${urlData}`,
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
      <!-- Error message -->
      <aside
        v-if="errors.length"
        class="border border-round padding-narrow margin-bottom c-island"
      >
        <h3 class="padding-bottom-xnarrow t-scale-epsilon">Sorry, there were a few errors in your message. Please correct them and try to submit again.</h3>
        <ul class="no-margin">
          <li v-for="error in errors" v-html="error"></li>
        </ul>
      </aside>

      <form v-if="!sent" method="POST" :action="simpleForm.url + simpleForm.post + simpleForm.token">

        <!-- contact form -->
        <div class="padding-bottom-xnarrow">
          <label class="form-label padding-bottom-xnarrow" for="name">Your name</label>
          <input 
            v-model="formContent.name"
            type="text"
            class="form-field"
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
            class="form-field"
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
        <div class="padding-bottom-xnarrow">
          <input
            v-model="subscribed"
            type="checkbox"
            id="contact-mailing-list"
            class="form-checkbox"
          />
          <label class="form-label display-inline-block padding-left-xxnarrow padding-bottom-xnarrow" for="contact-mailing-list">Add me to <strong>The Petting Zoo's</strong> mailing list.</label>
        </div>
        <button
          @click="validateForm"
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