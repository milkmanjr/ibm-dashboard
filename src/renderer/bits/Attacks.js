import Vue from 'vue'
import {Event, EventNames} from '@/bits/Events'

let $src, $target
const Dashboard = {
  data_path : './security_visual.json',
  refresh_interval : 1, // in minutes
  allIds: [],
  init : function() {
      $.fn.svgSetClass = function(className) {
        return this.attr('class',className);
      }

      Vue.http('https://www.usopen.org/demos/securitydashboard/security_visual.json').then((response) => {
        let file = response.data

        Dashboard.attack_counter = new Counter({ number: file.counter.attacks, counterType: 'attack', container: $('#attackCounter') });
        Dashboard.event_counter = new Counter({ number: file.counter.events, counterType: 'event',  container: $('#eventCounter') });

        Dashboard.attack_counter.animate();
        Dashboard.event_counter.animate();

        // populate tag cloud
        var words = file.tags.map(function(obj) {
          obj.text = obj.text.replace(/_/g,' ');
          return obj;
        });

        // load top sources list
        Dashboard.populateSrcList(file.sources);

        // process attack list, rotate
        MapBar.init(file.attacks);

        Dashboard.interval = setInterval(function() {
          Dashboard.refresh();
        }, Dashboard.refresh_interval * 60000);
    })
  },

  teardown: function () {
    clearInterval(Dashboard.interval)
    MapBar.teardown();
    Dashboard.attack_counter.clearInterval()
    Dashboard.event_counter.clearInterval()
  },

  refresh : function() {
    Vue.http('https://www.usopen.org/demos/securitydashboard/security_visual.json').then((response) => {
      let file = response.data

      //Dashboard.attack_counter.update(file.counter.attacks);
      //Dashboard.event_counter.update(file.counter.events);

      // update tag cloud
      var words = file.tags.map(function(obj) {
        obj.text = obj.text.replace(/_/g,' ');
        return obj;
      });

      // load top sources list
      Dashboard.populateSrcList(file.sources);

      // process attack list
      MapBar.attackList = file.attacks;
      MapBar.attackLength = file.attacks.length;
      MapBar.reloadCurrentAttack();
    });
  },

  populateSrcList : function(srcs) {
    var list = '';
    var map = $('#countryMap');
    MapBar.unhighlightCountry(map.find('.attacker'));
    for(var i=srcs.length-1; i>=0; --i) {
      var level = 6;
      if(i<6) {
        list = '<li><img src="/images/flags/' + srcs[i] + '.png" />'+Dashboard.getOrdinal(i+1)+'</li>' + list;
        level = i;
      }
      // map.find('#'+srcs[i]).svgSetClass('attacker level' + (i+1));
      MapBar.highlightCountry(map,map.find('#'+srcs[i]),level+1);
    }
    $('#srcList').html(list);
  },

  getOrdinal : function(n) {
    var s=["th","st","nd","rd"];
    var v=n%100;
    //return n+(s[(v-20)%10]||s[v]||s[0]);
    return n+"<sup>"+(s[(v-20)%10]||s[v]||s[0])+"</sup>";
  }
}

var Counter = function(opts) {
  this.last = 0;
  this.max;
  this.interval;
  this.intervalID;
  this.container;
  this.steps = Dashboard.refresh_interval * 60 * 10; // 60s * x steps/second
  this.counterType = opts.counterType;
  this.eventName = opts.counterType == 'attack' ? EventNames.ATTACK_COUNT : EventNames.ATTACK_EVENT_COUNT;

  this.animate = function() {
    clearInterval(this.intervalID);

    var that = this;

    var num = that.last + that.interval;
    //if(num > that.max) { num = that.max; }
    that.last = num;
    that.container.html(that.formatNumber(that.last));
    Event.$emit(that.eventName, {value: that.formatNumber(that.last)})

    this.intervalID = setInterval(function() {
      var num = that.last + that.interval;
      //if(num > that.max) { num = that.max; }
      that.last = num;
      that.container.html(that.formatNumber(that.last));
      Event.$emit(that.eventName, {type: that.eventName, value: that.formatNumber(that.last)})

      if(that.last === that.max) {
        console.log(that.container.attr('id') + ' reached max ' + that.last + ', ' + that.max);
        // clearInterval(that.intervalID);
      }
    }, (Dashboard.refresh_interval*60000)/this.steps);
  }

  this.clearInterval = function () {
    clearInterval(this.intervalID)
  }

  this.formatNumber = function(num) {
    num = ''+parseInt(num, 10);
    var l = num.length;
    if(l > 3) {
      // need to polyfill comma insertion
      l = num.length;
      var i = l, str = '';
      while(i--) {
        // str = (i == 0 ? '' : ((l-i) % 3 ? '' : ',')) + num.charAt(i) + str;
        // below is expanded version of above code
        var comma = '';
        // not last character
        if(i > 0) {
          // multiple of 3 characters in from the right
          if( (l-i) % 3 === 0) {
            comma = ',';
          }
        }
        // concatenate comma with character at position i and rest of composed str
        str = comma + num.charAt(i) + str;
      }
      num = str;

    }
    return num;
  }

  this.update = function(number) {
    this.max = number;
    this.calculateInterval();
    this.animate();
  }

  this.calculateInterval = function() {
    var diff = this.max - this.last;
    if(this.last === 0) {
      diff = 100000;
      this.last = this.max - 100000;
    }
    if(this.last < 0) {
      this.last = 0;
      diff = this.max;
    }

    this.interval = diff / this.steps;

    console.log(this.container.attr('id') + ' interval: ' + this.interval);
  }


  this.init = function(opts) {
    this.container = $(opts.container);

    this.max = opts.number;
    this.calculateInterval();

    return this;
  }

  return this.init(opts);
}

var MapBar = {
  attackList : [],
  attackLength : 0,

  intervalID : -1,
  interval : 1, // in seconds

  animation_length : 500, // in milliseconds

  timeoutID : -1,

  currentID : -1,

  init : function(list) {
    try {
      // sort based on timestamp in case it comes out of order
      list.sort(function(a,b) {
        return a.timestamp - b.timestamp;
      });
      this.attackList = list;
      this.attackLength = list.length;

      //this.bindEvents();

      this.nextAttack();
      // this.cycleAttacks();
    } catch(e) {
      console.log('init ERROR - %o',e);
    }
  },

  teardown: function () {
    this.stopCycle()
    console.log('tearing down')

    for (var i = 0; i<Dashboard.allIds.length; i++) {
      clearTimeout(Dashboard.allIds[i])
    }
  },

  bindEvents : function() {
    var legend = $('#targetLegend');

    legend.on('click', 'li', function() {
      MapBar.selectAttackType($(this).index());
    });

    $('#targetChart').on('click', 'div.border', function() {
      MapBar.selectAttackType($(this).index());
    });
  },

  cycleAttacks : function() {
    this.intervalID = setInterval(function() {
      MapBar.nextAttack();
    }, this.interval * 1000);
  },

  stopCycle : function() {
    clearInterval(this.intervalID);
  },

  // id here is 0-indexed
  selectAttackType : function(id) {
    MapBar.stopCycle();
    clearTimeout(MapBar.timeoutID);

    MapBar.loadAttack(MapBar.attackList[id]);
    MapBar.currentID = id;

    MapBar.timeoutID = setTimeout(function() {
      MapBar.cycleAttacks();
    }, (60 - MapBar.interval) * 1000);
  },

  nextAttack : function() {
    var next = this.currentID + 1;
    if(next >= this.attackLength) {
      next = 0;
    }
    var nextnext = next + 1;
    if(nextnext >= this.attackLength) {
      nextnext = 0;
    }

    var old_time = this.attackList[next].timestamp;
    var new_time = this.attackList[nextnext].timestamp;
    var timeout = new_time - old_time;
    if(nextnext < next) {
      timeout = 1000;
    }
    if(timeout === 0) {
      timeout = this.animation_length;
    }
    if(timeout > 3000) {
      timeout = 3000;
    }

    this.loadAttack(this.attackList[next]);

    this.currentID = next;

    Dashboard.allIds.push(setTimeout(function() {
      MapBar.nextAttack();
    },timeout));
  },

  loadAttack : function(att) {
    // att : { src: 'USA|CAN|MEX|JAM|BRA', type: 1|2|3 }
    // 1: CDN
    // 2: IPS
    // 3: Firewall

    var chart = $('#targetChart');
    var map = $('#countryMap');

    var attack_src = att.source;
    var attack_target = att.target;
    $src = map.find('#'+attack_src);
    $target = map.find('#'+attack_target);

    console.log('attack from: ' + attack_src + ' to: ' + attack_target);

    /*chart.find('.active').removeClass('active');
    switch(1*att.type) {
      case 1:
        chart.find('.cdn').addClass('active');
        map.svgSetClass('cdn');
        break;
      case 2:
        chart.find('.ips').addClass('active');
        map.svgSetClass('ips');
        break;
      case 3:
        chart.find('.firewall').addClass('active');
        map.svgSetClass('firewall');
        break;
    }

    map.find('.active').svgSetClass('');
    var countries = att.src.map(function(val) { return '#' + val }).join(',');
    $(countries).svgSetClass('active');*/

    // this.highlightCountry($src,map);

    //get border of attacking country
    if($src.find('g').length == 0){
      var paths = $src.children();
    } else {
      var paths = $src.find('g').children();
    }

    var level = '';
    if($src.length > 0) {
      var match = $src[0].className.baseVal.match(/(level\d)/);
      if(match && match[1]) {
        level = match[1];
      }
    }

    try {
      var b = paths[paths.length-1].getBBox();
      MapBar.createAttackPath(b,$target,level);
      // MapBar.unhighlightCountry($src);
    } catch (e) {

    }
  },

  highlightCountry : function(map, $src, level) {
    if(level === undefined) {
      level = 7;
    }
    //change attacking country color
    $src.svgSetClass('attacker level' + level).detach();
    map.find('circle').first().before($src);
  },

  unhighlightCountry : function($src) {
    //change attacking country color
    $src.svgSetClass('');
  },

  removeAttackPath : function(path) {
    setTimeout(function() {
      path.parentNode.removeChild(path);
    },this.animation_length);
  },

  createAttackPath : function(b,t,l) {
    var path = document.createElementNS("http://www.w3.org/2000/svg", 'path'); //Create a path in SVG's namespace
    path.setAttribute("class","attackPath hidden");

    var fromx = parseFloat(t.attr('cx')),
        fromy = parseFloat(t.attr('cy')),
        from = {x: fromx, y: fromy},
        tox = (b.x + b.width/2),
        toy = (b.y + b.height/2),
        to = {x: tox, y: toy};

    var cp = this.findControlPoint(from, to, 60);

    path.setAttribute("d","M"+fromx+" "+fromy+" Q "+cp.x+" "+cp.y+", "+tox+" "+toy); //Set path's data

    var length = Math.ceil(path.getTotalLength());

    path.style.strokeDasharray = length + ' ' + length;
    path.style.strokeDashoffset = length;

    // reset keyframe value for stroke-dashoffset to match length of path
    var keyframe = this.findKeyframesRule('dash');
    keyframe.deleteRule('to');
    keyframe.appendRule('to { stroke-dashoffset: ' + length*3 + ';}');

    path.setAttribute('class','attackPath shooting ' + l);
    document.getElementById("countryMap").appendChild(path);

    MapBar.removeAttackPath(path);
  },

  reloadCurrentAttack : function() {
    this.loadAttack(this.attackList[this.currentID]);
  },

  findMidpoint : function (from, to) {
    // var mid = {};
    // mid.x = (from.x + to.x) / 2;
    // mid.y = (from.y + to.y) / 2;

    var mid;
    mid = {x: (from.x + to.x) / 2, y: (from.y + to.y) / 2};
    return mid;
  },

  findSlope : function (from, to) {
    return (from.y - to.y) / (from.x - to.x);
  },

  findControlPoint : function (from, to, distance) {
    var midpoint = this.findMidpoint(from, to);
    var shotSlope = this.findSlope(from, to);
    var controlPointSlope = -1 / shotSlope;

    // console.log('shot '+to.number+':');
    // console.log('slope: ' + shotSlope);
    // console.log('perpendicular: ' + controlPointSlope);
    // console.log('from: ');
    // console.log(from);
    // console.log('to:');
    // console.log(to);
    var controlPoint;
    if (shotSlope === 0) {
      // horizontal, return the x midpoint + distance to move up
      controlPoint = {x: midpoint.x, y: midpoint.y - distance};
    } else if (from.x === to.x) {
      // vertical, return the y midpoint + distance to move left
      controlPoint = {x: midpoint.x - distance, y: midpoint.y};
    } else {
      // normal arc
      var x1 = midpoint.x + distance / Math.sqrt(1 + controlPointSlope * controlPointSlope);
      var x2 = midpoint.x - distance / Math.sqrt(1 + controlPointSlope * controlPointSlope);

      var y1 = controlPointSlope * (x1 - midpoint.x) + midpoint.y;
      var y2 = controlPointSlope * (x2 - midpoint.x) + midpoint.y;

      // console.log('x1:'+x1+', y1:'+y1);
      // console.log('midpoint x:'+midpoint.x + ', y:'+midpoint.y);
      // console.log('x2:'+x2+', y2:'+y2);

      if (y1 <= midpoint.y) {
        controlPoint = {x: x1, y: y1 };
      } else {
        controlPoint = {x: x2, y: y2 };
      }
    }

    return controlPoint;
  },

  // search the CSSOM for a specific -webkit-keyframe rule
  findKeyframesRule: function(rule)
  {
      // gather all stylesheets into an array
      var ss = document.styleSheets;

      // loop through the stylesheets
      for (var i = 0; i < ss.length; ++i) {

          // loop through all the rules
          for (var j = 0; j < ss[i].cssRules.length; ++j) {

              // find the -webkit-keyframe rule whose name matches our passed over parameter and return that rule
              if (ss[i].cssRules[j].type == window.CSSRule.KEYFRAMES_RULE && ss[i].cssRules[j].name == rule)
                  return ss[i].cssRules[j];
          }
      }
  }
}

export default Dashboard