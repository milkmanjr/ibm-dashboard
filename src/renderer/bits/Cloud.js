import {Event, EventNames} from '@/bits/Events'

const CloudDashboard = {
  refresh_interval : 1,
  counter_refresh_interval : 5,
  dataFile : 'https://www.usopen.org/demos/cloud/metrics.json',
  trafficFile : 'https://www.usopen.org/demos/cloud/cmusta_traffic.json',
  sourcesFile: 'https://www.usopen.org/demos/cloud/cmusta_trafficSources.json',
  init : function(){
    $.fn.svgSetClass = function(className) {
      return this.attr('class',className);
    }

    $.getJSON(this.dataFile, function(counterData){
      counterData.web = counterData.total - counterData.mobile;
      CloudDashboard.web_counter = new Counter({ number: counterData.total, counterType: 'web', container: $('.counter.total .data') });
      CloudDashboard.mobile_counter = new Counter({ number: counterData.mobile, counterType: 'mobile', container: $('.counter.mobile .data') });
      CloudDashboard.desktop_counter = new Counter({ number: counterData.web, counterType: 'desktop', container: $('.counter.desktop .data') });

      CloudDashboard.web_counter.animate();
      CloudDashboard.mobile_counter.animate();
      CloudDashboard.desktop_counter.animate();

      CloudDashboard.counterRefreshID = setInterval(function() {
        CloudDashboard.refresh_counter();
      }, CloudDashboard.counter_refresh_interval * 60000);
    });

    $.getJSON(this.trafficFile, function(trafficData){
      CloudDashboard.loadTrafficData(trafficData);
    });

    $.getJSON(this.sourcesFile, function(file){
      CloudDashboard.loadSourceData(file);
    });

   CloudDashboard.refreshID = setInterval(function() {
      CloudDashboard.refresh();
    }, CloudDashboard.refresh_interval * 60000);
  },
  refresh : function() {
    return

    $.getJSON(this.trafficFile, function(file){
      CloudDashboard.loadTrafficData(file);
    });
    $.getJSON(this.sourcesFile, function(file){
      CloudDashboard.loadSourceData(file);
    });
  },
  teardown: function () {
    clearInterval(CloudDashboard.counterRefreshID)
    clearInterval(CloudDashboard.refreshID)
    CloudDashboard.web_counter.teardown()
    CloudDashboard.mobile_counter.teardown()
    CloudDashboard.desktop_counter.teardown()
  },
  refresh_counter : function() {
    $.getJSON(this.dataFile, function(file) {
      file.web = file.total - file.mobile;
      CloudDashboard.web_counter.update(file.total);
      CloudDashboard.mobile_counter.update(file.mobile);
      CloudDashboard.desktop_counter.update(file.web);
    });
  },
  loadTrafficData :  function(trafficData){
    $('.rtp div, .ports div, .bld div, .sanJose div, .london div').hide();
    $.each(trafficData.data, function(){
      if(this.site == 'p1'){
        $('.rtp div').html(Math.round(this.percentage) + '%');
        $('.rtp, .rtp div').show();
      }else if(this.site == 'p3'){
        $('.bld, .bld div').show();
        $('.bld div').html(Math.round(this.percentage) + '%');
      }else if(this.site == 'p5'){
        $('.ports, .ports div').show();
        $('.ports div').html(Math.round(this.percentage) + '%');
      }else if(this.site == 's3'){
        $('.sanJose, .sanJose div').show();
        $('.sanJose div').html(Math.round(this.percentage) + '%');
      }else if(this.site == 's4'){
        $('.london, .london div').show();
        $('.london div').html(Math.round(this.percentage) + '%');
      }else if(this.site == 's2'){
        $('.montreal, .montreal div').show();
        $('.montreal div').html(Math.round(this.percentage) + '%');
      }else if(this.site == 's6'){
        $('.tokyo, .tokyo div').show();
        $('.tokyo div').html(Math.round(this.percentage) + '%');
      }
    });
  },
  loadSourceData : function(sourceData){
    var map = $('#countryMap');
    map.find('.active').svgSetClass('');
    var convertedSourceData = [];
    for(var i = 0; i <sourceData.length; i++){
        convertedSourceData.push(sourceData[i].country);
    }

     var countries = convertedSourceData.map(function(val) { return '#' + val }).join(',');
     $(countries).svgSetClass('active').detach().appendTo(map);
  }
}

var Counter = function(opts) {
  this.last = 0;
  this.max;
  this.interval;
  this.intervalID;
  this.container;
  this.eventName = opts.counterType == 'web' ? EventNames.CLOUD_COUNT_WEB : opts.counterType == 'mobile' ? EventNames.CLOUD_COUNT_MOBILE : EventNames.CLOUD_COUNT_DESKTOP;
  this.steps = CloudDashboard.counter_refresh_interval * 60 * 10; // 60s * x steps/second

  this.animate = function() {
    clearInterval(this.intervalID);

    var that = this;

    var num = that.last + that.interval;
    //if(num > that.max) { num = that.max; }
    that.last = num;
    that.container.html(that.formatNumber(that.last));
    Event.$emit(that.eventName, {type: that.eventName, value: that.formatNumber(that.last)})
    console.log('animating =>', that.eventName)

    this.intervalID = setInterval(function() {
      var num = that.last + that.interval;
      //if(num > that.max) { num = that.max; }
      that.last = num;
      that.container.html(that.formatNumber(that.last));
      Event.$emit(that.eventName, {type: that.eventName, value: that.formatNumber(that.last)})

      if(that.last === that.max) {
        console.log(that.container.attr('id') + ' reached max ' + that.last + ', ' + that.max);
        clearInterval(that.intervalID);
      }
    }, (CloudDashboard.counter_refresh_interval*60000)/this.steps);
  }

  this.teardown = function () {
    clearInterval(this.intervalID);
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

    // assume value will be same for 12 (5 min intervals with updates every 60 min) fetches
    // so slow steps down so we only reach the max on the final fetch
    this.interval = diff / this.steps / (60 / CloudDashboard.counter_refresh_interval);
  }


  this.init = function(opts) {
    this.container = $(opts.container);

    this.max = opts.number;
    this.calculateInterval();

    return this;
  }

  return this.init(opts);
}

export default CloudDashboard