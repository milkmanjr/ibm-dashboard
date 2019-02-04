<template>
  <div class="cognitive-concierge">
    <section-header subtext="IBM Cloud: AI ready" text="Watson Assistant" index="05"></section-header>

    <section>
      <div class="chatboxWrapper">
        <div class="chatbox">
          <h2 class="loadingText" v-if="!chatIsReady">Loading..</h2>
          <div class="history" ref="history">
            <div class="scrollableHistory">
              <div
                class="chat"
                :class="'chat--'+chat.from"
                v-for="chat in chatHistory">
                <h3>{{ chat.name }}</h3>
                <div class="chat__msg" v-html="chat.message"></div>
              </div>
            </div>
          </div>

          <div class="respond" :class="{ 'respond--ready': chatIsReady }">
            <h2 v-if="responses.length > 0">Suggested Responses</h2>
            <div class="responses">
              <span v-for="(response, index) in responses"
                    @click="typeMe(response, index)"
                    v-html="response.text"
                    :class="{ 'hasAnimated':response.hasAnimated, 'isGettingTyped':response.isGettingTyped }"></span>
            </div>
            <div class="fakeTextbox">
              <vue-typer
                v-if="textToType"
                :text="textToType"
                :repeat="0"
                :erase-on-complete="true"
                erase-style="clear"
                :pre-type-delay="1000"
                :type-delay="40"
                :pre-erase-delay="2000"
                @erased="onErased"></vue-typer>
            </div>
          </div>
        </div>
      </div>
    </section>

    <right-sidebar :fade="fade" :quote="quote" :points="points"></right-sidebar>
  </div>
</template>

<script>
  import { VueTyper } from 'vue-typer'

  // todo: store in a config file somewhere
  const endpoint = {
    url: 'https://satisfi2.com/ebm/ext_api.php?token=28f877f3-dadf-49bf-890d-8253f5f6d6f9',
    keys: {
      satisfi_company_id: 534,
      satisfi_company_token: '2ae09969-aac6-4afc-b673-a7d15dde46e8',
      satisfi_ext_bot_id: 603000,
      my_user_id: '401-2',
      my_conv_id: '401-2-100',
      area: 'CC0AA5BCB9E845469CF9DE5A14C55D5F'
    }
  }

  export default {
    data () {
      return {
        conciergeVideo: 'static/videos/cc-demo_Edit_04.mp4',
        bigQuote: 'Delight customers<br/>with personalized experiences',
        fadeTimeout: 400,
        fade: false,
        points: [
          {
            value: '10',
            unit: 'million',
            label: 'customer calls supported by Watson Assistant for a major Brazilian bank'
          },
          {
            value: '99%',
            label: 'increase in customer response times for a software company, resulting in a 10-point increase in customer satisfaction levels'
          },
          {
            value: '20X',
            label: 'additional customers a global telecommunications company call center can service using Watson-powered virtual agents'
          }
        ],
        quote: {
          text: 'Cognitive technology helps me deliver a seamless, easy, and personalized experience to every fan.',
          speaker: 'Amy Choyne',
          position: 'Chief Marketing Officer',
          headshot: 'static/speakers/amy_choyne.png'
        },
        chatIsReady: false,
        chatHistory: [],
        responses: [],
        responsesEnabled: true,
        responseTree: [
          {
            text: 'Hi',
            children: [
              {
                text: 'I’m traveling to the us open tomorrow, what’s the weather going to be like?'
              },
              {
                text: 'If I need cash, where can I find an ATM?'
              },
              {
                text: 'Who is currently playing on Ashe?',
                children: [
                  {
                    text: 'And who is playing in the Grandstand?'
                  }
                ]
              },
              {
                text: 'What can I eat there?',
                children: [
                  {
                    text: 'I’m hungry for burgers.',
                    children: [
                      {
                        text: 'Food village'
                      },
                      {
                        text: 'Armstrong'
                      },
                      {
                        text: 'Arthur Ashe'
                      }
                    ]
                  }
                ]
              }
            ]
          }
        ],
        textToType: null,
        removedResponse: null
      }
    },
    beforeMount () {
      this.$http.post(endpoint.url, {
        payload: {
          type: 'REQUEST',
          msg: 'stop',
          keys: endpoint.keys
        }
      })
      .then(response => {
        this.chatIsReady = true
        this.typeMe(this.responseTree[0]) // say "Hi"
      })
      .catch(error => console.log(error))
    },
    mounted () {
      this.fade = true
    },
    components: {
      'section-header': require('@/bits/SectionHeader'),
      'right-sidebar': require('@/bits/RightSidebar'),
      'vue-typer': VueTyper
    },
    methods: {
      typeMe (response, index = -1) {
        if (this.responsesEnabled) {
          this.responsesEnabled = false // disable other responses for now
          this.textToType = response.text

          // animate out
          response.isGettingTyped = true

          setTimeout(() => {
            if (index >= 0) {
              // remove response from list
              this.removedResponse = this.responses.splice(index, 1)[0]
              this.removedResponse.index = index
            } else {
              // unless it's the "Hi"
              this.removedResponse = response
              this.removedResponse.index = 0
            }
          }, 300)
        }
      },
      addChat (from, message) {
        this.chatHistory.push({
          from: from === 'user' ? 'user' : 'watson',
          name: from === 'user' ? 'You' : 'Watson Assistant',
          message: message
        })

        this.scrollToBottom()
      },
      onErased () { // when the text gets erased, it will look actually like it just got sent
        // push the text to the history
        this.addChat('user', this.textToType)

        // make it look like Watson is "thinking"
        setTimeout(() => {
          this.addChat('watson', '...')
        }, 1000)

        this.$http.post(endpoint.url, {
          payload: {
            type: 'REQUEST',
            msg: this.textToType,
            keys: endpoint.keys
          }
        }).then(response => {
          // console.log(response.data.payload.messages[0].msg_content)

          // remove the "..." chat
          this.chatHistory.pop()

          // add the actual response
          this.addChat('watson', response.data.payload.messages[0].msg_content)

          setTimeout(() => {
            if (this.removedResponse && this.removedResponse.children) {
              this.removedResponse.children.reverse().forEach(response => {
                this.responses.splice(this.removedResponse.index, 0, response)
              })
            }

            this.removedResponse = null
            this.responsesEnabled = true
            this.preventDuplicateResponseAnimations()
          }, 1000)
        })
        .catch(error => console.log(error))
      },
      preventDuplicateResponseAnimations () {
        setTimeout(() => {
          this.responses.forEach(response => {
            response.hasAnimated = true
          })
        }, 500)
      },
      scrollToBottom () {
        this.$nextTick(() => {
          this.$refs.history.scrollTop = this.$refs.history.scrollHeight
        })
      }
    }
  }
</script>

<style lang="scss">
  .cognitive-concierge {
    section {
      .chatboxWrapper {
        height: 100%;
        padding: 40px;
        background: $theme--cognitive-concierge--background-color;
      }

      .chatbox {
        height: 100%;
        display: flex;
        flex-direction: column;
        position: relative;

        .loadingText {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
        }

        .history {
          flex-grow: 1;
          overflow-y: scroll;
          margin-bottom: 40px;

          &::-webkit-scrollbar {
            display: none;
          }

          .scrollableHistory {
            height: 100%;
            position: relative;
          }

          .chat {
            margin-bottom: 20px;
            position: relative;

            &:last-child {
              margin-bottom: 0;
            }

            h3 {
              color: #5AACF4;
              font-size: 0.75em;
              margin-bottom: 0.5em;
            }

            .chat__msg {
              display: inline-block;
              font-size: 0.75em;
              max-width: 50%;
            }
          }

          .chat--user {
            text-align: right;

            .chat__msg {
              background-color: #5AACF4;
              color: white;
              padding: 15px;
            }
          }

          .chat--watson {
            .chat__msg {
              border-left: 2px solid #5AACF4;
              color: white;
              padding: 0 0 0 15px;

              ul {
                margin-left: 20px;
              }

              a {
                color: #5AACF4;
              }
            }
          }
        }

        .respond {
          opacity: 0;
          transition: all ease-in 500ms;

          &.respond--ready {
            opacity: 1.0;
          }

          h2 {
            font-size: 1em;
            margin-bottom: 0.5rem;
          }

          .responses {
            display: flex;
            justify-content: space-around;
            align-items: flex-end;
            margin-bottom: 20px;

            @keyframes newResponse {
              from {
                background-color: #FFFFFF;
                transform: rotateY(90deg);
              }

              to {
                background-color: #22303E;
                transform: rotateY(0deg);
              }
            }

            span {
              font-size: 0.75em;
              color: white;
              background-color: #22303E;
              padding: 15px;
              margin: 0 15px;
              max-width: 30%;

              &:not(.hasAnimated) {
                animation-duration: 300ms;
                animation-name: newResponse;
              }

              &.isGettingTyped {
                transition: transform linear 200ms;
                transform: rotateY(90deg);
              }

              &:first-child, &:last-child {
                margin: 0;
              }

              &:hover {
                cursor: pointer;
                background-color: #434F5A;
              }
            }
          }

          .fakeTextbox {
            height: 100px;
            background-color: #434F5A;
            text-align: center;
            padding: 35px 0;

            /* SCSS */
            .vue-typer {
              /* Styles for the vue-typer container
                 e.g. font-family, font-size  */
                display: inline-block;

              .custom.char {
                /* Styles for each character
                   e.g. color, background-color */
                  color: white;

                &.typed {
                  /* Styles specific to typed characters
                     i.e. characters to the left of the caret */
                }
                &.selected {
                  /* Styles specific to selected characters
                     i.e. characters to the right of the caret while VueTyper's
                          'eraseStyle' is set to a selection-based style */
                }
                &.erased {
                  /* Styles specific to erased characters
                     i.e. characters to the right of the caret while VueTyper's
                          'eraseStyle' is set to a non-selection-based style */
                }
              }

              .custom.caret {
                /* Styles for the caret
                   e.g. background-color, animation, display */
                  background-color: white;
                  width: 2px;
                  margin-left: 2px;

                &.pre-type {
                  /* Styles for the caret when it is idle before typing
                     i.e. before a string starts being typed, during 'preTypeDelay' */
                }
                &.pre-erase {
                  /* Styles for the caret when it is idle before erasing
                     i.e. before a string starts being erased, during 'preEraseDelay' */
                }
                &.idle {
                  /* Styles for the caret when it is idle, but VueTyper has not yet completed typing
                     i.e. when 'pre-type' or 'pre-erase' is set, but not 'complete' */
                }
                &.typing {
                  /* Styles for the caret while VueTyper is typing
                     i.e. when the caret is moving forwards */
                }
                &.selecting {
                  /* Styles for the caret while VueTyper is selecting
                     i.e. when the caret is moving backwards and 'eraseStyle' is
                     set to a selection-based style */
                }
                &.erasing {
                  /* Styles for the caret while VueTyper is erasing
                     i.e. when the caret is moving backwards and 'eraseStyle' is
                     set to a non-selection-based style */
                }
                &.complete {
                  /* Styles for the idle caret when VueTyper has finished all typing/erasing */
                }
              }
            }
          }
        }

      }
    }
  }
</style>
