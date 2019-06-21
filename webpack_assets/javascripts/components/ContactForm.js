import Vue from 'vue'
import jsonp from 'jsonp'
import queryString from 'query-string'

export default Vue.component('contact-form', {
  props: {
    url: String
  },
  data () {
    return {
      simpleForm: {
        url: 'https://getsimpleform.com/messages/ajax?form_api_token=',
        token: '9e785bffbf9337d08052b2b07bb8ef67',
        testToken: 'd785a1918d67317a7cd4f65c805f1c61',
        scottToken: '1697c4297b68bce50f046e36880ae4f8',
      },
      mailChimpUrl: 'https://gpoba.us8.list-manage.com/subscribe/post?u=0eb271cf853e657ebe61f0e9f&amp;id=a142a0b83f',
      formContent: {},
      sent: false,
      error: false,
      subscribed: false
    }
  },
  methods: {
    submitForm (event) {
      event.preventDefault()
      const urlData = queryString.stringify(this.formContent)
      console.log(urlData)

      jsonp(
        `${this.simpleForm.url}${this.simpleForm.scottToken}${urlData}`,
        null,
        (err, data) => {
          if (err) {
            console.log("Error!")
            console.error(err.message)
            this.error = true
            return false
          } else {
            console.log("Success Email")
            this.sent = true
            if (this.subscribed) {
              this.subscribe()
            }
            console.log(data)
          }
        }
      )
    },
    subscribe () {
      const url = this.mailChimpUrl.replace("/post?", "/post-json?")
      const params = {
        EMAIL: this.formContent.email,
        FNAME: this.formContent.name.split(' ')[0],
        LNAME: this.formContent.name.split(' ')[1]
      }
      const urlData = queryString.stringify(params)
      console.log(urlData)

      jsonp(
        `${url}&${urlData}`,
        {
          param: "c"
        },
         (err, data) => {
          if (err) {
            console.log("Error!")
            console.error(err.message)
            this.error = true
            this.sent = false
          } else {
            console.log("Success Subscribe")
            console.log(data)
          }
        }
      )
    }
  },
  template: `
    <div>
      <form v-if="!sent" action="#">

        <!-- contact form -->
        <div class="control_group">
          <label for="name">Your Name</label>
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
        <div class="control_group">
          <label for="email">Your Email</label>
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
        <div class="control_group">
        <select
          v-model="formContent.subject"
          class="form-dropdown"
          id="contact-subject"
        >
          <slot name="subject-options"></slot>
        </select>
        </div>
        <div class="control_group">
          <label for="message">Your Message</label>
          <textarea
            v-model="formContent.message"
            id="contact-message"
            class="form-textarea"
            cols="40"
            rows="6"
            required
          ></textarea>
        </div>
        <input type="hidden" class="form-hidden" :value="url" id="contact-url" name="url" />
        <div class="control_group mailing-list">
          <input
            v-model="subscribed"
            type="checkbox"
            id="contact-mailing-list"
            value="opted-in"
          />
          <label for="mailing-list">Add me to <strong>The Petting Zoo's</strong> mailing&nbsp;list.</label>
        </div>
        <button
          @click="submitForm"
          id="contact-contact-submit"
          type="submit"
          class="button primary small">
            Send
          </button>
      </form>

      <div v-if="sent" class="sent">
        <!-- Success message -->
        <h3>Thanks for contacting us!</h3>
        <p class="center">We'll be in touch with you soon.</p>
        <p v-if="subscribed && sent" class="t-align-center">
          Thank you for subscribing to our mailing list. We have sent you a confirmation email.
        </p>
      </div>

      <div v-if="error" class="error">
        <!-- Success message -->
        <h3>Thanks for contacting us!</h3>
        <p class="center">We'll be in touch with you soon.</p>
        <p v-if="subscribed && sent" class="t-align-center">
          Thank you for subscribing to our mailing list. We have sent you a confirmation email.
        </p>
      </div>
      
      <!-- Contact info sidebar -->
      <aside class="meta contact">
        <slot></slot>
      </aside>
    </div>
  `
})