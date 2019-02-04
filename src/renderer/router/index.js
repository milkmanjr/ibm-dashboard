import Vue from 'vue'
import Router from 'vue-router'
import {Event, EventNames} from '@/bits/Events'

Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/',
      name: 'index',
      components: {
        menu: require('@/components/Menu'),
        content: require('@/components/Content'),
        footer: require('@/components/Footer')
      },
      children: [
        {
          path: 'home',
          name: 'home',
          component: require('@/components/Content/Home')
        },
        {
          path: 'ibm-cloud',
          name: 'ibm-cloud',
          component: require('@/components/Content/IBMCloud')
        },
        {
          path: 'cyber-security',
          name: 'cyber-security',
          component: require('@/components/Content/CyberSecurity')
        },
        {
          path: 'watson-captioning',
          name: 'watson-captioning',
          component: require('@/components/Content/WatsonCaptioning')
        },
        {
          path: 'cognitive-highlights',
          name: 'cognitive-highlights',
          component: require('@/components/Content/CognitiveHighlights')
        },
        {
          path: 'slam-tracker',
          name: 'slam-tracker',
          component: require('@/components/Content/SlamTracker')
        },
        {
          path: 'cognitive-concierge',
          name: 'cognitive-concierge',
          component: require('@/components/Content/CognitiveConcierge')
        }
      ]
    },
    {
      path: '*',
      redirect: '/home'
    }
  ]
})

router.replace('/home')

router.beforeEach((to, from, next) => {
  Event.$emit(EventNames.STOP_VIDEO)
  next()
})

export default router
