<template>
    <div class="map-legend">
      <div class="map-legend__cloud">
        <span><img src="~@/assets/icons/public-cloud.svg" />Public Cloud</span>
        <span><img src="~@/assets/icons/private-cloud.svg" />Private Cloud</span>
      </div>
      <div v-if="include_security" class="map-legend__security">
            <div class="map-legend__security__bars">
                <span class="level_0"></span><span class="level_1"></span><span class="level_2"></span><span class="level_3"></span>
            </div>
            <div class="map-legend__security__text">
                <span>None</span>
                <span>Min</span>
                <span class="mid">Light</span>
                <span>Moderate</span>
                <span>High</span>
            </div>
      </div>
    </div>
</template>

<script>
export default {
  data () {
    return {}
  },
  props: ['include_security']
}
</script>

<style lang="scss" scoped>
.map-legend {
    display: block;
    position: absolute;
    width: 100%;
    bottom: 0;
    left: 0;

    .map-legend__cloud {
        text-align: center;
        font-size: .6rem;

        span {
            margin: 0 1.5em;
        }

        img {
            height: 1em;
            margin-right: 1em;
        }
    }

    .map-legend__security {
        width: 25%;
        margin: 0 auto;
    }

    .map-legend__security__bars {
        span {
            background: red;
            width: 25%;
            display: inline-block;
            height: .25em;
            margin: 0;

            &.level_0 {
                background: $theme--cyber-security--level_0;
            }
            &.level_1 {
                background: $theme--cyber-security--level_1;
            }
            &.level_2 {
                background: $theme--cyber-security--level_2;
            }
            &.level_3 {
                background: $theme--cyber-security--level_3;
            }
        }
    }

    .map-legend__security__text {
        font-size: .55rem;
        display: flex;
        width: 100%;
        justify-content: space-between;

        span {
            &.mid {
                margin-left: 1.25em;
            }
        }
    }
}
</style>
