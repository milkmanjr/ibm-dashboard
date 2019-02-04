<template>
  <div class="slam-tracker">
    <section-header subtext="IBM Cloud: Built for all applications" text="SlamTracker" index="03"></section-header>

    <section>
      <webview :src="defaultUrl || fallbackUrl" ref="webview"></webview>
    </section>

    <right-sidebar :fade="fade" :quote="quote" :points="points"></right-sidebar>
  </div>
</template>

<script>
  import SlamHelpers from '@/bits/SlamHelpers'
  import Vue from 'vue'

  export default {
    data () {
      return {
        fade: true,
        defaultUrl: '',
        fallbackUrl: '',
        points: [
          {
            value: '2X',
            label: 'online sales increase for food services company through the use of responsive cloud-based order management system'
          }, {
            value: '89%',
            label: 'accuracy level predicting hypoglycemic episodes for diabetics with mobile personal assistant'
          }, {
            value: '7',
            unit: 'hours',
            label: 'average time telecom sales reps save every week with streamlined sales app'
          }
        ],
        quote: {
          text: 'We\'ve got millions of people consuming the U.S. Open offsite. We need to deliver a digital experience that is almost as if they were here.',
          speaker: 'Kirsten Corio',
          position: 'Managing Director, Ticket Sales and Digital Strategy',
          headshot: 'static/speakers/kirsten_corio.png',
          thin_position: true
        }
      }
    },
    mounted () {
      this.$refs.webview.addEventListener('dom-ready', () => {
        this.$refs.webview.setZoomFactor(1)
        this.$refs.webview.insertCSS('body::-webkit-scrollbar-track { border: 0; background-color: #365583; } body::-webkit-scrollbar { width: 10px; background-color: #365583; } body::-webkit-scrollbar-thumb { background-color: #3f83cc; } body { padding-right: 1px !important; background-color: #365583;  }')
      })

      this.getMatches()
      this.getFallback()
    },
    methods: {
      resetWebview () {
        this.$refs.webview.loadURL(this.defaultUrl)
      },
      getMatches () {
        let parseString = require('xml2js').parseString
        let axios = require('axios')

        axios.get('https://s3.us-east-2.amazonaws.com/ibm.spinifex.io/trackingdata/MIP.xml')
          .then(response => {
            let self = this
            parseString(response.data, function (err, result) {
              if (err) {
                console.error('problem')
              }
              self.findMatch(result.Tournament.Courts[0].Court)
            })
          })
      },
      getFallback () {
        Vue.http('https://www.usopen.org/en_US/scores/feeds/completed_matches/completed.json')
          .then((response) => {
            this.fallbackUrl = SlamHelpers.getFallbackMatch(response.data)
          })
      },
      findMatch (matches) {
        let number

        for (var i = 0, len = matches.length; i < len; i++) {
          if (matches[i].$.MatchID) {
            number = this.urlBuilder(matches[i].$.MatchID)
            this.defaultUrl = `https://www.usopen.org/webview/en_US/suite/stats/${number}.html`
            break
          }
        }
      },
      urlBuilder (matchIdentifier) {
        let code

        if (matchIdentifier.match(/^MS/gi)) {
          code = matchIdentifier.replace('MS', '1')
        } else if (matchIdentifier.match('WS')) {
          code = matchIdentifier.replace('WS', '2')
        } else if (matchIdentifier.match('MD')) {
          code = matchIdentifier.replace('MD', '3')
        } else if (matchIdentifier.match('WD')) {
          code = matchIdentifier.replace('WD', '4')
        } else if (matchIdentifier.match('XD')) {
          code = matchIdentifier.replace('XD', '5')
        } else if (matchIdentifier.match('BS')) {
          code = matchIdentifier.replace('BS', '21')
        } else if (matchIdentifier.match('GS')) {
          code = matchIdentifier.replace('GS', '22')
        } else if (matchIdentifier.match('BD')) {
          code = matchIdentifier.replace('BD', '23')
        } else if (matchIdentifier.match('GD')) {
          code = matchIdentifier.replace('GD', '23')
        } else if (matchIdentifier.match('MQ')) {
          code = matchIdentifier.replace('MQ', '11')
        } else if (matchIdentifier.match('WQ')) {
          code = matchIdentifier.replace('WQ', '12')
        } else if (matchIdentifier.match('JS')) {
          code = matchIdentifier.replace('JS', '25')
        } else if (matchIdentifier.match('KS')) {
          code = matchIdentifier.replace('KS', '26')
        } else if (matchIdentifier.match('CS')) {
          code = matchIdentifier.replace('CS', '31')
        } else if (matchIdentifier.match('DS')) {
          code = matchIdentifier.replace('DS', '32')
        } else if (matchIdentifier.match('CD')) {
          code = matchIdentifier.replace('CD', '33')
        } else if (matchIdentifier.match('DD')) {
          code = matchIdentifier.replace('DD', '34')
        } else if (matchIdentifier.match('US')) {
          code = matchIdentifier.replace('US', '35')
        } else if (matchIdentifier.match('UD')) {
          code = matchIdentifier.replace('UD', '36')
        } else if (matchIdentifier.match('ZD')) {
          code = matchIdentifier.replace('ZD', '53')
        } else if (matchIdentifier.match('CM')) {
          code = matchIdentifier.replace('CM', '51')
        } else if (matchIdentifier.match('LD')) {
          code = matchIdentifier.replace('LD', '54')
        } else if (matchIdentifier.match('CW')) {
          code = matchIdentifier.replace('CW', '52')
        } else if (matchIdentifier.match('ED')) {
          code = matchIdentifier.replace('ED', '43')
        }

        return code
      }
    },
    components: {
      'section-header': require('@/bits/SectionHeader'),
      'right-sidebar': require('@/bits/RightSidebar')
    }
  }
</script>

<style lang="scss" scoped>
  .slam-tracker {
    section {
      display: flex;
      align-items: center;
    }

    div {
      flex: 1;
      align-items: center;
      display: flex;
      justify-content: center;
    }

    .slam-tracker__reset {
      height: 14%;
      background: rgba(0, 0, 0, 0.25);
      cursor: pointer;

      i {
        margin-right: 10px;
      }
    }

    webview {
      display: flex; // do not set to block!
      width: 100%;
      height: 100%;
      margin: 0 auto;

      &::-webkit-scrollbar {
        display: none;
      }
    }
  }
</style>
