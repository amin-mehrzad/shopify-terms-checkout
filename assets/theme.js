/*
 FastClick: polyfill to remove click delays on browsers with touch UIs.

 @version 1.0.3
 @codingstandard ftlabs-jsv2
 @copyright The Financial Times Limited [All Rights Reserved]
 @license MIT License
*/
(function(){"use strict";function e(t,r){function s(e,t){return function(){return e.apply(t,arguments)}}var i;r=r||{};this.trackingClick=false;this.trackingClickStart=0;this.targetElement=null;this.touchStartX=0;this.touchStartY=0;this.lastTouchIdentifier=0;this.touchBoundary=r.touchBoundary||10;this.layer=t;this.tapDelay=r.tapDelay||200;this.tapTimeout=r.tapTimeout||700;if(e.notNeeded(t)){return}var o=["onMouse","onClick","onTouchStart","onTouchMove","onTouchEnd","onTouchCancel"];var u=this;for(var a=0,f=o.length;a<f;a++){u[o[a]]=s(u[o[a]],u)}if(n){t.addEventListener("mouseover",this.onMouse,true);t.addEventListener("mousedown",this.onMouse,true);t.addEventListener("mouseup",this.onMouse,true)}t.addEventListener("click",this.onClick,true);t.addEventListener("touchstart",this.onTouchStart,false);t.addEventListener("touchmove",this.onTouchMove,false);t.addEventListener("touchend",this.onTouchEnd,false);t.addEventListener("touchcancel",this.onTouchCancel,false);if(!Event.prototype.stopImmediatePropagation){t.removeEventListener=function(e,n,r){var i=Node.prototype.removeEventListener;if(e==="click"){i.call(t,e,n.hijacked||n,r)}else{i.call(t,e,n,r)}};t.addEventListener=function(e,n,r){var i=Node.prototype.addEventListener;if(e==="click"){i.call(t,e,n.hijacked||(n.hijacked=function(e){if(!e.propagationStopped){n(e)}}),r)}else{i.call(t,e,n,r)}}}if(typeof t.onclick==="function"){i=t.onclick;t.addEventListener("click",function(e){i(e)},false);t.onclick=null}}var t=navigator.userAgent.indexOf("Windows Phone")>=0;var n=navigator.userAgent.indexOf("Android")>0&&!t;var r=/iP(ad|hone|od)/.test(navigator.userAgent)&&!t;var i=r&&/OS 4_\d(_\d)?/.test(navigator.userAgent);var s=r&&/OS ([6-9]|\d{2})_\d/.test(navigator.userAgent);var o=navigator.userAgent.indexOf("BB10")>0;e.prototype.needsClick=function(e){switch(e.nodeName.toLowerCase()){case"button":case"select":case"textarea":if(e.disabled){return true}break;case"input":if(r&&e.type==="file"||e.disabled){return true}break;case"label":case"iframe":case"video":return true}return/\bneedsclick\b/.test(e.className)};e.prototype.needsFocus=function(e){switch(e.nodeName.toLowerCase()){case"textarea":return true;case"select":return!n;case"input":switch(e.type){case"button":case"checkbox":case"file":case"image":case"radio":case"submit":return false}return!e.disabled&&!e.readOnly;default:return/\bneedsfocus\b/.test(e.className)}};e.prototype.sendClick=function(e,t){var n,r;if(document.activeElement&&document.activeElement!==e){document.activeElement.blur()}r=t.changedTouches[0];n=document.createEvent("MouseEvents");n.initMouseEvent(this.determineEventType(e),true,true,window,1,r.screenX,r.screenY,r.clientX,r.clientY,false,false,false,false,0,null);n.forwardedTouchEvent=true;e.dispatchEvent(n)};e.prototype.determineEventType=function(e){if(n&&e.tagName.toLowerCase()==="select"){return"mousedown"}return"click"};e.prototype.focus=function(e){var t;if(r&&e.setSelectionRange&&e.type.indexOf("date")!==0&&e.type!=="time"&&e.type!=="month"){t=e.value.length;e.setSelectionRange(t,t)}else{e.focus()}};e.prototype.updateScrollParent=function(e){var t,n;t=e.fastClickScrollParent;if(!t||!t.contains(e)){n=e;do{if(n.scrollHeight>n.offsetHeight){t=n;e.fastClickScrollParent=n;break}n=n.parentElement}while(n)}if(t){t.fastClickLastScrollTop=t.scrollTop}};e.prototype.getTargetElementFromEventTarget=function(e){if(e.nodeType===Node.TEXT_NODE){return e.parentNode}return e};e.prototype.onTouchStart=function(e){var t,n,s;if(e.targetTouches.length>1){return true}t=this.getTargetElementFromEventTarget(e.target);n=e.targetTouches[0];if(r){s=window.getSelection();if(s.rangeCount&&!s.isCollapsed){return true}if(!i){if(n.identifier&&n.identifier===this.lastTouchIdentifier){e.preventDefault();return false}this.lastTouchIdentifier=n.identifier;this.updateScrollParent(t)}}this.trackingClick=true;this.trackingClickStart=e.timeStamp;this.targetElement=t;this.touchStartX=n.pageX;this.touchStartY=n.pageY;if(e.timeStamp-this.lastClickTime<this.tapDelay){e.preventDefault()}return true};e.prototype.touchHasMoved=function(e){var t=e.changedTouches[0],n=this.touchBoundary;if(Math.abs(t.pageX-this.touchStartX)>n||Math.abs(t.pageY-this.touchStartY)>n){return true}return false};e.prototype.onTouchMove=function(e){if(!this.trackingClick){return true}if(this.targetElement!==this.getTargetElementFromEventTarget(e.target)||this.touchHasMoved(e)){this.trackingClick=false;this.targetElement=null}return true};e.prototype.findControl=function(e){if(e.control!==undefined){return e.control}if(e.htmlFor){return document.getElementById(e.htmlFor)}return e.querySelector("button, input:not([type=hidden]), keygen, meter, output, progress, select, textarea")};e.prototype.onTouchEnd=function(e){var t,o,u,a,f,l=this.targetElement;if(!this.trackingClick){return true}if(e.timeStamp-this.lastClickTime<this.tapDelay){this.cancelNextClick=true;return true}if(e.timeStamp-this.trackingClickStart>this.tapTimeout){return true}this.cancelNextClick=false;this.lastClickTime=e.timeStamp;o=this.trackingClickStart;this.trackingClick=false;this.trackingClickStart=0;if(s){f=e.changedTouches[0];l=document.elementFromPoint(f.pageX-window.pageXOffset,f.pageY-window.pageYOffset)||l;l.fastClickScrollParent=this.targetElement.fastClickScrollParent}u=l.tagName.toLowerCase();if(u==="label"){t=this.findControl(l);if(t){this.focus(l);if(n){return false}l=t}}else if(this.needsFocus(l)){if(e.timeStamp-o>100||r&&window.top!==window&&u==="input"){this.targetElement=null;return false}this.focus(l);this.sendClick(l,e);if(!r||u!=="select"){this.targetElement=null;e.preventDefault()}return false}if(r&&!i){a=l.fastClickScrollParent;if(a&&a.fastClickLastScrollTop!==a.scrollTop){return true}}if(!this.needsClick(l)){e.preventDefault();this.sendClick(l,e)}return false};e.prototype.onTouchCancel=function(){this.trackingClick=false;this.targetElement=null};e.prototype.onMouse=function(e){if(!this.targetElement){return true}if(e.forwardedTouchEvent){return true}if(!e.cancelable){return true}if(!this.needsClick(this.targetElement)||this.cancelNextClick){if(e.stopImmediatePropagation){e.stopImmediatePropagation()}else{e.propagationStopped=true}e.stopPropagation();e.preventDefault();return false}return true};e.prototype.onClick=function(e){var t;if(this.trackingClick){this.targetElement=null;this.trackingClick=false;return true}if(e.target.type==="submit"&&e.detail===0){return true}t=this.onMouse(e);if(!t){this.targetElement=null}return t};e.prototype.destroy=function(){var e=this.layer;if(n){e.removeEventListener("mouseover",this.onMouse,true);e.removeEventListener("mousedown",this.onMouse,true);e.removeEventListener("mouseup",this.onMouse,true)}e.removeEventListener("click",this.onClick,true);e.removeEventListener("touchstart",this.onTouchStart,false);e.removeEventListener("touchmove",this.onTouchMove,false);e.removeEventListener("touchend",this.onTouchEnd,false);e.removeEventListener("touchcancel",this.onTouchCancel,false)};e.notNeeded=function(e){var t;var r;var i;if(typeof window.ontouchstart==="undefined"){return true}r=+(/Chrome\/([0-9]+)/.exec(navigator.userAgent)||[,0])[1];if(r){if(n){t=document.querySelector("meta[name=viewport]");if(t){if(t.content.indexOf("user-scalable=no")!==-1){return true}if(r>31&&document.documentElement.scrollWidth<=window.outerWidth){return true}}}else{return true}}if(o){i=navigator.userAgent.match(/Version\/([0-9]*)\.([0-9]*)/);if(i[1]>=10&&i[2]>=3){t=document.querySelector("meta[name=viewport]");if(t){if(t.content.indexOf("user-scalable=no")!==-1){return true}if(document.documentElement.scrollWidth<=window.outerWidth){return true}}}}if(e.style.msTouchAction==="none"){return true}if(e.style.touchAction==="none"){return true}return false};e.attach=function(t,n){return new e(t,n)};if(typeof define=="function"&&typeof define.amd=="object"&&define.amd){define(function(){return e})}else if(typeof module!=="undefined"&&module.exports){module.exports=e.attach;module.exports.FastClick=e}else{window.FastClick=e}})()

/* Throttle & Debounce */
!function(n,t){"$:nomunge";var o,u=n.jQuery||n.Cowboy||(n.Cowboy={});u.throttle=o=function(n,o,e,i){var r,a=0;function c(){var u=this,c=+new Date-a,f=arguments;function d(){a=+new Date,e.apply(u,f)}i&&!r&&d(),r&&clearTimeout(r),i===t&&c>n?d():!0!==o&&(r=setTimeout(i?function(){r=t}:d,i===t?n-c:n))}return"boolean"!=typeof o&&(i=e,e=o,o=t),u.guid&&(c.guid=e.guid=e.guid||u.guid++),c},u.debounce=function(n,u,e){return e===t?o(n,u,!1):o(n,e,!1!==u)}}(this);

/* isElementVisible */
;(function(){function n(n){var i=window.innerWidth||document.documentElement.clientWidth,r=window.innerHeight||document.documentElement.clientHeight,t=n.getBoundingClientRect();return t.top>=0&&t.bottom<=r&&t.left>=0&&t.right<=i}function t(n){var i=window.innerWidth||document.documentElement.clientWidth,r=window.innerHeight||document.documentElement.clientHeight,t=n.getBoundingClientRect(),u=t.left>=0&&t.left<=i||t.right>=0&&t.right<=i,f=t.top>=0&&t.top<=r||t.bottom>=0&&t.bottom<=r;return u&&f}function i(n,i){function r(){var r=t(n);r!=u&&(u=r,typeof i=="function"&&i(r,n))}var u=t(n);window.addEventListener("load",r);window.addEventListener("resize",r);window.addEventListener("scroll",r)}function r(t,i){function r(){var r=n(t);r!=u&&(u=r,typeof i=="function"&&i(r,t))}var u=n(t);window.addEventListener("load",r);window.addEventListener("resize",r);window.addEventListener("scroll",r)}window.visibilityHelper={isElementTotallyVisible:n,isElementPartiallyVisible:t,inViewportPartially:i,inViewportTotally:r}})();

/* YoutTube API */
isYoutubeAPILoaded = false;

function loadYoutubeAPI() {
  if (isYoutubeAPILoaded) {
    return;
  } else {
    // Load Youtube API script
    var tag = document.createElement('script');
    tag.src = "https://www.youtube.com/iframe_api";
    var firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
  }
}

function onYouTubeIframeAPIReady() {
  isYoutubeAPILoaded = true;
  $('body').trigger('youtubeAPIReady');
}

/**
 * FeaturedVideo Template Script
 * ------------------------------------------------------------------------------
 * A file that contains scripts highly couple code to the FeaturedVideo template.
 *
   * @namespace FeaturedVideo
 */

PaloAlto.FeaturedVideo = (function() {
  var players = [];
  var isYoutubeAPIReady = false;
  var enableSound = false;
  var $playBtn;
  var defaultYoutubeOptions = {
      height: '720',
      width: '1280',
      playerVars: {
        showinfo: 0,
        controls: 0,
        fs: 0,
        rel: 0,
        height: "100%",
        width: "100%",
        iv_load_policy: 3,
        html5: 1,
        loop: 1,
        playsinline: 1,
        modestbranding: 1,
        disablekb: 1,
        wmode: 'opaque'
      },
      events: {
        'onReady': onPlayerReady,
        'onStateChange': onPlayerStateChange
      }
  };

  function FeaturedVideo(container) {
    var $container = this.$container = $(container);
    var $player = $container.find('.video__iframe');

    enableSound = $container.find('.video').data('enable-sound');
    $playBtn = $container.find('.play-button-mobile');

    if ($player.length) {
      this.playerID = $player.attr('id');
      this.videoID = $player.data('video-id');
      this.init();
    }

    $container.on('touchstart', '.video-wrapper', function(e) {
      var playerID = $(this).find('.video__iframe').attr('id');
      players[playerID].playVideo();
    });

    setVideoFullscreenSize();
    $(window).on('resize', setVideoFullscreenSize);

    function setVideoFullscreenSize() {
      var $playerContainer = $container.find('.video');
      var $player = $container.find('.video__iframe');
      var videoAspectRatio = 16/9;
      var containerAspectRatio = $playerContainer.width() / $playerContainer.height();
      var videoWidth;
      var videoHeight;

      if (videoAspectRatio > containerAspectRatio) {
        videoWidth = $playerContainer.height() * videoAspectRatio;
        videoHeight = $playerContainer.height();
      } else {
        videoWidth = $playerContainer.width();
        videoHeight = $playerContainer.width() / videoAspectRatio;
      }

      $player.css({
        'width': videoWidth,
        'height': videoHeight
      });
    };
  }

  function onPlayerReady(event) {
    var id = $(event.target.a).attr('id');
    if ( id ) {
      $(event.target.a).attr('tabindex', '-1');

      if (enableSound) {
        event.target.unMute();
      } else {
        event.target.mute();
      }

      event.target.playVideo();

      $(event.target.a).parent().addClass('loaded');

      checkPlayerVisibility(id);

      $(window).on('scroll.' + id, { id: id }, $.throttle(150, checkPlayerVisibility));
    }

  }

  function onPlayerStateChange(event) {
    // Loop video if state is ended
    if (event.data == 0) {
      event.target.playVideo();
      $playBtn.addClass('visually-hidden');
    } else if (event.data == 1) {
      $playBtn.addClass('visually-hidden');
    }
  }

  function checkPlayerVisibility(id) {
    if ( typeof id === 'string' ) {
      var playerID = id;
    } else if ( id.data != undefined ) {
      var playerID = id.data.id;
    } else {
      return false;
    }
    var playerElement = document.getElementById(playerID + '-container');
    var player = players[playerID];
    var isVisible = visibilityHelper.isElementPartiallyVisible(playerElement) || visibilityHelper.isElementTotallyVisible(playerElement);

    if (isVisible && player && typeof player.playVideo === 'function') {
      player.playVideo();
    } else if (!isVisible && player && typeof player.pauseVideo === 'function') {
      player.pauseVideo();
    }
  }

  FeaturedVideo.prototype = $.extend({}, FeaturedVideo.prototype, {
    init: function() {
      if (isYoutubeAPIReady) {
        this.loadYoutubePlayer();
      } else {
        // Load Youtube API if not loaded yet
        window.loadYoutubeAPI();
        $('body').on('youtubeAPIReady', this.loadYoutubePlayer.bind(this));
      }
    },

    loadYoutubePlayer: function() {
      var currentYoutubeOptions = $.extend({}, defaultYoutubeOptions);
      currentYoutubeOptions.videoId = this.videoID;
      players[this.playerID] = new YT.Player( this.playerID , currentYoutubeOptions );
      isYoutubeAPIReady = true;
    },

    onUnload: function(evt) {
      var playerID = 'video-' + this.$container.data('section-id');
      players[playerID].destroy();
    }
  });

  return FeaturedVideo;
})();

/* ===================================================================================== @preserve =
 ___  _   _    _
/   || | | |  | |
\__  | | | |  | |  __
/    |/  |/_) |/  /  \_/\/
\___/|__/| \_/|__/\__/  /\_/
              |\
              |/
Ajaxinate
version v2.0.11
https://github.com/Elkfox/Ajaxinate
Copyright (c) 2017 Elkfox Co Pty Ltd
https://elkfox.com
MIT License
================================================================================================= */

var Ajaxinate = function ajaxinateConstructor(config) {
  var settings = config || {};
  /*
    pagination: Selector of pagination container
    method: [options are 'scroll', 'click']
    container: Selector of repeating content
    offset: 0, offset the number of pixels before the bottom to start loading more on scroll
    loadingText: 'Loading', The text changed during loading
    callback: null, function to callback after a new page is loaded
  */
  var defaultSettings = {
    pagination: '.AjaxinatePagination',
    method: 'scroll',
    container: '.AjaxinateLoop',
    offset: 0,
    loadingText: 'Loading',
    callback: null
  };
  // Merge configs
  this.settings = Object.assign(defaultSettings, settings);

  // Bind 'this' to applicable prototype functions
  this.addScrollListeners = this.addScrollListeners.bind(this);
  this.addClickListener = this.addClickListener.bind(this);
  this.checkIfPaginationInView = this.checkIfPaginationInView.bind(this);
  this.stopMultipleClicks = this.stopMultipleClicks.bind(this);
  this.destroy = this.destroy.bind(this);

  // Set up our element selectors
  this.containerElement = document.querySelector(this.settings.container);
  this.paginationElement = document.querySelector(this.settings.pagination);

  this.initialize();
};

Ajaxinate.prototype.initialize = function initializeTheCorrectFunctionsBasedOnTheMethod() {
  // Find and initialise the correct function based on the method set in the config
  if (this.containerElement) {
    var initializers = {
      click: this.addClickListener,
      scroll: this.addScrollListeners
    };
    initializers[this.settings.method]();
  }
};

Ajaxinate.prototype.addScrollListeners = function addEventListenersForScrolling() {
  if (this.paginationElement) {
    document.addEventListener('scroll', this.checkIfPaginationInView);
    window.addEventListener('resize', this.checkIfPaginationInView);
    window.addEventListener('orientationchange', this.checkIfPaginationInView);
  }
};

Ajaxinate.prototype.addClickListener = function addEventListenerForClicking() {
  if (this.paginationElement) {
    this.nextPageLinkElement = this.paginationElement.querySelector('a');
    this.clickActive = true;
    if (this.nextPageLinkElement !== null) {
      this.nextPageLinkElement.addEventListener('click', this.stopMultipleClicks);
    }
  }
};

Ajaxinate.prototype.stopMultipleClicks = function handleClickEvent(event) {
  event.preventDefault();
  if (this.clickActive) {
    this.nextPageLinkElement.innerHTML = this.settings.loadingText;
    this.nextPageUrl = this.nextPageLinkElement.href;
    this.clickActive = false;
    this.loadMore();
  }
};

Ajaxinate.prototype.checkIfPaginationInView = function handleScrollEvent() {
  var top = this.paginationElement.getBoundingClientRect().top - this.settings.offset;
  var bottom = this.paginationElement.getBoundingClientRect().bottom + this.settings.offset;
  if (top <= window.innerHeight && bottom >= 0) {
    this.nextPageLinkElement = this.paginationElement.querySelector('a');
    this.removeScrollListener();
    if (this.nextPageLinkElement) {
      this.nextPageLinkElement.innerHTML = this.settings.loadingText;
      this.nextPageUrl = this.nextPageLinkElement.href;
      this.loadMore();
    }
  }
};

Ajaxinate.prototype.loadMore = function getTheHtmlOfTheNextPageWithAnAjaxRequest() {
  this.request = new XMLHttpRequest();
  this.request.onreadystatechange = function success() {
    if (this.request.readyState === 4 && this.request.status === 200) {
      var newContainer = $(this.request.response).find( this.settings.container );
      var newPagination = $(this.request.response).find( this.settings.pagination );
      this.containerElement.insertAdjacentHTML('beforeend', newContainer.html());
      this.paginationElement.innerHTML = newPagination.html();
      if (this.settings.callback && typeof this.settings.callback === 'function') {
        this.settings.callback( this.request.response );
      }
      this.initialize();
    }
  }.bind(this);
  this.request.open('GET', this.nextPageUrl);
  this.request.send();
};

Ajaxinate.prototype.removeClickListener = function removeClickEventListener() {
  this.nextPageLinkElement.addEventListener('click', this.stopMultipleClicks);
};

Ajaxinate.prototype.removeScrollListener = function removeScrollEventListener() {
  document.removeEventListener('scroll', this.checkIfPaginationInView);
  window.removeEventListener('resize', this.checkIfPaginationInView);
  window.removeEventListener('orientationchange', this.checkIfPaginationInView);
};

Ajaxinate.prototype.destroy = function removeEventListenersAndReturnThis() {
  // This method is used to unbind event listeners from the DOM
  // This function is called manually to destroy "this" Ajaxinate instance
  var destroyers = {
    click: this.removeClickListener,
    scroll: this.removeScrollListener
  };
  destroyers[this.settings.method]();
  return this;
};

/*!
 * Flickity PACKAGED v2.1.2
 * Touch, responsive, flickable carousels
 *
 * Licensed GPLv3 for open source use
 * or Flickity Commercial License for commercial use
 *
 * https://flickity.metafizzy.co
 * Copyright 2015-2018 Metafizzy
 */

!function(t,e){"function"==typeof define&&define.amd?define("jquery-bridget/jquery-bridget",["jquery"],function(i){return e(t,i)}):"object"==typeof module&&module.exports?module.exports=e(t,require("jquery")):t.jQueryBridget=e(t,t.jQuery)}(window,function(t,e){"use strict";function i(i,o,a){function l(t,e,n){var s,o="$()."+i+'("'+e+'")';return t.each(function(t,l){var h=a.data(l,i);if(!h)return void r(i+" not initialized. Cannot call methods, i.e. "+o);var c=h[e];if(!c||"_"==e.charAt(0))return void r(o+" is not a valid method");var d=c.apply(h,n);s=void 0===s?d:s}),void 0!==s?s:t}function h(t,e){t.each(function(t,n){var s=a.data(n,i);s?(s.option(e),s._init()):(s=new o(n,e),a.data(n,i,s))})}a=a||e||t.jQuery,a&&(o.prototype.option||(o.prototype.option=function(t){a.isPlainObject(t)&&(this.options=a.extend(!0,this.options,t))}),a.fn[i]=function(t){if("string"==typeof t){var e=s.call(arguments,1);return l(this,t,e)}return h(this,t),this},n(a))}function n(t){!t||t&&t.bridget||(t.bridget=i)}var s=Array.prototype.slice,o=t.console,r="undefined"==typeof o?function(){}:function(t){o.error(t)};return n(e||t.jQuery),i}),function(t,e){"function"==typeof define&&define.amd?define("ev-emitter/ev-emitter",e):"object"==typeof module&&module.exports?module.exports=e():t.EvEmitter=e()}("undefined"!=typeof window?window:this,function(){function t(){}var e=t.prototype;return e.on=function(t,e){if(t&&e){var i=this._events=this._events||{},n=i[t]=i[t]||[];return n.indexOf(e)==-1&&n.push(e),this}},e.once=function(t,e){if(t&&e){this.on(t,e);var i=this._onceEvents=this._onceEvents||{},n=i[t]=i[t]||{};return n[e]=!0,this}},e.off=function(t,e){var i=this._events&&this._events[t];if(i&&i.length){var n=i.indexOf(e);return n!=-1&&i.splice(n,1),this}},e.emitEvent=function(t,e){var i=this._events&&this._events[t];if(i&&i.length){i=i.slice(0),e=e||[];for(var n=this._onceEvents&&this._onceEvents[t],s=0;s<i.length;s++){var o=i[s],r=n&&n[o];r&&(this.off(t,o),delete n[o]),o.apply(this,e)}return this}},e.allOff=function(){delete this._events,delete this._onceEvents},t}),function(t,e){"function"==typeof define&&define.amd?define("get-size/get-size",e):"object"==typeof module&&module.exports?module.exports=e():t.getSize=e()}(window,function(){"use strict";function t(t){var e=parseFloat(t),i=t.indexOf("%")==-1&&!isNaN(e);return i&&e}function e(){}function i(){for(var t={width:0,height:0,innerWidth:0,innerHeight:0,outerWidth:0,outerHeight:0},e=0;e<h;e++){var i=l[e];t[i]=0}return t}function n(t){var e=getComputedStyle(t);return e||a("Style returned "+e+". Are you running this code in a hidden iframe on Firefox? See https://bit.ly/getsizebug1"),e}function s(){if(!c){c=!0;var e=document.createElement("div");e.style.width="200px",e.style.padding="1px 2px 3px 4px",e.style.borderStyle="solid",e.style.borderWidth="1px 2px 3px 4px",e.style.boxSizing="border-box";var i=document.body||document.documentElement;i.appendChild(e);var s=n(e);r=200==Math.round(t(s.width)),o.isBoxSizeOuter=r,i.removeChild(e)}}function o(e){if(s(),"string"==typeof e&&(e=document.querySelector(e)),e&&"object"==typeof e&&e.nodeType){var o=n(e);if("none"==o.display)return i();var a={};a.width=e.offsetWidth,a.height=e.offsetHeight;for(var c=a.isBorderBox="border-box"==o.boxSizing,d=0;d<h;d++){var u=l[d],f=o[u],p=parseFloat(f);a[u]=isNaN(p)?0:p}var g=a.paddingLeft+a.paddingRight,v=a.paddingTop+a.paddingBottom,m=a.marginLeft+a.marginRight,y=a.marginTop+a.marginBottom,b=a.borderLeftWidth+a.borderRightWidth,E=a.borderTopWidth+a.borderBottomWidth,S=c&&r,C=t(o.width);C!==!1&&(a.width=C+(S?0:g+b));var x=t(o.height);return x!==!1&&(a.height=x+(S?0:v+E)),a.innerWidth=a.width-(g+b),a.innerHeight=a.height-(v+E),a.outerWidth=a.width+m,a.outerHeight=a.height+y,a}}var r,a="undefined"==typeof console?e:function(t){console.error(t)},l=["paddingLeft","paddingRight","paddingTop","paddingBottom","marginLeft","marginRight","marginTop","marginBottom","borderLeftWidth","borderRightWidth","borderTopWidth","borderBottomWidth"],h=l.length,c=!1;return o}),function(t,e){"use strict";"function"==typeof define&&define.amd?define("desandro-matches-selector/matches-selector",e):"object"==typeof module&&module.exports?module.exports=e():t.matchesSelector=e()}(window,function(){"use strict";var t=function(){var t=window.Element.prototype;if(t.matches)return"matches";if(t.matchesSelector)return"matchesSelector";for(var e=["webkit","moz","ms","o"],i=0;i<e.length;i++){var n=e[i],s=n+"MatchesSelector";if(t[s])return s}}();return function(e,i){return e[t](i)}}),function(t,e){"function"==typeof define&&define.amd?define("fizzy-ui-utils/utils",["desandro-matches-selector/matches-selector"],function(i){return e(t,i)}):"object"==typeof module&&module.exports?module.exports=e(t,require("desandro-matches-selector")):t.fizzyUIUtils=e(t,t.matchesSelector)}(window,function(t,e){var i={};i.extend=function(t,e){for(var i in e)t[i]=e[i];return t},i.modulo=function(t,e){return(t%e+e)%e};var n=Array.prototype.slice;i.makeArray=function(t){if(Array.isArray(t))return t;if(null===t||void 0===t)return[];var e="object"==typeof t&&"number"==typeof t.length;return e?n.call(t):[t]},i.removeFrom=function(t,e){var i=t.indexOf(e);i!=-1&&t.splice(i,1)},i.getParent=function(t,i){for(;t.parentNode&&t!=document.body;)if(t=t.parentNode,e(t,i))return t},i.getQueryElement=function(t){return"string"==typeof t?document.querySelector(t):t},i.handleEvent=function(t){var e="on"+t.type;this[e]&&this[e](t)},i.filterFindElements=function(t,n){t=i.makeArray(t);var s=[];return t.forEach(function(t){if(t instanceof HTMLElement){if(!n)return void s.push(t);e(t,n)&&s.push(t);for(var i=t.querySelectorAll(n),o=0;o<i.length;o++)s.push(i[o])}}),s},i.debounceMethod=function(t,e,i){i=i||100;var n=t.prototype[e],s=e+"Timeout";t.prototype[e]=function(){var t=this[s];clearTimeout(t);var e=arguments,o=this;this[s]=setTimeout(function(){n.apply(o,e),delete o[s]},i)}},i.docReady=function(t){var e=document.readyState;"complete"==e||"interactive"==e?setTimeout(t):document.addEventListener("DOMContentLoaded",t)},i.toDashed=function(t){return t.replace(/(.)([A-Z])/g,function(t,e,i){return e+"-"+i}).toLowerCase()};var s=t.console;return i.htmlInit=function(e,n){i.docReady(function(){var o=i.toDashed(n),r="data-"+o,a=document.querySelectorAll("["+r+"]"),l=document.querySelectorAll(".js-"+o),h=i.makeArray(a).concat(i.makeArray(l)),c=r+"-options",d=t.jQuery;h.forEach(function(t){var i,o=t.getAttribute(r)||t.getAttribute(c);try{i=o&&JSON.parse(o)}catch(a){return void(s&&s.error("Error parsing "+r+" on "+t.className+": "+a))}var l=new e(t,i);d&&d.data(t,n,l)})})},i}),function(t,e){"function"==typeof define&&define.amd?define("flickity/js/cell",["get-size/get-size"],function(i){return e(t,i)}):"object"==typeof module&&module.exports?module.exports=e(t,require("get-size")):(t.Flickity=t.Flickity||{},t.Flickity.Cell=e(t,t.getSize))}(window,function(t,e){function i(t,e){this.element=t,this.parent=e,this.create()}var n=i.prototype;return n.create=function(){this.element.style.position="absolute",this.element.setAttribute("aria-selected","false"),this.x=0,this.shift=0},n.destroy=function(){this.element.style.position="";var t=this.parent.originSide;this.element.removeAttribute("aria-selected"),this.element.style[t]=""},n.getSize=function(){this.size=e(this.element)},n.setPosition=function(t){this.x=t,this.updateTarget(),this.renderPosition(t)},n.updateTarget=n.setDefaultTarget=function(){var t="left"==this.parent.originSide?"marginLeft":"marginRight";this.target=this.x+this.size[t]+this.size.width*this.parent.cellAlign},n.renderPosition=function(t){var e=this.parent.originSide;this.element.style[e]=this.parent.getPositionValue(t)},n.wrapShift=function(t){this.shift=t,this.renderPosition(this.x+this.parent.slideableWidth*t)},n.remove=function(){this.element.parentNode.removeChild(this.element)},i}),function(t,e){"function"==typeof define&&define.amd?define("flickity/js/slide",e):"object"==typeof module&&module.exports?module.exports=e():(t.Flickity=t.Flickity||{},t.Flickity.Slide=e())}(window,function(){"use strict";function t(t){this.parent=t,this.isOriginLeft="left"==t.originSide,this.cells=[],this.outerWidth=0,this.height=0}var e=t.prototype;return e.addCell=function(t){if(this.cells.push(t),this.outerWidth+=t.size.outerWidth,this.height=Math.max(t.size.outerHeight,this.height),1==this.cells.length){this.x=t.x;var e=this.isOriginLeft?"marginLeft":"marginRight";this.firstMargin=t.size[e]}},e.updateTarget=function(){var t=this.isOriginLeft?"marginRight":"marginLeft",e=this.getLastCell(),i=e?e.size[t]:0,n=this.outerWidth-(this.firstMargin+i);this.target=this.x+this.firstMargin+n*this.parent.cellAlign},e.getLastCell=function(){return this.cells[this.cells.length-1]},e.select=function(){this.changeSelected(!0)},e.unselect=function(){this.changeSelected(!1)},e.changeSelected=function(t){var e=t?"add":"remove";this.cells.forEach(function(i){i.element.classList[e]("is-selected"),i.element.setAttribute("aria-selected",t.toString())})},e.getCellElements=function(){return this.cells.map(function(t){return t.element})},t}),function(t,e){"function"==typeof define&&define.amd?define("flickity/js/animate",["fizzy-ui-utils/utils"],function(i){return e(t,i)}):"object"==typeof module&&module.exports?module.exports=e(t,require("fizzy-ui-utils")):(t.Flickity=t.Flickity||{},t.Flickity.animatePrototype=e(t,t.fizzyUIUtils))}(window,function(t,e){var i={};return i.startAnimation=function(){this.isAnimating||(this.isAnimating=!0,this.restingFrames=0,this.animate())},i.animate=function(){this.applyDragForce(),this.applySelectedAttraction();var t=this.x;if(this.integratePhysics(),this.positionSlider(),this.settle(t),this.isAnimating){var e=this;requestAnimationFrame(function(){e.animate()})}},i.positionSlider=function(){var t=this.x;this.options.wrapAround&&this.cells.length>1&&(t=e.modulo(t,this.slideableWidth),t-=this.slideableWidth,this.shiftWrapCells(t)),t+=this.cursorPosition,t=this.options.rightToLeft?-t:t;var i=this.getPositionValue(t);this.slider.style.transform=this.isAnimating?"translate3d("+i+",0,0)":"translateX("+i+")";var n=this.slides[0];if(n){var s=-this.x-n.target,o=s/this.slidesWidth;this.dispatchEvent("scroll",null,[o,s])}},i.positionSliderAtSelected=function(){this.cells.length&&(this.x=-this.selectedSlide.target,this.velocity=0,this.positionSlider())},i.getPositionValue=function(t){return this.options.percentPosition?.01*Math.round(t/this.size.innerWidth*1e4)+"%":Math.round(t)+"px"},i.settle=function(t){this.isPointerDown||Math.round(100*this.x)!=Math.round(100*t)||this.restingFrames++,this.restingFrames>2&&(this.isAnimating=!1,delete this.isFreeScrolling,this.positionSlider(),this.dispatchEvent("settle",null,[this.selectedIndex]))},i.shiftWrapCells=function(t){var e=this.cursorPosition+t;this._shiftCells(this.beforeShiftCells,e,-1);var i=this.size.innerWidth-(t+this.slideableWidth+this.cursorPosition);this._shiftCells(this.afterShiftCells,i,1)},i._shiftCells=function(t,e,i){for(var n=0;n<t.length;n++){var s=t[n],o=e>0?i:0;s.wrapShift(o),e-=s.size.outerWidth}},i._unshiftCells=function(t){if(t&&t.length)for(var e=0;e<t.length;e++)t[e].wrapShift(0)},i.integratePhysics=function(){this.x+=this.velocity,this.velocity*=this.getFrictionFactor()},i.applyForce=function(t){this.velocity+=t},i.getFrictionFactor=function(){return 1-this.options[this.isFreeScrolling?"freeScrollFriction":"friction"]},i.getRestingPosition=function(){return this.x+this.velocity/(1-this.getFrictionFactor())},i.applyDragForce=function(){if(this.isDraggable&&this.isPointerDown){var t=this.dragX-this.x,e=t-this.velocity;this.applyForce(e)}},i.applySelectedAttraction=function(){var t=this.isDraggable&&this.isPointerDown;if(!t&&!this.isFreeScrolling&&this.slides.length){var e=this.selectedSlide.target*-1-this.x,i=e*this.options.selectedAttraction;this.applyForce(i)}},i}),function(t,e){if("function"==typeof define&&define.amd)define("flickity/js/flickity",["ev-emitter/ev-emitter","get-size/get-size","fizzy-ui-utils/utils","./cell","./slide","./animate"],function(i,n,s,o,r,a){return e(t,i,n,s,o,r,a)});else if("object"==typeof module&&module.exports)module.exports=e(t,require("ev-emitter"),require("get-size"),require("fizzy-ui-utils"),require("./cell"),require("./slide"),require("./animate"));else{var i=t.Flickity;t.Flickity=e(t,t.EvEmitter,t.getSize,t.fizzyUIUtils,i.Cell,i.Slide,i.animatePrototype)}}(window,function(t,e,i,n,s,o,r){function a(t,e){for(t=n.makeArray(t);t.length;)e.appendChild(t.shift())}function l(t,e){var i=n.getQueryElement(t);if(!i)return void(d&&d.error("Bad element for Flickity: "+(i||t)));if(this.element=i,this.element.flickityGUID){var s=f[this.element.flickityGUID];return s.option(e),s}h&&(this.$element=h(this.element)),this.options=n.extend({},this.constructor.defaults),this.option(e),this._create()}var h=t.jQuery,c=t.getComputedStyle,d=t.console,u=0,f={};l.defaults={accessibility:!0,cellAlign:"center",freeScrollFriction:.075,friction:.28,namespaceJQueryEvents:!0,percentPosition:!0,resize:!0,selectedAttraction:.025,setGallerySize:!0},l.createMethods=[];var p=l.prototype;n.extend(p,e.prototype),p._create=function(){var e=this.guid=++u;this.element.flickityGUID=e,f[e]=this,this.selectedIndex=0,this.restingFrames=0,this.x=0,this.velocity=0,this.originSide=this.options.rightToLeft?"right":"left",this.viewport=document.createElement("div"),this.viewport.className="flickity-viewport",this._createSlider(),(this.options.resize||this.options.watchCSS)&&t.addEventListener("resize",this);for(var i in this.options.on){var n=this.options.on[i];this.on(i,n)}l.createMethods.forEach(function(t){this[t]()},this),this.options.watchCSS?this.watchCSS():this.activate()},p.option=function(t){n.extend(this.options,t)},p.activate=function(){if(!this.isActive){this.isActive=!0,this.element.classList.add("flickity-enabled"),this.options.rightToLeft&&this.element.classList.add("flickity-rtl"),this.getSize();var t=this._filterFindCellElements(this.element.children);a(t,this.slider),this.viewport.appendChild(this.slider),this.element.appendChild(this.viewport),this.reloadCells(),this.options.accessibility&&(this.element.tabIndex=0,this.element.addEventListener("keydown",this)),this.emitEvent("activate");var e,i=this.options.initialIndex;e=this.isInitActivated?this.selectedIndex:void 0!==i&&this.cells[i]?i:0,this.select(e,!1,!0),this.isInitActivated=!0,this.dispatchEvent("ready")}},p._createSlider=function(){var t=document.createElement("div");t.className="flickity-slider",t.style[this.originSide]=0,this.slider=t},p._filterFindCellElements=function(t){return n.filterFindElements(t,this.options.cellSelector)},p.reloadCells=function(){this.cells=this._makeCells(this.slider.children),this.positionCells(),this._getWrapShiftCells(),this.setGallerySize()},p._makeCells=function(t){var e=this._filterFindCellElements(t),i=e.map(function(t){return new s(t,this)},this);return i},p.getLastCell=function(){return this.cells[this.cells.length-1]},p.getLastSlide=function(){return this.slides[this.slides.length-1]},p.positionCells=function(){this._sizeCells(this.cells),this._positionCells(0)},p._positionCells=function(t){t=t||0,this.maxCellHeight=t?this.maxCellHeight||0:0;var e=0;if(t>0){var i=this.cells[t-1];e=i.x+i.size.outerWidth}for(var n=this.cells.length,s=t;s<n;s++){var o=this.cells[s];o.setPosition(e),e+=o.size.outerWidth,this.maxCellHeight=Math.max(o.size.outerHeight,this.maxCellHeight)}this.slideableWidth=e,this.updateSlides(),this._containSlides(),this.slidesWidth=n?this.getLastSlide().target-this.slides[0].target:0},p._sizeCells=function(t){t.forEach(function(t){t.getSize()})},p.updateSlides=function(){if(this.slides=[],this.cells.length){var t=new o(this);this.slides.push(t);var e="left"==this.originSide,i=e?"marginRight":"marginLeft",n=this._getCanCellFit();this.cells.forEach(function(e,s){if(!t.cells.length)return void t.addCell(e);var r=t.outerWidth-t.firstMargin+(e.size.outerWidth-e.size[i]);n.call(this,s,r)?t.addCell(e):(t.updateTarget(),t=new o(this),this.slides.push(t),t.addCell(e))},this),t.updateTarget(),this.updateSelectedSlide()}},p._getCanCellFit=function(){var t=this.options.groupCells;if(!t)return function(){return!1};if("number"==typeof t){var e=parseInt(t,10);return function(t){return t%e!==0}}var i="string"==typeof t&&t.match(/^(\d+)%$/),n=i?parseInt(i[1],10)/100:1;return function(t,e){return e<=(this.size.innerWidth+1)*n}},p._init=p.reposition=function(){this.positionCells(),this.positionSliderAtSelected()},p.getSize=function(){this.size=i(this.element),this.setCellAlign(),this.cursorPosition=this.size.innerWidth*this.cellAlign};var g={center:{left:.5,right:.5},left:{left:0,right:1},right:{right:0,left:1}};return p.setCellAlign=function(){var t=g[this.options.cellAlign];this.cellAlign=t?t[this.originSide]:this.options.cellAlign},p.setGallerySize=function(){if(this.options.setGallerySize){var t=this.options.adaptiveHeight&&this.selectedSlide?this.selectedSlide.height:this.maxCellHeight;this.viewport.style.height=t+"px"}},p._getWrapShiftCells=function(){if(this.options.wrapAround){this._unshiftCells(this.beforeShiftCells),this._unshiftCells(this.afterShiftCells);var t=this.cursorPosition,e=this.cells.length-1;this.beforeShiftCells=this._getGapCells(t,e,-1),t=this.size.innerWidth-this.cursorPosition,this.afterShiftCells=this._getGapCells(t,0,1)}},p._getGapCells=function(t,e,i){for(var n=[];t>0;){var s=this.cells[e];if(!s)break;n.push(s),e+=i,t-=s.size.outerWidth}return n},p._containSlides=function(){if(this.options.contain&&!this.options.wrapAround&&this.cells.length){var t=this.options.rightToLeft,e=t?"marginRight":"marginLeft",i=t?"marginLeft":"marginRight",n=this.slideableWidth-this.getLastCell().size[i],s=n<this.size.innerWidth,o=this.cursorPosition+this.cells[0].size[e],r=n-this.size.innerWidth*(1-this.cellAlign);this.slides.forEach(function(t){s?t.target=n*this.cellAlign:(t.target=Math.max(t.target,o),t.target=Math.min(t.target,r))},this)}},p.dispatchEvent=function(t,e,i){var n=e?[e].concat(i):i;if(this.emitEvent(t,n),h&&this.$element){t+=this.options.namespaceJQueryEvents?".flickity":"";var s=t;if(e){var o=h.Event(e);o.type=t,s=o}this.$element.trigger(s,i)}},p.select=function(t,e,i){if(this.isActive&&(t=parseInt(t,10),this._wrapSelect(t),(this.options.wrapAround||e)&&(t=n.modulo(t,this.slides.length)),this.slides[t])){var s=this.selectedIndex;this.selectedIndex=t,this.updateSelectedSlide(),i?this.positionSliderAtSelected():this.startAnimation(),this.options.adaptiveHeight&&this.setGallerySize(),this.dispatchEvent("select",null,[t]),t!=s&&this.dispatchEvent("change",null,[t]),this.dispatchEvent("cellSelect")}},p._wrapSelect=function(t){var e=this.slides.length,i=this.options.wrapAround&&e>1;if(!i)return t;var s=n.modulo(t,e),o=Math.abs(s-this.selectedIndex),r=Math.abs(s+e-this.selectedIndex),a=Math.abs(s-e-this.selectedIndex);!this.isDragSelect&&r<o?t+=e:!this.isDragSelect&&a<o&&(t-=e),t<0?this.x-=this.slideableWidth:t>=e&&(this.x+=this.slideableWidth)},p.previous=function(t,e){this.select(this.selectedIndex-1,t,e)},p.next=function(t,e){this.select(this.selectedIndex+1,t,e)},p.updateSelectedSlide=function(){var t=this.slides[this.selectedIndex];t&&(this.unselectSelectedSlide(),this.selectedSlide=t,t.select(),this.selectedCells=t.cells,this.selectedElements=t.getCellElements(),this.selectedCell=t.cells[0],this.selectedElement=this.selectedElements[0])},p.unselectSelectedSlide=function(){this.selectedSlide&&this.selectedSlide.unselect()},p.selectCell=function(t,e,i){var n=this.queryCell(t);if(n){var s=this.getCellSlideIndex(n);this.select(s,e,i)}},p.getCellSlideIndex=function(t){for(var e=0;e<this.slides.length;e++){var i=this.slides[e],n=i.cells.indexOf(t);if(n!=-1)return e}},p.getCell=function(t){for(var e=0;e<this.cells.length;e++){var i=this.cells[e];if(i.element==t)return i}},p.getCells=function(t){t=n.makeArray(t);var e=[];return t.forEach(function(t){var i=this.getCell(t);i&&e.push(i)},this),e},p.getCellElements=function(){return this.cells.map(function(t){return t.element})},p.getParentCell=function(t){var e=this.getCell(t);return e?e:(t=n.getParent(t,".flickity-slider > *"),this.getCell(t))},p.getAdjacentCellElements=function(t,e){if(!t)return this.selectedSlide.getCellElements();e=void 0===e?this.selectedIndex:e;var i=this.slides.length;if(1+2*t>=i)return this.getCellElements();for(var s=[],o=e-t;o<=e+t;o++){var r=this.options.wrapAround?n.modulo(o,i):o,a=this.slides[r];a&&(s=s.concat(a.getCellElements()))}return s},p.queryCell=function(t){return"number"==typeof t?this.cells[t]:("string"==typeof t&&(t=this.element.querySelector(t)),this.getCell(t))},p.uiChange=function(){this.emitEvent("uiChange")},p.childUIPointerDown=function(t){this.emitEvent("childUIPointerDown",[t])},p.onresize=function(){this.watchCSS(),this.resize()},n.debounceMethod(l,"onresize",150),p.resize=function(){if(this.isActive){this.getSize(),this.options.wrapAround&&(this.x=n.modulo(this.x,this.slideableWidth)),this.positionCells(),this._getWrapShiftCells(),this.setGallerySize(),this.emitEvent("resize");var t=this.selectedElements&&this.selectedElements[0];this.selectCell(t,!1,!0)}},p.watchCSS=function(){var t=this.options.watchCSS;if(t){var e=c(this.element,":after").content;e.indexOf("flickity")!=-1?this.activate():this.deactivate()}},p.onkeydown=function(t){var e=document.activeElement&&document.activeElement!=this.element;if(this.options.accessibility&&!e){var i=l.keyboardHandlers[t.keyCode];i&&i.call(this)}},l.keyboardHandlers={37:function(){var t=this.options.rightToLeft?"next":"previous";this.uiChange(),this[t]()},39:function(){var t=this.options.rightToLeft?"previous":"next";this.uiChange(),this[t]()}},p.focus=function(){var e=t.pageYOffset;this.element.focus({preventScroll:!0}),t.pageYOffset!=e&&t.scrollTo(t.pageXOffset,e)},p.deactivate=function(){this.isActive&&(this.element.classList.remove("flickity-enabled"),this.element.classList.remove("flickity-rtl"),this.unselectSelectedSlide(),this.cells.forEach(function(t){t.destroy()}),this.element.removeChild(this.viewport),a(this.slider.children,this.element),this.options.accessibility&&(this.element.removeAttribute("tabIndex"),this.element.removeEventListener("keydown",this)),this.isActive=!1,this.emitEvent("deactivate"))},p.destroy=function(){this.deactivate(),t.removeEventListener("resize",this),this.emitEvent("destroy"),h&&this.$element&&h.removeData(this.element,"flickity"),delete this.element.flickityGUID,delete f[this.guid]},n.extend(p,r),l.data=function(t){t=n.getQueryElement(t);var e=t&&t.flickityGUID;return e&&f[e]},n.htmlInit(l,"flickity"),h&&h.bridget&&h.bridget("flickity",l),l.setJQuery=function(t){h=t},l.Cell=s,l}),function(t,e){"function"==typeof define&&define.amd?define("unipointer/unipointer",["ev-emitter/ev-emitter"],function(i){return e(t,i)}):"object"==typeof module&&module.exports?module.exports=e(t,require("ev-emitter")):t.Unipointer=e(t,t.EvEmitter)}(window,function(t,e){function i(){}function n(){}var s=n.prototype=Object.create(e.prototype);s.bindStartEvent=function(t){this._bindStartEvent(t,!0)},s.unbindStartEvent=function(t){this._bindStartEvent(t,!1)},s._bindStartEvent=function(e,i){i=void 0===i||i;var n=i?"addEventListener":"removeEventListener",s="mousedown";t.PointerEvent?s="pointerdown":"ontouchstart"in t&&(s="touchstart"),e[n](s,this)},s.handleEvent=function(t){var e="on"+t.type;this[e]&&this[e](t)},s.getTouch=function(t){for(var e=0;e<t.length;e++){var i=t[e];if(i.identifier==this.pointerIdentifier)return i}},s.onmousedown=function(t){var e=t.button;e&&0!==e&&1!==e||this._pointerDown(t,t)},s.ontouchstart=function(t){this._pointerDown(t,t.changedTouches[0])},s.onpointerdown=function(t){this._pointerDown(t,t)},s._pointerDown=function(t,e){t.button||this.isPointerDown||(this.isPointerDown=!0,this.pointerIdentifier=void 0!==e.pointerId?e.pointerId:e.identifier,this.pointerDown(t,e))},s.pointerDown=function(t,e){this._bindPostStartEvents(t),this.emitEvent("pointerDown",[t,e])};var o={mousedown:["mousemove","mouseup"],touchstart:["touchmove","touchend","touchcancel"],pointerdown:["pointermove","pointerup","pointercancel"]};return s._bindPostStartEvents=function(e){if(e){var i=o[e.type];i.forEach(function(e){t.addEventListener(e,this)},this),this._boundPointerEvents=i}},s._unbindPostStartEvents=function(){this._boundPointerEvents&&(this._boundPointerEvents.forEach(function(e){t.removeEventListener(e,this)},this),delete this._boundPointerEvents)},s.onmousemove=function(t){this._pointerMove(t,t)},s.onpointermove=function(t){t.pointerId==this.pointerIdentifier&&this._pointerMove(t,t)},s.ontouchmove=function(t){var e=this.getTouch(t.changedTouches);e&&this._pointerMove(t,e)},s._pointerMove=function(t,e){this.pointerMove(t,e)},s.pointerMove=function(t,e){this.emitEvent("pointerMove",[t,e])},s.onmouseup=function(t){this._pointerUp(t,t)},s.onpointerup=function(t){t.pointerId==this.pointerIdentifier&&this._pointerUp(t,t)},s.ontouchend=function(t){var e=this.getTouch(t.changedTouches);e&&this._pointerUp(t,e)},s._pointerUp=function(t,e){this._pointerDone(),this.pointerUp(t,e)},s.pointerUp=function(t,e){this.emitEvent("pointerUp",[t,e])},s._pointerDone=function(){this._pointerReset(),this._unbindPostStartEvents(),this.pointerDone()},s._pointerReset=function(){this.isPointerDown=!1,delete this.pointerIdentifier},s.pointerDone=i,s.onpointercancel=function(t){t.pointerId==this.pointerIdentifier&&this._pointerCancel(t,t)},s.ontouchcancel=function(t){var e=this.getTouch(t.changedTouches);e&&this._pointerCancel(t,e)},s._pointerCancel=function(t,e){this._pointerDone(),this.pointerCancel(t,e)},s.pointerCancel=function(t,e){this.emitEvent("pointerCancel",[t,e])},n.getPointerPoint=function(t){return{x:t.pageX,y:t.pageY}},n}),function(t,e){"function"==typeof define&&define.amd?define("unidragger/unidragger",["unipointer/unipointer"],function(i){return e(t,i)}):"object"==typeof module&&module.exports?module.exports=e(t,require("unipointer")):t.Unidragger=e(t,t.Unipointer)}(window,function(t,e){function i(){}var n=i.prototype=Object.create(e.prototype);n.bindHandles=function(){this._bindHandles(!0)},n.unbindHandles=function(){this._bindHandles(!1)},n._bindHandles=function(e){e=void 0===e||e;for(var i=e?"addEventListener":"removeEventListener",n=e?this._touchActionValue:"",s=0;s<this.handles.length;s++){var o=this.handles[s];this._bindStartEvent(o,e),o[i]("click",this),t.PointerEvent&&(o.style.touchAction=n)}},n._touchActionValue="none",n.pointerDown=function(t,e){var i=this.okayPointerDown(t);i&&(this.pointerDownPointer=e,t.preventDefault(),this.pointerDownBlur(),this._bindPostStartEvents(t),this.emitEvent("pointerDown",[t,e]))};var s={TEXTAREA:!0,INPUT:!0,SELECT:!0,OPTION:!0},o={radio:!0,checkbox:!0,button:!0,submit:!0,image:!0,file:!0};return n.okayPointerDown=function(t){var e=s[t.target.nodeName],i=o[t.target.type],n=!e||i;return n||this._pointerReset(),n},n.pointerDownBlur=function(){var t=document.activeElement,e=t&&t.blur&&t!=document.body;e&&t.blur()},n.pointerMove=function(t,e){var i=this._dragPointerMove(t,e);this.emitEvent("pointerMove",[t,e,i]),this._dragMove(t,e,i)},n._dragPointerMove=function(t,e){var i={x:e.pageX-this.pointerDownPointer.pageX,y:e.pageY-this.pointerDownPointer.pageY};return!this.isDragging&&this.hasDragStarted(i)&&this._dragStart(t,e),i},n.hasDragStarted=function(t){return Math.abs(t.x)>3||Math.abs(t.y)>3},n.pointerUp=function(t,e){this.emitEvent("pointerUp",[t,e]),this._dragPointerUp(t,e)},n._dragPointerUp=function(t,e){this.isDragging?this._dragEnd(t,e):this._staticClick(t,e)},n._dragStart=function(t,e){this.isDragging=!0,this.isPreventingClicks=!0,this.dragStart(t,e)},n.dragStart=function(t,e){this.emitEvent("dragStart",[t,e])},n._dragMove=function(t,e,i){this.isDragging&&this.dragMove(t,e,i)},n.dragMove=function(t,e,i){t.preventDefault(),this.emitEvent("dragMove",[t,e,i])},n._dragEnd=function(t,e){this.isDragging=!1,setTimeout(function(){delete this.isPreventingClicks}.bind(this)),this.dragEnd(t,e)},n.dragEnd=function(t,e){this.emitEvent("dragEnd",[t,e])},n.onclick=function(t){this.isPreventingClicks&&t.preventDefault()},n._staticClick=function(t,e){this.isIgnoringMouseUp&&"mouseup"==t.type||(this.staticClick(t,e),"mouseup"!=t.type&&(this.isIgnoringMouseUp=!0,setTimeout(function(){delete this.isIgnoringMouseUp}.bind(this),400)))},n.staticClick=function(t,e){this.emitEvent("staticClick",[t,e])},i.getPointerPoint=e.getPointerPoint,i}),function(t,e){"function"==typeof define&&define.amd?define("flickity/js/drag",["./flickity","unidragger/unidragger","fizzy-ui-utils/utils"],function(i,n,s){return e(t,i,n,s)}):"object"==typeof module&&module.exports?module.exports=e(t,require("./flickity"),require("unidragger"),require("fizzy-ui-utils")):t.Flickity=e(t,t.Flickity,t.Unidragger,t.fizzyUIUtils)}(window,function(t,e,i,n){function s(){return{x:t.pageXOffset,y:t.pageYOffset}}n.extend(e.defaults,{draggable:">1",dragThreshold:3}),e.createMethods.push("_createDrag");var o=e.prototype;n.extend(o,i.prototype),o._touchActionValue="pan-y";var r="createTouch"in document,a=!1;o._createDrag=function(){this.on("activate",this.onActivateDrag),this.on("uiChange",this._uiChangeDrag),this.on("childUIPointerDown",this._childUIPointerDownDrag),this.on("deactivate",this.onDeactivateDrag),this.on("cellChange",this.updateDraggable),r&&!a&&(t.addEventListener("touchmove",function(){}),a=!0)},o.onActivateDrag=function(){this.handles=[this.viewport],this.bindHandles(),this.updateDraggable()},o.onDeactivateDrag=function(){this.unbindHandles(),this.element.classList.remove("is-draggable")},o.updateDraggable=function(){">1"==this.options.draggable?this.isDraggable=this.slides.length>1:this.isDraggable=this.options.draggable,this.isDraggable?this.element.classList.add("is-draggable"):this.element.classList.remove("is-draggable")},o.bindDrag=function(){this.options.draggable=!0,this.updateDraggable()},o.unbindDrag=function(){this.options.draggable=!1,this.updateDraggable()},o._uiChangeDrag=function(){delete this.isFreeScrolling},o._childUIPointerDownDrag=function(t){t.preventDefault(),this.pointerDownFocus(t)},o.pointerDown=function(e,i){if(!this.isDraggable)return void this._pointerDownDefault(e,i);var n=this.okayPointerDown(e);n&&(this._pointerDownPreventDefault(e),this.pointerDownFocus(e),document.activeElement!=this.element&&this.pointerDownBlur(),this.dragX=this.x,this.viewport.classList.add("is-pointer-down"),this.pointerDownScroll=s(),t.addEventListener("scroll",this),this._pointerDownDefault(e,i))},o._pointerDownDefault=function(t,e){this.pointerDownPointer=e,this._bindPostStartEvents(t),this.dispatchEvent("pointerDown",t,[e])};var l={INPUT:!0,TEXTAREA:!0,SELECT:!0};return o.pointerDownFocus=function(t){var e=l[t.target.nodeName];e||this.focus()},o._pointerDownPreventDefault=function(t){var e="touchstart"==t.type,i="touch"==t.pointerType,n=l[t.target.nodeName];e||i||n||t.preventDefault()},o.hasDragStarted=function(t){return Math.abs(t.x)>this.options.dragThreshold},o.pointerUp=function(t,e){delete this.isTouchScrolling,this.viewport.classList.remove("is-pointer-down"),this.dispatchEvent("pointerUp",t,[e]),this._dragPointerUp(t,e)},o.pointerDone=function(){t.removeEventListener("scroll",this),delete this.pointerDownScroll},o.dragStart=function(e,i){this.isDraggable&&(this.dragStartPosition=this.x,this.startAnimation(),t.removeEventListener("scroll",this),this.dispatchEvent("dragStart",e,[i]))},o.pointerMove=function(t,e){var i=this._dragPointerMove(t,e);this.dispatchEvent("pointerMove",t,[e,i]),this._dragMove(t,e,i)},o.dragMove=function(t,e,i){if(this.isDraggable){t.preventDefault(),this.previousDragX=this.dragX;var n=this.options.rightToLeft?-1:1;this.options.wrapAround&&(i.x=i.x%this.slideableWidth);var s=this.dragStartPosition+i.x*n;if(!this.options.wrapAround&&this.slides.length){var o=Math.max(-this.slides[0].target,this.dragStartPosition);s=s>o?.5*(s+o):s;var r=Math.min(-this.getLastSlide().target,this.dragStartPosition);s=s<r?.5*(s+r):s}this.dragX=s,this.dragMoveTime=new Date,
this.dispatchEvent("dragMove",t,[e,i])}},o.dragEnd=function(t,e){if(this.isDraggable){this.options.freeScroll&&(this.isFreeScrolling=!0);var i=this.dragEndRestingSelect();if(this.options.freeScroll&&!this.options.wrapAround){var n=this.getRestingPosition();this.isFreeScrolling=-n>this.slides[0].target&&-n<this.getLastSlide().target}else this.options.freeScroll||i!=this.selectedIndex||(i+=this.dragEndBoostSelect());delete this.previousDragX,this.isDragSelect=this.options.wrapAround,this.select(i),delete this.isDragSelect,this.dispatchEvent("dragEnd",t,[e])}},o.dragEndRestingSelect=function(){var t=this.getRestingPosition(),e=Math.abs(this.getSlideDistance(-t,this.selectedIndex)),i=this._getClosestResting(t,e,1),n=this._getClosestResting(t,e,-1),s=i.distance<n.distance?i.index:n.index;return s},o._getClosestResting=function(t,e,i){for(var n=this.selectedIndex,s=1/0,o=this.options.contain&&!this.options.wrapAround?function(t,e){return t<=e}:function(t,e){return t<e};o(e,s)&&(n+=i,s=e,e=this.getSlideDistance(-t,n),null!==e);)e=Math.abs(e);return{distance:s,index:n-i}},o.getSlideDistance=function(t,e){var i=this.slides.length,s=this.options.wrapAround&&i>1,o=s?n.modulo(e,i):e,r=this.slides[o];if(!r)return null;var a=s?this.slideableWidth*Math.floor(e/i):0;return t-(r.target+a)},o.dragEndBoostSelect=function(){if(void 0===this.previousDragX||!this.dragMoveTime||new Date-this.dragMoveTime>100)return 0;var t=this.getSlideDistance(-this.dragX,this.selectedIndex),e=this.previousDragX-this.dragX;return t>0&&e>0?1:t<0&&e<0?-1:0},o.staticClick=function(t,e){var i=this.getParentCell(t.target),n=i&&i.element,s=i&&this.cells.indexOf(i);this.dispatchEvent("staticClick",t,[e,n,s])},o.onscroll=function(){var t=s(),e=this.pointerDownScroll.x-t.x,i=this.pointerDownScroll.y-t.y;(Math.abs(e)>3||Math.abs(i)>3)&&this._pointerDone()},e}),function(t,e){"function"==typeof define&&define.amd?define("tap-listener/tap-listener",["unipointer/unipointer"],function(i){return e(t,i)}):"object"==typeof module&&module.exports?module.exports=e(t,require("unipointer")):t.TapListener=e(t,t.Unipointer)}(window,function(t,e){function i(t){this.bindTap(t)}var n=i.prototype=Object.create(e.prototype);return n.bindTap=function(t){t&&(this.unbindTap(),this.tapElement=t,this._bindStartEvent(t,!0))},n.unbindTap=function(){this.tapElement&&(this._bindStartEvent(this.tapElement,!0),delete this.tapElement)},n.pointerUp=function(i,n){if(!this.isIgnoringMouseUp||"mouseup"!=i.type){var s=e.getPointerPoint(n),o=this.tapElement.getBoundingClientRect(),r=t.pageXOffset,a=t.pageYOffset,l=s.x>=o.left+r&&s.x<=o.right+r&&s.y>=o.top+a&&s.y<=o.bottom+a;if(l&&this.emitEvent("tap",[i,n]),"mouseup"!=i.type){this.isIgnoringMouseUp=!0;var h=this;setTimeout(function(){delete h.isIgnoringMouseUp},400)}}},n.destroy=function(){this.pointerDone(),this.unbindTap()},i}),function(t,e){"function"==typeof define&&define.amd?define("flickity/js/prev-next-button",["./flickity","tap-listener/tap-listener","fizzy-ui-utils/utils"],function(i,n,s){return e(t,i,n,s)}):"object"==typeof module&&module.exports?module.exports=e(t,require("./flickity"),require("tap-listener"),require("fizzy-ui-utils")):e(t,t.Flickity,t.TapListener,t.fizzyUIUtils)}(window,function(t,e,i,n){"use strict";function s(t,e){this.direction=t,this.parent=e,this._create()}function o(t){return"string"==typeof t?t:"M "+t.x0+",50 L "+t.x1+","+(t.y1+50)+" L "+t.x2+","+(t.y2+50)+" L "+t.x3+",50  L "+t.x2+","+(50-t.y2)+" L "+t.x1+","+(50-t.y1)+" Z"}var r="http://www.w3.org/2000/svg";s.prototype=Object.create(i.prototype),s.prototype._create=function(){this.isEnabled=!0,this.isPrevious=this.direction==-1;var t=this.parent.options.rightToLeft?1:-1;this.isLeft=this.direction==t;var e=this.element=document.createElement("button");e.className="flickity-button flickity-prev-next-button",e.className+=this.isPrevious?" previous":" next",e.setAttribute("type","button"),this.disable(),e.setAttribute("aria-label",this.isPrevious?"Previous":"Next");var i=this.createSVG();e.appendChild(i),this.on("tap",this.onTap),this.parent.on("select",this.update.bind(this)),this.on("pointerDown",this.parent.childUIPointerDown.bind(this.parent))},s.prototype.activate=function(){this.bindTap(this.element),this.element.addEventListener("click",this),this.parent.element.appendChild(this.element)},s.prototype.deactivate=function(){this.parent.element.removeChild(this.element),i.prototype.destroy.call(this),this.element.removeEventListener("click",this)},s.prototype.createSVG=function(){var t=document.createElementNS(r,"svg");t.setAttribute("class","flickity-button-icon"),t.setAttribute("viewBox","0 0 100 100");var e=document.createElementNS(r,"path"),i=o(this.parent.options.arrowShape);return e.setAttribute("d",i),e.setAttribute("class","arrow"),this.isLeft||e.setAttribute("transform","translate(100, 100) rotate(180) "),t.appendChild(e),t},s.prototype.onTap=function(){if(this.isEnabled){this.parent.uiChange();var t=this.isPrevious?"previous":"next";this.parent[t]()}},s.prototype.handleEvent=n.handleEvent,s.prototype.onclick=function(t){var e=document.activeElement;e&&e==this.element&&this.onTap(t,t)},s.prototype.enable=function(){this.isEnabled||(this.element.disabled=!1,this.isEnabled=!0)},s.prototype.disable=function(){this.isEnabled&&(this.element.disabled=!0,this.isEnabled=!1)},s.prototype.update=function(){var t=this.parent.slides;if(this.parent.options.wrapAround&&t.length>1)return void this.enable();var e=t.length?t.length-1:0,i=this.isPrevious?0:e,n=this.parent.selectedIndex==i?"disable":"enable";this[n]()},s.prototype.destroy=function(){this.deactivate()},n.extend(e.defaults,{prevNextButtons:!0,arrowShape:{x0:10,x1:60,y1:50,x2:70,y2:40,x3:30}}),e.createMethods.push("_createPrevNextButtons");var a=e.prototype;return a._createPrevNextButtons=function(){this.options.prevNextButtons&&(this.prevButton=new s((-1),this),this.nextButton=new s(1,this),this.on("activate",this.activatePrevNextButtons))},a.activatePrevNextButtons=function(){this.prevButton.activate(),this.nextButton.activate(),this.on("deactivate",this.deactivatePrevNextButtons)},a.deactivatePrevNextButtons=function(){this.prevButton.deactivate(),this.nextButton.deactivate(),this.off("deactivate",this.deactivatePrevNextButtons)},e.PrevNextButton=s,e}),function(t,e){"function"==typeof define&&define.amd?define("flickity/js/page-dots",["./flickity","tap-listener/tap-listener","fizzy-ui-utils/utils"],function(i,n,s){return e(t,i,n,s)}):"object"==typeof module&&module.exports?module.exports=e(t,require("./flickity"),require("tap-listener"),require("fizzy-ui-utils")):e(t,t.Flickity,t.TapListener,t.fizzyUIUtils)}(window,function(t,e,i,n){function s(t){this.parent=t,this._create()}s.prototype=new i,s.prototype._create=function(){this.holder=document.createElement("ol"),this.holder.className="flickity-page-dots",this.dots=[],this.on("tap",this.onTap),this.on("pointerDown",this.parent.childUIPointerDown.bind(this.parent))},s.prototype.activate=function(){this.setDots(),this.bindTap(this.holder),this.parent.element.appendChild(this.holder)},s.prototype.deactivate=function(){this.parent.element.removeChild(this.holder),i.prototype.destroy.call(this)},s.prototype.setDots=function(){var t=this.parent.slides.length-this.dots.length;t>0?this.addDots(t):t<0&&this.removeDots(-t)},s.prototype.addDots=function(t){for(var e=document.createDocumentFragment(),i=[],n=this.dots.length,s=n+t,o=n;o<s;o++){var r=document.createElement("li");r.className="dot",r.setAttribute("aria-label","Page dot "+(o+1)),e.appendChild(r),i.push(r)}this.holder.appendChild(e),this.dots=this.dots.concat(i)},s.prototype.removeDots=function(t){var e=this.dots.splice(this.dots.length-t,t);e.forEach(function(t){this.holder.removeChild(t)},this)},s.prototype.updateSelected=function(){this.selectedDot&&(this.selectedDot.className="dot",this.selectedDot.removeAttribute("aria-current")),this.dots.length&&(this.selectedDot=this.dots[this.parent.selectedIndex],this.selectedDot.className="dot is-selected",this.selectedDot.setAttribute("aria-current","step"))},s.prototype.onTap=function(t){var e=t.target;if("LI"==e.nodeName){this.parent.uiChange();var i=this.dots.indexOf(e);this.parent.select(i)}},s.prototype.destroy=function(){this.deactivate()},e.PageDots=s,n.extend(e.defaults,{pageDots:!0}),e.createMethods.push("_createPageDots");var o=e.prototype;return o._createPageDots=function(){this.options.pageDots&&(this.pageDots=new s(this),this.on("activate",this.activatePageDots),this.on("select",this.updateSelectedPageDots),this.on("cellChange",this.updatePageDots),this.on("resize",this.updatePageDots),this.on("deactivate",this.deactivatePageDots))},o.activatePageDots=function(){this.pageDots.activate()},o.updateSelectedPageDots=function(){this.pageDots.updateSelected()},o.updatePageDots=function(){this.pageDots.setDots()},o.deactivatePageDots=function(){this.pageDots.deactivate()},e.PageDots=s,e}),function(t,e){"function"==typeof define&&define.amd?define("flickity/js/player",["ev-emitter/ev-emitter","fizzy-ui-utils/utils","./flickity"],function(t,i,n){return e(t,i,n)}):"object"==typeof module&&module.exports?module.exports=e(require("ev-emitter"),require("fizzy-ui-utils"),require("./flickity")):e(t.EvEmitter,t.fizzyUIUtils,t.Flickity)}(window,function(t,e,i){function n(t){this.parent=t,this.state="stopped",this.onVisibilityChange=this.visibilityChange.bind(this),this.onVisibilityPlay=this.visibilityPlay.bind(this)}n.prototype=Object.create(t.prototype),n.prototype.play=function(){if("playing"!=this.state){var t=document.hidden;if(t)return void document.addEventListener("visibilitychange",this.onVisibilityPlay);this.state="playing",document.addEventListener("visibilitychange",this.onVisibilityChange),this.tick()}},n.prototype.tick=function(){if("playing"==this.state){var t=this.parent.options.autoPlay;t="number"==typeof t?t:3e3;var e=this;this.clear(),this.timeout=setTimeout(function(){e.parent.next(!0),e.tick()},t)}},n.prototype.stop=function(){this.state="stopped",this.clear(),document.removeEventListener("visibilitychange",this.onVisibilityChange)},n.prototype.clear=function(){clearTimeout(this.timeout)},n.prototype.pause=function(){"playing"==this.state&&(this.state="paused",this.clear())},n.prototype.unpause=function(){"paused"==this.state&&this.play()},n.prototype.visibilityChange=function(){var t=document.hidden;this[t?"pause":"unpause"]()},n.prototype.visibilityPlay=function(){this.play(),document.removeEventListener("visibilitychange",this.onVisibilityPlay)},e.extend(i.defaults,{pauseAutoPlayOnHover:!0}),i.createMethods.push("_createPlayer");var s=i.prototype;return s._createPlayer=function(){this.player=new n(this),this.on("activate",this.activatePlayer),this.on("uiChange",this.stopPlayer),this.on("pointerDown",this.stopPlayer),this.on("deactivate",this.deactivatePlayer)},s.activatePlayer=function(){this.options.autoPlay&&(this.player.play(),this.element.addEventListener("mouseenter",this))},s.playPlayer=function(){this.player.play()},s.stopPlayer=function(){this.player.stop()},s.pausePlayer=function(){this.player.pause()},s.unpausePlayer=function(){this.player.unpause()},s.deactivatePlayer=function(){this.player.stop(),this.element.removeEventListener("mouseenter",this)},s.onmouseenter=function(){this.options.pauseAutoPlayOnHover&&(this.player.pause(),this.element.addEventListener("mouseleave",this))},s.onmouseleave=function(){this.player.unpause(),this.element.removeEventListener("mouseleave",this)},i.Player=n,i}),function(t,e){"function"==typeof define&&define.amd?define("flickity/js/add-remove-cell",["./flickity","fizzy-ui-utils/utils"],function(i,n){return e(t,i,n)}):"object"==typeof module&&module.exports?module.exports=e(t,require("./flickity"),require("fizzy-ui-utils")):e(t,t.Flickity,t.fizzyUIUtils)}(window,function(t,e,i){function n(t){var e=document.createDocumentFragment();return t.forEach(function(t){e.appendChild(t.element)}),e}var s=e.prototype;return s.insert=function(t,e){var i=this._makeCells(t);if(i&&i.length){var s=this.cells.length;e=void 0===e?s:e;var o=n(i),r=e==s;if(r)this.slider.appendChild(o);else{var a=this.cells[e].element;this.slider.insertBefore(o,a)}if(0===e)this.cells=i.concat(this.cells);else if(r)this.cells=this.cells.concat(i);else{var l=this.cells.splice(e,s-e);this.cells=this.cells.concat(i).concat(l)}this._sizeCells(i),this.cellChange(e,!0)}},s.append=function(t){this.insert(t,this.cells.length)},s.prepend=function(t){this.insert(t,0)},s.remove=function(t){var e=this.getCells(t);if(e&&e.length){var n=this.cells.length-1;e.forEach(function(t){t.remove();var e=this.cells.indexOf(t);n=Math.min(e,n),i.removeFrom(this.cells,t)},this),this.cellChange(n,!0)}},s.cellSizeChange=function(t){var e=this.getCell(t);if(e){e.getSize();var i=this.cells.indexOf(e);this.cellChange(i)}},s.cellChange=function(t,e){var i=this.selectedElement;this._positionCells(t),this._getWrapShiftCells(),this.setGallerySize();var n=this.getCell(i);n&&(this.selectedIndex=this.getCellSlideIndex(n)),this.selectedIndex=Math.min(this.slides.length-1,this.selectedIndex),this.emitEvent("cellChange",[t]),this.select(this.selectedIndex),e&&this.positionSliderAtSelected()},e}),function(t,e){"function"==typeof define&&define.amd?define("flickity/js/lazyload",["./flickity","fizzy-ui-utils/utils"],function(i,n){return e(t,i,n)}):"object"==typeof module&&module.exports?module.exports=e(t,require("./flickity"),require("fizzy-ui-utils")):e(t,t.Flickity,t.fizzyUIUtils)}(window,function(t,e,i){"use strict";function n(t){if("IMG"==t.nodeName){var e=t.getAttribute("data-flickity-lazyload"),n=t.getAttribute("data-flickity-lazyload-src"),s=t.getAttribute("data-flickity-lazyload-srcset");if(e||n||s)return[t]}var o="img[data-flickity-lazyload], img[data-flickity-lazyload-src], img[data-flickity-lazyload-srcset]",r=t.querySelectorAll(o);return i.makeArray(r)}function s(t,e){this.img=t,this.flickity=e,this.load()}e.createMethods.push("_createLazyload");var o=e.prototype;return o._createLazyload=function(){this.on("select",this.lazyLoad)},o.lazyLoad=function(){var t=this.options.lazyLoad;if(t){var e="number"==typeof t?t:0,i=this.getAdjacentCellElements(e),o=[];i.forEach(function(t){var e=n(t);o=o.concat(e)}),o.forEach(function(t){new s(t,this)},this)}},s.prototype.handleEvent=i.handleEvent,s.prototype.load=function(){this.img.addEventListener("load",this),this.img.addEventListener("error",this);var t=this.img.getAttribute("data-flickity-lazyload")||this.img.getAttribute("data-flickity-lazyload-src"),e=this.img.getAttribute("data-flickity-lazyload-srcset");this.img.src=t,e&&this.img.setAttribute("srcset",e),this.img.removeAttribute("data-flickity-lazyload"),this.img.removeAttribute("data-flickity-lazyload-src"),this.img.removeAttribute("data-flickity-lazyload-srcset")},s.prototype.onload=function(t){this.complete(t,"flickity-lazyloaded")},s.prototype.onerror=function(t){this.complete(t,"flickity-lazyerror")},s.prototype.complete=function(t,e){this.img.removeEventListener("load",this),this.img.removeEventListener("error",this);var i=this.flickity.getParentCell(this.img),n=i&&i.element;this.flickity.cellSizeChange(n),this.img.classList.add(e),this.flickity.dispatchEvent("lazyLoad",t,n)},e.LazyLoader=s,e}),function(t,e){"function"==typeof define&&define.amd?define("flickity/js/index",["./flickity","./drag","./prev-next-button","./page-dots","./player","./add-remove-cell","./lazyload"],e):"object"==typeof module&&module.exports&&(module.exports=e(require("./flickity"),require("./drag"),require("./prev-next-button"),require("./page-dots"),require("./player"),require("./add-remove-cell"),require("./lazyload")))}(window,function(t){return t}),function(t,e){"function"==typeof define&&define.amd?define("flickity-as-nav-for/as-nav-for",["flickity/js/index","fizzy-ui-utils/utils"],e):"object"==typeof module&&module.exports?module.exports=e(require("flickity"),require("fizzy-ui-utils")):t.Flickity=e(t.Flickity,t.fizzyUIUtils)}(window,function(t,e){function i(t,e,i){return(e-t)*i+t}t.createMethods.push("_createAsNavFor");var n=t.prototype;return n._createAsNavFor=function(){this.on("activate",this.activateAsNavFor),this.on("deactivate",this.deactivateAsNavFor),this.on("destroy",this.destroyAsNavFor);var t=this.options.asNavFor;if(t){var e=this;setTimeout(function(){e.setNavCompanion(t)})}},n.setNavCompanion=function(i){i=e.getQueryElement(i);var n=t.data(i);if(n&&n!=this){this.navCompanion=n;var s=this;this.onNavCompanionSelect=function(){s.navCompanionSelect()},n.on("select",this.onNavCompanionSelect),this.on("staticClick",this.onNavStaticClick),this.navCompanionSelect(!0)}},n.navCompanionSelect=function(t){if(this.navCompanion){var e=this.navCompanion.selectedCells[0],n=this.navCompanion.cells.indexOf(e),s=n+this.navCompanion.selectedCells.length-1,o=Math.floor(i(n,s,this.navCompanion.cellAlign));if(this.selectCell(o,!1,t),this.removeNavSelectedElements(),!(o>=this.cells.length)){var r=this.cells.slice(n,s+1);this.navSelectedElements=r.map(function(t){return t.element}),this.changeNavSelectedClass("add")}}},n.changeNavSelectedClass=function(t){this.navSelectedElements.forEach(function(e){e.classList[t]("is-nav-selected")})},n.activateAsNavFor=function(){this.navCompanionSelect(!0)},n.removeNavSelectedElements=function(){this.navSelectedElements&&(this.changeNavSelectedClass("remove"),delete this.navSelectedElements)},n.onNavStaticClick=function(t,e,i,n){"number"==typeof n&&this.navCompanion.selectCell(n)},n.deactivateAsNavFor=function(){this.removeNavSelectedElements()},n.destroyAsNavFor=function(){this.navCompanion&&(this.navCompanion.off("select",this.onNavCompanionSelect),this.off("staticClick",this.onNavStaticClick),delete this.navCompanion)},t}),function(t,e){"use strict";"function"==typeof define&&define.amd?define("imagesloaded/imagesloaded",["ev-emitter/ev-emitter"],function(i){return e(t,i)}):"object"==typeof module&&module.exports?module.exports=e(t,require("ev-emitter")):t.imagesLoaded=e(t,t.EvEmitter)}("undefined"!=typeof window?window:this,function(t,e){function i(t,e){for(var i in e)t[i]=e[i];return t}function n(t){if(Array.isArray(t))return t;var e="object"==typeof t&&"number"==typeof t.length;return e?h.call(t):[t]}function s(t,e,o){if(!(this instanceof s))return new s(t,e,o);var r=t;return"string"==typeof t&&(r=document.querySelectorAll(t)),r?(this.elements=n(r),this.options=i({},this.options),"function"==typeof e?o=e:i(this.options,e),o&&this.on("always",o),this.getImages(),a&&(this.jqDeferred=new a.Deferred),void setTimeout(this.check.bind(this))):void l.error("Bad element for imagesLoaded "+(r||t))}function o(t){this.img=t}function r(t,e){this.url=t,this.element=e,this.img=new Image}var a=t.jQuery,l=t.console,h=Array.prototype.slice;s.prototype=Object.create(e.prototype),s.prototype.options={},s.prototype.getImages=function(){this.images=[],this.elements.forEach(this.addElementImages,this)},s.prototype.addElementImages=function(t){"IMG"==t.nodeName&&this.addImage(t),this.options.background===!0&&this.addElementBackgroundImages(t);var e=t.nodeType;if(e&&c[e]){for(var i=t.querySelectorAll("img"),n=0;n<i.length;n++){var s=i[n];this.addImage(s)}if("string"==typeof this.options.background){var o=t.querySelectorAll(this.options.background);for(n=0;n<o.length;n++){var r=o[n];this.addElementBackgroundImages(r)}}}};var c={1:!0,9:!0,11:!0};return s.prototype.addElementBackgroundImages=function(t){var e=getComputedStyle(t);if(e)for(var i=/url\((['"])?(.*?)\1\)/gi,n=i.exec(e.backgroundImage);null!==n;){var s=n&&n[2];s&&this.addBackground(s,t),n=i.exec(e.backgroundImage)}},s.prototype.addImage=function(t){var e=new o(t);this.images.push(e)},s.prototype.addBackground=function(t,e){var i=new r(t,e);this.images.push(i)},s.prototype.check=function(){function t(t,i,n){setTimeout(function(){e.progress(t,i,n)})}var e=this;return this.progressedCount=0,this.hasAnyBroken=!1,this.images.length?void this.images.forEach(function(e){e.once("progress",t),e.check()}):void this.complete()},s.prototype.progress=function(t,e,i){this.progressedCount++,this.hasAnyBroken=this.hasAnyBroken||!t.isLoaded,this.emitEvent("progress",[this,t,e]),this.jqDeferred&&this.jqDeferred.notify&&this.jqDeferred.notify(this,t),this.progressedCount==this.images.length&&this.complete(),this.options.debug&&l&&l.log("progress: "+i,t,e)},s.prototype.complete=function(){var t=this.hasAnyBroken?"fail":"done";if(this.isComplete=!0,this.emitEvent(t,[this]),this.emitEvent("always",[this]),this.jqDeferred){var e=this.hasAnyBroken?"reject":"resolve";this.jqDeferred[e](this)}},o.prototype=Object.create(e.prototype),o.prototype.check=function(){var t=this.getIsImageComplete();return t?void this.confirm(0!==this.img.naturalWidth,"naturalWidth"):(this.proxyImage=new Image,this.proxyImage.addEventListener("load",this),this.proxyImage.addEventListener("error",this),this.img.addEventListener("load",this),this.img.addEventListener("error",this),void(this.proxyImage.src=this.img.src))},o.prototype.getIsImageComplete=function(){return this.img.complete&&this.img.naturalWidth},o.prototype.confirm=function(t,e){this.isLoaded=t,this.emitEvent("progress",[this,this.img,e])},o.prototype.handleEvent=function(t){var e="on"+t.type;this[e]&&this[e](t)},o.prototype.onload=function(){this.confirm(!0,"onload"),this.unbindEvents()},o.prototype.onerror=function(){this.confirm(!1,"onerror"),this.unbindEvents()},o.prototype.unbindEvents=function(){this.proxyImage.removeEventListener("load",this),this.proxyImage.removeEventListener("error",this),this.img.removeEventListener("load",this),this.img.removeEventListener("error",this)},r.prototype=Object.create(o.prototype),r.prototype.check=function(){this.img.addEventListener("load",this),this.img.addEventListener("error",this),this.img.src=this.url;var t=this.getIsImageComplete();t&&(this.confirm(0!==this.img.naturalWidth,"naturalWidth"),this.unbindEvents())},r.prototype.unbindEvents=function(){this.img.removeEventListener("load",this),this.img.removeEventListener("error",this)},r.prototype.confirm=function(t,e){this.isLoaded=t,this.emitEvent("progress",[this,this.element,e])},s.makeJQueryPlugin=function(e){e=e||t.jQuery,e&&(a=e,a.fn.imagesLoaded=function(t,e){var i=new s(this,t,e);return i.jqDeferred.promise(a(this))})},s.makeJQueryPlugin(),s}),function(t,e){"function"==typeof define&&define.amd?define(["flickity/js/index","imagesloaded/imagesloaded"],function(i,n){return e(t,i,n)}):"object"==typeof module&&module.exports?module.exports=e(t,require("flickity"),require("imagesloaded")):t.Flickity=e(t,t.Flickity,t.imagesLoaded)}(window,function(t,e,i){"use strict";e.createMethods.push("_createImagesLoaded");var n=e.prototype;return n._createImagesLoaded=function(){this.on("activate",this.imagesLoaded)},n.imagesLoaded=function(){function t(t,i){var n=e.getParentCell(i.img);e.cellSizeChange(n&&n.element),e.options.freeScroll||e.positionSliderAtSelected()}if(this.options.imagesLoaded){var e=this;i(this.slider).on("progress",t)}},e});


/*
    A simple jQuery modal (http://github.com/kylefox/jquery-modal)
    Version 0.6.1
*/
!function(o){var t=null;o.modal=function(e,i){o.modal.close();var s,l;if(this.$body=o("body"),this.options=o.extend({},o.modal.defaults,i),this.options.doFade=!isNaN(parseInt(this.options.fadeDuration,10)),e.is("a"))if(l=e.attr("href"),/^#/.test(l)){if(this.$elm=o(l),1!==this.$elm.length)return null;this.$body.append(this.$elm),this.open()}else this.$elm=o("<div>"),this.$body.append(this.$elm),s=function(o,t){t.elm.remove()},this.showSpinner(),e.trigger(o.modal.AJAX_SEND),o.get(l).done(function(i){t&&(e.trigger(o.modal.AJAX_SUCCESS),t.$elm.empty().append(i).on(o.modal.CLOSE,s),t.hideSpinner(),t.open(),e.trigger(o.modal.AJAX_COMPLETE))}).fail(function(){e.trigger(o.modal.AJAX_FAIL),t.hideSpinner(),e.trigger(o.modal.AJAX_COMPLETE)});else this.$elm=e,this.$body.append(this.$elm),this.open()},o.modal.prototype={constructor:o.modal,open:function(){var t=this;this.options.doFade?(this.block(),setTimeout(function(){t.show()},this.options.fadeDuration*this.options.fadeDelay)):(this.block(),this.show()),this.options.escapeClose&&o(document).on("keydown.modal",function(t){27==t.which&&o.modal.close()}),this.options.clickClose&&this.blocker.click(function(t){t.target==this&&o.modal.close()})},close:function(){this.unblock(),this.hide(),o(document).off("keydown.modal")},block:function(){this.$elm.trigger(o.modal.BEFORE_BLOCK,[this._ctx()]),this.blocker=o('<div class="jquery-modal blocker"></div>'),this.$body.css("overflow","hidden"),this.$body.append(this.blocker),this.options.doFade&&this.blocker.css("opacity",0).animate({opacity:1},this.options.fadeDuration),this.$elm.trigger(o.modal.BLOCK,[this._ctx()])},unblock:function(){if(this.options.doFade){var o=this;this.blocker.fadeOut(this.options.fadeDuration,function(){o.blocker.children().appendTo(o.$body),o.blocker.remove(),o.$body.css("overflow","")})}else this.blocker.children().appendTo(this.$body),this.blocker.remove(),this.$body.css("overflow","")},show:function(){this.$elm.trigger(o.modal.BEFORE_OPEN,[this._ctx()]),this.options.showClose&&(this.closeButton=o('<a href="#close-modal" rel="modal:close" class="close-modal '+this.options.closeClass+'">'+this.options.closeText+"</a>"),this.$elm.append(this.closeButton)),this.$elm.addClass(this.options.modalClass+" current"),this.$elm.appendTo(this.blocker),this.options.doFade?this.$elm.css("opacity",0).show().animate({opacity:1},this.options.fadeDuration):this.$elm.show(),this.$elm.trigger(o.modal.OPEN,[this._ctx()])},hide:function(){this.$elm.trigger(o.modal.BEFORE_CLOSE,[this._ctx()]),this.closeButton&&this.closeButton.remove(),this.$elm.removeClass("current");var t=this;this.options.doFade?this.$elm.fadeOut(this.options.fadeDuration,function(){t.$elm.trigger(o.modal.AFTER_CLOSE,[t._ctx()])}):this.$elm.hide(0,function(){t.$elm.trigger(o.modal.AFTER_CLOSE,[t._ctx()])}),this.$elm.trigger(o.modal.CLOSE,[this._ctx()])},showSpinner:function(){this.options.showSpinner&&(this.spinner=this.spinner||o('<div class="'+this.options.modalClass+'-spinner"></div>').append(this.options.spinnerHtml),this.$body.append(this.spinner),this.spinner.show())},hideSpinner:function(){this.spinner&&this.spinner.remove()},_ctx:function(){return{elm:this.$elm,blocker:this.blocker,options:this.options}}},o.modal.close=function(o){if(t){o&&o.preventDefault(),t.close();var e=t.$elm;return t=null,e}},o.modal.isActive=function(){return t?!0:!1},o.modal.defaults={escapeClose:!0,clickClose:!0,closeText:"",closeClass:"",modalClass:"modal",spinnerHtml:null,showSpinner:!0,showClose:!0,fadeDuration:null,fadeDelay:1},o.modal.BEFORE_BLOCK="modal:before-block",o.modal.BLOCK="modal:block",o.modal.BEFORE_OPEN="modal:before-open",o.modal.OPEN="modal:open",o.modal.BEFORE_CLOSE="modal:before-close",o.modal.CLOSE="modal:close",o.modal.AFTER_CLOSE="modal:after-close",o.modal.AJAX_SEND="modal:ajax:send",o.modal.AJAX_SUCCESS="modal:ajax:success",o.modal.AJAX_FAIL="modal:ajax:fail",o.modal.AJAX_COMPLETE="modal:ajax:complete",o.fn.modal=function(e){return 1===this.length&&(t=new o.modal(this,e)),this},o(document).on("click.modal",'a[rel="modal:close"]',o.modal.close),o(document).on("click.modal",'a[rel="modal:open"]',function(t){t.preventDefault(),o(this).modal()})}(jQuery);

/*!
 * JavaScript Cookie v2.1.0
 * https://github.com/js-cookie/js-cookie
 *
 * Copyright 2006, 2015 Klaus Hartl & Fagner Brack
 * Released under the MIT license
 */

!function(e){if("function"==typeof define&&define.amd)define(e);else if("object"==typeof exports)module.exports=e();else{var n=window.Cookies,t=window.Cookies=e();t.noConflict=function(){return window.Cookies=n,t}}}(function(){function e(){for(var e=0,n={};e<arguments.length;e++){var t=arguments[e];for(var o in t)n[o]=t[o]}return n}function n(t){function o(n,r,i){var c;if(arguments.length>1){if(i=e({path:"/"},o.defaults,i),"number"==typeof i.expires){var s=new Date;s.setMilliseconds(s.getMilliseconds()+864e5*i.expires),i.expires=s}try{c=JSON.stringify(r),/^[\{\[]/.test(c)&&(r=c)}catch(a){}return r=t.write?t.write(r,n):encodeURIComponent(String(r)).replace(/%(23|24|26|2B|3A|3C|3E|3D|2F|3F|40|5B|5D|5E|60|7B|7D|7C)/g,decodeURIComponent),n=encodeURIComponent(String(n)),n=n.replace(/%(23|24|26|2B|5E|60|7C)/g,decodeURIComponent),n=n.replace(/[\(\)]/g,escape),document.cookie=[n,"=",r,i.expires&&"; expires="+i.expires.toUTCString(),i.path&&"; path="+i.path,i.domain&&"; domain="+i.domain,i.secure?"; secure":""].join("")}n||(c={});for(var p=document.cookie?document.cookie.split("; "):[],d=/(%[0-9A-Z]{2})+/g,u=0;u<p.length;u++){var f=p[u].split("="),l=f[0].replace(d,decodeURIComponent),m=f.slice(1).join("=");'"'===m.charAt(0)&&(m=m.slice(1,-1));try{if(m=t.read?t.read(m,l):t(m,l)||m.replace(d,decodeURIComponent),this.json)try{m=JSON.parse(m)}catch(a){}if(n===l){c=m;break}n||(c[l]=m)}catch(a){}}return c}return o.get=o.set=o,o.getJSON=function(){return o.apply({json:!0},[].slice.call(arguments))},o.defaults={},o.remove=function(n,t){o(n,"",e(t,{expires:-1}))},o.withConverter=n,o}return n(function(){})});


/*! Magnific Popup - v1.1.0 - 2016-02-20
* http://dimsemenov.com/plugins/magnific-popup/
* Copyright (c) 2016 Dmitry Semenov;
*/
!function(a){"function"==typeof define&&define.amd?define(["jquery"],a):a("object"==typeof exports?require("jquery"):window.jQuery||window.Zepto)}(function(a){var b,c,d,e,f,g,h="Close",i="BeforeClose",j="AfterClose",k="BeforeAppend",l="MarkupParse",m="Open",n="Change",o="mfp",p="."+o,q="mfp-ready",r="mfp-removing",s="mfp-prevent-close",t=function(){},u=!!window.jQuery,v=a(window),w=function(a,c){b.ev.on(o+a+p,c)},x=function(b,c,d,e){var f=document.createElement("div");return f.className="mfp-"+b,d&&(f.innerHTML=d),e?c&&c.appendChild(f):(f=a(f),c&&f.appendTo(c)),f},y=function(c,d){b.ev.triggerHandler(o+c,d),b.st.callbacks&&(c=c.charAt(0).toLowerCase()+c.slice(1),b.st.callbacks[c]&&b.st.callbacks[c].apply(b,a.isArray(d)?d:[d]))},z=function(c){return c===g&&b.currTemplate.closeBtn||(b.currTemplate.closeBtn=a(b.st.closeMarkup.replace("%title%",b.st.tClose)),g=c),b.currTemplate.closeBtn},A=function(){a.magnificPopup.instance||(b=new t,b.init(),a.magnificPopup.instance=b)},B=function(){var a=document.createElement("p").style,b=["ms","O","Moz","Webkit"];if(void 0!==a.transition)return!0;for(;b.length;)if(b.pop()+"Transition"in a)return!0;return!1};t.prototype={constructor:t,init:function(){var c=navigator.appVersion;b.isLowIE=b.isIE8=document.all&&!document.addEventListener,b.isAndroid=/android/gi.test(c),b.isIOS=/iphone|ipad|ipod/gi.test(c),b.supportsTransition=B(),b.probablyMobile=b.isAndroid||b.isIOS||/(Opera Mini)|Kindle|webOS|BlackBerry|(Opera Mobi)|(Windows Phone)|IEMobile/i.test(navigator.userAgent),d=a(document),b.popupsCache={}},open:function(c){var e;if(c.isObj===!1){b.items=c.items.toArray(),b.index=0;var g,h=c.items;for(e=0;e<h.length;e++)if(g=h[e],g.parsed&&(g=g.el[0]),g===c.el[0]){b.index=e;break}}else b.items=a.isArray(c.items)?c.items:[c.items],b.index=c.index||0;if(b.isOpen)return void b.updateItemHTML();b.types=[],f="",c.mainEl&&c.mainEl.length?b.ev=c.mainEl.eq(0):b.ev=d,c.key?(b.popupsCache[c.key]||(b.popupsCache[c.key]={}),b.currTemplate=b.popupsCache[c.key]):b.currTemplate={},b.st=a.extend(!0,{},a.magnificPopup.defaults,c),b.fixedContentPos="auto"===b.st.fixedContentPos?!b.probablyMobile:b.st.fixedContentPos,b.st.modal&&(b.st.closeOnContentClick=!1,b.st.closeOnBgClick=!1,b.st.showCloseBtn=!1,b.st.enableEscapeKey=!1),b.bgOverlay||(b.bgOverlay=x("bg").on("click"+p,function(){b.close()}),b.wrap=x("wrap").attr("tabindex",-1).on("click"+p,function(a){b._checkIfClose(a.target)&&b.close()}),b.container=x("container",b.wrap)),b.contentContainer=x("content"),b.st.preloader&&(b.preloader=x("preloader",b.container,b.st.tLoading));var i=a.magnificPopup.modules;for(e=0;e<i.length;e++){var j=i[e];j=j.charAt(0).toUpperCase()+j.slice(1),b["init"+j].call(b)}y("BeforeOpen"),b.st.showCloseBtn&&(b.st.closeBtnInside?(w(l,function(a,b,c,d){c.close_replaceWith=z(d.type)}),f+=" mfp-close-btn-in"):b.wrap.append(z())),b.st.alignTop&&(f+=" mfp-align-top"),b.fixedContentPos?b.wrap.css({overflow:b.st.overflowY,overflowX:"hidden",overflowY:b.st.overflowY}):b.wrap.css({top:v.scrollTop(),position:"absolute"}),(b.st.fixedBgPos===!1||"auto"===b.st.fixedBgPos&&!b.fixedContentPos)&&b.bgOverlay.css({height:d.height(),position:"absolute"}),b.st.enableEscapeKey&&d.on("keyup"+p,function(a){27===a.keyCode&&b.close()}),v.on("resize"+p,function(){b.updateSize()}),b.st.closeOnContentClick||(f+=" mfp-auto-cursor"),f&&b.wrap.addClass(f);var k=b.wH=v.height(),n={};if(b.fixedContentPos&&b._hasScrollBar(k)){var o=b._getScrollbarSize();o&&(n.marginRight=o)}b.fixedContentPos&&(b.isIE7?a("body, html").css("overflow","hidden"):n.overflow="hidden");var r=b.st.mainClass;return b.isIE7&&(r+=" mfp-ie7"),r&&b._addClassToMFP(r),b.updateItemHTML(),y("BuildControls"),a("html").css(n),b.bgOverlay.add(b.wrap).prependTo(b.st.prependTo||a(document.body)),b._lastFocusedEl=document.activeElement,setTimeout(function(){b.content?(b._addClassToMFP(q),b._setFocus()):b.bgOverlay.addClass(q),d.on("focusin"+p,b._onFocusIn)},16),b.isOpen=!0,b.updateSize(k),y(m),c},close:function(){b.isOpen&&(y(i),b.isOpen=!1,b.st.removalDelay&&!b.isLowIE&&b.supportsTransition?(b._addClassToMFP(r),setTimeout(function(){b._close()},b.st.removalDelay)):b._close())},_close:function(){y(h);var c=r+" "+q+" ";if(b.bgOverlay.detach(),b.wrap.detach(),b.container.empty(),b.st.mainClass&&(c+=b.st.mainClass+" "),b._removeClassFromMFP(c),b.fixedContentPos){var e={marginRight:""};b.isIE7?a("body, html").css("overflow",""):e.overflow="",a("html").css(e)}d.off("keyup"+p+" focusin"+p),b.ev.off(p),b.wrap.attr("class","mfp-wrap").removeAttr("style"),b.bgOverlay.attr("class","mfp-bg"),b.container.attr("class","mfp-container"),!b.st.showCloseBtn||b.st.closeBtnInside&&b.currTemplate[b.currItem.type]!==!0||b.currTemplate.closeBtn&&b.currTemplate.closeBtn.detach(),b.st.autoFocusLast&&b._lastFocusedEl&&a(b._lastFocusedEl).focus(),b.currItem=null,b.content=null,b.currTemplate=null,b.prevHeight=0,y(j)},updateSize:function(a){if(b.isIOS){var c=document.documentElement.clientWidth/window.innerWidth,d=window.innerHeight*c;b.wrap.css("height",d),b.wH=d}else b.wH=a||v.height();b.fixedContentPos||b.wrap.css("height",b.wH),y("Resize")},updateItemHTML:function(){var c=b.items[b.index];b.contentContainer.detach(),b.content&&b.content.detach(),c.parsed||(c=b.parseEl(b.index));var d=c.type;if(y("BeforeChange",[b.currItem?b.currItem.type:"",d]),b.currItem=c,!b.currTemplate[d]){var f=b.st[d]?b.st[d].markup:!1;y("FirstMarkupParse",f),f?b.currTemplate[d]=a(f):b.currTemplate[d]=!0}e&&e!==c.type&&b.container.removeClass("mfp-"+e+"-holder");var g=b["get"+d.charAt(0).toUpperCase()+d.slice(1)](c,b.currTemplate[d]);b.appendContent(g,d),c.preloaded=!0,y(n,c),e=c.type,b.container.prepend(b.contentContainer),y("AfterChange")},appendContent:function(a,c){b.content=a,a?b.st.showCloseBtn&&b.st.closeBtnInside&&b.currTemplate[c]===!0?b.content.find(".mfp-close").length||b.content.append(z()):b.content=a:b.content="",y(k),b.container.addClass("mfp-"+c+"-holder"),b.contentContainer.append(b.content)},parseEl:function(c){var d,e=b.items[c];if(e.tagName?e={el:a(e)}:(d=e.type,e={data:e,src:e.src}),e.el){for(var f=b.types,g=0;g<f.length;g++)if(e.el.hasClass("mfp-"+f[g])){d=f[g];break}e.src=e.el.attr("data-mfp-src"),e.src||(e.src=e.el.attr("href"))}return e.type=d||b.st.type||"inline",e.index=c,e.parsed=!0,b.items[c]=e,y("ElementParse",e),b.items[c]},addGroup:function(a,c){var d=function(d){d.mfpEl=this,b._openClick(d,a,c)};c||(c={});var e="click.magnificPopup";c.mainEl=a,c.items?(c.isObj=!0,a.off(e).on(e,d)):(c.isObj=!1,c.delegate?a.off(e).on(e,c.delegate,d):(c.items=a,a.off(e).on(e,d)))},_openClick:function(c,d,e){var f=void 0!==e.midClick?e.midClick:a.magnificPopup.defaults.midClick;if(f||!(2===c.which||c.ctrlKey||c.metaKey||c.altKey||c.shiftKey)){var g=void 0!==e.disableOn?e.disableOn:a.magnificPopup.defaults.disableOn;if(g)if(a.isFunction(g)){if(!g.call(b))return!0}else if(v.width()<g)return!0;c.type&&(c.preventDefault(),b.isOpen&&c.stopPropagation()),e.el=a(c.mfpEl),e.delegate&&(e.items=d.find(e.delegate)),b.open(e)}},updateStatus:function(a,d){if(b.preloader){c!==a&&b.container.removeClass("mfp-s-"+c),d||"loading"!==a||(d=b.st.tLoading);var e={status:a,text:d};y("UpdateStatus",e),a=e.status,d=e.text,b.preloader.html(d),b.preloader.find("a").on("click",function(a){a.stopImmediatePropagation()}),b.container.addClass("mfp-s-"+a),c=a}},_checkIfClose:function(c){if(!a(c).hasClass(s)){var d=b.st.closeOnContentClick,e=b.st.closeOnBgClick;if(d&&e)return!0;if(!b.content||a(c).hasClass("mfp-close")||b.preloader&&c===b.preloader[0])return!0;if(c===b.content[0]||a.contains(b.content[0],c)){if(d)return!0}else if(e&&a.contains(document,c))return!0;return!1}},_addClassToMFP:function(a){b.bgOverlay.addClass(a),b.wrap.addClass(a)},_removeClassFromMFP:function(a){this.bgOverlay.removeClass(a),b.wrap.removeClass(a)},_hasScrollBar:function(a){return(b.isIE7?d.height():document.body.scrollHeight)>(a||v.height())},_setFocus:function(){(b.st.focus?b.content.find(b.st.focus).eq(0):b.wrap).focus()},_onFocusIn:function(c){return c.target===b.wrap[0]||a.contains(b.wrap[0],c.target)?void 0:(b._setFocus(),!1)},_parseMarkup:function(b,c,d){var e;d.data&&(c=a.extend(d.data,c)),y(l,[b,c,d]),a.each(c,function(c,d){if(void 0===d||d===!1)return!0;if(e=c.split("_"),e.length>1){var f=b.find(p+"-"+e[0]);if(f.length>0){var g=e[1];"replaceWith"===g?f[0]!==d[0]&&f.replaceWith(d):"img"===g?f.is("img")?f.attr("src",d):f.replaceWith(a("<img>").attr("src",d).attr("class",f.attr("class"))):f.attr(e[1],d)}}else b.find(p+"-"+c).html(d)})},_getScrollbarSize:function(){if(void 0===b.scrollbarSize){var a=document.createElement("div");a.style.cssText="width: 99px; height: 99px; overflow: scroll; position: absolute; top: -9999px;",document.body.appendChild(a),b.scrollbarSize=a.offsetWidth-a.clientWidth,document.body.removeChild(a)}return b.scrollbarSize}},a.magnificPopup={instance:null,proto:t.prototype,modules:[],open:function(b,c){return A(),b=b?a.extend(!0,{},b):{},b.isObj=!0,b.index=c||0,this.instance.open(b)},close:function(){return a.magnificPopup.instance&&a.magnificPopup.instance.close()},registerModule:function(b,c){c.options&&(a.magnificPopup.defaults[b]=c.options),a.extend(this.proto,c.proto),this.modules.push(b)},defaults:{disableOn:0,key:null,midClick:!1,mainClass:"",preloader:!0,focus:"",closeOnContentClick:!1,closeOnBgClick:!0,closeBtnInside:!0,showCloseBtn:!0,enableEscapeKey:!0,modal:!1,alignTop:!1,removalDelay:0,prependTo:null,fixedContentPos:"auto",fixedBgPos:"auto",overflowY:"auto",closeMarkup:'<button title="%title%" type="button" class="mfp-close">&#215;</button>',tClose:"Close (Esc)",tLoading:"Loading...",autoFocusLast:!0}},a.fn.magnificPopup=function(c){A();var d=a(this);if("string"==typeof c)if("open"===c){var e,f=u?d.data("magnificPopup"):d[0].magnificPopup,g=parseInt(arguments[1],10)||0;f.items?e=f.items[g]:(e=d,f.delegate&&(e=e.find(f.delegate)),e=e.eq(g)),b._openClick({mfpEl:e},d,f)}else b.isOpen&&b[c].apply(b,Array.prototype.slice.call(arguments,1));else c=a.extend(!0,{},c),u?d.data("magnificPopup",c):d[0].magnificPopup=c,b.addGroup(d,c);return d};var C,D,E,F="inline",G=function(){E&&(D.after(E.addClass(C)).detach(),E=null)};a.magnificPopup.registerModule(F,{options:{hiddenClass:"hide",markup:"",tNotFound:"Content not found"},proto:{initInline:function(){b.types.push(F),w(h+"."+F,function(){G()})},getInline:function(c,d){if(G(),c.src){var e=b.st.inline,f=a(c.src);if(f.length){var g=f[0].parentNode;g&&g.tagName&&(D||(C=e.hiddenClass,D=x(C),C="mfp-"+C),E=f.after(D).detach().removeClass(C)),b.updateStatus("ready")}else b.updateStatus("error",e.tNotFound),f=a("<div>");return c.inlineElement=f,f}return b.updateStatus("ready"),b._parseMarkup(d,{},c),d}}});var H,I="ajax",J=function(){H&&a(document.body).removeClass(H)},K=function(){J(),b.req&&b.req.abort()};a.magnificPopup.registerModule(I,{options:{settings:null,cursor:"mfp-ajax-cur",tError:'<a href="%url%">The content</a> could not be loaded.'},proto:{initAjax:function(){b.types.push(I),H=b.st.ajax.cursor,w(h+"."+I,K),w("BeforeChange."+I,K)},getAjax:function(c){H&&a(document.body).addClass(H),b.updateStatus("loading");var d=a.extend({url:c.src,success:function(d,e,f){var g={data:d,xhr:f};y("ParseAjax",g),b.appendContent(a(g.data),I),c.finished=!0,J(),b._setFocus(),setTimeout(function(){b.wrap.addClass(q)},16),b.updateStatus("ready"),y("AjaxContentAdded")},error:function(){J(),c.finished=c.loadError=!0,b.updateStatus("error",b.st.ajax.tError.replace("%url%",c.src))}},b.st.ajax.settings);return b.req=a.ajax(d),""}}});var L,M=function(c){if(c.data&&void 0!==c.data.title)return c.data.title;var d=b.st.image.titleSrc;if(d){if(a.isFunction(d))return d.call(b,c);if(c.el)return c.el.attr(d)||""}return""};a.magnificPopup.registerModule("image",{options:{markup:'<div class="mfp-figure"><div class="mfp-close"></div><figure><div class="mfp-img"></div><figcaption><div class="mfp-bottom-bar"><div class="mfp-title"></div><div class="mfp-counter"></div></div></figcaption></figure></div>',cursor:"mfp-zoom-out-cur",titleSrc:"title",verticalFit:!0,tError:'<a href="%url%">The image</a> could not be loaded.'},proto:{initImage:function(){var c=b.st.image,d=".image";b.types.push("image"),w(m+d,function(){"image"===b.currItem.type&&c.cursor&&a(document.body).addClass(c.cursor)}),w(h+d,function(){c.cursor&&a(document.body).removeClass(c.cursor),v.off("resize"+p)}),w("Resize"+d,b.resizeImage),b.isLowIE&&w("AfterChange",b.resizeImage)},resizeImage:function(){var a=b.currItem;if(a&&a.img&&b.st.image.verticalFit){var c=0;b.isLowIE&&(c=parseInt(a.img.css("padding-top"),10)+parseInt(a.img.css("padding-bottom"),10)),a.img.css("max-height",b.wH-c)}},_onImageHasSize:function(a){a.img&&(a.hasSize=!0,L&&clearInterval(L),a.isCheckingImgSize=!1,y("ImageHasSize",a),a.imgHidden&&(b.content&&b.content.removeClass("mfp-loading"),a.imgHidden=!1))},findImageSize:function(a){var c=0,d=a.img[0],e=function(f){L&&clearInterval(L),L=setInterval(function(){return d.naturalWidth>0?void b._onImageHasSize(a):(c>200&&clearInterval(L),c++,void(3===c?e(10):40===c?e(50):100===c&&e(500)))},f)};e(1)},getImage:function(c,d){var e=0,f=function(){c&&(c.img[0].complete?(c.img.off(".mfploader"),c===b.currItem&&(b._onImageHasSize(c),b.updateStatus("ready")),c.hasSize=!0,c.loaded=!0,y("ImageLoadComplete")):(e++,200>e?setTimeout(f,100):g()))},g=function(){c&&(c.img.off(".mfploader"),c===b.currItem&&(b._onImageHasSize(c),b.updateStatus("error",h.tError.replace("%url%",c.src))),c.hasSize=!0,c.loaded=!0,c.loadError=!0)},h=b.st.image,i=d.find(".mfp-img");if(i.length){var j=document.createElement("img");j.className="mfp-img",c.el&&c.el.find("img").length&&(j.alt=c.el.find("img").attr("alt")),c.img=a(j).on("load.mfploader",f).on("error.mfploader",g),j.src=c.src,i.is("img")&&(c.img=c.img.clone()),j=c.img[0],j.naturalWidth>0?c.hasSize=!0:j.width||(c.hasSize=!1)}return b._parseMarkup(d,{title:M(c),img_replaceWith:c.img},c),b.resizeImage(),c.hasSize?(L&&clearInterval(L),c.loadError?(d.addClass("mfp-loading"),b.updateStatus("error",h.tError.replace("%url%",c.src))):(d.removeClass("mfp-loading"),b.updateStatus("ready")),d):(b.updateStatus("loading"),c.loading=!0,c.hasSize||(c.imgHidden=!0,d.addClass("mfp-loading"),b.findImageSize(c)),d)}}});var N,O=function(){return void 0===N&&(N=void 0!==document.createElement("p").style.MozTransform),N};a.magnificPopup.registerModule("zoom",{options:{enabled:!1,easing:"ease-in-out",duration:300,opener:function(a){return a.is("img")?a:a.find("img")}},proto:{initZoom:function(){var a,c=b.st.zoom,d=".zoom";if(c.enabled&&b.supportsTransition){var e,f,g=c.duration,j=function(a){var b=a.clone().removeAttr("style").removeAttr("class").addClass("mfp-animated-image"),d="all "+c.duration/1e3+"s "+c.easing,e={position:"fixed",zIndex:9999,left:0,top:0,"-webkit-backface-visibility":"hidden"},f="transition";return e["-webkit-"+f]=e["-moz-"+f]=e["-o-"+f]=e[f]=d,b.css(e),b},k=function(){b.content.css("visibility","visible")};w("BuildControls"+d,function(){if(b._allowZoom()){if(clearTimeout(e),b.content.css("visibility","hidden"),a=b._getItemToZoom(),!a)return void k();f=j(a),f.css(b._getOffset()),b.wrap.append(f),e=setTimeout(function(){f.css(b._getOffset(!0)),e=setTimeout(function(){k(),setTimeout(function(){f.remove(),a=f=null,y("ZoomAnimationEnded")},16)},g)},16)}}),w(i+d,function(){if(b._allowZoom()){if(clearTimeout(e),b.st.removalDelay=g,!a){if(a=b._getItemToZoom(),!a)return;f=j(a)}f.css(b._getOffset(!0)),b.wrap.append(f),b.content.css("visibility","hidden"),setTimeout(function(){f.css(b._getOffset())},16)}}),w(h+d,function(){b._allowZoom()&&(k(),f&&f.remove(),a=null)})}},_allowZoom:function(){return"image"===b.currItem.type},_getItemToZoom:function(){return b.currItem.hasSize?b.currItem.img:!1},_getOffset:function(c){var d;d=c?b.currItem.img:b.st.zoom.opener(b.currItem.el||b.currItem);var e=d.offset(),f=parseInt(d.css("padding-top"),10),g=parseInt(d.css("padding-bottom"),10);e.top-=a(window).scrollTop()-f;var h={width:d.width(),height:(u?d.innerHeight():d[0].offsetHeight)-g-f};return O()?h["-moz-transform"]=h.transform="translate("+e.left+"px,"+e.top+"px)":(h.left=e.left,h.top=e.top),h}}});var P="iframe",Q="//about:blank",R=function(a){if(b.currTemplate[P]){var c=b.currTemplate[P].find("iframe");c.length&&(a||(c[0].src=Q),b.isIE8&&c.css("display",a?"block":"none"))}};a.magnificPopup.registerModule(P,{options:{markup:'<div class="mfp-iframe-scaler"><div class="mfp-close"></div><iframe class="mfp-iframe" src="//about:blank" frameborder="0" allowfullscreen></iframe></div>',srcAction:"iframe_src",patterns:{youtube:{index:"youtube.com",id:"v=",src:"//www.youtube.com/embed/%id%?autoplay=1"},vimeo:{index:"vimeo.com/",id:"/",src:"//player.vimeo.com/video/%id%?autoplay=1"},gmaps:{index:"//maps.google.",src:"%id%&output=embed"}}},proto:{initIframe:function(){b.types.push(P),w("BeforeChange",function(a,b,c){b!==c&&(b===P?R():c===P&&R(!0))}),w(h+"."+P,function(){R()})},getIframe:function(c,d){var e=c.src,f=b.st.iframe;a.each(f.patterns,function(){return e.indexOf(this.index)>-1?(this.id&&(e="string"==typeof this.id?e.substr(e.lastIndexOf(this.id)+this.id.length,e.length):this.id.call(this,e)),e=this.src.replace("%id%",e),!1):void 0});var g={};return f.srcAction&&(g[f.srcAction]=e),b._parseMarkup(d,g,c),b.updateStatus("ready"),d}}});var S=function(a){var c=b.items.length;return a>c-1?a-c:0>a?c+a:a},T=function(a,b,c){return a.replace(/%curr%/gi,b+1).replace(/%total%/gi,c)};a.magnificPopup.registerModule("gallery",{options:{enabled:!1,arrowMarkup:'<button title="%title%" type="button" class="mfp-arrow mfp-arrow-%dir%"></button>',preload:[0,2],navigateByImgClick:!0,arrows:!0,tPrev:"Previous (Left arrow key)",tNext:"Next (Right arrow key)",tCounter:"%curr% of %total%"},proto:{initGallery:function(){var c=b.st.gallery,e=".mfp-gallery";return b.direction=!0,c&&c.enabled?(f+=" mfp-gallery",w(m+e,function(){c.navigateByImgClick&&b.wrap.on("click"+e,".mfp-img",function(){return b.items.length>1?(b.next(),!1):void 0}),d.on("keydown"+e,function(a){37===a.keyCode?b.prev():39===a.keyCode&&b.next()})}),w("UpdateStatus"+e,function(a,c){c.text&&(c.text=T(c.text,b.currItem.index,b.items.length))}),w(l+e,function(a,d,e,f){var g=b.items.length;e.counter=g>1?T(c.tCounter,f.index,g):""}),w("BuildControls"+e,function(){if(b.items.length>1&&c.arrows&&!b.arrowLeft){var d=c.arrowMarkup,e=b.arrowLeft=a(d.replace(/%title%/gi,c.tPrev).replace(/%dir%/gi,"left")).addClass(s),f=b.arrowRight=a(d.replace(/%title%/gi,c.tNext).replace(/%dir%/gi,"right")).addClass(s);e.click(function(){b.prev()}),f.click(function(){b.next()}),b.container.append(e.add(f))}}),w(n+e,function(){b._preloadTimeout&&clearTimeout(b._preloadTimeout),b._preloadTimeout=setTimeout(function(){b.preloadNearbyImages(),b._preloadTimeout=null},16)}),void w(h+e,function(){d.off(e),b.wrap.off("click"+e),b.arrowRight=b.arrowLeft=null})):!1},next:function(){b.direction=!0,b.index=S(b.index+1),b.updateItemHTML()},prev:function(){b.direction=!1,b.index=S(b.index-1),b.updateItemHTML()},goTo:function(a){b.direction=a>=b.index,b.index=a,b.updateItemHTML()},preloadNearbyImages:function(){var a,c=b.st.gallery.preload,d=Math.min(c[0],b.items.length),e=Math.min(c[1],b.items.length);for(a=1;a<=(b.direction?e:d);a++)b._preloadItem(b.index+a);for(a=1;a<=(b.direction?d:e);a++)b._preloadItem(b.index-a)},_preloadItem:function(c){if(c=S(c),!b.items[c].preloaded){var d=b.items[c];d.parsed||(d=b.parseEl(c)),y("LazyLoad",d),"image"===d.type&&(d.img=a('<img class="mfp-img" />').on("load.mfploader",function(){d.hasSize=!0}).on("error.mfploader",function(){d.hasSize=!0,d.loadError=!0,y("LazyLoadError",d)}).attr("src",d.src)),d.preloaded=!0}}}});var U="retina";a.magnificPopup.registerModule(U,{options:{replaceSrc:function(a){return a.src.replace(/\.\w+$/,function(a){return"@2x"+a})},ratio:1},proto:{initRetina:function(){if(window.devicePixelRatio>1){var a=b.st.retina,c=a.ratio;c=isNaN(c)?c():c,c>1&&(w("ImageHasSize."+U,function(a,b){b.img.css({"max-width":b.img[0].naturalWidth/c,width:"100%"})}),w("ElementParse."+U,function(b,d){d.src=a.replaceSrc(d,c)}))}}}}),A()});

/*!
smooth-scroll.js
The MIT License (MIT)
Copyright (c) Anthony Garand
*/
!function(e,t){"function"==typeof define&&define.amd?define([],t(e)):"object"==typeof exports?module.exports=t(e):e.smoothScroll=t(e)}("undefined"!=typeof global?global:this.window||this.global,function(e){"use strict";var t,n,r,o,a,c={},u="querySelector"in document&&"addEventListener"in e,i={selector:"[data-scroll]",selectorHeader:"[data-scroll-header]",speed:500,easing:"easeInOutCubic",offset:0,updateURL:!0,callback:function(){}},l=function(){var e={},t=!1,n=0,r=arguments.length;"[object Boolean]"===Object.prototype.toString.call(arguments[0])&&(t=arguments[0],n++);for(var o=function(n){for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(t&&"[object Object]"===Object.prototype.toString.call(n[r])?e[r]=l(!0,e[r],n[r]):e[r]=n[r])};r>n;n++){var a=arguments[n];o(a)}return e},s=function(e){return Math.max(e.scrollHeight,e.offsetHeight,e.clientHeight)},f=function(e,t){var n,r,o=t.charAt(0),a="classList"in document.documentElement;for("["===o&&(t=t.substr(1,t.length-2),n=t.split("="),n.length>1&&(r=!0,n[1]=n[1].replace(/"/g,"").replace(/'/g,"")));e&&e!==document&&1===e.nodeType;e=e.parentNode){if("."===o)if(a){if(e.classList.contains(t.substr(1)))return e}else if(new RegExp("(^|\\s)"+t.substr(1)+"(\\s|$)").test(e.className))return e;if("#"===o&&e.id===t.substr(1))return e;if("["===o&&e.hasAttribute(n[0])){if(!r)return e;if(e.getAttribute(n[0])===n[1])return e}if(e.tagName.toLowerCase()===t)return e}return null};c.escapeCharacters=function(e){"#"===e.charAt(0)&&(e=e.substr(1));for(var t,n=String(e),r=n.length,o=-1,a="",c=n.charCodeAt(0);++o<r;){if(t=n.charCodeAt(o),0===t)throw new InvalidCharacterError("Invalid character: the input contains U+0000.");a+=t>=1&&31>=t||127==t||0===o&&t>=48&&57>=t||1===o&&t>=48&&57>=t&&45===c?"\\"+t.toString(16)+" ":t>=128||45===t||95===t||t>=48&&57>=t||t>=65&&90>=t||t>=97&&122>=t?n.charAt(o):"\\"+n.charAt(o)}return"#"+a};var d=function(e,t){var n;return"easeInQuad"===e&&(n=t*t),"easeOutQuad"===e&&(n=t*(2-t)),"easeInOutQuad"===e&&(n=.5>t?2*t*t:-1+(4-2*t)*t),"easeInCubic"===e&&(n=t*t*t),"easeOutCubic"===e&&(n=--t*t*t+1),"easeInOutCubic"===e&&(n=.5>t?4*t*t*t:(t-1)*(2*t-2)*(2*t-2)+1),"easeInQuart"===e&&(n=t*t*t*t),"easeOutQuart"===e&&(n=1- --t*t*t*t),"easeInOutQuart"===e&&(n=.5>t?8*t*t*t*t:1-8*--t*t*t*t),"easeInQuint"===e&&(n=t*t*t*t*t),"easeOutQuint"===e&&(n=1+--t*t*t*t*t),"easeInOutQuint"===e&&(n=.5>t?16*t*t*t*t*t:1+16*--t*t*t*t*t),n||t},m=function(e,t,n){var r=0;if(e.offsetParent)do r+=e.offsetTop,e=e.offsetParent;while(e);return r=Math.max(r-t-n,0),Math.min(r,p()-h())},h=function(){return Math.max(document.documentElement.clientHeight,window.innerHeight||0)},p=function(){return Math.max(e.document.body.scrollHeight,e.document.documentElement.scrollHeight,e.document.body.offsetHeight,e.document.documentElement.offsetHeight,e.document.body.clientHeight,e.document.documentElement.clientHeight)},g=function(e){return e&&"object"==typeof JSON&&"function"==typeof JSON.parse?JSON.parse(e):{}},b=function(t,n){e.history.pushState&&(n||"true"===n)&&"file:"!==e.location.protocol&&e.history.pushState(null,null,[e.location.protocol,"//",e.location.host,e.location.pathname,e.location.search,t].join(""))},v=function(e){return null===e?0:s(e)+e.offsetTop};c.animateScroll=function(n,c,u){var s=g(c?c.getAttribute("data-options"):null),f=l(t||i,u||{},s),h="[object Number]"===Object.prototype.toString.call(n)?!0:!1,y=h?null:"#"===n?e.document.documentElement:e.document.querySelector(n);if(h||y){var O=e.pageYOffset;r||(r=e.document.querySelector(f.selectorHeader)),o||(o=v(r));var S,I,H=h?n:m(y,o,parseInt(f.offset,10)),E=H-O,j=p(),w=0;h||b(n,f.updateURL);var C=function(t,r,o){var a=e.pageYOffset;(t==r||a==r||e.innerHeight+a>=j)&&(clearInterval(o),h||y.focus(),f.callback(n,c))},L=function(){w+=16,S=w/parseInt(f.speed,10),S=S>1?1:S,I=O+E*d(f.easing,S),e.scrollTo(0,Math.floor(I)),C(I,H,a)},A=function(){clearInterval(a),a=setInterval(L,16)};0===e.pageYOffset&&e.scrollTo(0,0),A()}};var y=function(e){if(0===e.button&&!e.metaKey&&!e.ctrlKey){var n=f(e.target,t.selector);if(n&&"a"===n.tagName.toLowerCase()){e.preventDefault();var r=c.escapeCharacters(n.hash);c.animateScroll(r,n,t)}}},O=function(e){n||(n=setTimeout(function(){n=null,o=v(r)},66))};return c.destroy=function(){t&&(e.document.removeEventListener("click",y,!1),e.removeEventListener("resize",O,!1),t=null,n=null,r=null,o=null,a=null)},c.init=function(n){u&&(c.destroy(),t=l(i,n||{}),r=e.document.querySelector(t.selectorHeader),o=v(r),e.document.addEventListener("click",y,!1),r&&e.addEventListener("resize",O,!1))},c});

/*!
 * instafeed.js v1.4.1 - A simple Instagram javascript plugin
 * http://instafeedjs.com
 * repo: https://github.com/stevenschobert/instafeed.js
 * License: MIT (https://github.com/stevenschobert/instafeed.js/blob/master/LICENSE)
 */
 
(function(){var a;a=function(){function a(a,b){var c,d;if(this.options={target:"instafeed",get:"popular",resolution:"thumbnail",sortBy:"none",links:!0,mock:!1,useHttp:!1},"object"==typeof a)for(c in a)d=a[c],this.options[c]=d;this.context=null!=b?b:this,this.unique=this._genKey()}return a.prototype.hasNext=function(){return"string"==typeof this.context.nextUrl&&this.context.nextUrl.length>0},a.prototype.next=function(){return!!this.hasNext()&&this.run(this.context.nextUrl)},a.prototype.run=function(b){var c,d,e;if("string"!=typeof this.options.clientId&&"string"!=typeof this.options.accessToken)throw new Error("Missing clientId or accessToken.");if("string"!=typeof this.options.accessToken&&"string"!=typeof this.options.clientId)throw new Error("Missing clientId or accessToken.");return null!=this.options.before&&"function"==typeof this.options.before&&this.options.before.call(this),"undefined"!=typeof document&&null!==document&&(e=document.createElement("script"),e.id="instafeed-fetcher",e.src=b||this._buildUrl(),c=document.getElementsByTagName("head"),c[0].appendChild(e),d="instafeedCache"+this.unique,window[d]=new a(this.options,this),window[d].unique=this.unique),!0},a.prototype.parse=function(a){var b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,t,u,v,w,x,y,z,A,B,C,D,E,F,G,H;if("object"!=typeof a){if(null!=this.options.error&&"function"==typeof this.options.error)return this.options.error.call(this,"Invalid JSON data"),!1;throw new Error("Invalid JSON response")}if(200!==a.meta.code){if(null!=this.options.error&&"function"==typeof this.options.error)return this.options.error.call(this,a.meta.error_message),!1;throw new Error("Error from Instagram: "+a.meta.error_message)}if(0===a.data.length){if(null!=this.options.error&&"function"==typeof this.options.error)return this.options.error.call(this,"No images were returned from Instagram"),!1;throw new Error("No images were returned from Instagram")}if(null!=this.options.success&&"function"==typeof this.options.success&&this.options.success.call(this,a),this.context.nextUrl="",null!=a.pagination&&(this.context.nextUrl=a.pagination.next_url),"none"!==this.options.sortBy)switch(F="random"===this.options.sortBy?["","random"]:this.options.sortBy.split("-"),E="least"===F[0],F[1]){case"random":a.data.sort(function(){return.5-Math.random()});break;case"recent":a.data=this._sortBy(a.data,"created_time",E);break;case"liked":a.data=this._sortBy(a.data,"likes.count",E);break;case"commented":a.data=this._sortBy(a.data,"comments.count",E);break;default:throw new Error("Invalid option for sortBy: '"+this.options.sortBy+"'.")}if("undefined"!=typeof document&&null!==document&&this.options.mock===!1){if(q=a.data,D=parseInt(this.options.limit,10),null!=this.options.limit&&q.length>D&&(q=q.slice(0,D)),h=document.createDocumentFragment(),null!=this.options.filter&&"function"==typeof this.options.filter&&(q=this._filter(q,this.options.filter)),null!=this.options.template&&"string"==typeof this.options.template){for(j="",o="",u="",H=document.createElement("div"),l=0,z=q.length;l<z;l++){if(m=q[l],n=m.images[this.options.resolution],"object"!=typeof n)throw g="No image found for resolution: "+this.options.resolution+".",new Error(g);v=n.width,s=n.height,t="square",v>s&&(t="landscape"),v<s&&(t="portrait"),p=n.url,k=window.location.protocol.indexOf("http")>=0,k&&!this.options.useHttp&&(p=p.replace(/https?:\/\//,"//")),o=this._makeTemplate(this.options.template,{model:m,id:m.id,link:m.link,type:m.type,image:p,width:v,height:s,orientation:t,caption:this._getObjectProperty(m,"caption.text"),likes:m.likes.count,comments:m.comments.count,location:this._getObjectProperty(m,"location.name")}),j+=o}for(H.innerHTML=j,e=[],d=0,c=H.childNodes.length;d<c;)e.push(H.childNodes[d]),d+=1;for(x=0,A=e.length;x<A;x++)C=e[x],h.appendChild(C)}else for(y=0,B=q.length;y<B;y++){if(m=q[y],r=document.createElement("img"),n=m.images[this.options.resolution],"object"!=typeof n)throw g="No image found for resolution: "+this.options.resolution+".",new Error(g);p=n.url,k=window.location.protocol.indexOf("http")>=0,k&&!this.options.useHttp&&(p=p.replace(/https?:\/\//,"//")),r.src=p,this.options.links===!0?(b=document.createElement("a"),b.href=m.link,b.appendChild(r),h.appendChild(b)):h.appendChild(r)}if(G=this.options.target,"string"==typeof G&&(G=document.getElementById(G)),null==G)throw g='No element with id="'+this.options.target+'" on page.',new Error(g);G.appendChild(h),i=document.getElementsByTagName("head")[0],i.removeChild(document.getElementById("instafeed-fetcher")),w="instafeedCache"+this.unique,window[w]=void 0;try{delete window[w]}catch(a){f=a}}return null!=this.options.after&&"function"==typeof this.options.after&&this.options.after.call(this),!0},a.prototype._buildUrl=function(){var a,b,c;switch(a="https://api.instagram.com/v1",this.options.get){case"popular":b="media/popular";break;case"tagged":if(!this.options.tagName)throw new Error("No tag name specified. Use the 'tagName' option.");b="tags/"+this.options.tagName+"/media/recent";break;case"location":if(!this.options.locationId)throw new Error("No location specified. Use the 'locationId' option.");b="locations/"+this.options.locationId+"/media/recent";break;case"user":if(!this.options.userId)throw new Error("No user specified. Use the 'userId' option.");b="users/"+this.options.userId+"/media/recent";break;default:throw new Error("Invalid option for get: '"+this.options.get+"'.")}return c=a+"/"+b,c+=null!=this.options.accessToken?"?access_token="+this.options.accessToken:"?client_id="+this.options.clientId,null!=this.options.limit&&(c+="&count="+this.options.limit),c+="&callback=instafeedCache"+this.unique+".parse"},a.prototype._genKey=function(){var a;return a=function(){return(65536*(1+Math.random())|0).toString(16).substring(1)},""+a()+a()+a()+a()},a.prototype._makeTemplate=function(a,b){var c,d,e,f,g;for(d=/(?:\{{2})([\w\[\]\.]+)(?:\}{2})/,c=a;d.test(c);)f=c.match(d)[1],g=null!=(e=this._getObjectProperty(b,f))?e:"",c=c.replace(d,function(){return""+g});return c},a.prototype._getObjectProperty=function(a,b){var c,d;for(b=b.replace(/\[(\w+)\]/g,".$1"),d=b.split(".");d.length;){if(c=d.shift(),!(null!=a&&c in a))return null;a=a[c]}return a},a.prototype._sortBy=function(a,b,c){var d;return d=function(a,d){var e,f;return e=this._getObjectProperty(a,b),f=this._getObjectProperty(d,b),c?e>f?1:-1:e<f?1:-1},a.sort(d.bind(this)),a},a.prototype._filter=function(a,b){var c,d,e,f,g;for(c=[],d=function(a){if(b(a))return c.push(a)},e=0,g=a.length;e<g;e++)f=a[e],d(f);return c},a}(),function(a,b){return"function"==typeof define&&define.amd?define([],b):"object"==typeof module&&module.exports?module.exports=b():a.Instafeed=b()}(this,function(){return a})}).call(this);
 


/**
 * @license
 * lodash 4.5.1 (Custom Build) lodash.com/license | Underscore.js 1.8.3 underscorejs.org/LICENSE
 * Build: `lodash core -o ./dist/lodash.core.js`
 */
;(function(){function n(n,t){for(var r=-1,e=t.length,u=n.length;++r<e;)n[u+r]=t[r];return n}function t(n,t,r){for(var e=-1,u=n.length;++e<u;){var o=n[e],i=t(o);if(null!=i&&(c===an?i===i:r(i,c)))var c=i,f=o}return f}function r(n,t,r){var e;return r(n,function(n,r,u){return t(n,r,u)?(e=n,false):void 0}),e}function e(n,t,r,e,u){return u(n,function(n,u,o){r=e?(e=false,n):t(r,n,u,o)}),r}function u(n,t){return O(t,function(t){return n[t]})}function o(n){return n&&n.Object===Object?n:null}function i(n){return vn[n];
}function c(n){var t=false;if(null!=n&&typeof n.toString!="function")try{t=!!(n+"")}catch(r){}return t}function f(n,t){return n=typeof n=="number"||hn.test(n)?+n:-1,n>-1&&0==n%1&&(null==t?9007199254740991:t)>n}function a(n){if(Y(n)&&!Pn(n)){if(n instanceof l)return n;if(En.call(n,"__wrapped__")){var t=new l(n.__wrapped__,n.__chain__);return t.__actions__=N(n.__actions__),t}}return new l(n)}function l(n,t){this.__wrapped__=n,this.__actions__=[],this.__chain__=!!t}function p(n,t,r,e){var u;return(u=n===an)||(u=xn[r],
u=(n===u||n!==n&&u!==u)&&!En.call(e,r)),u?t:n}function s(n){return X(n)?Fn(n):{}}function h(n,t,r){if(typeof n!="function")throw new TypeError("Expected a function");return setTimeout(function(){n.apply(an,r)},t)}function v(n,t){var r=true;return $n(n,function(n,e,u){return r=!!t(n,e,u)}),r}function y(n,t){var r=[];return $n(n,function(n,e,u){t(n,e,u)&&r.push(n)}),r}function _(t,r,e,u){u||(u=[]);for(var o=-1,i=t.length;++o<i;){var c=t[o];r>0&&Y(c)&&L(c)&&(e||Pn(c)||K(c))?r>1?_(c,r-1,e,u):n(u,c):e||(u[u.length]=c);
}return u}function g(n,t){return n&&qn(n,t,en)}function b(n,t){return y(t,function(t){return Q(n[t])})}function j(n,t,r,e,u){return n===t?true:null==n||null==t||!X(n)&&!Y(t)?n!==n&&t!==t:m(n,t,j,r,e,u)}function m(n,t,r,e,u,o){var i=Pn(n),f=Pn(t),a="[object Array]",l="[object Array]";i||(a=kn.call(n),"[object Arguments]"==a&&(a="[object Object]")),f||(l=kn.call(t),"[object Arguments]"==l&&(l="[object Object]"));var p="[object Object]"==a&&!c(n),f="[object Object]"==l&&!c(t);return!(l=a==l)||i||p?2&u||(a=p&&En.call(n,"__wrapped__"),
f=f&&En.call(t,"__wrapped__"),!a&&!f)?l?(o||(o=[]),(a=J(o,function(t){return t[0]===n}))&&a[1]?a[1]==t:(o.push([n,t]),t=(i?I:q)(n,t,r,e,u,o),o.pop(),t)):false:r(a?n.value():n,f?t.value():t,e,u,o):$(n,t,a)}function d(n){var t=typeof n;return"function"==t?n:null==n?cn:("object"==t?x:A)(n)}function w(n){n=null==n?n:Object(n);var t,r=[];for(t in n)r.push(t);return r}function O(n,t){var r=-1,e=L(n)?Array(n.length):[];return $n(n,function(n,u,o){e[++r]=t(n,u,o)}),e}function x(n){var t=en(n);return function(r){
var e=t.length;if(null==r)return!e;for(r=Object(r);e--;){var u=t[e];if(!(u in r&&j(n[u],r[u],an,3)))return false}return true}}function E(n,t){return n=Object(n),P(t,function(t,r){return r in n&&(t[r]=n[r]),t},{})}function A(n){return function(t){return null==t?an:t[n]}}function k(n,t,r){var e=-1,u=n.length;for(0>t&&(t=-t>u?0:u+t),r=r>u?u:r,0>r&&(r+=u),u=t>r?0:r-t>>>0,t>>>=0,r=Array(u);++e<u;)r[e]=n[e+t];return r}function N(n){return k(n,0,n.length)}function S(n,t){var r;return $n(n,function(n,e,u){return r=t(n,e,u),
!r}),!!r}function T(t,r){return P(r,function(t,r){return r.func.apply(r.thisArg,n([t],r.args))},t)}function F(n,t,r,e){r||(r={});for(var u=-1,o=t.length;++u<o;){var i=t[u],c=e?e(r[i],n[i],i,r,n):n[i],f=r,a=f[i];En.call(f,i)&&(a===c||a!==a&&c!==c)&&(c!==an||i in f)||(f[i]=c)}return r}function R(n){return V(function(t,r){var e=-1,u=r.length,o=u>1?r[u-1]:an,o=typeof o=="function"?(u--,o):an;for(t=Object(t);++e<u;){var i=r[e];i&&n(t,i,e,o)}return t})}function B(n){return function(){var t=arguments,r=s(n.prototype),t=n.apply(r,t);
return X(t)?t:r}}function D(n,t,r){function e(){for(var o=-1,i=arguments.length,c=-1,f=r.length,a=Array(f+i),l=this&&this!==wn&&this instanceof e?u:n;++c<f;)a[c]=r[c];for(;i--;)a[c++]=arguments[++o];return l.apply(t,a)}if(typeof n!="function")throw new TypeError("Expected a function");var u=B(n);return e}function I(n,t,r,e,u,o){var i=-1,c=1&u,f=n.length,a=t.length;if(f!=a&&!(2&u&&a>f))return false;for(a=true;++i<f;){var l=n[i],p=t[i];if(void 0!==an){a=false;break}if(c){if(!S(t,function(n){return l===n||r(l,n,e,u,o);
})){a=false;break}}else if(l!==p&&!r(l,p,e,u,o)){a=false;break}}return a}function $(n,t,r){switch(r){case"[object Boolean]":case"[object Date]":return+n==+t;case"[object Error]":return n.name==t.name&&n.message==t.message;case"[object Number]":return n!=+n?t!=+t:n==+t;case"[object RegExp]":case"[object String]":return n==t+""}return false}function q(n,t,r,e,u,o){var i=2&u,c=en(n),f=c.length,a=en(t).length;if(f!=a&&!i)return false;for(var l=f;l--;){var p=c[l];if(!(i?p in t:En.call(t,p)))return false}for(a=true;++l<f;){
var p=c[l],s=n[p],h=t[p];if(void 0!==an||s!==h&&!r(s,h,e,u,o)){a=false;break}i||(i="constructor"==p)}return a&&!i&&(r=n.constructor,e=t.constructor,r!=e&&"constructor"in n&&"constructor"in t&&!(typeof r=="function"&&r instanceof r&&typeof e=="function"&&e instanceof e)&&(a=false)),a}function z(n){var t=n?n.length:an;if(W(t)&&(Pn(n)||nn(n)||K(n))){n=String;for(var r=-1,e=Array(t);++r<t;)e[r]=n(r);t=e}else t=null;return t}function C(n){var t=n&&n.constructor,t=Q(t)&&t.prototype||xn;return n===t}function G(n){
return n?n[0]:an}function J(n,t){return r(n,d(t),$n)}function M(n,t){return $n(n,typeof t=="function"?t:cn)}function P(n,t,r){return e(n,d(t),r,3>arguments.length,$n)}function U(n,t){var r;if(typeof t!="function")throw new TypeError("Expected a function");return n=Un(n),function(){return 0<--n&&(r=t.apply(this,arguments)),1>=n&&(t=an),r}}function V(n){var t;if(typeof n!="function")throw new TypeError("Expected a function");return t=In(t===an?n.length-1:Un(t),0),function(){for(var r=arguments,e=-1,u=In(r.length-t,0),o=Array(u);++e<u;)o[e]=r[t+e];
for(u=Array(t+1),e=-1;++e<t;)u[e]=r[e];return u[t]=o,n.apply(this,u)}}function H(n,t){return n>t}function K(n){return Y(n)&&L(n)&&En.call(n,"callee")&&(!Rn.call(n,"callee")||"[object Arguments]"==kn.call(n))}function L(n){return null!=n&&!(typeof n=="function"&&Q(n))&&W(zn(n))}function Q(n){return n=X(n)?kn.call(n):"","[object Function]"==n||"[object GeneratorFunction]"==n}function W(n){return typeof n=="number"&&n>-1&&0==n%1&&9007199254740991>=n}function X(n){var t=typeof n;return!!n&&("object"==t||"function"==t);
}function Y(n){return!!n&&typeof n=="object"}function Z(n){return typeof n=="number"||Y(n)&&"[object Number]"==kn.call(n)}function nn(n){return typeof n=="string"||!Pn(n)&&Y(n)&&"[object String]"==kn.call(n)}function tn(n,t){return t>n}function rn(n){return typeof n=="string"?n:null==n?"":n+""}function en(n){var t=C(n);if(!t&&!L(n))return Dn(Object(n));var r,e=z(n),u=!!e,e=e||[],o=e.length;for(r in n)!En.call(n,r)||u&&("length"==r||f(r,o))||t&&"constructor"==r||e.push(r);return e}function un(n){for(var t=-1,r=C(n),e=w(n),u=e.length,o=z(n),i=!!o,o=o||[],c=o.length;++t<u;){
var a=e[t];i&&("length"==a||f(a,c))||"constructor"==a&&(r||!En.call(n,a))||o.push(a)}return o}function on(n){return n?u(n,en(n)):[]}function cn(n){return n}function fn(t,r,e){var u=en(r),o=b(r,u);null!=e||X(r)&&(o.length||!u.length)||(e=r,r=t,t=this,o=b(r,en(r)));var i=X(e)&&"chain"in e?e.chain:true,c=Q(t);return $n(o,function(e){var u=r[e];t[e]=u,c&&(t.prototype[e]=function(){var r=this.__chain__;if(i||r){var e=t(this.__wrapped__);return(e.__actions__=N(this.__actions__)).push({func:u,args:arguments,
thisArg:t}),e.__chain__=r,e}return u.apply(t,n([this.value()],arguments))})}),t}var an,ln=1/0,pn=/[&<>"'`]/g,sn=RegExp(pn.source),hn=/^(?:0|[1-9]\d*)$/,vn={"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;","`":"&#96;"},yn={"function":true,object:true},_n=yn[typeof exports]&&exports&&!exports.nodeType?exports:an,gn=yn[typeof module]&&module&&!module.nodeType?module:an,bn=gn&&gn.exports===_n?_n:an,jn=o(yn[typeof self]&&self),mn=o(yn[typeof window]&&window),dn=o(yn[typeof this]&&this),wn=o(_n&&gn&&typeof global=="object"&&global)||mn!==(dn&&dn.window)&&mn||jn||dn||Function("return this")(),On=Array.prototype,xn=Object.prototype,En=xn.hasOwnProperty,An=0,kn=xn.toString,Nn=wn._,Sn=wn.Reflect,Tn=Sn?Sn.f:an,Fn=Object.create,Rn=xn.propertyIsEnumerable,Bn=wn.isFinite,Dn=Object.keys,In=Math.max,$n=function(n,t){
return function(r,e){if(null==r)return r;if(!L(r))return n(r,e);for(var u=r.length,o=t?u:-1,i=Object(r);(t?o--:++o<u)&&false!==e(i[o],o,i););return r}}(g),qn=function(n){return function(t,r,e){var u=-1,o=Object(t);e=e(t);for(var i=e.length;i--;){var c=e[n?i:++u];if(false===r(o[c],c,o))break}return t}}();Tn&&!Rn.call({valueOf:1},"valueOf")&&(w=function(n){n=Tn(n);for(var t,r=[];!(t=n.next()).done;)r.push(t.value);return r});var zn=A("length"),Cn=V(function(t,r){return Pn(t)||(t=null==t?[]:[Object(t)]),_(r,1),
n(N(t),on)}),Gn=V(function(n,t,r){return D(n,t,r)}),Jn=V(function(n,t){return h(n,1,t)}),Mn=V(function(n,t,r){return h(n,Vn(t)||0,r)}),Pn=Array.isArray,Un=Number,Vn=Number,Hn=R(function(n,t){F(t,en(t),n)}),Kn=R(function(n,t){F(t,un(t),n)}),Ln=R(function(n,t,r,e){F(t,un(t),n,e)}),Qn=V(function(n){return n.push(an,p),Ln.apply(an,n)}),Wn=V(function(n,t){return null==n?{}:E(n,_(t,1))}),Xn=d;l.prototype=s(a.prototype),l.prototype.constructor=l,a.assignIn=Kn,a.before=U,a.bind=Gn,a.chain=function(n){return n=a(n),
n.__chain__=true,n},a.compact=function(n){return y(n,Boolean)},a.concat=Cn,a.create=function(n,t){var r=s(n);return t?Hn(r,t):r},a.defaults=Qn,a.defer=Jn,a.delay=Mn,a.filter=function(n,t){return y(n,d(t))},a.flatten=function(n){return n&&n.length?_(n,1):[]},a.flattenDeep=function(n){return n&&n.length?_(n,ln):[]},a.iteratee=Xn,a.keys=en,a.map=function(n,t){return O(n,d(t))},a.matches=function(n){return x(Hn({},n))},a.mixin=fn,a.negate=function(n){if(typeof n!="function")throw new TypeError("Expected a function");
return function(){return!n.apply(this,arguments)}},a.once=function(n){return U(2,n)},a.pick=Wn,a.slice=function(n,t,r){var e=n?n.length:0;return r=r===an?e:+r,e?k(n,null==t?0:+t,r):[]},a.sortBy=function(n,t){var r=0;return t=d(t),O(O(n,function(n,e,u){return{c:n,b:r++,a:t(n,e,u)}}).sort(function(n,t){var r;n:{r=n.a;var e=t.a;if(r!==e){var u=null===r,o=r===an,i=r===r,c=null===e,f=e===an,a=e===e;if(r>e&&!c||!i||u&&!f&&a||o&&a){r=1;break n}if(e>r&&!u||!a||c&&!o&&i||f&&i){r=-1;break n}}r=0}return r||n.b-t.b;
}),A("c"))},a.tap=function(n,t){return t(n),n},a.thru=function(n,t){return t(n)},a.toArray=function(n){return L(n)?n.length?N(n):[]:on(n)},a.values=on,a.extend=Kn,fn(a,a),a.clone=function(n){return X(n)?Pn(n)?N(n):F(n,en(n)):n},a.escape=function(n){return(n=rn(n))&&sn.test(n)?n.replace(pn,i):n},a.every=function(n,t,r){return t=r?an:t,v(n,d(t))},a.find=J,a.forEach=M,a.has=function(n,t){return null!=n&&En.call(n,t)},a.head=G,a.identity=cn,a.indexOf=function(n,t,r){var e=n?n.length:0;r=typeof r=="number"?0>r?In(e+r,0):r:0,
r=(r||0)-1;for(var u=t===t;++r<e;){var o=n[r];if(u?o===t:o!==o)return r}return-1},a.isArguments=K,a.isArray=Pn,a.isBoolean=function(n){return true===n||false===n||Y(n)&&"[object Boolean]"==kn.call(n)},a.isDate=function(n){return Y(n)&&"[object Date]"==kn.call(n)},a.isEmpty=function(n){if(L(n)&&(Pn(n)||nn(n)||Q(n.splice)||K(n)))return!n.length;for(var t in n)if(En.call(n,t))return false;return true},a.isEqual=function(n,t){return j(n,t)},a.isFinite=function(n){return typeof n=="number"&&Bn(n)},a.isFunction=Q,a.isNaN=function(n){
return Z(n)&&n!=+n},a.isNull=function(n){return null===n},a.isNumber=Z,a.isObject=X,a.isRegExp=function(n){return X(n)&&"[object RegExp]"==kn.call(n)},a.isString=nn,a.isUndefined=function(n){return n===an},a.last=function(n){var t=n?n.length:0;return t?n[t-1]:an},a.max=function(n){return n&&n.length?t(n,cn,H):an},a.min=function(n){return n&&n.length?t(n,cn,tn):an},a.noConflict=function(){return wn._===this&&(wn._=Nn),this},a.noop=function(){},a.reduce=P,a.result=function(n,t,r){return t=null==n?an:n[t],
t===an&&(t=r),Q(t)?t.call(n):t},a.size=function(n){return null==n?0:(n=L(n)?n:en(n),n.length)},a.some=function(n,t,r){return t=r?an:t,S(n,d(t))},a.uniqueId=function(n){var t=++An;return rn(n)+t},a.each=M,a.first=G,fn(a,function(){var n={};return g(a,function(t,r){En.call(a.prototype,r)||(n[r]=t)}),n}(),{chain:false}),a.VERSION="4.5.1",$n("pop join replace reverse split push shift sort splice unshift".split(" "),function(n){var t=(/^(?:replace|split)$/.test(n)?String.prototype:On)[n],r=/^(?:push|sort|unshift)$/.test(n)?"tap":"thru",e=/^(?:pop|join|replace|shift)$/.test(n);
a.prototype[n]=function(){var n=arguments;return e&&!this.__chain__?t.apply(this.value(),n):this[r](function(r){return t.apply(r,n)})}}),a.prototype.toJSON=a.prototype.valueOf=a.prototype.value=function(){return T(this.__wrapped__,this.__actions__)},(mn||jn||{})._=a,typeof define=="function"&&typeof define.amd=="object"&&define.amd? define(function(){return a}):_n&&gn?(bn&&((gn.exports=a)._=a),_n._=a):wn._=a}).call(this);

/**!
 * trunk8 v1.3.3
 * https://github.com/rviscomi/trunk8
 *
 * Copyright 2012 Rick Viscomi
 * Released under the MIT License.
 *
 * Date: September 26, 2012
 */

!function(t,e){"function"==typeof define&&define.amd?define(["jquery"],e):"object"==typeof module&&module.exports?e(require("jquery")):e(t.jQuery)}(this,function(t){var e,n,r="center",i="left",a="right",s={auto:"auto"};function o(e){this.$element=t(e),this.original_text=t.trim(this.$element.html()),this.settings=t.extend({},t.fn.trunk8.defaults)}function l(t){var e=document.createElement("DIV");return e.innerHTML=t,void 0!==e.textContent?e.textContent:e.innerText}function u(e,n,r){e=e.replace(r,"");var i=function(n,a){var s,o,l,u,h="";for(u=0;u<n.length;u++)s=n[u],l=t.trim(e).split(" ").length,t.trim(e).length&&("string"==typeof s?(/<br\s*\/?>/i.test(s)||(1===l&&t.trim(e).length<=s.length?(s=e,"p"!==a&&"div"!==a||(s+=r),e=""):e=e.replace(s,"")),h+=t.trim(s)+(u===n.length-1||l<=1?"":" ")):(o=i(s.content,s.tag),s.after&&(e=e.replace(s.after,"")),o&&(s.after||(s.after=" "),h+="<"+s.tag+s.attribs+">"+o+"</"+s.tag+">"+s.after)));return h},a=i(n);return a.slice(a.length-r.length)!==r&&(a+=r),a}function h(){var e,r,i,a,o,h,c=this.data("trunk8"),f=c.settings,g=f.width,d=f.side,p=f.fill,m=f.parseHTML,v=n.getLineHeight(this)*f.lines,y=c.original_text,S=y.length,x="";if(this.html(y),o=this.text(),m&&l(y)!==y&&(h=function t(e){if(l(e)===e)return e.split(/\s/g);for(var n,r,i=[],a=/<([a-z]+)([^<]*)(?:>([\S\s]*?(?!<\1>))<\/\1>|\s+\/>)(['.?!,]*)|((?:[^<>\s])+['.?!,]*\w?|<br\s?\/?>)/gi,s=a.exec(e);s&&n!==a.lastIndex;)n=a.lastIndex,s[5]?i.push(s[5]):s[1]&&i.push({tag:s[1],attribs:s[2],content:s[3],after:s[4]}),s=a.exec(e);for(r=0;r<i.length;r++)"string"!=typeof i[r]&&i[r].content&&(i[r].content=t(i[r].content));return i}(y),S=(y=l(y)).length),g===s.auto){if(this.height()<=v)return;for(e=0,r=S-1;e<=r;)i=e+(r-e>>1),a=n.eatStr(y,d,S-i,p),m&&h&&(a=u(a,h,p)),this.html(a),this.height()>v?r=i-1:(e=i+1,x=x.length>a.length?x:a);this.html(""),this.html(x),f.tooltip&&this.attr("title",o)}else{if(isNaN(g))return void t.error('Invalid width "'+g+'".');i=S-g,a=n.eatStr(y,d,i,p),this.html(a),f.tooltip&&this.attr("title",y)}f.onTruncate()}o.prototype.updateSettings=function(e){this.settings=t.extend(this.settings,e)},e={init:function(e){return this.each(function(){var n=t(this),r=n.data("trunk8");r||n.data("trunk8",r=new o(this)),r.updateSettings(e),h.call(n)})},update:function(e){return this.each(function(){var n=t(this);e&&(n.data("trunk8").original_text=e),h.call(n)})},revert:function(){return this.each(function(){var e=t(this).data("trunk8").original_text;t(this).html(e)})},getSettings:function(){return t(this.get(0)).data("trunk8").settings}},(n={eatStr:function(e,s,o,l){var u,h,c=e.length,f=n.eatStr.generateKey.apply(null,arguments);if(n.eatStr.cache[f])return n.eatStr.cache[f];if("string"==typeof e&&0!==c||t.error('Invalid source string "'+e+'".'),o<0||o>c)t.error('Invalid bite size "'+o+'".');else if(0===o)return e;switch("string"!=typeof(l+"")&&t.error("Fill unable to be converted to a string."),s){case a:return n.eatStr.cache[f]=t.trim(e.substr(0,c-o))+l;case i:return n.eatStr.cache[f]=l+t.trim(e.substr(o));case r:return u=c>>1,h=o>>1,n.eatStr.cache[f]=t.trim(n.eatStr(e.substr(0,c-u),a,o-h,""))+l+t.trim(n.eatStr(e.substr(c-u),i,h,""));default:t.error('Invalid side "'+s+'".')}},getLineHeight:function(e){var n=t(e).css("float");"none"!==n&&t(e).css("float","none");var r=t(e).css("position");"absolute"===r&&t(e).css("position","static");var i,a=t(e).html(),s="line-height-test";return t(e).html("i").wrap('<div id="'+s+'" />'),i=t("#"+s).innerHeight(),t(e).html(a).css({float:n,position:r}).unwrap(),i}}).eatStr.cache={},n.eatStr.generateKey=function(){return Array.prototype.join.call(arguments,"")},t.fn.trunk8=function(n){return e[n]?e[n].apply(this,Array.prototype.slice.call(arguments,1)):"object"!=typeof n&&n?void t.error("Method "+n+" does not exist on jQuery.trunk8"):e.init.apply(this,arguments)},t.fn.trunk8.defaults={fill:"&hellip;",lines:1,side:a,tooltip:!0,width:s.auto,parseHTML:!1,onTruncate:function(){}}});

//# sourceMappingURL=gmaps.min.js.map
"use strict";!function(a,b){"object"==typeof exports?module.exports=b():"function"==typeof define&&define.amd?define(["jquery","googlemaps!"],b):a.GMaps=b()}(this,function(){var a=function(a,b){var c;if(a===b)return a;for(c in b)void 0!==b[c]&&(a[c]=b[c]);return a},b=function(a,b){var c,d=Array.prototype.slice.call(arguments,2),e=[],f=a.length;if(Array.prototype.map&&a.map===Array.prototype.map)e=Array.prototype.map.call(a,function(a){var c=d.slice(0);return c.splice(0,0,a),b.apply(this,c)});else for(c=0;c<f;c++)callback_params=d,callback_params.splice(0,0,a[c]),e.push(b.apply(this,callback_params));return e},c=function(a){var b,c=[];for(b=0;b<a.length;b++)c=c.concat(a[b]);return c},d=function(a,b){var c=a[0],d=a[1];return b&&(c=a[1],d=a[0]),new google.maps.LatLng(c,d)},f=function(a,b){var c;for(c=0;c<a.length;c++)a[c]instanceof google.maps.LatLng||(a[c].length>0&&"object"==typeof a[c][0]?a[c]=f(a[c],b):a[c]=d(a[c],b));return a},g=function(a,b){var c=a.replace(".","");return"jQuery"in this&&b?$("."+c,b)[0]:document.getElementsByClassName(c)[0]},h=function(a,b){var a=a.replace("#","");return"jQuery"in window&&b?$("#"+a,b)[0]:document.getElementById(a)},i=function(a){var b=0,c=0;if(a.getBoundingClientRect){var d=a.getBoundingClientRect(),e=-(window.scrollX?window.scrollX:window.pageXOffset),f=-(window.scrollY?window.scrollY:window.pageYOffset);return[d.left-e,d.top-f]}if(a.offsetParent)do b+=a.offsetLeft,c+=a.offsetTop;while(a=a.offsetParent);return[b,c]},j=function(b){var c=document,d=function(b){if("object"!=typeof window.google||!window.google.maps)return"object"==typeof window.console&&window.console.error&&console.error("Google Maps API is required. Please register the following JavaScript library https://maps.googleapis.com/maps/api/js."),function(){};if(!this)return new d(b);b.zoom=b.zoom||15,b.mapType=b.mapType||"roadmap";var e,f=function(a,b){return void 0===a?b:a},j=this,k=["bounds_changed","center_changed","click","dblclick","drag","dragend","dragstart","idle","maptypeid_changed","projection_changed","resize","tilesloaded","zoom_changed"],l=["mousemove","mouseout","mouseover"],m=["el","lat","lng","mapType","width","height","markerClusterer","enableNewStyle"],n=b.el||b.div,o=b.markerClusterer,p=google.maps.MapTypeId[b.mapType.toUpperCase()],q=new google.maps.LatLng(b.lat,b.lng),r=f(b.zoomControl,!0),s=b.zoomControlOpt||{style:"DEFAULT",position:"TOP_LEFT"},t=s.style||"DEFAULT",u=s.position||"TOP_LEFT",v=f(b.panControl,!0),w=f(b.mapTypeControl,!0),x=f(b.scaleControl,!0),y=f(b.streetViewControl,!0),z=f(z,!0),A={},B={zoom:this.zoom,center:q,mapTypeId:p},C={panControl:v,zoomControl:r,zoomControlOptions:{style:google.maps.ZoomControlStyle[t],position:google.maps.ControlPosition[u]},mapTypeControl:w,scaleControl:x,streetViewControl:y,overviewMapControl:z};if("string"==typeof b.el||"string"==typeof b.div?n.indexOf("#")>-1?this.el=h(n,b.context):this.el=g.apply(this,[n,b.context]):this.el=n,void 0===this.el||null===this.el)throw"No element defined.";for(window.context_menu=window.context_menu||{},window.context_menu[j.el.id]={},this.controls=[],this.overlays=[],this.layers=[],this.singleLayers={},this.markers=[],this.polylines=[],this.routes=[],this.polygons=[],this.infoWindow=null,this.overlay_el=null,this.zoom=b.zoom,this.registered_events={},this.el.style.width=b.width||this.el.scrollWidth||this.el.offsetWidth,this.el.style.height=b.height||this.el.scrollHeight||this.el.offsetHeight,google.maps.visualRefresh=b.enableNewStyle,e=0;e<m.length;e++)delete b[m[e]];for(1!=b.disableDefaultUI&&(B=a(B,C)),A=a(B,b),e=0;e<k.length;e++)delete A[k[e]];for(e=0;e<l.length;e++)delete A[l[e]];this.map=new google.maps.Map(this.el,A),o&&(this.markerClusterer=o.apply(this,[this.map]));var D=function(a,b){var c="",d=window.context_menu[j.el.id][a];for(var e in d)if(d.hasOwnProperty(e)){var f=d[e];c+='<li><a id="'+a+"_"+e+'" href="#">'+f.title+"</a></li>"}if(h("gmaps_context_menu")){var g=h("gmaps_context_menu");g.innerHTML=c;var e,k=g.getElementsByTagName("a"),l=k.length;for(e=0;e<l;e++){var m=k[e],n=function(c){c.preventDefault(),d[this.id.replace(a+"_","")].action.apply(j,[b]),j.hideContextMenu()};google.maps.event.clearListeners(m,"click"),google.maps.event.addDomListenerOnce(m,"click",n,!1)}var o=i.apply(this,[j.el]),p=o[0]+b.pixel.x-15,q=o[1]+b.pixel.y-15;g.style.left=p+"px",g.style.top=q+"px"}};this.buildContextMenu=function(a,b){if("marker"===a){b.pixel={};var c=new google.maps.OverlayView;c.setMap(j.map),c.draw=function(){var d=c.getProjection(),e=b.marker.getPosition();b.pixel=d.fromLatLngToContainerPixel(e),D(a,b)}}else D(a,b);var d=h("gmaps_context_menu");setTimeout(function(){d.style.display="block"},0)},this.setContextMenu=function(a){window.context_menu[j.el.id][a.control]={};var b,d=c.createElement("ul");for(b in a.options)if(a.options.hasOwnProperty(b)){var e=a.options[b];window.context_menu[j.el.id][a.control][e.name]={title:e.title,action:e.action}}d.id="gmaps_context_menu",d.style.display="none",d.style.position="absolute",d.style.minWidth="100px",d.style.background="white",d.style.listStyle="none",d.style.padding="8px",d.style.boxShadow="2px 2px 6px #ccc",h("gmaps_context_menu")||c.body.appendChild(d);var f=h("gmaps_context_menu");google.maps.event.addDomListener(f,"mouseout",function(a){a.relatedTarget&&this.contains(a.relatedTarget)||window.setTimeout(function(){f.style.display="none"},400)},!1)},this.hideContextMenu=function(){var a=h("gmaps_context_menu");a&&(a.style.display="none")};var E=function(a,c){google.maps.event.addListener(a,c,function(a){void 0==a&&(a=this),b[c].apply(this,[a]),j.hideContextMenu()})};google.maps.event.addListener(this.map,"zoom_changed",this.hideContextMenu);for(var F=0;F<k.length;F++){var G=k[F];G in b&&E(this.map,G)}for(var F=0;F<l.length;F++){var G=l[F];G in b&&E(this.map,G)}google.maps.event.addListener(this.map,"rightclick",function(a){b.rightclick&&b.rightclick.apply(this,[a]),void 0!=window.context_menu[j.el.id].map&&j.buildContextMenu("map",a)}),this.refresh=function(){google.maps.event.trigger(this.map,"resize")},this.fitZoom=function(){var a,b=[],c=this.markers.length;for(a=0;a<c;a++)"boolean"==typeof this.markers[a].visible&&this.markers[a].visible&&b.push(this.markers[a].getPosition());this.fitLatLngBounds(b)},this.fitLatLngBounds=function(a){var b,c=a.length,d=new google.maps.LatLngBounds;for(b=0;b<c;b++)d.extend(a[b]);this.map.fitBounds(d)},this.setCenter=function(a,b,c){this.map.panTo(new google.maps.LatLng(a,b)),c&&c()},this.getElement=function(){return this.el},this.zoomIn=function(a){a=a||1,this.zoom=this.map.getZoom()+a,this.map.setZoom(this.zoom)},this.zoomOut=function(a){a=a||1,this.zoom=this.map.getZoom()-a,this.map.setZoom(this.zoom)};var H,I=[];for(H in this.map)"function"!=typeof this.map[H]||this[H]||I.push(H);for(e=0;e<I.length;e++)!function(a,b,c){a[c]=function(){return b[c].apply(b,arguments)}}(this,this.map,I[e])};return d}(this);j.prototype.createControl=function(a){var b=document.createElement("div");b.style.cursor="pointer",a.disableDefaultStyles!==!0&&(b.style.fontFamily="Roboto, Arial, sans-serif",b.style.fontSize="11px",b.style.boxShadow="rgba(0, 0, 0, 0.298039) 0px 1px 4px -1px");for(var c in a.style)b.style[c]=a.style[c];a.id&&(b.id=a.id),a.title&&(b.title=a.title),a.classes&&(b.className=a.classes),a.content&&("string"==typeof a.content?b.innerHTML=a.content:a.content instanceof HTMLElement&&b.appendChild(a.content)),a.position&&(b.position=google.maps.ControlPosition[a.position.toUpperCase()]);for(var d in a.events)!function(b,c){google.maps.event.addDomListener(b,c,function(){a.events[c].apply(this,[this])})}(b,d);return b.index=1,b},j.prototype.addControl=function(a){var b=this.createControl(a);return this.controls.push(b),this.map.controls[b.position].push(b),b},j.prototype.removeControl=function(a){var b,c=null;for(b=0;b<this.controls.length;b++)this.controls[b]==a&&(c=this.controls[b].position,this.controls.splice(b,1));if(c)for(b=0;b<this.map.controls.length;b++){var d=this.map.controls[a.position];if(d.getAt(b)==a){d.removeAt(b);break}}return a},j.prototype.createMarker=function(b){if(void 0==b.lat&&void 0==b.lng&&void 0==b.position)throw"No latitude or longitude defined.";var c=this,d=b.details,e=b.fences,f=b.outside,g={position:new google.maps.LatLng(b.lat,b.lng),map:null},h=a(g,b);delete h.lat,delete h.lng,delete h.fences,delete h.outside;var i=new google.maps.Marker(h);if(i.fences=e,b.infoWindow){i.infoWindow=new google.maps.InfoWindow(b.infoWindow);for(var j=["closeclick","content_changed","domready","position_changed","zindex_changed"],k=0;k<j.length;k++)!function(a,c){b.infoWindow[c]&&google.maps.event.addListener(a,c,function(a){b.infoWindow[c].apply(this,[a])})}(i.infoWindow,j[k])}for(var l=["animation_changed","clickable_changed","cursor_changed","draggable_changed","flat_changed","icon_changed","position_changed","shadow_changed","shape_changed","title_changed","visible_changed","zindex_changed"],m=["dblclick","drag","dragend","dragstart","mousedown","mouseout","mouseover","mouseup"],k=0;k<l.length;k++)!function(a,c){b[c]&&google.maps.event.addListener(a,c,function(){b[c].apply(this,[this])})}(i,l[k]);for(var k=0;k<m.length;k++)!function(a,c,d){b[d]&&google.maps.event.addListener(c,d,function(c){c.pixel||(c.pixel=a.getProjection().fromLatLngToPoint(c.latLng)),b[d].apply(this,[c])})}(this.map,i,m[k]);return google.maps.event.addListener(i,"click",function(){this.details=d,b.click&&b.click.apply(this,[this]),i.infoWindow&&(c.hideInfoWindows(),i.infoWindow.open(c.map,i))}),google.maps.event.addListener(i,"rightclick",function(a){a.marker=this,b.rightclick&&b.rightclick.apply(this,[a]),void 0!=window.context_menu[c.el.id].marker&&c.buildContextMenu("marker",a)}),i.fences&&google.maps.event.addListener(i,"dragend",function(){c.checkMarkerGeofence(i,function(a,b){f(a,b)})}),i},j.prototype.addMarker=function(a){var b;if(a.hasOwnProperty("gm_accessors_"))b=a;else{if(!(a.hasOwnProperty("lat")&&a.hasOwnProperty("lng")||a.position))throw"No latitude or longitude defined.";b=this.createMarker(a)}return b.setMap(this.map),this.markerClusterer&&this.markerClusterer.addMarker(b),this.markers.push(b),j.fire("marker_added",b,this),b},j.prototype.addMarkers=function(a){for(var b,c=0;b=a[c];c++)this.addMarker(b);return this.markers},j.prototype.hideInfoWindows=function(){for(var a,b=0;a=this.markers[b];b++)a.infoWindow&&a.infoWindow.close()},j.prototype.removeMarker=function(a){for(var b=0;b<this.markers.length;b++)if(this.markers[b]===a){this.markers[b].setMap(null),this.markers.splice(b,1),this.markerClusterer&&this.markerClusterer.removeMarker(a),j.fire("marker_removed",a,this);break}return a},j.prototype.removeMarkers=function(a){var b=[];if(void 0===a){for(var c=0;c<this.markers.length;c++){var d=this.markers[c];d.setMap(null),j.fire("marker_removed",d,this)}this.markerClusterer&&this.markerClusterer.clearMarkers&&this.markerClusterer.clearMarkers(),this.markers=b}else{for(var c=0;c<a.length;c++){var e=this.markers.indexOf(a[c]);if(e>-1){var d=this.markers[e];d.setMap(null),this.markerClusterer&&this.markerClusterer.removeMarker(d),j.fire("marker_removed",d,this)}}for(var c=0;c<this.markers.length;c++){var d=this.markers[c];null!=d.getMap()&&b.push(d)}this.markers=b}},j.prototype.drawOverlay=function(a){var b=new google.maps.OverlayView,c=!0;return b.setMap(this.map),null!=a.auto_show&&(c=a.auto_show),b.onAdd=function(){var c=document.createElement("div");c.style.borderStyle="none",c.style.borderWidth="0px",c.style.position="absolute",c.style.zIndex=100,c.innerHTML=a.content,b.el=c,a.layer||(a.layer="overlayLayer");var d=this.getPanes(),e=d[a.layer],f=["contextmenu","DOMMouseScroll","dblclick","mousedown"];e.appendChild(c);for(var g=0;g<f.length;g++)!function(a,b){google.maps.event.addDomListener(a,b,function(a){navigator.userAgent.toLowerCase().indexOf("msie")!=-1&&document.all?(a.cancelBubble=!0,a.returnValue=!1):a.stopPropagation()})}(c,f[g]);a.click&&(d.overlayMouseTarget.appendChild(b.el),google.maps.event.addDomListener(b.el,"click",function(){a.click.apply(b,[b])})),google.maps.event.trigger(this,"ready")},b.draw=function(){var d=this.getProjection(),e=d.fromLatLngToDivPixel(new google.maps.LatLng(a.lat,a.lng));a.horizontalOffset=a.horizontalOffset||0,a.verticalOffset=a.verticalOffset||0;var f=b.el,g=f.children[0],h=g.clientHeight,i=g.clientWidth;switch(a.verticalAlign){case"top":f.style.top=e.y-h+a.verticalOffset+"px";break;default:case"middle":f.style.top=e.y-h/2+a.verticalOffset+"px";break;case"bottom":f.style.top=e.y+a.verticalOffset+"px"}switch(a.horizontalAlign){case"left":f.style.left=e.x-i+a.horizontalOffset+"px";break;default:case"center":f.style.left=e.x-i/2+a.horizontalOffset+"px";break;case"right":f.style.left=e.x+a.horizontalOffset+"px"}f.style.display=c?"block":"none",c||a.show.apply(this,[f])},b.onRemove=function(){var c=b.el;a.remove?a.remove.apply(this,[c]):(b.el.parentNode.removeChild(b.el),b.el=null)},this.overlays.push(b),b},j.prototype.removeOverlay=function(a){for(var b=0;b<this.overlays.length;b++)if(this.overlays[b]===a){this.overlays[b].setMap(null),this.overlays.splice(b,1);break}},j.prototype.removeOverlays=function(){for(var a,b=0;a=this.overlays[b];b++)a.setMap(null);this.overlays=[]},j.prototype.drawPolyline=function(a){var b=[],c=a.path;if(c.length)if(void 0===c[0][0])b=c;else for(var d,e=0;d=c[e];e++)b.push(new google.maps.LatLng(d[0],d[1]));var f={map:this.map,path:b,strokeColor:a.strokeColor,strokeOpacity:a.strokeOpacity,strokeWeight:a.strokeWeight,geodesic:a.geodesic,clickable:!0,editable:!1,visible:!0};a.hasOwnProperty("clickable")&&(f.clickable=a.clickable),a.hasOwnProperty("editable")&&(f.editable=a.editable),a.hasOwnProperty("icons")&&(f.icons=a.icons),a.hasOwnProperty("zIndex")&&(f.zIndex=a.zIndex);for(var g=new google.maps.Polyline(f),h=["click","dblclick","mousedown","mousemove","mouseout","mouseover","mouseup","rightclick"],i=0;i<h.length;i++)!function(b,c){a[c]&&google.maps.event.addListener(b,c,function(b){a[c].apply(this,[b])})}(g,h[i]);return this.polylines.push(g),j.fire("polyline_added",g,this),g},j.prototype.removePolyline=function(a){for(var b=0;b<this.polylines.length;b++)if(this.polylines[b]===a){this.polylines[b].setMap(null),this.polylines.splice(b,1),j.fire("polyline_removed",a,this);break}},j.prototype.removePolylines=function(){for(var a,b=0;a=this.polylines[b];b++)a.setMap(null);this.polylines=[]},j.prototype.drawCircle=function(b){b=a({map:this.map,center:new google.maps.LatLng(b.lat,b.lng)},b),delete b.lat,delete b.lng;for(var c=new google.maps.Circle(b),d=["click","dblclick","mousedown","mousemove","mouseout","mouseover","mouseup","rightclick"],e=0;e<d.length;e++)!function(a,c){b[c]&&google.maps.event.addListener(a,c,function(a){b[c].apply(this,[a])})}(c,d[e]);return this.polygons.push(c),c},j.prototype.drawRectangle=function(b){b=a({map:this.map},b);var c=new google.maps.LatLngBounds(new google.maps.LatLng(b.bounds[0][0],b.bounds[0][1]),new google.maps.LatLng(b.bounds[1][0],b.bounds[1][1]));b.bounds=c;for(var d=new google.maps.Rectangle(b),e=["click","dblclick","mousedown","mousemove","mouseout","mouseover","mouseup","rightclick"],f=0;f<e.length;f++)!function(a,c){b[c]&&google.maps.event.addListener(a,c,function(a){b[c].apply(this,[a])})}(d,e[f]);return this.polygons.push(d),d},j.prototype.drawPolygon=function(d){var e=!1;d.hasOwnProperty("useGeoJSON")&&(e=d.useGeoJSON),delete d.useGeoJSON,d=a({map:this.map},d),0==e&&(d.paths=[d.paths.slice(0)]),d.paths.length>0&&d.paths[0].length>0&&(d.paths=c(b(d.paths,f,e)));for(var g=new google.maps.Polygon(d),h=["click","dblclick","mousedown","mousemove","mouseout","mouseover","mouseup","rightclick"],i=0;i<h.length;i++)!function(a,b){d[b]&&google.maps.event.addListener(a,b,function(a){d[b].apply(this,[a])})}(g,h[i]);return this.polygons.push(g),j.fire("polygon_added",g,this),g},j.prototype.removePolygon=function(a){for(var b=0;b<this.polygons.length;b++)if(this.polygons[b]===a){this.polygons[b].setMap(null),this.polygons.splice(b,1),j.fire("polygon_removed",a,this);break}},j.prototype.removePolygons=function(){for(var a,b=0;a=this.polygons[b];b++)a.setMap(null);this.polygons=[]},j.prototype.getFromFusionTables=function(a){var b=a.events;delete a.events;var c=a,d=new google.maps.FusionTablesLayer(c);for(var e in b)!function(a,c){google.maps.event.addListener(a,c,function(a){b[c].apply(this,[a])})}(d,e);return this.layers.push(d),d},j.prototype.loadFromFusionTables=function(a){var b=this.getFromFusionTables(a);return b.setMap(this.map),b},j.prototype.getFromKML=function(a){var b=a.url,c=a.events;delete a.url,delete a.events;var d=a,e=new google.maps.KmlLayer(b,d);for(var f in c)!function(a,b){google.maps.event.addListener(a,b,function(a){c[b].apply(this,[a])})}(e,f);return this.layers.push(e),e},j.prototype.loadFromKML=function(a){var b=this.getFromKML(a);return b.setMap(this.map),b},j.prototype.addLayer=function(a,b){b=b||{};var c;switch(a){case"weather":this.singleLayers.weather=c=new google.maps.weather.WeatherLayer;break;case"clouds":this.singleLayers.clouds=c=new google.maps.weather.CloudLayer;break;case"traffic":this.singleLayers.traffic=c=new google.maps.TrafficLayer;break;case"transit":this.singleLayers.transit=c=new google.maps.TransitLayer;break;case"bicycling":this.singleLayers.bicycling=c=new google.maps.BicyclingLayer;break;case"panoramio":this.singleLayers.panoramio=c=new google.maps.panoramio.PanoramioLayer,c.setTag(b.filter),delete b.filter,b.click&&google.maps.event.addListener(c,"click",function(a){b.click(a),delete b.click});break;case"places":if(this.singleLayers.places=c=new google.maps.places.PlacesService(this.map),b.search||b.nearbySearch||b.radarSearch){var d={bounds:b.bounds||null,keyword:b.keyword||null,location:b.location||null,name:b.name||null,radius:b.radius||null,rankBy:b.rankBy||null,types:b.types||null};b.radarSearch&&c.radarSearch(d,b.radarSearch),b.search&&c.search(d,b.search),b.nearbySearch&&c.nearbySearch(d,b.nearbySearch)}if(b.textSearch){var e={bounds:b.bounds||null,location:b.location||null,query:b.query||null,radius:b.radius||null};c.textSearch(e,b.textSearch)}}if(void 0!==c)return"function"==typeof c.setOptions&&c.setOptions(b),"function"==typeof c.setMap&&c.setMap(this.map),c},j.prototype.removeLayer=function(a){if("string"==typeof a&&void 0!==this.singleLayers[a])this.singleLayers[a].setMap(null),delete this.singleLayers[a];else for(var b=0;b<this.layers.length;b++)if(this.layers[b]===a){this.layers[b].setMap(null),this.layers.splice(b,1);break}};var k,l;return j.prototype.getRoutes=function(b){switch(b.travelMode){case"bicycling":k=google.maps.TravelMode.BICYCLING;break;case"transit":k=google.maps.TravelMode.TRANSIT;break;case"driving":k=google.maps.TravelMode.DRIVING;break;default:k=google.maps.TravelMode.WALKING}l="imperial"===b.unitSystem?google.maps.UnitSystem.IMPERIAL:google.maps.UnitSystem.METRIC;var c={avoidHighways:!1,avoidTolls:!1,optimizeWaypoints:!1,waypoints:[]},d=a(c,b);d.origin=/string/.test(typeof b.origin)?b.origin:new google.maps.LatLng(b.origin[0],b.origin[1]),d.destination=/string/.test(typeof b.destination)?b.destination:new google.maps.LatLng(b.destination[0],b.destination[1]),d.travelMode=k,d.unitSystem=l,delete d.callback,delete d.error;var e=[];(new google.maps.DirectionsService).route(d,function(a,c){if(c===google.maps.DirectionsStatus.OK){for(var d in a.routes)a.routes.hasOwnProperty(d)&&e.push(a.routes[d]);b.callback&&b.callback(e,a,c)}else b.error&&b.error(a,c)})},j.prototype.removeRoutes=function(){this.routes.length=0},j.prototype.getElevations=function(d){d=a({locations:[],path:!1,samples:256},d),d.locations.length>0&&d.locations[0].length>0&&(d.locations=c(b([d.locations],f,!1)));var e=d.callback;delete d.callback;var g=new google.maps.ElevationService;if(d.path){var h={path:d.locations,samples:d.samples};g.getElevationAlongPath(h,function(a,b){e&&"function"==typeof e&&e(a,b)})}else delete d.path,delete d.samples,g.getElevationForLocations(d,function(a,b){e&&"function"==typeof e&&e(a,b)})},j.prototype.cleanRoute=j.prototype.removePolylines,j.prototype.renderRoute=function(b,c){var d,e="string"==typeof c.panel?document.getElementById(c.panel.replace("#","")):c.panel;c.panel=e,c=a({map:this.map},c),d=new google.maps.DirectionsRenderer(c),this.getRoutes({origin:b.origin,destination:b.destination,travelMode:b.travelMode,waypoints:b.waypoints,unitSystem:b.unitSystem,error:b.error,avoidHighways:b.avoidHighways,avoidTolls:b.avoidTolls,optimizeWaypoints:b.optimizeWaypoints,callback:function(a,b,c){c===google.maps.DirectionsStatus.OK&&d.setDirections(b)}})},j.prototype.drawRoute=function(a){var b=this;this.getRoutes({origin:a.origin,destination:a.destination,travelMode:a.travelMode,waypoints:a.waypoints,unitSystem:a.unitSystem,error:a.error,avoidHighways:a.avoidHighways,avoidTolls:a.avoidTolls,optimizeWaypoints:a.optimizeWaypoints,callback:function(c){if(c.length>0){var d={path:c[c.length-1].overview_path,strokeColor:a.strokeColor,strokeOpacity:a.strokeOpacity,strokeWeight:a.strokeWeight};a.hasOwnProperty("icons")&&(d.icons=a.icons),b.drawPolyline(d),a.callback&&a.callback(c[c.length-1])}}})},j.prototype.travelRoute=function(a){if(a.origin&&a.destination)this.getRoutes({origin:a.origin,destination:a.destination,travelMode:a.travelMode,waypoints:a.waypoints,unitSystem:a.unitSystem,error:a.error,callback:function(b){if(b.length>0&&a.start&&a.start(b[b.length-1]),b.length>0&&a.step){var c=b[b.length-1];if(c.legs.length>0)for(var d,e=c.legs[0].steps,f=0;d=e[f];f++)d.step_number=f,a.step(d,c.legs[0].steps.length-1)}b.length>0&&a.end&&a.end(b[b.length-1])}});else if(a.route&&a.route.legs.length>0)for(var b,c=a.route.legs[0].steps,d=0;b=c[d];d++)b.step_number=d,a.step(b)},j.prototype.drawSteppedRoute=function(a){var b=this;if(a.origin&&a.destination)this.getRoutes({origin:a.origin,destination:a.destination,travelMode:a.travelMode,waypoints:a.waypoints,error:a.error,callback:function(c){if(c.length>0&&a.start&&a.start(c[c.length-1]),c.length>0&&a.step){var d=c[c.length-1];if(d.legs.length>0)for(var e,f=d.legs[0].steps,g=0;e=f[g];g++){e.step_number=g;var h={path:e.path,strokeColor:a.strokeColor,strokeOpacity:a.strokeOpacity,strokeWeight:a.strokeWeight};a.hasOwnProperty("icons")&&(h.icons=a.icons),b.drawPolyline(h),a.step(e,d.legs[0].steps.length-1)}}c.length>0&&a.end&&a.end(c[c.length-1])}});else if(a.route&&a.route.legs.length>0)for(var c,d=a.route.legs[0].steps,e=0;c=d[e];e++){c.step_number=e;var f={path:c.path,strokeColor:a.strokeColor,strokeOpacity:a.strokeOpacity,strokeWeight:a.strokeWeight};a.hasOwnProperty("icons")&&(f.icons=a.icons),b.drawPolyline(f),a.step(c)}},j.Route=function(a){this.origin=a.origin,this.destination=a.destination,this.waypoints=a.waypoints,this.map=a.map,this.route=a.route,this.step_count=0,this.steps=this.route.legs[0].steps,this.steps_length=this.steps.length;var b={path:new google.maps.MVCArray,strokeColor:a.strokeColor,strokeOpacity:a.strokeOpacity,strokeWeight:a.strokeWeight};a.hasOwnProperty("icons")&&(b.icons=a.icons),this.polyline=this.map.drawPolyline(b).getPath()},j.Route.prototype.getRoute=function(a){var b=this;this.map.getRoutes({origin:this.origin,destination:this.destination,travelMode:a.travelMode,waypoints:this.waypoints||[],error:a.error,callback:function(){b.route=e[0],a.callback&&a.callback.call(b)}})},j.Route.prototype.back=function(){if(this.step_count>0){this.step_count--;var a=this.route.legs[0].steps[this.step_count].path;for(var b in a)a.hasOwnProperty(b)&&this.polyline.pop()}},j.Route.prototype.forward=function(){if(this.step_count<this.steps_length){var a=this.route.legs[0].steps[this.step_count].path;for(var b in a)a.hasOwnProperty(b)&&this.polyline.push(a[b]);this.step_count++}},j.prototype.checkGeofence=function(a,b,c){return c.containsLatLng(new google.maps.LatLng(a,b))},j.prototype.checkMarkerGeofence=function(a,b){if(a.fences)for(var c,d=0;c=a.fences[d];d++){var e=a.getPosition();this.checkGeofence(e.lat(),e.lng(),c)||b(a,c)}},j.prototype.toImage=function(a){var a=a||{},b={};if(b.size=a.size||[this.el.clientWidth,this.el.clientHeight],b.lat=this.getCenter().lat(),b.lng=this.getCenter().lng(),this.markers.length>0){b.markers=[];for(var c=0;c<this.markers.length;c++)b.markers.push({lat:this.markers[c].getPosition().lat(),lng:this.markers[c].getPosition().lng()})}if(this.polylines.length>0){var d=this.polylines[0];b.polyline={},b.polyline.path=google.maps.geometry.encoding.encodePath(d.getPath()),b.polyline.strokeColor=d.strokeColor,b.polyline.strokeOpacity=d.strokeOpacity,b.polyline.strokeWeight=d.strokeWeight}return j.staticMapURL(b)},j.staticMapURL=function(a){function b(a,b){if("#"===a[0]&&(a=a.replace("#","0x"),b)){if(b=parseFloat(b),0===(b=Math.min(1,Math.max(b,0))))return"0x00000000";b=(255*b).toString(16),1===b.length&&(b+=b),a=a.slice(0,8)+b}return a}var c,d=[],e=("file:"===location.protocol?"http:":location.protocol)+"//maps.googleapis.com/maps/api/staticmap";a.url&&(e=a.url,delete a.url),e+="?";var f=a.markers;delete a.markers,!f&&a.marker&&(f=[a.marker],delete a.marker);var g=a.styles;delete a.styles;var h=a.polyline;if(delete a.polyline,a.center)d.push("center="+a.center),delete a.center;else if(a.address)d.push("center="+a.address),delete a.address;else if(a.lat)d.push(["center=",a.lat,",",a.lng].join("")),delete a.lat,delete a.lng;else if(a.visible){var i=encodeURI(a.visible.join("|"));d.push("visible="+i)}var j=a.size;j?(j.join&&(j=j.join("x")),delete a.size):j="630x300",d.push("size="+j),a.zoom||a.zoom===!1||(a.zoom=15);var k=!a.hasOwnProperty("sensor")||!!a.sensor;delete a.sensor,d.push("sensor="+k);for(var l in a)a.hasOwnProperty(l)&&d.push(l+"="+a[l]);if(f)for(var m,n,o=0;c=f[o];o++){m=[],c.size&&"normal"!==c.size?(m.push("size:"+c.size),delete c.size):c.icon&&(m.push("icon:"+encodeURI(c.icon)),delete c.icon),c.color&&(m.push("color:"+c.color.replace("#","0x")),delete c.color),c.label&&(m.push("label:"+c.label[0].toUpperCase()),delete c.label),n=c.address?c.address:c.lat+","+c.lng,delete c.address,delete c.lat,delete c.lng;for(var l in c)c.hasOwnProperty(l)&&m.push(l+":"+c[l]);m.length||0===o?(m.push(n),m=m.join("|"),d.push("markers="+encodeURI(m))):(m=d.pop()+encodeURI("|"+n),d.push(m))}if(g)for(var o=0;o<g.length;o++){var p=[];g[o].featureType&&p.push("feature:"+g[o].featureType.toLowerCase()),g[o].elementType&&p.push("element:"+g[o].elementType.toLowerCase());for(var q=0;q<g[o].stylers.length;q++)for(var r in g[o].stylers[q]){var s=g[o].stylers[q][r];"hue"!=r&&"color"!=r||(s="0x"+s.substring(1)),p.push(r+":"+s)}var t=p.join("|");""!=t&&d.push("style="+t)}if(h){if(c=h,h=[],c.strokeWeight&&h.push("weight:"+parseInt(c.strokeWeight,10)),c.strokeColor){var u=b(c.strokeColor,c.strokeOpacity);h.push("color:"+u)}if(c.fillColor){var v=b(c.fillColor,c.fillOpacity);h.push("fillcolor:"+v)}var w=c.path;if(w.join)for(var x,q=0;x=w[q];q++)h.push(x.join(","));else h.push("enc:"+w);h=h.join("|"),d.push("path="+encodeURI(h))}var y=window.devicePixelRatio||1;return d.push("scale="+y),d=d.join("&"),e+d},j.prototype.addMapType=function(a,b){if(!b.hasOwnProperty("getTileUrl")||"function"!=typeof b.getTileUrl)throw"'getTileUrl' function required.";b.tileSize=b.tileSize||new google.maps.Size(256,256);var c=new google.maps.ImageMapType(b);this.map.mapTypes.set(a,c)},j.prototype.addOverlayMapType=function(a){if(!a.hasOwnProperty("getTile")||"function"!=typeof a.getTile)throw"'getTile' function required.";var b=a.index;delete a.index,this.map.overlayMapTypes.insertAt(b,a)},j.prototype.removeOverlayMapType=function(a){this.map.overlayMapTypes.removeAt(a)},j.prototype.addStyle=function(a){var b=new google.maps.StyledMapType(a.styles,{name:a.styledMapName});this.map.mapTypes.set(a.mapTypeId,b)},j.prototype.setStyle=function(a){this.map.setMapTypeId(a)},j.prototype.createPanorama=function(a){return a.hasOwnProperty("lat")&&a.hasOwnProperty("lng")||(a.lat=this.getCenter().lat(),a.lng=this.getCenter().lng()),this.panorama=j.createPanorama(a),this.map.setStreetView(this.panorama),this.panorama},j.createPanorama=function(b){var c=h(b.el,b.context);b.position=new google.maps.LatLng(b.lat,b.lng),delete b.el,delete b.context,delete b.lat,delete b.lng;for(var d=["closeclick","links_changed","pano_changed","position_changed","pov_changed","resize","visible_changed"],e=a({visible:!0},b),f=0;f<d.length;f++)delete e[d[f]];for(var g=new google.maps.StreetViewPanorama(c,e),f=0;f<d.length;f++)!function(a,c){b[c]&&google.maps.event.addListener(a,c,function(){b[c].apply(this)})}(g,d[f]);return g},j.prototype.on=function(a,b){return j.on(a,this,b)},j.prototype.off=function(a){j.off(a,this)},j.prototype.once=function(a,b){return j.once(a,this,b)},j.custom_events=["marker_added","marker_removed","polyline_added","polyline_removed","polygon_added","polygon_removed","geolocated","geolocation_failed"],j.on=function(a,b,c){if(j.custom_events.indexOf(a)==-1)return b instanceof j&&(b=b.map),google.maps.event.addListener(b,a,c);var d={handler:c,eventName:a};return b.registered_events[a]=b.registered_events[a]||[],b.registered_events[a].push(d),d},j.off=function(a,b){j.custom_events.indexOf(a)==-1?(b instanceof j&&(b=b.map),google.maps.event.clearListeners(b,a)):b.registered_events[a]=[]},j.once=function(a,b,c){if(j.custom_events.indexOf(a)==-1)return b instanceof j&&(b=b.map),google.maps.event.addListenerOnce(b,a,c)},j.fire=function(a,b,c){if(j.custom_events.indexOf(a)==-1)google.maps.event.trigger(b,a,Array.prototype.slice.apply(arguments).slice(2));else if(a in c.registered_events)for(var d=c.registered_events[a],e=0;e<d.length;e++)!function(a,b,c){a.apply(b,[c])}(d[e].handler,c,b)},j.geolocate=function(a){var b=a.always||a.complete;navigator.geolocation?navigator.geolocation.getCurrentPosition(function(c){a.success(c),b&&b()},function(c){a.error(c),b&&b()},a.options):(a.not_supported(),b&&b())},j.geocode=function(a){this.geocoder=new google.maps.Geocoder;var b=a.callback;a.hasOwnProperty("lat")&&a.hasOwnProperty("lng")&&(a.latLng=new google.maps.LatLng(a.lat,a.lng)),delete a.lat,delete a.lng,delete a.callback,this.geocoder.geocode(a,function(a,c){b(a,c)})},"object"==typeof window.google&&window.google.maps&&(google.maps.Polygon.prototype.getBounds||(google.maps.Polygon.prototype.getBounds=function(a){for(var b,c=new google.maps.LatLngBounds,d=this.getPaths(),e=0;e<d.getLength();e++){b=d.getAt(e);for(var f=0;f<b.getLength();f++)c.extend(b.getAt(f))}return c}),google.maps.Polygon.prototype.containsLatLng||(google.maps.Polygon.prototype.containsLatLng=function(a){var b=this.getBounds();if(null!==b&&!b.contains(a))return!1;for(var c=!1,d=this.getPaths().getLength(),e=0;e<d;e++)for(var f=this.getPaths().getAt(e),g=f.getLength(),h=g-1,i=0;i<g;i++){var j=f.getAt(i),k=f.getAt(h);(j.lng()<a.lng()&&k.lng()>=a.lng()||k.lng()<a.lng()&&j.lng()>=a.lng())&&j.lat()+(a.lng()-j.lng())/(k.lng()-j.lng())*(k.lat()-j.lat())<a.lat()&&(c=!c),h=i}return c}),google.maps.Circle.prototype.containsLatLng||(google.maps.Circle.prototype.containsLatLng=function(a){return!google.maps.geometry||google.maps.geometry.spherical.computeDistanceBetween(this.getCenter(),a)<=this.getRadius()}),google.maps.Rectangle.prototype.containsLatLng=function(a){return this.getBounds().contains(a)},google.maps.LatLngBounds.prototype.containsLatLng=function(a){return this.contains(a)},google.maps.Marker.prototype.setFences=function(a){this.fences=a},google.maps.Marker.prototype.addFence=function(a){this.fences.push(a)},google.maps.Marker.prototype.getId=function(){return this.__gm_id}),Array.prototype.indexOf||(Array.prototype.indexOf=function(a){if(null==this)throw new TypeError;var b=Object(this),c=b.length>>>0;if(0===c)return-1;var d=0;if(arguments.length>1&&(d=Number(arguments[1]),d!=d?d=0:0!=d&&d!=1/0&&d!=-(1/0)&&(d=(d>0||-1)*Math.floor(Math.abs(d)))),d>=c)return-1;for(var e=d>=0?d:Math.max(c-Math.abs(d),0);e<c;e++)if(e in b&&b[e]===a)return e;return-1}),j});

/*!
  Zoom 1.7.20
  license: MIT
  http://www.jacklmoore.com/zoom
*/
(function(o){var t={url:!1,callback:!1,target:!1,duration:120,on:"mouseover",touch:!0,onZoomIn:!1,onZoomOut:!1,magnify:1};o.zoom=function(t,n,e,i){var u,c,r,a,m,l,s,f=o(t),h=f.css("position"),d=o(n);return t.style.position=/(absolute|fixed)/.test(h)?h:"relative",t.style.overflow="hidden",e.style.width=e.style.height="",o(e).addClass("zoomImg").css({position:"absolute",top:0,left:0,opacity:0,width:e.width*i,height:e.height*i,border:"none",maxWidth:"none",maxHeight:"none"}).appendTo(t),{init:function(){c=f.outerWidth(),u=f.outerHeight(),n===t?(a=c,r=u):(a=d.outerWidth(),r=d.outerHeight()),m=(e.width-c)/a,l=(e.height-u)/r,s=d.offset()},move:function(o){var t=o.pageX-s.left,n=o.pageY-s.top;n=Math.max(Math.min(n,r),0),t=Math.max(Math.min(t,a),0),e.style.left=t*-m+"px",e.style.top=n*-l+"px"}}},o.fn.zoom=function(n){return this.each(function(){var e=o.extend({},t,n||{}),i=e.target&&o(e.target)[0]||this,u=this,c=o(u),r=document.createElement("img"),a=o(r),m="mousemove.zoom",l=!1,s=!1;if(!e.url){var f=u.querySelector("img");if(f&&(e.url=f.getAttribute("data-src")||f.currentSrc||f.src),!e.url)return}c.one("zoom.destroy",function(o,t){c.off(".zoom"),i.style.position=o,i.style.overflow=t,r.onload=null,a.remove()}.bind(this,i.style.position,i.style.overflow)),r.onload=function(){function t(t){f.init(),f.move(t),a.stop().fadeTo(o.support.opacity?e.duration:0,1,o.isFunction(e.onZoomIn)?e.onZoomIn.call(r):!1)}function n(){a.stop().fadeTo(e.duration,0,o.isFunction(e.onZoomOut)?e.onZoomOut.call(r):!1)}var f=o.zoom(i,u,r,e.magnify);"grab"===e.on?c.on("mousedown.zoom",function(e){1===e.which&&(o(document).one("mouseup.zoom",function(){n(),o(document).off(m,f.move)}),t(e),o(document).on(m,f.move),e.preventDefault())}):"click"===e.on?c.on("click.zoom",function(e){return l?void 0:(l=!0,t(e),o(document).on(m,f.move),o(document).one("click.zoom",function(){n(),l=!1,o(document).off(m,f.move)}),!1)}):"toggle"===e.on?c.on("click.zoom",function(o){l?n():t(o),l=!l}):"mouseover"===e.on&&(f.init(),c.on("mouseenter.zoom",t).on("mouseleave.zoom",n).on(m,f.move)),e.touch&&c.on("touchstart.zoom",function(o){o.preventDefault(),s?(s=!1,n()):(s=!0,t(o.originalEvent.touches[0]||o.originalEvent.changedTouches[0]))}).on("touchmove.zoom",function(o){o.preventDefault(),f.move(o.originalEvent.touches[0]||o.originalEvent.changedTouches[0])}).on("touchend.zoom",function(o){o.preventDefault(),s&&(s=!1,n())}),o.isFunction(e.callback)&&e.callback.call(r)},r.setAttribute("role","presentation"),r.src=e.url})},o.fn.zoom.defaults=t})(window.jQuery);

/*!
  Truncate
  license: MIT
  https://github.com/pathable/truncate
*/
(function($){var chop=/(\s*\S+|\s)$/;var start=/^(\S*)/;$.truncate=function(html,options){return $('<div></div>').append(html).truncate(options).html()};$.fn.truncate=function(options){if($.isNumeric(options))options={length:options};var o=$.extend({},$.truncate.defaults,options);return this.each(function(){var self=$(this);if(o.noBreaks)self.find('br').replaceWith(' ');var text=self.text();var excess=text.length-o.length;if(o.stripTags)self.text(text);if(o.words&&excess>0){var truncated=text.slice(0,o.length).replace(chop,'').length;if(o.keepFirstWord&&truncated===0){excess=text.length-start.exec(text)[0].length-1}else{excess=text.length-truncated-1}}
if(excess<0||!excess&&!o.truncated)return;$.each(self.contents().get().reverse(),function(i,el){var $el=$(el);var text=$el.text();var length=text.length;if(length<=excess){o.truncated=!0;excess-=length;$el.remove();return}
if(el.nodeType===3){if(o.finishBlock){$(el.splitText(length)).replaceWith(o.ellipsis)}else{$(el.splitText(length-excess-1)).replaceWith(o.ellipsis)}
return!1}
$el.truncate($.extend(o,{length:length-excess}));return!1})})};$.truncate.defaults={stripTags:!1,words:!1,keepFirstWord:!1,noBreaks:!1,finishBlock:!1,length:Infinity,ellipsis:'\u2026'}})(jQuery);

window.isLTie9 = $("html").hasClass("lt-ie9");
window.is_ie = /MSIE|Trident/i.test(navigator.userAgent);
window.is_iphone = /iPhone|iPod/i.test(navigator.userAgent);
window.is_ios = /iPad|iPhone|iPod/.test(navigator.userAgent);
window.isTouchDevice = 'ontouchstart' in document.documentElement;

PaloAlto.Sections = function Sections() {
  this.constructors = {};
  this.instances = [];

  $(document)
    .on('shopify:section:load', this._onSectionLoad.bind(this))
    .on('shopify:section:unload', this._onSectionUnload.bind(this))
    .on('shopify:section:select', this._onSelect.bind(this))
    .on('shopify:section:deselect', this._onDeselect.bind(this))
    .on('shopify:block:select', this._onBlockSelect.bind(this))
    .on('shopify:block:deselect', this._onBlockDeselect.bind(this));
};

PaloAlto.Sections.prototype = _.assignIn({}, PaloAlto.Sections.prototype, {
  _createInstance: function(container, constructor) {
    var $container = $(container);
    var id = $container.attr('data-section-id');
    var type = $container.attr('data-section-type');

    constructor = constructor || this.constructors[type];

    if (_.isUndefined(constructor)) {
      return;
    }

    var instance = _.assignIn(new constructor(container), {
      id: id,
      type: type,
      container: container
    });

    this.instances.push(instance);
  },

  _onSectionLoad: function(evt) {
    var container = $('[data-section-id]', evt.target)[0];
    if (container) {
      this._createInstance(container);
    }
  },

  _onSectionUnload: function(evt) {
    this.instances = _.filter(this.instances, function(instance) {
       var isEventInstance = (instance.id === evt.detail.sectionId);

      if (isEventInstance) {
        if (_.isFunction(instance.onUnload)) {
          instance.onUnload(evt);
        }
      }

      return !isEventInstance;
    });
  },

  _onSelect: function(evt) {
    // eslint-disable-next-line no-shadow
    var instance = _.find(this.instances, function(instance) {
      return instance.id === evt.detail.sectionId;
    });

    if (!_.isUndefined(instance) && _.isFunction(instance.onSelect)) {
      instance.onSelect(evt);
    }
  },

  _onDeselect: function(evt) {
    // eslint-disable-next-line no-shadow
    var instance = _.find(this.instances, function(instance) {
      return instance.id === evt.detail.sectionId;
    });

    if (!_.isUndefined(instance) && _.isFunction(instance.onDeselect)) {
      instance.onDeselect(evt);
    }
  },

  _onBlockSelect: function(evt) {
    // eslint-disable-next-line no-shadow
    var instance = _.find(this.instances, function(instance) {
      return instance.id === evt.detail.sectionId;
    });

    if (!_.isUndefined(instance) && _.isFunction(instance.onBlockSelect)) {
      instance.onBlockSelect(evt);
    }
  },

  _onBlockDeselect: function(evt) {
    // eslint-disable-next-line no-shadow
    var instance = _.find(this.instances, function(instance) {
      return instance.id === evt.detail.sectionId;
    });

    if (!_.isUndefined(instance) && _.isFunction(instance.onBlockDeselect)) {
      instance.onBlockDeselect(evt);
    }
  },

  register: function(type, constructor) {
    this.constructors[type] = constructor;

    $('[data-section-type=' + type + ']').each(function(index, container) {
      this._createInstance(container, constructor);
    }.bind(this));
  }
});

PaloAlto.init = function(){
  //Show the body on load
  $('.block-body').hide();
  smoothScroll.init();
  PaloAlto.initIE();

  

  PaloAlto.initProductGrid();
};


PaloAlto.initIE = function(){
  if(!window.is_ie) {
    $('html').addClass('not-ie');
  }
    window.isLTie9 = $("html").hasClass("lt-ie9");
  if (navigator.userAgent.indexOf("MSIE ") > 0 || !!navigator.userAgent.match(/Trident.*rv\:11\./)){
    $("html").addClass("ie");
  }
};

PaloAlto.initListeners = function(){
  // Reset listneners
  $(document)
    .off( 'keydown', 'body' )
    .off( 'ajaxCart.afterCartLoad' )
    .off( 'change', '.template-cart .js-qty input' )
    .off( 'click', '.template-cart .cart__remove' );

  // Init listneners
  $(document)
  .on('keydown', 'body', function(e){
    if(e.which == 9){
      $('body')
      .removeClass('no-outlines')
      .one('mousedown', function(){
        $(this).addClass('no-outlines');
      });
    };
  })
  .on('ajaxCart.afterCartLoad', function(evt, cart) {
    
      var isDrawerOpen = $( 'body' ).hasClass( 'js-drawer-open' );
      if ( !isDrawerOpen ) {
        timber.RightDrawer.open();
      }
    
  })
  .on('change', '.template-cart .js-qty input', function(e){
    var $this = $(this),
    $form = $('form.cart');

    $this
      .prop('disabled', true)
      .parents('.js-qty')
      .end()
      .siblings().prop('disabled', true);
    $form.addClass( 'is-loading' );

    var $cart = $('.cart');
    var qty = $this.val();
    var id = $this.attr( 'id' );
    var product_id = id.substring( parseInt( id.indexOf( '_' ) + 1 ) );
    var line = parseInt( $this.closest( '.cart__row' ).index() + 1 );
    var moneyFormat = window.monies;

    $.ajax( {
      type: 'post',
      url: '/cart/change.js',
      dataType: 'json',
      data: {
        'quantity': qty,
        'line': line
      },
      success: function( data ) {
        var $cartItems = $cart.find( '.cart__items' );
        var updatedItems = '';
        var hasNewItems = false;

        // Check for discounts or duplicated line items
        if ( data.items.length != $cartItems.find( '.cart__row' ).length ) {
          hasNewItems = true;
        }

        // Update all line items changed
        for ( var i = 0; i < data.items.length; i++ ) {
          var currentItem = data.items[i];
          var discountsArray = data.items[i].discounts;
          var discounts = '';
          var price = '';
          var unitPrice = '';
          var totalPrice = '';
          var image = currentItem.image != null ? currentItem.image.replace(/(\.[^.]*)$/, "_large$1").replace('http:', '') : "//cdn.shopify.com/s/assets/admin/no-image-medium-cc9732cb976dd349a0df1d39816fbcc7.gif";

          // Get discounts
          if ( discountsArray.length ) {
            discounts += '<div class="cart__row-discounts">';
            for ( var j = 0; j < discountsArray.length; j++ ) {
              discounts += '<p>' + discountsArray[j].title + ' (-' + Shopify.formatMoney( discountsArray[j].amount, moneyFormat ) + ')</p>';
            }
            discounts += '</div>';
          }

          // Get unit price
          if ( currentItem.unit_price_measurement ) {
            unitPrice = Shopify.formatMoney(currentItem.unit_price, moneyFormat) + ' ';
            if ( currentItem.unit_price_measurement.reference_value != 1 ) {
              unitPrice += currentItem.unit_price_measurement.reference_value;
            }
            unitPrice += currentItem.unit_price_measurement.reference_unit;
          }

          // Get line price value
          price += '<span class="price">';
          if ( currentItem.original_price > currentItem.final_price ) {
            price += '<s>' + Shopify.formatMoney( currentItem.original_price, moneyFormat ) + '</s> ';
          }
          price += Shopify.formatMoney( currentItem.final_price, moneyFormat );
          price += '</span>';

          if ( unitPrice ) {
            price += '<span class="unit-price">' + unitPrice + '</span>';
          }

          // Get total line price
          totalPrice += '<span class="price price--total">';
          if ( currentItem.original_line_price > currentItem.final_line_price ) {
            totalPrice += '<s>' + Shopify.formatMoney( currentItem.original_line_price, moneyFormat ) + '</s> ';
          }
          totalPrice += Shopify.formatMoney( currentItem.final_line_price, moneyFormat );
          totalPrice += '</span>' + discounts;

          if ( hasNewItems ) {
            // Update the whole cart
            updatedItems += '<tr class="cart__row table__section" data-variant-id="' + currentItem.variant_id + '" data-total-price="' + currentItem.final_line_price + '">\
                              <td>\
                                <a href="/cart/change?line=' + i + '&amp;quantity=0" class="cart__remove">\
                                  <i class="custom-icon-x"></i>\
                                </a>\
                              </td>\
                              <td data-label="Product" class="product-name-label">\
                                <a href="' + currentItem.url + '" class="cart__image">\
                                  <img width="240" class="lazyload fade-in" data-srcset="' + image + '" alt="' + escape(currentItem.title) + '">\
                                  <span class="loader"></span>\
                                </a>\
                              </td>\
                              <td>\
                                <a href="' + currentItem.url + '" class="size--18">' + currentItem.title + '</a>\
                              </td>\
                              <td data-label="Price" class="text-center">' + price + '</td>\
                              <td data-label="Quantity">\
                                <div class="js-qty">\
                                  <button type="button" class="js-qty__adjust js-qty__adjust--minus icon-fallback-text" data-id="updates_' + currentItem.id + '" data-qty="' + parseInt(currentItem.quantity - 1) + '">\
                                    <span class="icon icon-minus" aria-hidden="true"></span>\
                                    <span class="fallback-text">−</span>\
                                  </button>\
                                  <input type="text" class="js-qty__num" value="' + currentItem.quantity + '" min="1" data-id="updates_' + currentItem.id + '" aria-label="quantity" pattern="[0-9]*" name="updates[]" id="updates_' + currentItem.id + '">\
                                  <button type="button" class="js-qty__adjust js-qty__adjust--plus icon-fallback-text" data-id="updates_' + currentItem.id + '" data-qty="' + parseInt(currentItem.quantity + 1) + '">\
                                    <span class="icon icon-plus" aria-hidden="true"></span>\
                                    <span class="fallback-text">+</span>\
                                  </button>\
                                </div>\
                              </td>\
                              <td data-label="Total" class="text-right">' + totalPrice + '</td>\
                            </tr>';
            $cartItems.empty().append( updatedItems );
          } else {
            // Update the values only
            var $currentRow = $( '.cart__row' ).eq( i );
            $currentRow.find( '[data-label="Quantity"]').find( '.js-qty__num').val( currentItem.quantity );
            $currentRow.find( '[data-label="Price"]').empty().append( price );
            $currentRow.find( '[data-label="Total"]').empty().append( totalPrice );
          }


          // Update cart totals
          var totalDiscount = '';
          var cartDiscounts = data.cart_level_discount_applications;

          for ( var j = 0; j < cartDiscounts.length; j++ ) {
            totalDiscount += '<span>' + cartDiscounts[j].title + '</span><span>-' + Shopify.formatMoney( cartDiscounts[j].total_allocated_amount, moneyFormat ) + '</span>';
          }

          // Set the new total price
          $cart.find( '.cart__discounts' ).empty().append( totalDiscount );
          $cart.find( '.cart__subtotal-price' ).empty().append( Shopify.formatMoney( data.total_price, moneyFormat ) );

          // Update cart total
          updateCartTotal();

          if ( typeof(Currency) != 'undefined' && typeof(Currency.convertAll) != 'undefined' && Currency ){
            Currency.convertAll(shopCurrency, $('[name=currencies]').val());
          }

          $this
            .prop('disabled', false)
            .parents('.js-qty')
            .end()
            .siblings().prop('disabled', false);

          $form.removeClass( 'is-loading' );
        }
      },
      error: function() {
        $this
          .prop('disabled', false)
          .parents('.js-qty')
          .end()
          .siblings().prop('disabled', false);

        $form.removeClass( 'is-loading' );
      }
    });

    // remove line item if the quantity is 0
    if ( qty == 0 ) {
      $( this ).closest( '.cart__row' ).fadeOut( function() {
        $( this ).remove();
        updateCartTotal();
      } );
    }

    function updateCartTotal() {
      $.getJSON('/cart.js', function(cart) {
        $( '#CartCount' ).html( cart.item_count );
      });
    }
  }).on( 'click', '.template-cart .cart__remove', function(e) {
    e.preventDefault();
    $( this ).closest( '.cart__row' ).find( '.js-qty__num' ).prop( 'value', 0 ).change();
  });
};

PaloAlto.fitNav = function () {
  // Measure children of site nav on load and resize.
  // If wider than parent, switch to mobile nav.

  var $window = $(window),
      $body = $( 'body' ),
      $header = $( '.site-header' ),
      $siteNav = $( '.site-nav' ),
      $page = $( '#PageContainer' );

  controlNav();
  dropdownFix();
  $window.on( 'load', controlNav )
         .on( 'resize', PaloAlto.debounce( controlNav, 20 ) )
         .on( 'resize', PaloAlto.debounce( dropdownFix, 20 ) );

  function controlNav() {
    // Reset nav to normal state
    $siteNav.removeClass( 'site-nav--compress' );
    $header.removeClass( 'site-header--force-nav-right' );

    // Subtract 20 from width to account for inline-block spacing
    var navWidth = $siteNav.parent().outerWidth() - 20;
    var navWidthCentered = 0;
    var navItemWidth = 0;

    if ( $header.data( 'nav-position' ) == 'center' ) {
      navWidthCentered = $header.find( '.wrapper' ).width() - $( '.site-header__logo' ).outerWidth() * 2 - 20;
    }

    $siteNav.find( '> li' ).each(function() {
      var $el = $(this);
      if (!$el.hasClass( 'site-nav--compress__menu' )) {
        // Round up to be safe
        navItemWidth += Math.ceil($(this).width());
      }
    });

    if ( navItemWidth > navWidthCentered ) {
      $header.addClass( 'site-header--force-nav-right' );
    } else {
      $header.removeClass( 'site-header--force-nav-right' );
    }

    if (navItemWidth > navWidth) {
      $siteNav.addClass('site-nav--compress');
    } else {
      $siteNav.removeClass('site-nav--compress');
    }
  }

  // Check if menu shows up out of the screen
  function dropdownFix() {
    $header.find( '.site-nav--has-dropdown' ).each(function() {
      var $el = $(this);
      var $dropdownMenu = $el.find( '.site-nav__dropdown' );
      var $dropdownSubmenu = $dropdownMenu.find( '.sub-sub-links' );
      var elementOffset = $el.offset().left;
      var dropdownMenuWidth = $dropdownMenu.outerWidth();
      var dropdownSubMenuWidth = $dropdownSubmenu.length ? $dropdownSubmenu.outerWidth() : 0;
      var windowWidth = $(window).width();

      if ( parseInt(elementOffset + dropdownMenuWidth + dropdownSubMenuWidth) > windowWidth ) {
        $dropdownMenu.addClass( 'site-nav__dropdown--right' );
      }
    });
  }
};

PaloAlto.NavSearch = {
  init: function() {
    var self = this;
    var doc = this.doc = $(document);
    var html = this.html = $('html');
    var body = this.body = $('body');
    var header = this.header = $('.site-header');
    var searchOpen = this.searchOpen = $('.nav-search__open');
    var searchClose = this.searchClose = $('.nav-search__close');
    var searchPopup = this.searchPopup = $('.nav-search');
    var searchForm = this.searchForm = $('.nav-search .search-form');
    var searchContainer = this.searchContainer = $('.nav-search__container');
    var searchScroller = this.searchScroller = $('.nav-search__scroller');
    var searchResultsContainer = this.searchResultsContainer = $('#search-results');
    var searchType = this.searchType = this.searchForm.find('input[name="type"]').val();
    var searchRequest = this.searchRequest = null;

    this.searchForm.on('keyup', '.nav-search__input', function(e) {
      self.searchContainer.addClass('push-up');

      var query = $(this).val();
      if (query.length) {
         query += '*';
        self.request(query);
      } else {
        self.reset();
      }
    });

    this.searchOpen.on('click', function(e) {
      e.preventDefault();
      self.open();
    });

    this.searchClose.on('click', function(e) {
      e.preventDefault();
      self.close();
    });

    this.doc.on('click', function(e) {
      if ( self.searchPopup.hasClass('nav-search--is-visible') && !$(e.target).is('.nav-search, .nav-search *, .nav-search__open, .nav-search__open *') ) {
        self.close();
      }
    });

    // Close if escape key pressed
    this.doc.on('keyup', function(e) {
      if ( e.keyCode === 27) {
        self.close();
      }
    });

    this.searchContainer.on('click', '.js-loadMore', function(e) {
      e.preventDefault();
      var requestedURL = this.href;
      this.classList.add('loading');
      self.loadMore(requestedURL);
    });

    this.searchContainer.on('click', '.results__popular-links a', function(e) {
      e.preventDefault();
      var searchText = $(this).text();
      self.searchForm.find('.nav-search__input').val(searchText);
      self.request(searchText);
    });

    this.infiniteScroll();
  },
  open: function() {
    var self = this;
    var scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    var scrollPosition = $(window).scrollTop();
    var pageOffset = $('.top-bar').length ? $('.top-bar').outerHeight() : 0;

    self.body.addClass('lock-body');
    self.html.css('margin-right', scrollbarWidth);
    self.searchPopup.addClass('nav-search--is-visible');
    self.header.addClass('is-search-visible');

    setTimeout(function() {
      self.searchForm.find('.nav-search__input').focus().select();
    }, 100);

    // Scroll to top in order to show the search container properly on the screen
    if ( self.header.hasClass( 'relative' ) && scrollPosition > pageOffset ) {
      $( 'html, body' ).animate({ 'scrollTop': pageOffset }, 250);
    }
  },
  close: function() {
    var self = this;
    self.reset();
    self.header.removeClass('is-search-visible');
    self.searchPopup.removeClass('nav-search--is-visible');

    setTimeout(function() {
      self.html.css('margin-right', 0);
      self.body.removeClass('lock-body');
    }, 200);
  },
  reset: function() {
    var self = this;
    self.searchResultsContainer.empty();
    self.searchForm[0].reset();
    self.searchContainer.removeClass('is-searching push-up');
  },
  request: function(query) {
    var self = this;

    self.searchResultsContainer.empty();
    self.searchContainer.addClass('is-searching');

    // Kill previous ajax request
    if (self.searchRequest != null) {
      self.searchRequest.abort();
    }

    // Do a new ajax request
    self.searchRequest = $.ajax({
      method: 'GET',
      url: '/search?view=json',
      dataType: 'json',
      data: {
        q: query,
        type: self.searchType
      }
    }).done(function(data) {
      var searchResultsContent = '';
      var pagination = '';

      if (data.results_count) {
        var resultsText = data.results_count == 1 ? data.results_count + " result" : data.results_count + " results";
        var nextPage = data.next_page;

        searchResultsContent += '<div class="results__count">' + resultsText + '</div>\
                     <ul class="results__list">' + self.getResultsContent(data) + '</ul>';

        if (nextPage) {
          pagination = '<div class="pagination u-center"><a href="' + nextPage + '" class="js-loadMore loadMore loadMore--endlessScroll button">Load more</a><div class="load-more-icon"></div></div>';
        }

      } else {
        searchResultsContent = '<p class="no-results">No results found</p>';
      }

      self.searchResultsContainer.html(searchResultsContent);
      self.searchResultsContainer.append( pagination );
      self.searchContainer.removeClass('is-searching');
      self.infiniteScroll();
    });
  },
  infiniteScroll: function() {
    var self = this;

    self.searchScroller.off( 'scroll' );
    self.searchScroller.on( 'scroll', $.throttle(150, function(){
      var scrolled = self.searchScroller.scrollTop();
      var scrollTriggerPoint = self.searchContainer.height() - self.searchScroller.height() * 2;
      var isSearching = self.searchContainer.hasClass('is-searching');

      if (scrolled >= scrollTriggerPoint && !isSearching) {
        self.searchContainer.find('.js-loadMore').trigger('click');
        self.searchScroller.off('scroll');
      }
    }));
  },
  loadMore: function(requestedURL) {
    var self = this;

    self.searchRequest = $.ajax({
      method: 'GET',
      url: requestedURL,
      dataType: 'json'
    }).done(function(data) {
      var pagination = '';
      var searchResultsContent = '';
      var nextPage = data.next_page;

      if (data.results_count) {
        searchResultsContent = self.getResultsContent(data);

        if (nextPage) {
          pagination += '<div class="pagination u-center"><a href="' + nextPage + '" class="js-loadMore loadMore loadMore--endlessScroll button">Load more</a><div class="load-more-icon"></div></div>';
        }
      }

      self.searchResultsContainer.find('.pagination').remove();
      self.searchResultsContainer.find('.results__list').append(searchResultsContent);
      self.searchResultsContainer.append( pagination );
      self.infiniteScroll();
    });
  },
  getResultsContent: function(data) {
    var searchResultsContent = '';

    for ( var i = 0; i < data.results.length; i++ ) {
      var title = data.results[i].title;
      var url = data.results[i].url;
      var image = data.results[i].featured_image;
      var imageWidths = '295,394,590,700,800,1000,1200,1500,1800,2000,2400';
      var imageAspectRatio = data.results[i].image_aspectratio;

      searchResultsContent += '<li class="result">\
                                <div class="result__image" data-aspectratio="' + imageAspectRatio + '">\
                                  <a href="' + url + '" tabindex="3">\
                                    <img class="lazyload fade-in" alt="' + title + '"\
                                      data-src="' + image.replace( '_1x1.', '_{width}x.' ) + '"\
                                      data-widths="[' + imageWidths + ']"\
                                      data-aspectratio="' + imageAspectRatio + '"\
                                      data-sizes="auto" />\
                                  </a>\
                                </div>\
                                <p class="result__title"><a href="' + url + '">' + title + '</a></p>\
                              </li>';
    }

    return searchResultsContent;
  }
};

/*
 * Debounce function
 * based on unminified version from http://davidwalsh.name/javascript-debounce-function
 */

PaloAlto.debounce = function(n,t,u){var e;return function(){var a=this,r=arguments,i=function(){e=null,u||n.apply(a,r)},o=u&&!e;clearTimeout(e),e=setTimeout(i,t),o&&n.apply(a,r)}}

PaloAlto.initStickyNav = function( forceFullHeader, sectionUpdated ) {
  var $window = $( window );
  var $body = $( 'body' );
  var $header = $( '.site-header' );
  var $headerSection = $( '#shopify-section-header' );
  var $pageContainer = $( '#PageContainer' );
  var $logoImage = $( '.site-header__logo img' );
  var hasLogoImage = $logoImage.length;
  var position = $header.attr( 'data-position' );
  var hasCollectionFilters = $( '[data-section-type="collection-template"][data-filters="true"]' ).length && $( '#collection__filters' ).length;
  var pageLoaded = false;
  var isHeaderHeightSet = false;

  //Determine what is the first
  var firstSection = $('.main-content').children().first();
  var isFullHeader = forceFullHeader != null ? forceFullHeader : $(firstSection).find('.slider-text-block').length || $(firstSection).find('.text-inside').length || $(firstSection).find('.featured-image-section-inner').length || $(firstSection).not('#shopify-section-product-template').find('.banner').length;

  // Set transparent header class
  isFullHeader ? $body.addClass( 'has-slideshow' ).removeClass( 'has-no-slideshow' ) : $body.removeClass( 'has-slideshow' ).addClass( 'has-no-slideshow' );

  // Set fixed header class
  if ( position == 'fixed' && !hasCollectionFilters) {
    $headerSection.addClass( 'fixed' );

    if ( hasLogoImage ) {
      var $logoLink = $body.hasClass( 'has-slideshow' ) && $( '.site-header__logo-link--home' ).length ? $( '.site-header__logo-link--home' ) : $( '.site-header__logo-link--other' );
      $logoLink.find('img').on('load', function(e) {
        pageLoaded = true;
        setHeaderHeight();
      });
    } else {
      $window.on( 'load', function() {
        pageLoaded = true;
        setHeaderHeight();
      });
    }

    if ( sectionUpdated ) {
      pageLoaded = true;
      setHeaderHeight();
    }

    $window.on( 'scroll', $.throttle(20, headerState) );
  } else {
    $headerSection.removeClass( 'fixed' );
    $body.removeClass( 'has-scrolled' );
  }

  setMainSpacing();

  $window.on( 'resize', PaloAlto.debounce(setHeaderHeight, 10) )

  // Background transition fix for Safari and iOS
  // it needs to have a fixed height otherwise the transition breaks on Safari
  function setHeaderHeight() {
    // Don't set header height until the page is loaded
    if ( !pageLoaded ) return;

    // reset heights first
    $logoImage.css( 'height', 'auto' );
    $header.add( $headerSection ).css( 'height', 'auto' );

    var headerHeight = $header.find( '> .wrapper' ).outerHeight();
    var logoMargins = 30;
    $header.add( $headerSection ).css( 'height', headerHeight );
    $logoImage.css( 'height', headerHeight - logoMargins );
    isHeaderHeightSet = true;

    headerState();
    setMainSpacing();
  }

  function headerState() {
    hasCollectionFilters = $( '[data-section-type="collection-template"][data-filters="true"]' ).length && $( '#collection__filters' ).length;

    // Don't change header state until the page is loaded and header height is set
    if ( !pageLoaded || !isHeaderHeightSet || hasCollectionFilters ) return;

    var scrolled = window.scrollY;
    var pageOffset = $( '#PageContainer' ).offset().top;

    scrolled > pageOffset ? $body.addClass( 'has-scrolled' ) : $body.removeClass( 'has-scrolled' );
  }

  function setMainSpacing() {
    if ( !isFullHeader && position == 'fixed' && !hasCollectionFilters ){
      var headerHeight = $header.outerHeight();

      $pageContainer.css('paddingTop', headerHeight);
    } else {
      $pageContainer.css('paddingTop', '0');
    }
  }
};

PaloAlto.initProductGrid = function(){
  if ($('body').hasClass('template-collection') || $('body').hasClass('template-index') || $('body').hasClass('template-list-collections') || $('body').hasClass('template-product')){
    PaloAlto.initTags();
  }
}

PaloAlto.initProductThumbnails = function(container, sectionId){
  var $container = $(container);
  $container
  .on('click', '[data-action=show-product-image][data-id]', function(e){
    e.preventDefault();
    var scope = $('.frame--'+sectionId);
    $('.featured-image',scope).each(function(){
      $(this).addClass('hide');
  });
    $('#' + $(this).data('id')).removeClass('hide');
  });
};

PaloAlto.initLightbox = function(){

  $('.product-images').each(function(){
    var $productImage = $(this);
    var hasZoom = $('.featured-image', $productImage).hasClass('hover-zoom');
    var hasLightbox = $('.featured-image', $productImage).hasClass('mfp-zoom-in-cur');

    if (hasLightbox) {
      // Lightbox
      $('[data-mfp-src]', $productImage).magnificPopup({
        type: 'image',
        mainClass: 'mfp-fade',
        closeOnBgClick: true,
        closeBtnInside: false,
        closeOnContentClick: false,
        tClose: 'Close (Esc)',
        removalDelay: 300,
        closeMarkup: '<button title="%title%" class="mfp-close"><i class="custom-icon-x mfp-icon-x"></i></button>',
        disableOn: function() {
          if( $(window).width() < 768) {
            return false;
          }
          return true;
        },
        gallery: {
          enabled:true,
          navigateByImgClick: false,
          arrowMarkup: '<button title="%title%" type="button" class="mfp-arrow mfp-arrow-%dir%"><span class="mfp-chevron mfp-chevron-%dir%"></span></button>',
          tPrev: 'Previous (Left arrow key)',
          tNext: 'Next (Right arrow key)'
        }
      });
    } else if (hasZoom) {
      // Zoom
      $('.hover-zoom', $productImage).each(function() {
        var $image = $(this);

        enquire.register("screen and (min-width: 768px)", {
          match: function() {
            $image.parent().zoom({
              duration: 300,
              url: $image.data('zoom'),
              target: $image.parent().find('.zoom-container'),
              callback: function() {
                var forceZoomRatio = 1.5;
                var originalImgWidth = this.width;
                var originalImgHeight = this.height;
                var imageAspectRatio = $image.data('aspectratio');
                var containerWidth = $image.parent().width();
                var containerHeight = $image.parent().height();

                if (originalImgWidth < containerWidth) {
                  $(this).width(containerWidth * forceZoomRatio);
                  $(this).height(containerWidth / imageAspectRatio * forceZoomRatio);
                } else if (originalImgHeight < containerHeight) {
                  $(this).width(containerHeight / imageAspectRatio * forceZoomRatio);
                  $(this).height(containerHeight * forceZoomRatio);
                }
              },
              onZoomIn: function() {
                $(this).parent().addClass('zoomed');
              },
              onZoomOut: function() {
                $(this).parent().removeClass('zoomed');
              }
            });
          }
        });

      });
    }
  });
};


PaloAlto.initTags = function(){
  $('.has-tag').each(function() {
    var hasTag = this;
    var $image = $(this).find('.product-image');
    var parent = $(hasTag);
    var tag = $(hasTag).find('.tag');

    if($(tag).css('visibility') == 'hidden'){
      PaloAlto.circlifyTag(tag);
    }
  });
};

PaloAlto.initAccessibleDropdowns = function(){

  /** Mobile meus **/

   //Sub menus
  $('.mobile-nav__toggle').on( 'click', function(){
    var dropdown = $(this).parent().next();
    $(dropdown).toggle(200);
    $(this).find( 'button:eq(0)' ).toggleClass( 'is-expanded' );
    checkAriaStatus(dropdown);
  });

  /** Desktop menus **/
  $('.dropdown-sub-links__toggle').on( 'click', function(){
    var dropdown = $(this).parent().next();
    $(dropdown).toggle(200);
    $(this).toggleClass( 'is-expanded' );
    checkAriaStatus(dropdown);
  });

  //Sub menus -- enter
  $('.site-nav--has-dropdown > div > a').mouseenter(function(){
    var $header = $('.site-header');
    var dropdown = $(this).closest( '.site-nav--has-dropdown' ).find('.site-nav__dropdown');
    checkAriaStatus(dropdown);
    var subsub = $(this).closest( '.site-nav--has-dropdown' ).find('.sub-sub-links');

    if ( $header.hasClass( 'is-search-visible' ) ) {
      PaloAlto.NavSearch.close();
    }
  });

   //Sub menus -- leave
  $('.site-nav--has-dropdown').mouseleave(function(){
    var dropdown = $(this).find('.site-nav__dropdown');
    checkAriaStatus(dropdown);
  });

  //Subsub menus -- enter
 $('.has-sub-links').mouseenter(function(){
    var target = $(this).next();
    $(target).attr("aria-expanded","true");
    $(target).mouseenter(function(){
      $(this).attr("aria-expanded","true");
    });
 });

  //Subsub menus -- leave
  $('.has-sub-links').mouseleave(function(){
    var target = $(this).next();
    $(target).attr("aria-expanded","false");
    $(target).mouseleave(function(){
      $(this).attr("aria-expanded","false");
    });
 });


  function checkAriaStatus(el){
    var ariaExpanded = $(el).attr("aria-expanded");
    var state = $(el).css('display');
    if (state == 'block'){
      $(el).attr("aria-expanded","true");
    } else {
       $(el).attr("aria-expanded","false");
    }
  }

};

PaloAlto.onPriceAdded = function(){
  if ( typeof(Currency) != 'undefined' && typeof(Currency.convertAll) != 'undefined' && Currency ){
    Currency.convertAll(shopCurrency, $('[name=currencies]').val());
    onCurrencySet();
  }
};

PaloAlto.InitPopup = (function() {

  function InitPopup(container) {
    var $container = this.$container = $( container );
    var $popup = $container.find( '#popup' );
    var modalDelay = parseInt( $popup.data( 'delay' ) );
    var reappearTime = parseInt( $popup.data( 'reappear-time' ) );
    var popupEnabled = $popup.data( 'enabled' );
    var testMode = $popup.data('testmode');
    var showModalDelayed = this.showModalDelayed;

    truncateText();

    if (testMode) {
      showModal(modalDelay);
    } else {
      //If cookie doesn't exist or it's expired
      if (Cookies.get('newsletter_delay') === undefined || reappearTime == 0){
        showModal(modalDelay);
        createCookie(reappearTime);
      }
    }

    function showModal(modalDelay){
      if ( this.showModalDelayed != null ) {
        clearTimeout( this.showModalDelayed );
      }

      //Only show if it hasn't already been shown during that browser session
      if (sessionStorage.name != "popup_shown" && $('html').hasClass('lt-ie9') == false){

        this.showModalDelayed = setTimeout(function() {
          $('#popup').modal();
          $('#popup').css('display','inline-block');
        }, modalDelay);
        $('.close-modal').append('<i class="custom-icon-x"></i>');

        // Safari Private Browsing Mode shiv
        if (typeof localStorage === 'object') {
            try {
                localStorage.setItem('localStorage', 1);
                localStorage.removeItem('localStorage');
                sessionStorage.name = "popup_shown";

            } catch (e) {
                Storage.prototype._setItem = Storage.prototype.setItem;
                Storage.prototype.setItem = function() {};
            }
        }
      }  else if (testMode) {
        this.showModalDelayed = setTimeout(function() {
          $('#popup').modal();
          $('#popup').css('display','inline-block');
        }, modalDelay);
        $('.close-modal').append('<i class="custom-icon-x"></i>');
      }
    };

    function createCookie(reappearTime){
      if (reappearTime != 0){
        Cookies.set('newsletter_delay', 'value', { expires: reappearTime });
      }
    };

    function truncateText() {
      $popup.find( '.popup__text' ).truncate({
        length: 300,
      });
    }

    // Allow body scrolling
    $( document ).on( 'modal:block', function() {
      $( 'body' ).css( 'overflow', '' );
    });

    $.modal.defaults = {
      escapeClose: true,      // Allows the user to close the modal by pressing `ESC`
      clickClose: true,       // Allows the user to close the modal by clicking the overlay
      closeText: " ",         // Text content for the close <a> tag.
      closeClass: 'close-modal', // Add additional class(es) to the close <a> tag.
      showClose: true,        // Shows a (X) icon/link in the top-right corner
      modalClass: "modal",    // CSS class added to the element being displayed in the modal.
      spinnerHtml: null,      // HTML appended to the default spinner during AJAX requests.
      showSpinner: true,      // Enable/disable the default spinner during AJAX requests.
      fadeDuration: 250,      // Number of milliseconds the fade transition takes (null means no transition)
      fadeDelay: .5           // Point during the overlay's fade-in that the modal begins to fade in (.5 = 50%, 1.5 = 150%, etc.)
    };
  }

  InitPopup.prototype = $.extend({}, InitPopup.prototype, {
    /**
     * Event callback for Theme Editor `section:select` event
     */
    onUnload: function() {
      $( '.jquery-modal' ).remove();

      if ( this.showModalDelayed != null ) {
        clearTimeout( showModalDelayed );
      }
    }
  });

  return InitPopup;
})();

PaloAlto.circlifyTag = function(tag){
  var isCircle = tag.hasClass( 'tag--circle' );
  var tagWidthPadding = tag.width();
  var tagHeightPadding = tag.height()
  var tagSize = 0;
  if (tagWidthPadding > tagHeightPadding) {
    tagSize = tagWidthPadding;
  } else {
    tagSize = tagHeightPadding;
  }
  tagSize = tagSize + 20;

  if ( isCircle ) {
    $(tag).css({ width: tagSize, height: tagSize, borderRadius:'50%', visibility:'visible'});
  } else {
    $(tag).css({ visibility:'visible'});
  }

};

PaloAlto.RichText = (function() {

  function RichText(container) {

    var playButton = $(container).find('.play-button');
    $(playButton).one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', noPulse);
    function noPulse() {
      $(this).removeClass('animated fadeInLeftBig _1');
    }
    var stroke = $(playButton).find('.stroke-circle');
    $(playButton).on({
      mouseenter: function() {
        $(this).css('animation-name', '');
        $(stroke).addClass('pulsate');
      },
      mouseleave: function() {
        $(stroke).removeClass('pulsate');
      }
    });

    $(playButton).magnificPopup({
      disableOn: 200,
      type: 'iframe',
      mainClass: 'mfp-fade',
      removalDelay: 160,
       preloader: false,
          fixedContentPos: false,
      preloader: false,
      fixedContentPos: false,
      closeMarkup: '<button title="%title%" class="mfp-close"><i class="custom-icon-x mfp-icon-x"></i></button>',
      closeOnBgClick: true,
      tClose: 'Close (Esc)',
      iframe: {
          patterns: {
              youtube_short: {
                index: 'youtu.be/',
                id: 'youtu.be/',
                src: '//www.youtube.com/embed/%id%?autoplay=1&autohide=0&branding=0&cc_load_policy=0&controls=0&fs=0&iv_load_policy=3&modestbranding=1&playsinline=1&quality=hd720&rel=0&showinfo=0&wmode=opaque'
              }
          }
      }
    });
  }

  return RichText;
})();

PaloAlto.Instagram = (function() {


  function Instagram(container) {
    var accessToken = $('#instafeed').attr('data-access-token');
    var numPhotos = $('#instafeed').attr('data-num-photos');
    if(numPhotos > 18){numPhotos = 18;}
    if(accessToken){
      var userFeed = new Instafeed({
        get: 'user',
        userId: 'self',
        accessToken: accessToken,
        sortBy: 'most-recent',
        resolution: 'standard_resolution',
        limit: numPhotos,
        template: '<a class="instafeed-photo animation instaimg large--one-sixth medium--one-half small--one-half lazyload" href="{{link}}" data-bgset="{{image}}" data-sizes="auto" data-parent-fit="cover"><div class="insta-comment-table"><span class="insta-comment"><i class="icon icon-instagram"></i><br>{{caption}}</span></div></a>',
      after: function() {
        setHeights();
        $(window).resize(function() {
          setHeights();
        });
        truncateDescriptions();
      }
      });
      userFeed.run();
    }

    function setHeights(){
      var image = $('.instaimg');
      var height = $(image).width();
      $(image).css('height',height);
    }

    function truncateDescriptions() {
      $('.insta-comment').each(function() {
        if (!$(this).text().length){
          $(this).html("<i class = 'icon icon-instagram'></i>");
        } else {
          var shortText = $(this).html().substr(0, 120);
          if (shortText.length == 120){
            while (shortText.slice(-1) != ' '){
              shortText = shortText.substring(0, shortText.length - 1);
            }
            shortText = shortText+'...';
          }
          $(this).html(shortText);
        }
      });
    }
  }

  return Instagram;
})();

PaloAlto.Slider = (function() {

  function Slider(container) {
    var $container = this.$container = $( container );
    var slider = $container.find('.flickity');
    var slidesCount = $container.attr('data-slides-count');
    var autoplay = $container.data('autoplay');
    var duration = $container.data('duration');
    var textPosition = $container.data('text-position');
    var imageHeight = $container.data('image-height');
    var prevNextButtons = slider.find('.item').length > 1 && $container.data('nav-arrows');
    var pageDots = slider.find('.item').length > 1 && $container.data('page-dots');
    var selectedAttraction = $container.data('transition') ? 0.1 : 1;

    if ( autoplay ) {
      autoplay = duration;
    }

    initSlider(slider, autoplay, prevNextButtons);
    snapToSlide(slider, autoplay);

    if(textPosition == "slider-text-block-outside" && imageHeight == "original-height"){
      //On load
      initArrows(container);
      //On scroll
      $(slider).on( 'scroll.flickity', function( event, progress ) {
        initArrows(container);
      });
    }
    initMagnific(container);

    function initArrows(){
      $(container).imagesLoaded( function() {
          var buttons = $(container).find('.flickity-prev-next-button')
          var activeSlide = $(container).find('.is-selected');
          var activeSlideImg = $(activeSlide).find('img');
          var offset = $(activeSlideImg).height()/2 - 44/2;
          $(buttons).css('bottom',offset);
          $(buttons).css('top','initial');
          $(buttons).css('transform','initial');
          $(buttons).css('-webkit-transform','initial');
      });
    }

    function initSlider(slider, autoplay, prevNextButtons) {

      slider.on('ready.flickity', function() {
        var currentStyle = $(this).find('.item[data-slide-position="1"]').data('style');
        $(this).parents('.slider').attr('data-current-style', currentStyle);
        $(this).find('.initial-slide').removeClass('initial-slide');
      });

      slider.on('change.flickity', function(event, index) {
        var activeSlide = parseInt(index + 1);
        var currentStyle = $(this).find('.item[data-slide-position="' + activeSlide +'"]').data('style');
        $(this).parents('.slider').attr('data-current-style', currentStyle);
      });

      slider.flickity({
          autoPlay: autoplay,
          wrapAround: true,
          adaptiveHeight: true,
          setGallerySize: true,
          imagesLoaded: true,
          lazyLoad: true,
          pageDots: pageDots,
          prevNextButtons: false,
          friction: 1,
          selectedAttraction: selectedAttraction
      });

      if ( prevNextButtons ) {
        $(container).on( 'click', '.slider__arrow--previous', function() {
          slider.flickity('previous');
        });
        // next
        $(container).on( 'click', '.slider__arrow--next', function() {
          slider.flickity('next');
        });
      }
    }

    function snapToSlide(slider, autoplay) {
      $(document).on('shopify:block:select', function(event) {
        var target = $(event.target);
        var position = $(target).attr("data-slide-position") - 1;
        $(slider).flickity('select', position);
        $(slider).flickity('pausePlayer');

      });
      $(document).on('shopify:block:deselect', function(event) {
        if (autoplay){
         $(slider).flickity('playPlayer');
        }
      });
    }

    function initMagnific(container) {
      var magnificAnchor = $(container).find('.secondary-call-to-action');
      $(magnificAnchor).magnificPopup({
        disableOn: 200,
        type: 'iframe',
        mainClass: 'mfp-fade',
        removalDelay: 160,
        preloader: false,
        fixedContentPos: false,
        closeMarkup: '<button title="%title%" class="mfp-close"><i class="custom-icon-x mfp-icon-x"></i></button>',
        closeOnBgClick: true,
        tClose: 'Close (Esc)',
        iframe: {
          patterns: {
              youtube: {
                index: 'youtube.com/',
                src: '//www.youtube.com/embed/%id%?autoplay=1&mute=1'
              }
          }
      }
      });
    }

    $(container).on('click', '.js-scroll-down', function(e) {
      e.preventDefault();
      var $header = $( '.site-header' );
      var headerHeight = $header.hasClass( 'fixed' ) ? $header.outerHeight() : 0;
      var scrollToPosition = parseInt( Math.ceil(slider.offset().top) + slider.outerHeight() - headerHeight );

      $('html, body').animate({ 'scrollTop': scrollToPosition }, 500);
    });
  }

  Slider.prototype = $.extend({}, Slider.prototype, {
    /* Product grid slideshow */
    onUnload: function(evt) {
      var isFirstSection = $( '.main-content' ).children().first().hasClass( 'slideshow' );

      if ( isFirstSection ) {
        PaloAlto.initStickyNav( false );
      }
    }
  });

  return Slider;
})();

PaloAlto.Header = (function() {

  function Header(container) {
    var isDrawerOpen = $( 'body' ).hasClass( 'js-drawer-open' );

    if($('.drawer--left').css('display') == 'block'){
      var leftDrawer = 'opened';
    } else {
      var leftDrawer = 'closed';
    }

    timber.init();

    if ( isDrawerOpen ) timber.LeftDrawer.close();

    
      isDrawerOpen = $( 'body' ).hasClass( 'js-drawer-open' );

      if ( isDrawerOpen ) timber.RightDrawer.close();

      $(document).ready(function() {
        $(document).on('shopify:section:load', function(event) {
          ajaxCart.init({
            cartCountSelector: '.CartCount',
            moneyFormat: window.monies
          });
        });
      });
    



    PaloAlto.fitNav();
    PaloAlto.initAccessibleDropdowns();
    PaloAlto.initListeners();
    PaloAlto.initStickyNav();
    $(document).on('shopify:section:load shopify:section:reorder', function(event) {
      PaloAlto.initStickyNav( null , true );
    });

    // Init ajax search only when search icon is shown
    if ( $( '.site-header__search').length ) {
      PaloAlto.NavSearch.init();
    }
  }

  return Header;
})();

PaloAlto.FeaturedProduct = (function() {

  function FeaturedProduct(container) {
    var $container = this.$container = $(container);

    if(!$container.hasClass('onboarding-fp')){
      var sectionId = $container.attr('data-section-id');
      var enableSwatches = $container.data('swatches');
      var product = JSON.parse(document.getElementById('ProductJson-' + sectionId).innerHTML);
      PaloAlto.initProductVariants(container, product, sectionId);
      PaloAlto.initProductThumbnails(container, sectionId);

      PaloAlto.initListeners();
      $container.find('.product-form').css('visibility','visible');

      $(timber.init);
      initFeaturedProductTag();

      if ( enableSwatches ) {
        PaloAlto.ColorSwatches.bind();
      }
    }

    function initFeaturedProductTag(){
      var featuredProduct = $(container).find('.featured-product');
      var tag = $(container).find('.tag-fp');
        if(!$(featuredProduct).hasClass('fp-has-tag') && !$(featuredProduct).hasClass('tag-added')){
         $(container).imagesLoaded( function() {
            PaloAlto.circlifyTag(tag);
          });
         $(featuredProduct).addClass('tag-added');
        };
    }

    if ( typeof(Currency) != 'undefined' && typeof(Currency.convertAll) != 'undefined' && Currency ){
      Currency.convertAll(shopCurrency, $('[name=currencies]').val());
    }
  }

  FeaturedProduct.prototype = $.extend({}, FeaturedProduct.prototype, {
    /**
     * Event callback for Theme Editor `section:select` event
     */
    onSelect: function() {
      var enableReviews = this.$container.data('reviews');

      if ( enableReviews && typeof( window.SPR ) == 'function' ) {
        window.SPR.initDomEls();
        window.SPR.loadBadges();
      }
    }
  });

  return FeaturedProduct;
})();

PaloAlto.QuickViewPopup = (function($selector) {
  $selector.magnificPopup({
    type: 'ajax',
    cache: false,
    alignTop: true,
    removalDelay: 300,
    mainClass: 'popup-quick-buy mfp-fade',
    autoFocusLast: false,
    callbacks: {
      parseAjax: function(mfpResponse) {
        var $mfpContent = $(mfpResponse.data);
        var $mfpData = $mfpContent.find('.product-single').add( $mfpContent.find('[id^="ProductJson-"]') );
        var $productContainer = $mfpData.filter('.product-single');
        var sectionId = $productContainer.data('section-id');
        var product = JSON.parse($mfpData.filter('#ProductJson-' + sectionId )[0].innerHTML);
        var enableSwatches = $selector.closest('[data-section-type]').data('swatches');
        var showReviews = $selector.closest('[data-section-type]').data('reviews');
        var $dynamicButton = $productContainer.find( '.shopify-payment-button' );
        var isSoldout = $productContainer.find('#AddToCart--' + sectionId ).hasClass( 'disabled' );

        $productContainer.addClass('is-loading');

        setTimeout(function() {
          PaloAlto.initProductVariants($mfpData, product, sectionId);

          if (enableSwatches) {
            PaloAlto.ColorSwatches.bind();
          } else {
            PaloAlto.ColorSwatches.destroy();
          }

          if ( showReviews && typeof( window.SPR ) == 'function') {
            window.SPR.initDomEls();
            window.SPR.loadBadges();
          }

          initSlider($productContainer);
          Shopify.PaymentButton.init();

          $(document).off('click', '.mfp-wrap .spr-badge *' );
          $(document).on('click', '.mfp-wrap .spr-badge *', function(e) {
            e.preventDefault();
            e.stopPropagation();
            return false;
          } );

          isSoldout ? $dynamicButton.hide() : $dynamicButton.show();

          $productContainer.removeClass('is-loading');
        }, 250);

        return mfpResponse.data = $mfpData;
      },
      ajaxContentAdded: function() {
        // Ajax content is loaded and appended to DOM
        if ( typeof(Currency) != 'undefined' && typeof(Currency.convertAll) != 'undefined' && Currency ){
          Currency.convertAll(shopCurrency, $('[name=currencies]:eq(0)').val());
        }
      }
    }
  });

  var initSlider = function($productContainer) {
    /* Product Slider */
    var $slider = $('.product-images__slider', $productContainer);
    var $thumbs = $('.product-images__thumbs', $productContainer);
    var hasSlides = $slider.find('.product-images__slide').length > 1;

    if (hasSlides) {
      $slider.flickity({
        cellSelector: '.product-images__slide',
        wrapAround: true,
        imagesLoaded: true,
        lazyLoad: true,
        pageDots: false,
        arrowShape: {
          x0: 0,
          x1: 45, y1: 50,
          x2: 50, y2: 50,
          x3: 5
        }
      });

      $thumbs.flickity({
        asNavFor: '.product-images__slider',
        cellSelector: '.product-images__thumbs-slide',
        contain: true,
        pageDots: false,
        prevNextButtons: false
      });

      $slider.on('lazybeforeunveil', function() {
        $slider.flickity( 'resize' );
      });
    }
  }

  var magnificPopup = $.magnificPopup;
  var isSubmitting = false;

  // Prevent multiple submit by removing the form submit event
  $(document).off('click', '.mfp-wrap button[type="submit"]');

  // Bind form submit event functions
  $(document).on('click', '.mfp-wrap button[type="submit"]', function(event) {
    var $qtyInput = $(this).closest( 'form' ).find( '[name="quantity"]').val();
    var qty = $qtyInput.val();

    if (!isSubmitting && qty > 0) {
      isSubmitting = true;
      $(this).attr('disabled', true).closest('.product-form').submit().addClass('is-loading');
      $qtyInput.removeClass( 'field-error' ).siblings( '.qty-error-message' ).remove();
    } else {
      $qtyInput.parent().find( '.qty-error-message' ).remove();
      $qtyInput.addClass( 'field-error' ).parent().append( '<small class="qty-error-message">' + "Quantity must be greater than 0." + '</small>' );;

      // Remove the error message after 3 seconds
      setTimeout( function() {
        $qtyInput.parent().find( '.qty-error-message' ).fadeOut( 'fast',function() {
          $(this).remove();
        });
      }, 3000);
      return false;
    }
  }).on('ajaxCart.afterCartLoad', function() {
    magnificPopup.close();
    setTimeout(function() {
      isSubmitting = false;
      $('.mfp-wrap .product-form').removeClass('is-loading').find('button[type="submit"]').attr('disabled', false);
    }, 500);
  }).on('ajaxCart.errorAddItem', function() {
    setTimeout(function() {
      isSubmitting = false;
      $('.mfp-wrap .product-form').removeClass('is-loading').find('button[type="submit"]').attr('disabled', false);
    }, 500);
  });
});

PaloAlto.QuickBuy = (function($selector) {
  var product,
      isSubmitting = false;

  $selector.off( 'click' );
  $selector.on( 'click', function(e) {

    e.preventDefault();
    var $imageContainer = $(this).closest( '.grid__image' );
    var variantId = $(this).data( 'variant-id' );
    var qty = $(this).closest( 'form' ).find( '[name="quantity"]').val();

    if (!isSubmitting) {
      isSubmitting = true;

      $(this).attr( 'disabled', true ).addClass( 'is-loading' );

      $.ajax({
        type: 'POST',
        url: '/cart/add.js',
        data: {
          quantity: 1,
          id: variantId
        },
        dataType: 'json',
        success: function( line_item ) {
          // Update cart count
          updateCartTotal();

          // Open cart drawer and reload cart items
          ajaxCart.load()
        },
        error: function(XMLHttpRequest, textStatus) {
          $(document).trigger( 'ajaxCart.errorAddItem' );
        }
      }).always(function() {
        setTimeout(function() {
          isSubmitting = false;
          $selector.removeClass('is-loading').attr('disabled', false);
        }, 500);
      }).fail(function( response ) {
        var productTitle = $imageContainer.closest( '.product-item-parent' ).find( '.product-grid-item__title').text();
        var errorText = "All %%productTitle%% are in your cart.";

        errorText = errorText.replace( '%%productTitle%%', productTitle );
        $imageContainer.remove('.error').append('<div class="error">' + errorText + '</div>');
        $imageContainer.find('.error').css( 'opacity', 1 );

        // Hide error after 3 seconds
        setTimeout(function() {
          $imageContainer.find('.error').fadeOut('fast', function() {
            $(this).remove();
          })
        }, 3000);
      });
    } else {
      return false;
    }
  });
  $(timber.init);

  function updateCartTotal() {
    $.getJSON('/cart.js', function(cart) {
      $( '#CartCount, .CartCount' ).html( cart.item_count );
    });
  }
});

PaloAlto.ProductTemplate = (function() {

  function ProductTemplate(container) {
    var $container = this.$container = $(container);
    var sectionId = $(container).attr('data-section-id');
    var product = JSON.parse(document.getElementById('ProductJson-' + sectionId).innerHTML);
    var enableSwatches = $container.data('swatches');
    var enableReviews = this.$container.data('reviews');

    PaloAlto.initProductVariants(container, product, sectionId);
    PaloAlto.initProductThumbnails(container, sectionId);
    PaloAlto.initLightbox();
    PaloAlto.initListeners();

    $container.find( '.product-form' ).css('visibility','visible');
    $(timber.init);

    if (enableSwatches) {
      PaloAlto.ColorSwatches.bind();
    }

    if ( typeof(Currency) != 'undefined' && typeof(Currency.convertAll) != 'undefined' && Currency ){
      Currency.convertAll(shopCurrency, $('[name=currencies]').val());
    }

    this.productSlider();
    this.productTabs();
    this.checkButtons();

    if ( $( 'body' ).hasClass( 'quick-view-enabled' ) ){
      PaloAlto.QuickViewPopup( $( '.quick_view_button' ) );
    } else if ( $( 'body' ).hasClass( 'quick-buy-enabled' ) ){
      PaloAlto.QuickBuy( $( '.add_to_cart_button' ) );
    }

    if ( enableReviews && typeof( window.SPR ) == 'function' ) {
      window.SPR.initDomEls();
      window.SPR.loadBadges();
      window.SPR.loadProducts();
    }
  }

  ProductTemplate.prototype = $.extend({}, ProductTemplate.prototype, {
    /* Product Slider */
    productSlider: function() {
      var $slider = $('.product-images__slider', this.$container);
      var $thumbs = $('.product-images__thumbs', this.$container);
      var hasSlides = $slider.find('.product-images__slide').length > 1;
      var draggable = $slider.data( 'gallery' ) != 'lightbox';

      if (hasSlides) {
        $slider.flickity({
          cellSelector: '.product-images__slide',
          draggable: draggable,
          wrapAround: true,
          pageDots: false,
          adaptiveHeight: true,
          arrowShape: {
            x0: 0,
            x1: 45, y1: 50,
            x2: 50, y2: 50,
            x3: 5
          }
        });

        $thumbs.flickity({
          asNavFor: '.product-images__slider',
          cellSelector: '.product-images__thumbs-slide',
          imagesLoaded: true,
          contain: true,
          pageDots: false,
          prevNextButtons: false
        });

        $slider.on('lazybeforeunveil', '.product-images__slide', function() {
          $slider.flickity( 'resize' );
        });
      }
    },

    /* Product Tabs */
    productTabs: function(){
      var $productTab = $('.js-product-tabs .product-tab');

      // Click the product-tab title to change the tab
      $productTab.on('click', '.product-tab-title', function(){
        $(this).parent('.product-tab').toggleClass('is-active');
      });

      // Open reviews tab on star rating badge click
      $( document ).on( 'click', '.product-single .star-clickable, .product-single .spr-badge', function(e) {
        e.preventDefault();
        e.stopPropagation();

        if ( $( '#product-tab--reviews' ).length ) {
          var $header = $( '.site-header' );
          var headerHeight = $header.hasClass( 'fixed' ) ? $header.outerHeight() : 0;
          var reviewsTop = $( '#product-tab--reviews' ).offset().top - headerHeight;

          $( '#product-tab--reviews' ).addClass( 'is-active' ).siblings().removeClass( 'is-active' );
          $( 'html, body' ).stop(true).animate({ scrollTop: reviewsTop }, 300 );
        }
      });
    },

    checkButtons: function() {
      var $dynamicButton = this.$container.find( '.shopify-payment-button' );
      var isSoldout = this.$container.find('#AddToCart--' + this.$container.data( 'section-id') ).hasClass( 'disabled' )

      if ( isSoldout ) {
        $dynamicButton.hide();
      } else {
        $dynamicButton.show();
      }
    }
  });

  return ProductTemplate;
})();

PaloAlto.RelatedProducts = (function() {
  function RelatedProducts(container) {
    var $relatedSection = this.$relatedSection = $( '[data-related-products]' );
    this.init();
  }
  RelatedProducts.prototype = $.extend({}, RelatedProducts.prototype, {
    init: function() {
      var self = this;
      var $relatedSection = this.$relatedSection;
      var productId = $relatedSection.data( 'product-id' );
      var limit = $relatedSection.data('limit');
      var enableSwatches = $relatedSection.data( 'swatches' );
      var enableReviews = $relatedSection.data( 'reviews' );
      var productGridSlideshow = $relatedSection.data( 'product-grid-slideshow' );
      var requestUrl = "/recommendations/products?section_id=related-products&limit=" + limit + "&product_id=" + productId;

      $.get(requestUrl)
        .done(function(data) {
          var inner = $( data ).find( '[data-related-products]' ).html();
          $relatedSection.hide().html( inner ).slideDown( 'slow' );

          // Show sale/sold out tags
          PaloAlto.initTags();

          if ( $( 'body' ).hasClass( 'quick-view-enabled' ) ){
            PaloAlto.QuickViewPopup( $relatedSection.find( '.quick_view_button' ) );
          } else if ( $( 'body' ).hasClass( 'quick-buy-enabled' ) ){
            PaloAlto.QuickBuy( $relatedSection.find( '.add_to_cart_button' ) );
          }

          if ( productGridSlideshow ) {
            self.productGridSlideshow();
          }

          if ( enableSwatches ) {
            PaloAlto.ColorSwatches.bind();
          }

          // Show reviews badges
          if ( enableReviews && typeof( window.SPR ) == 'function' ) {
            window.SPR.initDomEls();
            window.SPR.loadBadges();
          }

          if ( typeof(Currency) != 'undefined' && typeof(Currency.convertAll) != 'undefined' && Currency ){
            Currency.convertAll(shopCurrency, $('[name=currencies]').val());
          }
        });
    },
    productGridSlideshow: function() {
      var $productGridSlider = this.$relatedSection.find( '.product-image__slider' );

      $productGridSlider.each( function() {
        var countImages = $( this ).find( '.product-image' ).length;

        if ( countImages > 1 ) {
          var $imageSlider = $( this ).flickity({
            cellSelector: '.product-image__slide',
            contain: true,
            wrapAround: true,
            imagesLoaded: true,
            lazyLoad: true,
            pageDots: false,
            adaptiveHeight: false,
            arrowShape: {
              x0: 0,
              x1: 45, y1: 50,
              x2: 50, y2: 50,
              x3: 5
            }
          });
        }
      });

      // Prevent page redirect on slideshow arrow click
      this.$relatedSection.on( 'click', '.grid__image', function(e) {
        if ( $(e.target).is( '.flickity-button, .flickity-button *' ) ) {
          e.preventDefault();
        }
      });
    }
  });
  return RelatedProducts;
})();

PaloAlto.CollectionTemplate = (function() {
  var constants = {
    SORT_BY: 'sort_by',
    DEFAULT_SORT: 'title-ascending'
  };
  var selectors = {
    filterSelection: '.filters-toolbar__input--filter',
    sortSelection: '.filters-toolbar__input--sort',
    defaultSort: '.filters-toolbar__default-sort'
  };

  function CollectionTemplate(container) {
    var self = this;
    var $container = this.$container = $(container);
    var sectionId = $container.data( 'section-id' );
    var enableSubCollections = $container.data( 'subcollections' );
    var enableSwatches = $container.data( 'swatches' );
    var enableReviews = $container.data( 'reviews' );
    var enableFilters = $container.data( 'filters') && $container.find( '#collection__filters' ).length;
    var productGridSlideshow = $container.data( 'product-grid-slideshow' );
    var isBannerImageHeight = $container.find( '.banner-img--original' ).length;

    /* Filters */
    this.$filterSelect = $(selectors.filterSelection, $container);
    this.$sortSelect = $(selectors.sortSelection, $container);
    this.$selects = $(selectors.filterSelection, $container).add($(selectors.sortSelection, $container));

    this.defaultSort = this._getDefaultSortValue();

    this.$filterSelect.on('change', this._onFilterChange.bind(this));
    this.$sortSelect.on('change', this._onSortChange.bind(this));
    this.$selects.removeClass('hidden');

    if ( $( 'body' ).hasClass( 'quick-view-enabled' ) ){
      PaloAlto.QuickViewPopup( $( '.quick_view_button' ) );
    } else if ( $( 'body' ).hasClass( 'quick-buy-enabled' ) ){
      PaloAlto.QuickBuy( $( '.add_to_cart_button' ) );
    }

    if ( enableSubCollections != 'hidden' ) {
      this.subCollectionsSlideshow();
    }

    if ( enableSwatches ) {
      this._stripSwatches();
    }

    if ( productGridSlideshow ) {
      this.productGridSlideshow();
    }

    if ( enableFilters ) {
      this.filters();
    }

    if ( isBannerImageHeight ) {
      this.fixBannerOnMobile();

      $(window).on('resize', PaloAlto.debounce( self.fixBannerOnMobile.bind( self ), 250));
    }

    var self = this;
    const endlessCollection = this.endlessCollection = new Ajaxinate({
      container: '#AjaxinateLoop',
      pagination: '#AjaxinatePagination',
      method: 'scroll',
      callback: function() {
        if ( $( 'body' ).hasClass( 'quick-view-enabled' ) ){
          PaloAlto.QuickViewPopup( $( '.quick_view_button' ) );
        } else if ( $( 'body' ).hasClass( 'quick-buy-enabled' ) ){
          PaloAlto.QuickBuy( $( '.add_to_cart_button' ) );
        }

        if ( productGridSlideshow ) {
          self.productGridSlideshow();
        }

        if ( enableReviews && typeof( window.SPR ) == 'function' ) {
          window.SPR.initDomEls();
          window.SPR.loadBadges();
        }

        $(window).trigger( 'scroll' );
        $(window).trigger( 'resize' );

        if ( typeof(Currency) != 'undefined' && typeof(Currency.convertAll) != 'undefined' && Currency ){
          Currency.convertAll(shopCurrency, $('[name=currencies]').val());
        }
      }
    });
  }

  CollectionTemplate.prototype = $.extend({}, CollectionTemplate.prototype, {
    fixBannerOnMobile: function() {
      var $bannerImage = this.$container.find( '.banner-img--original' );
      var $bannerContent = this.$container.find( '.collection-header' );
      var bannerImageHeight = $bannerImage.height();
      var bannerContentHeight = $bannerContent.height();
      var headerHeight = $( '.site-header' ).outerHeight();
      var additionalPadding = 100;
      var bannerMinHeight = bannerContentHeight + headerHeight + additionalPadding

      if ( bannerImageHeight < bannerMinHeight ) {
        $bannerImage.css( 'min-height', bannerMinHeight );
        $bannerContent.css( 'padding-top', headerHeight );
      }
    },
    /* Product grid slideshow */
    productGridSlideshow: function() {
      var $productGridSlider = this.$container.find( '.product-image__slider' );

      $productGridSlider.each( function() {
        var countImages = $( this ).find( '.product-image' ).length;

        if ( countImages > 1 ) {
          var $imageSlider = $( this ).flickity({
            cellSelector: '.product-image__slide',
            contain: true,
            wrapAround: true,
            imagesLoaded: true,
            lazyLoad: true,
            pageDots: false,
            adaptiveHeight: false,
            arrowShape: {
              x0: 0,
              x1: 45, y1: 50,
              x2: 50, y2: 50,
              x3: 5
            }
          });
        }
      });

      // Prevent page redirect on slideshow arrow click
      this.$container.on( 'click', '.grid__image', function(e) {
        if ( $(e.target).is( '.flickity-button, .flickity-button *' ) ) {
          e.preventDefault();
        }
      });
    },

    subCollectionsSlideshow: function() {
      var self = this;
      var $slider = this.$container.find( '.subcollections__list' );

      enquire.register( 'screen and (max-width: 767px)', {
        match: function() {
          runSlider();
        },
        unmatch: function() {
          var hasSlider = $slider.hasClass( 'flickity-enabled' );

          if ( hasSlider ) {
            $slider.flickity( 'destroy' );
          }
        }
      });

      function runSlider() {
        $slider.flickity({
          cellSelector: '.subcollection__item',
          imagesLoaded: true,
          lazyLoad: true,
          pageDots: false,
          contain: true,
          groupCells: true,
          freeScroll: true,
          prevNextButtons: false
        });
      }
    },

    filters: function() {
      var self = this;
      var $collectionWrapper = this.$container.find( '.collection__wrapper' );
      var $collectionProducts = this.$container.find( '.collection__products' );
      var $filtersContainer = this.$container.find( '.collection__filters-wrapper' );
      var $filtersContainerParent = this.$container.find( '#collection__filters' );

      if ( !$filtersContainerParent.length ) return;

      var tags = this.$container.data( 'tags' );
      var collection = this.$container.data( 'collection' );
      var sort = this.$container.data( 'sort' );

      setCollectionContainerHeight();

      /* Bind toggle buttons */
      $filtersContainer.on( 'click', '.collection__filter-title', function() {
        var isTopPosition = $( window ).width() < 1024 || $( '.collection__filters--top' ).length;

        if ( isTopPosition ) {
          $(this).parent().toggleClass( 'is-expanded' ).attr( 'aria-expanded', true ).siblings().removeClass( 'is-expanded' ).attr( 'aria-expanded', false );

          if ( $filtersContainer.find( '.collection__filter.is-expanded' ).length ) {
            $filtersContainerParent.addClass( 'has-tags-expanded' );
          } else {
            $filtersContainerParent.removeClass( 'has-tags-expanded' );
          }
        }
      });

      /* Close dropdowns on click outside their container */
      $( document ).on( 'click', function(e) {
        if ( !$( e.target ).is( '#collection__filters *' ) ) {
          $filtersContainer.find( '.collection__filter' ).removeClass( 'is-expanded' ).attr( 'aria-expanded', false );
          $filtersContainerParent.removeClass( 'has-tags-expanded' );
        }
      });

      $filtersContainer.on( 'click', '.collection__filter button', function(e) {
        e.preventDefault();

        var selectedTag = $( this ).data( 'tag' );
        var isTagSelected = $( this ).parent().hasClass( 'is-active' );

        if ( isTagSelected ) {
          var tagIndex = tags.indexOf( selectedTag );

          $( this ).parent().removeClass( 'is-active' );

          if ( tagIndex > -1 ) {
            tags.splice( tagIndex, 1 );
          }
        } else {
          $( this ).parent().addClass( 'is-active' );

          tags.push( selectedTag );
        }

        self.$container.attr( 'data-tags', tags );

        var requestedURL = collection + '/' + tags.join( '+' ) + '?sort_by=' + sort;

        requestFilteredProducts( requestedURL, tags );
      });

      /* Reset filters */
      var bindResetButton = function(e) {
          var requestedURL = collection + '/?sort_by=' + sort;

          $filtersContainer.find( '.collection__filter-tags > li' ).removeClass( 'is-active' );
          $filtersContainer.find( '.collection__filter' ).removeClass( 'is-expanded' );
          $filtersContainerParent.removeClass( 'has-tags-expanded' );

          // Reset saved tags
          tags = [];
          self.$container.attr( 'data-tags', false );

          requestFilteredProducts( requestedURL, tags );
      }

      self.$container.find( '.js-reset-filters' ).on( 'click', bindResetButton );

      /* Animate products container height in order to make the filters move smooth */
      $(window).on('resize', PaloAlto.debounce( setCollectionContainerHeight , 50));

      function requestFilteredProducts( requestedURL, tags ) {
        var subcollectionsHeight = self.$container.find( '.subcollections--top' ).length ? self.$container.find( '.subcollections' ).outerHeight() : 0;
        var productsTop = self.$container.find( '.collection__wrapper' ).offset().top + subcollectionsHeight;
        var enableReviews = self.$container.data( 'reviews' );
        var productGridSlideshow = self.$container.data( 'product-grid-slideshow' );
        var enableSubCollections = self.$container.data( 'subcollections' );

        // Kill previous ajax request
        if ( self.filterProductsRequest != null ) {
          self.filterProductsRequest.abort();
        }

        if ( !tags.length ) {
          self.$container.find( '.js-reset-filters' ).removeClass( 'is-visible' ).slideUp( 300 );
          self.$container.find( '.collection__filters' ).removeClass( 'collection__filters--has-tags-selected' );
        }

        self.$container.addClass( 'is-loading' );

        self.endlessCollection.destroy();

        // Scroll back to top
        $( 'html, body' ).stop().animate({ 'scrollTop': productsTop });

        self.filterProductsRequest = $.ajax({
          method: 'GET',
          url: requestedURL,
          dataType: 'html',
        }).done(function(data) {
          var filteredItems = $( data ).find( '.collection__products' ).html();
          var $pagination = $( data ).find( '.pagination' );
          var productsFound = $( data ).find( '.products-found' ).html();

          self.$container.find( '.collection__products' ).html( filteredItems );
          self.$container.find( '.products-found' ).html( productsFound );
          self.$container.find( '.js-reset-filters' ).on( 'click', bindResetButton );

          if ( $pagination.length ) {
            self.$container.find( '.pagination' ).html( $pagination.html() );
          } else {
            self.$container.find( '.pagination' ).empty();
          }

          self._stripSwatches();

          self.endlessCollection = new Ajaxinate({
            container: '#AjaxinateLoop',
            pagination: '#AjaxinatePagination',
            method: 'scroll',
            callback: function() {
              if ( $( 'body' ).hasClass( 'quick-view-enabled' ) ){
                PaloAlto.QuickViewPopup( $( '.quick_view_button' ) );
              } else if ( $( 'body' ).hasClass( 'quick-buy-enabled' ) ){
                PaloAlto.QuickBuy( $( '.add_to_cart_button' ) );
              }

              if ( enableReviews && typeof( window.SPR ) == 'function' ) {
                window.SPR.initDomEls();
                window.SPR.loadBadges();
              }

              if ( productGridSlideshow ) {
                self.productGridSlideshow();
              }

              $(window).trigger( 'scroll' );
              $(window).trigger( 'resize' );
            }
          });

          // Show reset button if there are tags selected
          if ( tags.length ) {
            self.$container.find( '.js-reset-filters' ).addClass( 'is-visible' ).slideDown( 300, function() {
              var subcollectionsHeight = self.$container.find( '.subcollections--top' ).length ? self.$container.find( '.subcollections' ).outerHeight() : 0;
              var productsTop = self.$container.find( '.collection__wrapper' ).offset().top + subcollectionsHeight;

              // Scroll back to top
              $( 'html, body' ).stop().animate({ 'scrollTop': productsTop });
            } );
            self.$container.find( '.collection__filters' ).addClass( 'collection__filters--has-tags-selected' );
          }

          if ( $( 'body' ).hasClass( 'quick-view-enabled' ) ){
            PaloAlto.QuickViewPopup( $( '.quick_view_button' ) );
          } else if ( $( 'body' ).hasClass( 'quick-buy-enabled' ) ){
            PaloAlto.QuickBuy( $( '.add_to_cart_button' ) );
          }

          // Show reviews badges
          if ( enableReviews && typeof( window.SPR ) == 'function' ) {
            window.SPR.initDomEls();
            window.SPR.loadBadges();
          }

          if ( productGridSlideshow ) {
            self.productGridSlideshow();
          }

          if ( enableSubCollections != 'hidden' ) {
            self.subCollectionsSlideshow();
          }

          // Stop loading animation
          setTimeout(function() {
            self.$container.removeClass( 'is-loading' );
            setCollectionContainerHeight();
          }, 450);

          // Update page URL if supported by the browser
          if (history.replaceState) {
            window.history.pushState( { path: requestedURL }, '', requestedURL );
          }
        }).fail( function( jqXHR, textStatus, errorThrown ) {
          self.$container.removeClass( 'is-loading' );
        });
      }

      /* Need that function in order to animate the stickiy filters when new products are loaded */
      function setCollectionContainerHeight() {
        var isLeftPosition = $filtersContainerParent.hasClass( 'collection__filters--left' ) && $(window).width() >= 1024;
        var newContainerHeight = $collectionProducts.outerHeight();

        if ( isLeftPosition ) {
          $collectionWrapper.css( 'height', newContainerHeight );
        } else {
          $collectionWrapper.css( 'height', 'initial' );
        }
      }
    },

    /**
     * Event callback for Theme Editor `section:select` event
     */
    onSelect: function() {
      var enableReviews = this.$container.data( 'reviews' );

      if ( enableReviews && typeof( window.SPR ) == 'function' ) {
        window.SPR.initDomEls();
        window.SPR.loadBadges();
      }

      if ( $( 'body' ).hasClass( 'quick-view-enabled' ) ){
        PaloAlto.QuickViewPopup( $( '.quick_view_button' ) );
      } else if ( $( 'body' ).hasClass( 'quick-buy-enabled' ) ){
        PaloAlto.QuickBuy( $( '.add_to_cart_button' ) );
      }
    },

    onDeselect: function() {
      $.magnificPopup.close();
    },

    _onSortChange: function(evt) {
      var query = '';

      this.sort = this._getSortValue();

      query = [constants.SORT_BY + '=' + this.sort];

      var search = document.location.search = query.length ? '?' + query : '';

      document.location.href = this.$filterSelect.val() + search;
    },

    _onFilterChange: function(evt) {
      document.location.href = this.$filterSelect.val();
    },

    _getSortValue: function() {
      return this.$sortSelect.val() || this.defaultSort;
    },

    _getDefaultSortValue: function() {
      return $(selectors.defaultSort, this.$container).val() || constants.DEFAULT_SORT;
    },

    _stripSwatches: function() {
      var $swatches = this.$container.find('.collection__products .swatch');
      var $swatchesFake = this.$container.find('.collection__products .swatches-fake');
      $swatches.each(function() {
        $(this).find('input, style, script, .header').remove();
      });

      // Remove single swatches
      $swatchesFake.each( function() {
        var swatchesCount = $( this ).find( '.swatch-element' ).length;

        if ( swatchesCount == 1 ) {
          $( this ).remove();
        }
      });
    },

    onUnload: function(evt) {
      this.$filterSelect.off('change', this._onFilterChange);
      this.$sortSelect.off('change', this._onSortChange);
      $.magnificPopup.close();
    }
  });

  return CollectionTemplate;
})();

PaloAlto.FeaturedCollection = (function() {
  var constants = {
    SORT_BY: 'sort_by',
    DEFAULT_SORT: 'title-ascending'
  };
  var selectors = {
    filterSelection: '.filters-toolbar__input--filter',
    sortSelection: '.filters-toolbar__input--sort',
    defaultSort: '.filters-toolbar__default-sort'
  };

  function FeaturedCollection(container) {
    var self = this;
    var $container = this.$container = $(container);
    var $collectionSlider = this.$collectionSlider = $container.find( '.js-featured-collection--slider' );
    var $productSliders = this.$productSliders = $container.find( '.product-image__slider' );
    var enableSwatches = $container.data('swatches');
    var enableReviews = $container.data('reviews');
    var enableSlider = $container.data('slider');
    var productGridSlideshow = $container.data( 'product-grid-slideshow' );

    /* Filters */
    this.$filterSelect = $(selectors.filterSelection, $container);
    this.$sortSelect = $(selectors.sortSelection, $container);
    this.$selects = $(selectors.filterSelection, $container).add($(selectors.sortSelection, $container));

    this.defaultSort = this._getDefaultSortValue();

    this.$filterSelect.on('change', this._onFilterChange.bind(this));
    this.$sortSelect.on('change', this._onSortChange.bind(this));
    this.$selects.removeClass('hidden');

    if ( enableSwatches ) {
      this._stripSwatches();
    }

    if ( enableSlider ) {
      this.checkSlider();

      $( window ).on( 'resize', $.throttle(150, self.checkSlider.bind(self) ) );
    }

    if ( productGridSlideshow ) {
      this.productGridSlideshow();
    }

    if ( typeof(Currency) != 'undefined' && typeof(Currency.convertAll) != 'undefined' && Currency ){
      Currency.convertAll(shopCurrency, $('[name=currencies]').val());
    }

    this.init();
  }

  FeaturedCollection.prototype = $.extend({}, FeaturedCollection.prototype, {
    init: function() {
      if ( $( 'body' ).hasClass( 'quick-view-enabled' ) ){
        PaloAlto.QuickViewPopup( $( '.quick_view_button', this.$container ) );
      } else if ( $( 'body' ).hasClass( 'quick-buy-enabled' ) ){
        PaloAlto.QuickBuy( $( '.add_to_cart_button', this.$container ) );
      }
    },

    checkSlider: function() {
      var windowWidth = window.innerWidth || document.documentElement.clientWidth;
      var isDesktop = windowWidth >= 768;
      var isTablet = windowWidth < 768 && windowWidth > 480;
      var isMobile = windowWidth <= 480;
      var slidesCount = this.$collectionSlider.find( '.grid__item' ).length;
      var productColumns = this.$container.data( 'product-columns' );

      if ( isDesktop && slidesCount > productColumns || isTablet && slidesCount > 2 || isMobile && slidesCount > 1 ) {
        this.initSlider();
        this.setSliderArrowsPosition();
      } else {
        this.destroySlider();
      }
    },

    initSlider: function() {
      var self = this;
      var $slider = this.$collectionSlider;
      var dragThreshold = this.$productSliders.length ? 90 : 3;

      $slider.removeClass( 'slider--disabled' );

      if ( !$slider.data( 'flickity' ) ) {
        $slider.on( 'ready.flickity', function() {
          self.setSliderArrowsPosition();
        });

        $slider.flickity({
          cellSelector: '.featured-collection__item',
          contain: true,
          groupCells: true,
          imagesLoaded: true,
          lazyLoad: true,
          pageDots: false,
          adaptiveHeight: false,
          dragThreshold: dragThreshold,
          wrapAround: true,
          prevNextButtons: false
        });

        this.$container.on( 'click', '.slider__arrow--previous', function() {
          $slider.flickity('previous');
        });

        this.$container.on( 'click', '.slider__arrow--next', function() {
          $slider.flickity('next');
        });

      }
    },

    destroySlider: function() {
      var $slider = this.$collectionSlider;

      $slider.addClass( 'slider--disabled' );

      if ( $slider.data( 'flickity' ) ) {
        $slider.flickity( 'destroy' );
      }
    },

    setSliderArrowsPosition: function() {
      var $slider = this.$collectionSlider;
      var $arrows = $slider.find( '.slider__arrow' );
      var imageHeight = $slider.find( '.grid__image' ).outerHeight();

      $arrows.css('top', imageHeight / 2 );
    },

    /* Product grid slideshow */
    productGridSlideshow: function() {
      var $productGridSlider = this.$container.find( '.product-image__slider' );

      $productGridSlider.each( function() {
        var countImages = $( this ).find( '.product-image' ).length;

        if ( countImages > 1 ) {
          var $imageSlider = $( this ).flickity({
            cellSelector: '.product-image__slide',
            contain: true,
            wrapAround: true,
            imagesLoaded: true,
            lazyLoad: true,
            pageDots: false,
            adaptiveHeight: false,
            dragThreshold: 3,
            arrowShape: {
              x0: 0,
              x1: 45, y1: 50,
              x2: 50, y2: 50,
              x3: 5
            }
          });
        }
      });

      // Prevent page redirect on slideshow arrow click
      this.$container.on( 'click', '.grid__image', function(e) {
        if ( $(e.target).is( '.flickity-button, .flickity-button *' ) ) {
          e.preventDefault();
        }
      });
    },

    _onSortChange: function(evt) {
      var query = '';

      this.sort = this._getSortValue();

      query = [constants.SORT_BY + '=' + this.sort];

      var search = document.location.search = query.length ? '?' + query : '';

      document.location.href = this.$filterSelect.val() + search;
    },

    _onFilterChange: function(evt) {
      document.location.href = this.$filterSelect.val();
    },

    _getSortValue: function() {
      return this.$sortSelect.val() || this.defaultSort;
    },

    _getDefaultSortValue: function() {
      return $(selectors.defaultSort, this.$container).val() || constants.DEFAULT_SORT;
    },

    _stripSwatches: function() {
      var $swatches = this.$container.find('.swatch');
      var $swatchesFake = this.$container.find('.collection__products .swatches-fake');
      $swatches.each(function() {
        $(this).find('input, style, script, .header').remove();
      });

      // Remove single swatches
      $swatchesFake.each( function() {
        var swatchesCount = $( this ).find( '.swatch-element' ).length;

        if ( swatchesCount == 1 ) {
          $( this ).remove();
        }
      });
    },

    /**
     * Event callback for Theme Editor `section:select` event
     */
    onSelect: function() {
      var enableReviews = this.$container.data('reviews');

      if ( enableReviews && typeof( window.SPR ) == 'function' ) {
        window.SPR.initDomEls();
        window.SPR.loadBadges();
      }

      if ( $( 'body' ).hasClass( 'quick-view-enabled' ) ){
        PaloAlto.QuickViewPopup( $( '.quick_view_button', this.$container ) );
      } else if ( $( 'body' ).hasClass( 'quick-buy-enabled' ) ){
        PaloAlto.QuickBuy( $( '.add_to_cart_button', this.$container ) );
      }
    },

    onDeselect: function() {
      $.magnificPopup.close();
    },

    onBlockSelect: function(evt) {
      var $slider = $( evt.target ).parents( '.js-featured-collection--slider' );
      var index = $( evt.target ).index();

      if ( $slider.data( 'flickity' ) ) {
        $slider.flickity( 'select', index );
      }
    },

    onUnload: function(evt) {
      this.$filterSelect.off('change', this._onFilterChange);
      this.$sortSelect.off('change', this._onSortChange);
      $.magnificPopup.close();

      var $slider = $(evt.target).parents('.js-featured-collection--slider');

      if ( $slider.data('flickity') ) {
        $slider.flickity('destroy');
      }
    }
  });

  return FeaturedCollection;
})();

PaloAlto.TabbedCollections = (function() {
  function TabbedCollections(container) {
    var self = this;
    var $container = this.$container = $(container);
    var $productSliders = this.$productSliders = $container.find( '.product-image__slider' );
    var enableSwatches = $container.data('swatches');
    var enableReviews = $container.data('reviews');
    var enableSlider = $container.data('slider');
    var productGridSlideshow = $container.data( 'product-grid-slideshow' );
    var productColumns = $container.data( 'product-columns' )

    if ( enableSwatches ) {
      this._stripSwatches();
    }

    if ( enableSlider ) {
      this.checkSlider();

      $( window ).on( 'resize', $.throttle(150, self.checkSlider.bind(self) ) );
    }

    if ( productGridSlideshow ) {
      this.productGridSlideshow();
    }

    if ( typeof(Currency) != 'undefined' && typeof(Currency.convertAll) != 'undefined' && Currency ){
      Currency.convertAll(shopCurrency, $('[name=currencies]').val());
    }

    this.init();
  }

  TabbedCollections.prototype = $.extend({}, TabbedCollections.prototype, {
    init: function() {
      var self = this;

      $( '.collection__tabs-nav', this.$container ).on( 'click', 'button', function(e) {
        e.preventDefault();
        var $tabs = self.$container.find( '.collection__tab' );
        var currentTab = '#' + $(this).data( 'tab' );
        var $currentSlider = $(currentTab).find( '.js-featured-collection--slider' );

        $(this).parent().addClass( 'is-active' ).siblings().removeClass( 'is-active' );
        $tabs.removeClass( 'is-active' ).filter( $(currentTab) ).addClass( 'is-active' );

        // Fade out slider until it initializes
        $currentSlider.addClass( 'is-loading' );

        // Init slider or trigger resize if it's already initialized
        if ( $currentSlider.data( 'flickity' ) ) {
          $currentSlider.flickity( 'resize' );
        } else {
          self.checkSlider();
        }

        // Update product grid images slideshow
        self.$productSliders.filter( ':visible' ).flickity( 'resize' );

        // Fix blurry images on tab select
        $(currentTab).find( '.product-image' ).addClass( 'lazyload' );

        // Fade in slider
        $currentSlider.removeClass( 'is-loading' );
      });

      // Bind quick buy/view buttons
      if ( $( 'body' ).hasClass( 'quick-view-enabled' ) ){
        PaloAlto.QuickViewPopup( $( '.quick_view_button', this.$container ) );
      } else if ( $( 'body' ).hasClass( 'quick-buy-enabled' ) ){
        PaloAlto.QuickBuy( $( '.add_to_cart_button', this.$container ) );
      }
    },

    checkSlider: function() {
      var windowWidth = window.innerWidth || document.documentElement.clientWidth;
      var isDesktop = windowWidth >= 768;
      var isTablet = windowWidth < 768 && windowWidth > 480;
      var isMobile = windowWidth <= 480;
      var $collectionSlider = this.$container.find( '.is-active .js-featured-collection--slider' );
      var slidesCount = $collectionSlider.find( '.grid__item' ).length;
      var productColumns = this.$container.data( 'product-columns' );

      if ( isDesktop && slidesCount > productColumns || isTablet && slidesCount > 2 || isMobile && slidesCount > 1 ) {
        this.initSlider();
        this.setSliderArrowsPosition();
      } else {
        this.destroySlider();
      }
    },

    initSlider: function() {
      var self = this;
      var $slider = this.$container.find( '.is-active .js-featured-collection--slider' );
      var dragThreshold = this.$productSliders.length ? 90 : 3;

      $slider.removeClass( 'slider--disabled' );

      if ( !$slider.data( 'flickity' ) ) {
        $slider.on( 'ready.flickity', function() {
          self.setSliderArrowsPosition();
        });

        $slider.flickity({
          cellSelector: '.featured-collection__item',
          contain: true,
          groupCells: true,
          imagesLoaded: true,
          lazyLoad: true,
          pageDots: false,
          adaptiveHeight: false,
          dragThreshold: dragThreshold,
          wrapAround: true,
          prevNextButtons: false
        });

        $slider.on( 'click', '.slider__arrow--previous', function() {
          $slider.flickity('previous');
        });

        $slider.on( 'click', '.slider__arrow--next', function() {
          $slider.flickity('next');
        });
      }
    },

    destroySlider: function() {
      var $slider = this.$container.find( '.is-active .js-featured-collection--slider' );

      $slider.addClass( 'slider--disabled' );

      if ( $slider.data( 'flickity' ) ) {
        $slider.flickity( 'destroy' );
      }
    },

    setSliderArrowsPosition: function() {
      var $slider = this.$container.find( '.is-active .js-featured-collection--slider' );
      var $arrows = $slider.find('.slider__arrow');
      var imageHeight = $slider.find('.grid__image').outerHeight();

      $arrows.css('top', imageHeight / 2 );
    },

    /* Product grid slideshow */
    productGridSlideshow: function() {
      var $productGridSlider = this.$container.find( '.product-image__slider' );

      $productGridSlider.each( function() {
        var countImages = $( this ).find( '.product-image' ).length;

        if ( countImages > 1 ) {
          var $imageSlider = $( this ).flickity({
            cellSelector: '.product-image__slide',
            contain: true,
            wrapAround: true,
            imagesLoaded: true,
            lazyLoad: true,
            pageDots: false,
            adaptiveHeight: false,
            dragThreshold: 3,
            arrowShape: {
              x0: 0,
              x1: 45, y1: 50,
              x2: 50, y2: 50,
              x3: 5
            }
          });
        }
      });

      // Prevent page redirect on slideshow arrow click
      this.$container.on( 'click', '.grid__image', function(e) {
        if ( $(e.target).is( '.flickity-button, .flickity-button *' ) ) {
          e.preventDefault();
        }
      });
    },

    _stripSwatches: function() {
      var $swatches = this.$container.find('.swatch');
      var $swatchesFake = this.$container.find('.collection__products .swatches-fake');
      $swatches.each(function() {
        $(this).find('input, style, script, .header').remove();
      });

      // Remove single swatches
      $swatchesFake.each( function() {
        var swatchesCount = $( this ).find( '.swatch-element' ).length;

        if ( swatchesCount == 1 ) {
          $( this ).remove();
        }
      });
    },

    /**
     * Event callback for Theme Editor `section:select` event
     */
    onSelect: function() {
      var enableReviews = this.$container.data('reviews');

      if ( enableReviews && typeof( window.SPR ) == 'function' ) {
        window.SPR.initDomEls();
        window.SPR.loadBadges();
      }

      if ( $( 'body' ).hasClass( 'quick-view-enabled' ) ){
        PaloAlto.QuickViewPopup( $( '.quick_view_button', this.$container ) );
      } else if ( $( 'body' ).hasClass( 'quick-buy-enabled' ) ){
        PaloAlto.QuickBuy( $( '.add_to_cart_button', this.$container ) );
      }
    },

    onDeselect: function() {
      $.magnificPopup.close();
    },

    onBlockSelect: function(evt) {
      // Show selected tab
      $( evt.target ).find( 'button' ).trigger( 'click' );
    },

    onUnload: function(evt) {
      $.magnificPopup.close();

      var $slider = $(evt.target).find( '.is-active .js-featured-collection--slider' );

      if ( $slider.data('flickity') ) {
        $slider.flickity('destroy');
      }
    }
  });

  return TabbedCollections;
})();

PaloAlto.ListCollections = (function() {

  function ListCollections(container) {
    var self = this;
    var $container = this.$container = $( container );
    var $slider = $container.find( '.js-list-collections__slider' );

    this.checkSlidesSize( $slider );

    $(window).on('resize', PaloAlto.debounce(function() {
        self.checkSlidesSize( $slider );
    }, 250));
  }

  ListCollections.prototype = $.extend({}, ListCollections.prototype, {
    checkSlidesSize: function( $slider ) {
      var windowWidth = $( window ).width();
      var columns = $slider.data( 'columns' );
      var slidesCount = $slider.find( '.list-collections__slide' ).length;

      // Center columns and remove slider if the columns are more than the slides
      if ( columns >= slidesCount && windowWidth >= 768 ) {
        $slider.addClass( 'list-collections__slider--center' );

        if ( $slider.data( 'flickity' ) ) {
          $slider.flickity( 'destroy' );
        }
      } else {
        $slider.removeClass( 'list-collections__slider--center' );

        if ( !$slider.data( 'flickity' ) ) {
          $slider.flickity({
            pageDots: false,
            cellAlign: 'left',
            groupCells: true,
            arrowShape: {
              x0: 0,
              x1: 45, y1: 50,
              x2: 50, y2: 50,
              x3: 5
            }
          });
        }
      }
    },
    onBlockSelect: function(evt) {
      var $slider = $( evt.target ).parents( '.js-list-collections__slider' );
      var sliderData = $slider.data( 'flickity' );
      var index = parseInt( $( evt.target ).index() );
      var slidesPerPage = parseInt( sliderData.slides[0].cells.length );
      var groupIndex = Math.floor( index / slidesPerPage );

      if ( $slider.data( 'flickity' ) ) {
        $slider.flickity( 'select', groupIndex );
      }
    }
  });

  return ListCollections;
})();

PaloAlto.FeaturedImage = (function() {

  function FeaturedImage(container) {
    // iOS doesn't play well with background-attachment: fixed
    if(window.isTouchDevice){
      $(container).css('background-attachment','scroll');
    }

    // Resizes background image without stretching it
    if($(container).hasClass('original-height')){
      proportionize(container);
      $(window).resize(function(){
        proportionize(container);
      });
    }

    function proportionize(container){
      var aspectRatio = $(container).data('aspect-ratio');
      var windowWidth = $(window).width();
      var newHeight = windowWidth / aspectRatio;

      $(container).css('height',newHeight);
      enquire.register("screen and (max-width: 991px)", {
        match : function() {
          $(container).css('background-size',windowWidth);
          $(container).addClass('original-height--position');
        },
        unmatch : function() {
          $(container).css('background-size','cover');
          $(container).removeClass('original-height--position');
        }
      });

      $(container).css('opacity','1');
    }
  }

  return FeaturedImage;
})();

PaloAlto.BlogPosts = (function() {

  function BlogPosts(container) {
    var self = this;
    var $container = self.$container = $(container);
    var title = $(container).find('.h4');
    var excerpt = $(container).find('.excerpt');

    $(title).each(function(){
      $(this).trunk8({lines: 2});
    });

    this.setHeights(container);
    this.checkMobile();
    $(window).on('resize', $.throttle(150, function(){
      self.setHeights(container);
      self.checkMobile();
    }));
  }

  BlogPosts.prototype = $.extend({}, BlogPosts.prototype, {
    setHeights: function(container){
      var content = $(container).find('.featured-blog__content');
      if(!$(content).hasClass('onboarding-blog-content')){
        var tallestContent = 0;
        $(content).each(function(){
          var titleHeight = $(this).find('.h5').height();
          var dateHeight = $(this).find('.featured-blog__date').height();
          var excerptHeight = $(this).find('.excerpt').height();
          var currentContent = titleHeight + dateHeight + excerptHeight;
          if(currentContent > tallestContent){
            tallestContent = currentContent;
          }
        });
        tallestContent = tallestContent + 75;
        $(content).css('height', tallestContent);
      }
    },

    checkMobile: function() {
      var windowWidth = $(window).width();

      if ( windowWidth < 768 ) {
        this.initSlider();
      } else {
        this.destroySlider();
      }
    },

    initSlider: function() {
      var $slider = this.$container.find('.featured-blog__slider-mobile');
      if ( !$slider.data('flickity') ) {
        $slider.flickity({
          contain: true,
          wrapAround: true,
          arrowShape: {
            x0: 0,
            x1: 45, y1: 50,
            x2: 50, y2: 50,
            x3: 5
          }
        });
      }
    },

    destroySlider: function() {
      var $slider = this.$container.find('.featured-blog__slider-mobile');
      if ( $slider.data('flickity') ) {
        $slider.flickity('destroy');
      }
    },

    onBlockSelect: function(evt) {
      var $slider = $(evt.target).parents('.featured-blog__slider-mobile');
      var index = $(evt.target).index();

      if ( $slider.data('flickity') ) {
        $slider.flickity('select', index);
      }
    },

    onUnload: function(evt) {
      var $slider = $(evt.target).parents('.featured-blog__slider-mobile');

      if ( $slider.data('flickity') ) {
        $slider.flickity('destroy');
      }
    }
  });

  return BlogPosts;

})();

PaloAlto.LogoList = (function() {
  function LogoList(container) {
    var self = this;
    var $container = self.$container = $(container);
    var $slider = self.$slider = $container.find('.logo-list__slider');

    self.checkSlides(self);

    $(window).on('resize', $.throttle(150, function() {
      self.checkSlides(self)
    }));
  }

  LogoList.prototype = $.extend({}, LogoList.prototype, {
    checkSlides: function(self) {
      var sliderWidth = self.$slider.width();
      var slideWidth = self.$slider.find('.logo-list__slide').outerWidth();
      var slideCount = self.$slider.find('.logo-list__slide').length;

      if ( slideCount * slideWidth > sliderWidth ) {
        self.initSlider(self);
      } else {
        self.destroySlider(self);
      }
    },

    initSlider: function(self) {
      if ( !self.$slider.data('flickity') ) {
        self.$slider.flickity({
          contain: true,
          wrapAround: true,
          pageDots: false,
          arrowShape: {
            x0: 0,
            x1: 45, y1: 50,
            x2: 50, y2: 50,
            x3: 5
          }
        });
      }
    },

    destroySlider: function(self) {
      if ( self.$slider.data('flickity') ) {
        self.$slider.flickity('destroy');
      }
    },

    onBlockSelect: function(evt) {
      var $slider = $(evt.target).parents('.logo-list__slider');
      var index = $(evt.target).index();

      if ( $slider.data('flickity') ) {
        $slider.flickity('select', index);
      }
    },

    onUnload: function(evt) {
      var $slider = $(evt.target).parents('.logo-list__slider');

      if ( $slider.data('flickity') ) {
        $slider.flickity('destroy');
      }
    }
  });

  return LogoList;
})();

PaloAlto.IconsRow = (function() {
  function IconsRow(container) {
    var self = this;
    var $container = self.$container = $(container);
    var $slider = self.$slider = $container.find('.icons-row__slider');

    self.checkSlides(self);

    $(window).on('resize', $.throttle(150, function() {
      self.checkSlides(self)
    }));
  }

  IconsRow.prototype = $.extend({}, IconsRow.prototype, {
    checkSlides: function(self) {
      var isMobile = $(window).width() < 768;

      if ( isMobile ) {
        self.initSlider(self);
      } else {
        self.destroySlider(self);
      }
    },

    initSlider: function(self) {
      if ( !self.$slider.data('flickity') ) {
        self.$slider.flickity({
          contain: true,
          wrapAround: true,
          pageDots: false,
          arrowShape: {
            x0: 0,
            x1: 45, y1: 50,
            x2: 50, y2: 50,
            x3: 5
          }
        });
      }
    },

    destroySlider: function(self) {
      if ( self.$slider.data('flickity') ) {
        self.$slider.flickity('destroy');
      }
    },

    onBlockSelect: function(evt) {
      var $slider = $(evt.target).parents('.icons-row__slider');
      var index = $(evt.target).index();

      if ( $slider.data('flickity') ) {
        $slider.flickity('select', index);
      }
    },

    onUnload: function(evt) {
      var $slider = $(evt.target).parents('.icons-row__slider');

      if ( $slider.data('flickity') ) {
        $slider.flickity('destroy');
      }
    }
  });

  return IconsRow;
})();

PaloAlto.Map = (function() {

  function Map(container) {
    var key = $(container).data('key');
    var style = $(container).data('style');
    $.getScript(
      'https://maps.googleapis.com/maps/api/js?key=' + key
    ).then(function() {
      createMap(container);
    });

    function createMap(container){
      var zoom = $(container).data('zoom');
      var id = $(container).data('section-id');
      var address = $(container).data('address');
      var map = new GMaps({
          div: '.map--'+id,
          lat: 37.4439064,
          lng: -122.1639733,
          navigationControl: false,
          mapTypeControl: false,
          scaleControl: false,
          draggable: false,
          zoom: zoom
      });

      var standard =[];
      var silver =[{"elementType":"geometry","stylers":[{"color":"#f5f5f5"}]},{"elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"elementType":"labels.text.fill","stylers":[{"color":"#616161"}]},{"elementType":"labels.text.stroke","stylers":[{"color":"#f5f5f5"}]},{"featureType":"administrative.land_parcel","elementType":"labels.text.fill","stylers":[{"color":"#bdbdbd"}]},{"featureType":"poi","elementType":"geometry","stylers":[{"color":"#eeeeee"}]},{"featureType":"poi","elementType":"labels.text.fill","stylers":[{"color":"#757575"}]},{"featureType":"poi.park","elementType":"geometry","stylers":[{"color":"#e5e5e5"}]},{"featureType":"poi.park","elementType":"labels.text.fill","stylers":[{"color":"#9e9e9e"}]},{"featureType":"road","elementType":"geometry","stylers":[{"color":"#ffffff"}]},{"featureType":"road.arterial","elementType":"labels.text.fill","stylers":[{"color":"#757575"}]},{"featureType":"road.highway","elementType":"geometry","stylers":[{"color":"#dadada"}]},{"featureType":"road.highway","elementType":"labels.text.fill","stylers":[{"color":"#616161"}]},{"featureType":"road.local","elementType":"labels.text.fill","stylers":[{"color":"#9e9e9e"}]},{"featureType":"transit.line","elementType":"geometry","stylers":[{"color":"#e5e5e5"}]},{"featureType":"transit.station","elementType":"geometry","stylers":[{"color":"#eeeeee"}]},{"featureType":"water","elementType":"geometry","stylers":[{"color":"#c9c9c9"}]},{"featureType":"water","elementType":"labels.text.fill","stylers":[{"color":"#9e9e9e"}]}];
      var retro =[{"elementType":"geometry","stylers":[{"color":"#ebe3cd"}]},{"elementType":"labels.text.fill","stylers":[{"color":"#523735"}]},{"elementType":"labels.text.stroke","stylers":[{"color":"#f5f1e6"}]},{"featureType":"administrative","elementType":"geometry.stroke","stylers":[{"color":"#c9b2a6"}]},{"featureType":"administrative.land_parcel","elementType":"geometry.stroke","stylers":[{"color":"#dcd2be"}]},{"featureType":"administrative.land_parcel","elementType":"labels.text.fill","stylers":[{"color":"#ae9e90"}]},{"featureType":"landscape.natural","elementType":"geometry","stylers":[{"color":"#dfd2ae"}]},{"featureType":"poi","elementType":"geometry","stylers":[{"color":"#dfd2ae"}]},{"featureType":"poi","elementType":"labels.text.fill","stylers":[{"color":"#93817c"}]},{"featureType":"poi.park","elementType":"geometry.fill","stylers":[{"color":"#a5b076"}]},{"featureType":"poi.park","elementType":"labels.text.fill","stylers":[{"color":"#447530"}]},{"featureType":"road","elementType":"geometry","stylers":[{"color":"#f5f1e6"}]},{"featureType":"road.arterial","elementType":"geometry","stylers":[{"color":"#fdfcf8"}]},{"featureType":"road.highway","elementType":"geometry","stylers":[{"color":"#f8c967"}]},{"featureType":"road.highway","elementType":"geometry.stroke","stylers":[{"color":"#e9bc62"}]},{"featureType":"road.highway.controlled_access","elementType":"geometry","stylers":[{"color":"#e98d58"}]},{"featureType":"road.highway.controlled_access","elementType":"geometry.stroke","stylers":[{"color":"#db8555"}]},{"featureType":"road.local","elementType":"labels.text.fill","stylers":[{"color":"#806b63"}]},{"featureType":"transit.line","elementType":"geometry","stylers":[{"color":"#dfd2ae"}]},{"featureType":"transit.line","elementType":"labels.text.fill","stylers":[{"color":"#8f7d77"}]},{"featureType":"transit.line","elementType":"labels.text.stroke","stylers":[{"color":"#ebe3cd"}]},{"featureType":"transit.station","elementType":"geometry","stylers":[{"color":"#dfd2ae"}]},{"featureType":"water","elementType":"geometry.fill","stylers":[{"color":"#b9d3c2"}]},{"featureType":"water","elementType":"labels.text.fill","stylers":[{"color":"#92998d"}]}];
      var dark =[{"elementType":"geometry","stylers":[{"color":"#212121"}]},{"elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"elementType":"labels.text.fill","stylers":[{"color":"#757575"}]},{"elementType":"labels.text.stroke","stylers":[{"color":"#212121"}]},{"featureType":"administrative","elementType":"geometry","stylers":[{"color":"#757575"}]},{"featureType":"administrative.country","elementType":"labels.text.fill","stylers":[{"color":"#9e9e9e"}]},{"featureType":"administrative.land_parcel","stylers":[{"visibility":"off"}]},{"featureType":"administrative.locality","elementType":"labels.text.fill","stylers":[{"color":"#bdbdbd"}]},{"featureType":"poi","elementType":"labels.text.fill","stylers":[{"color":"#757575"}]},{"featureType":"poi.park","elementType":"geometry","stylers":[{"color":"#181818"}]},{"featureType":"poi.park","elementType":"labels.text.fill","stylers":[{"color":"#616161"}]},{"featureType":"poi.park","elementType":"labels.text.stroke","stylers":[{"color":"#1b1b1b"}]},{"featureType":"road","elementType":"geometry.fill","stylers":[{"color":"#2c2c2c"}]},{"featureType":"road","elementType":"labels.text.fill","stylers":[{"color":"#8a8a8a"}]},{"featureType":"road.arterial","elementType":"geometry","stylers":[{"color":"#373737"}]},{"featureType":"road.highway","elementType":"geometry","stylers":[{"color":"#3c3c3c"}]},{"featureType":"road.highway.controlled_access","elementType":"geometry","stylers":[{"color":"#4e4e4e"}]},{"featureType":"road.local","elementType":"labels.text.fill","stylers":[{"color":"#616161"}]},{"featureType":"transit","elementType":"labels.text.fill","stylers":[{"color":"#757575"}]},{"featureType":"water","elementType":"geometry","stylers":[{"color":"#000000"}]},{"featureType":"water","elementType":"labels.text.fill","stylers":[{"color":"#3d3d3d"}]}];
      var night =[{"elementType":"geometry","stylers":[{"color":"#242f3e"}]},{"elementType":"labels.text.fill","stylers":[{"color":"#746855"}]},{"elementType":"labels.text.stroke","stylers":[{"color":"#242f3e"}]},{"featureType":"administrative.locality","elementType":"labels.text.fill","stylers":[{"color":"#d59563"}]},{"featureType":"poi","elementType":"labels.text.fill","stylers":[{"color":"#d59563"}]},{"featureType":"poi.park","elementType":"geometry","stylers":[{"color":"#263c3f"}]},{"featureType":"poi.park","elementType":"labels.text.fill","stylers":[{"color":"#6b9a76"}]},{"featureType":"road","elementType":"geometry","stylers":[{"color":"#38414e"}]},{"featureType":"road","elementType":"geometry.stroke","stylers":[{"color":"#212a37"}]},{"featureType":"road","elementType":"labels.text.fill","stylers":[{"color":"#9ca5b3"}]},{"featureType":"road.highway","elementType":"geometry","stylers":[{"color":"#746855"}]},{"featureType":"road.highway","elementType":"geometry.stroke","stylers":[{"color":"#1f2835"}]},{"featureType":"road.highway","elementType":"labels.text.fill","stylers":[{"color":"#f3d19c"}]},{"featureType":"transit","elementType":"geometry","stylers":[{"color":"#2f3948"}]},{"featureType":"transit.station","elementType":"labels.text.fill","stylers":[{"color":"#d59563"}]},{"featureType":"water","elementType":"geometry","stylers":[{"color":"#17263c"}]},{"featureType":"water","elementType":"labels.text.fill","stylers":[{"color":"#515c6d"}]},{"featureType":"water","elementType":"labels.text.stroke","stylers":[{"color":"#17263c"}]}];
      var aubergine =[{"elementType":"geometry","stylers":[{"color":"#1d2c4d"}]},{"elementType":"labels.text.fill","stylers":[{"color":"#8ec3b9"}]},{"elementType":"labels.text.stroke","stylers":[{"color":"#1a3646"}]},{"featureType":"administrative.country","elementType":"geometry.stroke","stylers":[{"color":"#4b6878"}]},{"featureType":"administrative.land_parcel","elementType":"labels.text.fill","stylers":[{"color":"#64779e"}]},{"featureType":"administrative.province","elementType":"geometry.stroke","stylers":[{"color":"#4b6878"}]},{"featureType":"landscape.man_made","elementType":"geometry.stroke","stylers":[{"color":"#334e87"}]},{"featureType":"landscape.natural","elementType":"geometry","stylers":[{"color":"#023e58"}]},{"featureType":"poi","elementType":"geometry","stylers":[{"color":"#283d6a"}]},{"featureType":"poi","elementType":"labels.text.fill","stylers":[{"color":"#6f9ba5"}]},{"featureType":"poi","elementType":"labels.text.stroke","stylers":[{"color":"#1d2c4d"}]},{"featureType":"poi.park","elementType":"geometry.fill","stylers":[{"color":"#023e58"}]},{"featureType":"poi.park","elementType":"labels.text.fill","stylers":[{"color":"#3C7680"}]},{"featureType":"road","elementType":"geometry","stylers":[{"color":"#304a7d"}]},{"featureType":"road","elementType":"labels.text.fill","stylers":[{"color":"#98a5be"}]},{"featureType":"road","elementType":"labels.text.stroke","stylers":[{"color":"#1d2c4d"}]},{"featureType":"road.highway","elementType":"geometry","stylers":[{"color":"#2c6675"}]},{"featureType":"road.highway","elementType":"geometry.stroke","stylers":[{"color":"#255763"}]},{"featureType":"road.highway","elementType":"labels.text.fill","stylers":[{"color":"#b0d5ce"}]},{"featureType":"road.highway","elementType":"labels.text.stroke","stylers":[{"color":"#023e58"}]},{"featureType":"transit","elementType":"labels.text.fill","stylers":[{"color":"#98a5be"}]},{"featureType":"transit","elementType":"labels.text.stroke","stylers":[{"color":"#1d2c4d"}]},{"featureType":"transit.line","elementType":"geometry.fill","stylers":[{"color":"#283d6a"}]},{"featureType":"transit.station","elementType":"geometry","stylers":[{"color":"#3a4762"}]},{"featureType":"water","elementType":"geometry","stylers":[{"color":"#0e1626"}]},{"featureType":"water","elementType":"labels.text.fill","stylers":[{"color":"#4e6d70"}]}];

      var styles = '';
      if(style == 'standard'){
        styles = standard;
      } else if (style == 'silver'){
        styles = silver;
      } else if (style == 'retro'){
        styles = retro;
      } else if (style == 'dark'){
        styles = dark;
      } else if (style == 'night'){
        styles = night;
      } else {
        styles = aubergine;
      }

      map.addStyle({
          styledMapName:"Styled Map",
          styles: styles,
          mapTypeId: "map_style"
      });

      map.setStyle("map_style");
      GMaps.geocode({
        address: address,
        callback: function(results, status) {
          if (status == 'OK') {
            var latlng = results[0].geometry.location;
            map.setCenter(latlng.lat(), latlng.lng());
            map.addMarker({
              lat: latlng.lat(),
              lng: latlng.lng()
            });
          }
        }
      });
    }
  }

  return Map;

})();

PaloAlto.ColorSwatches = {
  init: function(variant, selector) {
    var form = $('#' + selector.domIdPrefix).closest('form');
    var enableColorSwatches = form.data('swatches');

    if (enableColorSwatches) {
      if (variant) {
        var form = $('#' + selector.domIdPrefix).closest('form');
        for (var i=0,length=variant.options.length; i<length; i++) {
          var radioButton = form.find('.swatch[data-option-index="' + i + '"] :radio[value="' + escape(variant.options[i]) +'"]');
          if (radioButton.size()) {
            radioButton.get(0).checked = true;
          }
        }
      }
    }
  },
  bind: function() {
    $( '.product-form' ).on( 'change', '.swatch :radio', function() {
      var optionIndex = $( this ).closest( '.swatch' ).attr( 'data-option-index' );
      var optionValue = $( this ).val();

      $(this)
      .closest( 'form' )
      .find( '.single-option-selector' )
      .eq( optionIndex )
      .val( optionValue )
      .trigger( 'change' );
    });
  },
  unbind: function() {
    $( '.product-form' ).off( 'change', '.swatch :radio' );
  },
  destroy: function() {
    this.unbind();

    $( '.product-form' ).find( '.swatch, style' ).remove();
  }
}

PaloAlto.Testimonials = (function() {

  function Testimonials(container) {
    var $container = this.$container = $(container);
    var sectionId = $(container).attr('data-section-id');

    this.initSlider();
  }

  Testimonials.prototype = $.extend({}, Testimonials.prototype, {

    /* Init Slider */
    initSlider: function() {
      var $slider = $( '.testimonials__slider', this.$container);
      var slidesCount = $slider.find( '.testimonial__item' ).length;

      if ( slidesCount > 3 ) {
        runSlider();
      }

      if ( slidesCount > 1 ) {
        enquire.register( 'screen and (max-width: 767px)', {
          match: function() {
            runSlider();
          },
          unmatch: function() {
            var hasSlider = $slider.hasClass( 'flickity-enabled' );

            if ( slidesCount <= 3 && hasSlider ) {
              $slider.flickity( 'destroy' );
            }
          }
        });
      }

      function runSlider() {
        $slider.flickity({
          cellSelector: '.testimonial__item',
          imagesLoaded: true,
          lazyLoad: true,
          pageDots: true,
          contain: true,
          groupCells: true,
          arrowShape: {
            x0: 0,
            x1: 45, y1: 50,
            x2: 50, y2: 50,
            x3: 5
          }
        });
      }
    },

    onBlockSelect: function(evt) {
      var $slider = $( evt.target ).parents( '.testimonials__slider' );
      var sliderData = $slider.data( 'flickity' );
      var index = parseInt( $( evt.target ).index() );
      var slidesPerPage = parseInt( sliderData.slides[0].cells.length );
      var groupIndex = Math.floor( index / slidesPerPage );

      if ( $slider.data( 'flickity' ) ) {
        $slider.flickity( 'select', groupIndex );
      }
    }
  });

  return Testimonials;
})();

PaloAlto.Faq = (function() {

  function Faq(container) {
    var $container = this.$container = $(container);
    var sectionId = $(container).attr('data-section-id');

    this.initFaq();
  }

  Faq.prototype = $.extend({}, Faq.prototype, {

    /* Init Faq */
    initFaq: function() {
      var $faqItem = $( '.faq-list__item', this.container );

      $faqItem.on('click', '.faq-list__item-question', function() {
        $( this ).parent().toggleClass( 'is-active' );
      });

    }
  });

  return Faq;
})();

PaloAlto.Press = (function() {

  function Press(container) {
    var $container = this.$container = $(container);
    var $slider = this.$slider = $container.find( '.press__items' );
    var $sliderNav = this.$sliderNav = $container.find( '.press__logos-slider' );

    this.initSlider();
  }

  Press.prototype = $.extend({}, Press.prototype, {

    /* Init slider */
    initSlider: function() {
      var $slider = this.$slider;
      var $sliderNav = this.$sliderNav;
      var slidesCount = $slider.data( 'count' );

      $slider.flickity({
        wrapAround: true,
        adaptiveHeight: true,
        prevNextButtons: false,
        pageDots: false
      });

      if ( slidesCount > 2 ) {

        $sliderNav.flickity({
          wrapAround: true,
          initialIndex: 2,
          imagesLoaded: true,
          lazyLoad: true,
          asNavFor: $slider[0],
          prevNextButtons: false,
          pageDots: false
        });

        // Trigger text change on image move/drag
        $sliderNav.on( 'change.flickity', function( event, pointer ) {
          var flkty = $sliderNav.data( 'flickity' );
          var index = flkty.selectedIndex;
          $slider.flickity( 'selectCell', index );
        });

        // Trigger text change on image move/drag
        $slider.on( 'change.flickity', function( event, pointer ) {
          var flkty = $slider.data( 'flickity' );
          var index = flkty.selectedIndex;
          $sliderNav.flickity( 'selectCell', index );
        });

        this.$container.on( 'click', '.slider__arrow', function() {
          if ( $(this).hasClass( 'slider__arrow--previous' ) ) {
            $slider.flickity( 'previous', true );
          } else {
            $slider.flickity( 'next', true );
          }
        });
      } else {
        $sliderNav.on( 'click', '.press__logo', function() {
          var index = $(this).index();

          $(this).addClass( 'is-selected' ).siblings().removeClass( 'is-selected' );
          $slider.flickity( 'selectCell', index );
        });

        $slider.on( 'change.flickity', function( event, pointer ) {
          var flkty = $slider.data( 'flickity' );
          var index = flkty.selectedIndex;
          $sliderNav.find( '.press__logo' ).eq( index ).addClass( 'is-selected' ).siblings().removeClass( 'is-selected' );
        });
      }


    },

    onBlockSelect: function(evt) {
      var $slider = $( evt.target ).parents( '.press__items' );
      var $sliderNav = $( evt.target ).parents( '.press__logos-slider' );
      var index = $( evt.target ).index();

      if ( $slider.data( 'flickity' ) ) {
        $slider.flickity( 'select', index );
      }

      if ( $sliderNav.data( 'flickity' ) ) {
        $sliderNav.flickity( 'select', index );
      }
    }
  });

  return Press;
})();

PaloAlto.onVariantSelected = function(variant, selector) {

  if (variant) {
    // BEGIN SWATCHES
    var form = $('#' + selector.domIdPrefix).closest('form');
    for (var i=0,length=variant.options.length; i<length; i++) {
      var radioButton = form.find('.swatch[data-option-index="' + i + '"] :radio[value="' + escape(variant.options[i]) +'"]');
      if (radioButton.length) {
        radioButton.get(0).checked = true;
      }
    }
    // END SWATCHES

    var variantImageID = variant.featured_image ? variant.featured_image.id : false
    var $slider = $('.product-images__slider');
    var flick = $slider.data('flickity');
    var $featuredProduct = $('.featured-product').has('.featured-image#' + variantImageID );

    // Slide to selected variant image
    if(flick && flick.isActive) {
      var $variantSlide = $slider.find('[data-image-id="' + variantImageID + '"]');

      if ($variantSlide.index() != -1) {
        flick.select($variantSlide.index());
      }
    } else if ( $featuredProduct.length ) {
      $featuredProduct.find('.featured-image').addClass('hide').filter('.featured-image#' + variantImageID ).removeClass('hide');
    }
  }
}

PaloAlto.AnnouncementBar = (function() {

  function AnnouncementBar(container) {
    var $container = this.$container = $(container);
    var sectionId = $(container).attr('data-section-id');

    this.initSlider();
  }

  AnnouncementBar.prototype = $.extend({}, AnnouncementBar.prototype, {

    /* Init Slider */
    initSlider: function() {
      var $slider = $( '.top-bar__slider', this.$container);

      $slider.flickity({
        cellSelector: '.top-bar__slide',
        pageDots: false,
        prevNextButtons: false,
        wrapAround: true,
        autoPlay: 5000
      });
    },

    onBlockSelect: function(evt) {
      var $slider = $( evt.target ).parents( '.top-bar__slider' );
      var index = $( evt.target ).index();

      if ( $slider.data( 'flickity' ) ) {
        $slider.flickity( 'select', index );
        $slider.flickity( 'pausePlayer' );
      }
    },

    onBlockDeselect: function(evt) {
      var $slider = $( evt.target ).parents( '.top-bar__slider' );

      if ( $slider.data( 'flickity' ) ) {
        $slider.flickity( 'unpausePlayer' );
      }
    }
  });

  return AnnouncementBar;
})();

PaloAlto.initSections = function() {
  var sections = new PaloAlto.Sections();

  sections.register('header', PaloAlto.Header);
  sections.register('announcement-bar', PaloAlto.AnnouncementBar);
  sections.register('product-template', PaloAlto.ProductTemplate);
  sections.register('related-products', PaloAlto.RelatedProducts);
  sections.register('collection-template', PaloAlto.CollectionTemplate);
  sections.register('list-collections', PaloAlto.ListCollections);
  sections.register('featured-collection', PaloAlto.FeaturedCollection);
  sections.register('tabbed-collections', PaloAlto.TabbedCollections);
  sections.register('featured-product', PaloAlto.FeaturedProduct);
  sections.register('slider', PaloAlto.Slider);
  sections.register('rich-text-with-media', PaloAlto.RichText);
  sections.register('instagram', PaloAlto.Instagram);
  sections.register('featured-image', PaloAlto.FeaturedImage);
  sections.register('blog-posts', PaloAlto.BlogPosts);
  sections.register('featured-video', PaloAlto.FeaturedVideo);
  sections.register('logo-list', PaloAlto.LogoList);
  sections.register('icons-row', PaloAlto.IconsRow);
  sections.register('map', PaloAlto.Map);
  sections.register('testimonials', PaloAlto.Testimonials);
  sections.register('faq', PaloAlto.Faq);
  sections.register('press', PaloAlto.Press);
  sections.register('popup', PaloAlto.InitPopup);

  // Recheck sticky header settings if section is set to hidden
  $(document).on('shopify:section:unload', function() {
    setTimeout( function() {
      PaloAlto.initStickyNav();
    }, 300);
  });
};

/* Jonathan Snook - MIT License - https://github.com/snookca/prepareTransition */
(function(a){a.fn.prepareTransition=function(){return this.each(function(){var b=a(this);b.one("TransitionEnd webkitTransitionEnd transitionend oTransitionEnd",function(){b.removeClass("is-transitioning")});var c=["transition-duration","-moz-transition-duration","-webkit-transition-duration","-o-transition-duration"];var d=0;a.each(c,function(a,c){d=parseFloat(b.css(c))||d});if(d!=0){b.addClass("is-transitioning");b[0].offsetWidth}})}})(jQuery);

/* replaceUrlParam - http://stackoverflow.com/questions/7171099/how-to-replace-url-parameter-with-javascript-jquery */
function replaceUrlParam(e,r,a){var n=new RegExp("("+r+"=).*?(&|$)"),c=e;return c=e.search(n)>=0?e.replace(n,"$1"+a+"$2"):c+(c.indexOf("?")>0?"&":"?")+r+"="+a};

/*============================================================================
  Money Format
  - Shopify.format money is defined in option_selection.js.
    If that file is not included, it is redefined here.
==============================================================================*/
if ((typeof Shopify) === 'undefined') { Shopify = {}; }
if (!Shopify.formatMoney) {
  Shopify.formatMoney = function(cents, format) {
    var value = '',
        placeholderRegex = /\{\{\s*(\w+)\s*\}\}/,
        formatString = (format || this.money_format);

    if (typeof cents == 'string') {
      cents = cents.replace('.','');
    }

    function defaultOption(opt, def) {
      return (typeof opt == 'undefined' ? def : opt);
    }

    function formatWithDelimiters(number, precision, thousands, decimal) {
      precision = defaultOption(precision, 2);
      thousands = defaultOption(thousands, ',');
      decimal   = defaultOption(decimal, '.');

      if (isNaN(number) || number == null) {
        return 0;
      }

      number = (number/100.0).toFixed(precision);

      var parts   = number.split('.'),
          dollars = parts[0].replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1' + thousands),
          cents   = parts[1] ? (decimal + parts[1]) : '';

      return dollars + cents;
    }

    switch(formatString.match(placeholderRegex)[1]) {
      case 'amount':
        value = formatWithDelimiters(cents, 2);
        break;
      case 'amount_no_decimals':
        value = formatWithDelimiters(cents, 0);
        break;
      case 'amount_with_comma_separator':
        value = formatWithDelimiters(cents, 2, '.', ',');
        break;
      case 'amount_no_decimals_with_comma_separator':
        value = formatWithDelimiters(cents, 0, '.', ',');
        break;
    }

    return formatString.replace(placeholderRegex, value);
  };
}


// Timber functions
window.timber = window.timber || {};

timber.cacheSelectors = function () {
  timber.cache = {
    // General
    $html                    : $('html'),
    $body                    : $('body'),

    // Navigation
    $header                  : $('.site-header'),
    $navigation              : $('#AccessibleNav'),
    $mobileSubNavToggle      : $('.mobile-nav__toggle'),

    // Product Page
    $productImage            : $('#ProductPhotoImg'),
    $thumbImages             : $('#ProductThumbs').find('a.product-single__thumbnail'),

    // Customer Pages
    $recoverPasswordLink     : $('#RecoverPassword'),
    $hideRecoverPasswordLink : $('#HideRecoverPasswordLink'),
    $recoverPasswordForm     : $('#RecoverPasswordForm'),
    $customerLoginForm       : $('#CustomerLoginForm'),
    $passwordResetSuccess    : $('#ResetSuccess')
  };
};

timber.init = function () {
  FastClick.attach(document.body);
  timber.cacheSelectors();
  timber.accessibleNav();
  timber.drawersInit();
  timber.mobileNavToggle();
  // timber.productImageSwitch();
  timber.loginForms();
};

timber.accessibleNav = function () {
  var $nav = timber.cache.$navigation,
      $header = timber.cache.$header,
      $allLinks = $nav.find('a'),
      $topLevel = $nav.children('li').find('a'),
      $parents = $nav.find('.site-nav--has-dropdown'),
      $subMenuLinks = $nav.find('.site-nav__dropdown').find('a'),
      megamenuClass = 'site-nav__item--has-meganav',
      activeClass = 'nav-hover',
      focusClass = 'nav-focus';

  // Reset event listeners
  $parents.off( 'mouseleave' );
  $parents.off( 'mouseenter touchstart', '> div > a' );
  $allLinks.off('blur focus')

  // Mouseenter
  $parents.on('mouseenter touchstart', '> div > a', function(evt) {
    var $el = $(this).closest( '.site-nav--has-dropdown' );

    if (!$el.hasClass(activeClass)) {
      evt.preventDefault();
    }

    showDropdown($el);
  });

  // Mouseout
  $parents.on('mouseleave', function() {
    hideDropdown($(this));
  });

  $subMenuLinks.on('touchstart', function(evt) {
    // Prevent touchstart on body from firing instead of link
    evt.stopImmediatePropagation();
  });

  $allLinks.on('focus', function() {
    handleFocus($(this));
  });

  $allLinks.on('blur', function() {
    removeFocus($topLevel);
  });

  // accessibleNav private methods
  function handleFocus ($el) {
    var $subMenu = $el.next('ul'),
        hasSubMenu = $subMenu.hasClass('sub-nav') ? true : false,
        isSubItem = $('.site-nav__dropdown').has($el).length,
        $newFocus = null;

    // Add focus class for top level items, or keep menu shown
    if (!isSubItem) {
      removeFocus($topLevel);
      addFocus($el);
    } else {
      $newFocus = $el.closest('.site-nav--has-dropdown').find('a');
      addFocus($newFocus);
    }
  }

  function showDropdown ($el) {
    $el.addClass(activeClass);

    // Change header style when open a mega menu
    if ( $el.hasClass(megamenuClass) ) {
      $header.addClass('is-meganav-visible');
    }

    setTimeout(function() {
      timber.cache.$body.on('touchstart', function() {
        hideDropdown($el);
      });
    }, 250);
  }

  function hideDropdown ($el) {
    $el.removeClass(activeClass);
    timber.cache.$body.off('touchstart');
    $header.removeClass('is-meganav-visible');
  }

  function addFocus ($el) {
    $el.addClass(focusClass);
  }

  function removeFocus ($el) {
    $el.removeClass(focusClass);
  }
};

timber.drawersInit = function () {
  timber.LeftDrawer = new timber.Drawers('NavDrawer', 'left');

  
    timber.RightDrawer = new timber.Drawers('CartDrawer', 'right', {
      'onDrawerOpen': function() {
        var isCartLoaded = !!$('#CartContainer').html();

        if ( !isCartLoaded ) {
          ajaxCart.load();
        }
      }
    });

    $('.js-drawer-open-left').on( 'click', function() {
      var isDrawerOpen = $( 'body' ).hasClass( '.js-drawer-open' );
      if ( isDrawerOpen ) timber.RightDrawer.close();
    });
  

  $('.js-drawer-open-right').on('click', function() {
    var isDrawerOpen = $( 'body' ).hasClass( '.js-drawer-open' );
    if ( isDrawerOpen ) timber.LeftDrawer.close();
  });

};

timber.mobileNavToggle = function () {
  timber.cache.$mobileSubNavToggle.on('click', function() {
    $(this).parent().toggleClass('mobile-nav--expanded');
  });
};

timber.getHash = function () {
  return window.location.hash;
};

timber.updateHash = function (hash) {
  window.location.hash = '#' + hash;
  $('#' + hash).attr('tabindex', -1).focus();
};

timber.productPage = function (options) {
  var moneyFormat = options.money_format,
      variant = options.variant,
      selector = options.selector,
      container = options.container;

  // Selectors
  var $productImage = $(container).find('#ProductPhotoImg'),
      $productVarImage = $(container).find('.productvarimg'),
      $addToCart = $(container).find('#AddToCart--' + $(container).data( 'section-id') ),
      $productPrice = $(container).find('#ProductPrice'),
      $comparePrice = $(container).find('#ComparePrice'),
      $unitPrice = $(container).find('#UnitPrice'),
      $quantityElements = $(container).find('.qtydiv, .quantity-selector, label + .js-qty'),
      $addToCartText = $(container).find('#AddToCartText');

  if (variant) {
    // Select a valid variant if available
    if (variant.available) {
      // Available, enable the submit button, change text, show quantity elements
      $addToCart.removeClass('disabled').prop('disabled', false);
      $addToCartText.html("Add to Cart");
      $quantityElements.show();
    } else {
      // Sold out, disable the submit button, change text, hide quantity elements
      $addToCart.addClass('disabled').prop('disabled', true);
      $addToCartText.html("Sold Out");
      $quantityElements.hide();
    }

    if ( variant.unit_price_measurement ) {
      var unitPrice = Shopify.formatMoney(variant.unit_price, moneyFormat) + ' ';
      if ( variant.unit_price_measurement.reference_value != 1 ) {
        unitPrice += variant.unit_price_measurement.reference_value;
      }
      unitPrice += variant.unit_price_measurement.reference_unit;

      // Update unit price
      $unitPrice.html( unitPrice );
    }

    // Regardless of stock, update the product price
    $productPrice.html( Shopify.formatMoney(variant.price, moneyFormat) );

    // Also update and show the product's compare price if necessary
    if (variant.compare_at_price > variant.price) {
      $comparePrice
        .html( '<s>' + Shopify.formatMoney(variant.compare_at_price, moneyFormat) + '</s>' )
        .show();
    } else {
      $comparePrice.hide();
    }

    if ( typeof(Currency) != 'undefined' && typeof(Currency.convertAll) != 'undefined' && Currency ){
      Currency.convertAll(shopCurrency, $('[name=currencies]').val());
    }

  } else {
    // The variant doesn't exist, disable submit button.
    // This may be an error or notice that a specific variant is not available.
    // To only show available variants, implement linked product options:
    //   - http://docs.shopify.com/manual/configuration/store-customization/advanced-navigation/linked-product-options
    $addToCart.addClass('disabled').prop('disabled', true);
    $addToCartText.html("Unavailable");
    $quantityElements.hide();
  }

  checkButtons();
  function checkButtons(){
    var $dynamicButton = $(container).find( '.shopify-payment-button' );
    var isSoldout = $addToCart.hasClass( 'disabled' )

    if ( isSoldout ) {
      $dynamicButton.hide();
    } else {
      $dynamicButton.show();
    }
  }
};

timber.loginForms = function() {
  function showRecoverPasswordForm() {
    timber.cache.$recoverPasswordForm.show();
    timber.cache.$customerLoginForm.hide();
  }

  function hideRecoverPasswordForm() {
    timber.cache.$recoverPasswordForm.hide();
    timber.cache.$customerLoginForm.show();
  }

  timber.cache.$recoverPasswordLink.on('click', function(evt) {
    evt.preventDefault();
    showRecoverPasswordForm();
  });

  timber.cache.$hideRecoverPasswordLink.on('click', function(evt) {
    evt.preventDefault();
    hideRecoverPasswordForm();
  });

  // Allow deep linking to recover password form
  if (timber.getHash() == '#recover') {
    showRecoverPasswordForm();
  }
};

timber.resetPasswordSuccess = function() {
  timber.cache.$passwordResetSuccess.show();
};

/*============================================================================
  Drawer modules
  - Docs http://shopify.github.io/Timber/#drawers
==============================================================================*/
timber.Drawers = (function () {
  var Drawer = function (id, position, options) {
    var defaults = {
      close: '.js-drawer-close',
      open: '.js-drawer-open-' + position,
      openClass: 'js-drawer-open',
      dirOpenClass: 'js-drawer-open-' + position
    };

    this.$nodes = {
      parent: $('body, html'),
      page: $('#PageContainer'),
      moved: $('.is-moved-by-drawer')
    };

    this.config = $.extend(defaults, options);
    this.position = position;

    this.$drawer = $('#' + id);

    if (!this.$drawer.length) {
      return false;
    }

    this.drawerIsOpen = false;
    this.init();
  };

  Drawer.prototype.init = function () {
    // Reset buttons
    $(this.config.open).off('click');
    this.$drawer.find(this.config.close).off('click');

    // Init buttons
    $(this.config.open).on('click', $.proxy(this.open, this));
    this.$drawer.find(this.config.close).on('click', $.proxy(this.close, this));
  };

  Drawer.prototype.open = function (evt) {
    // Keep track if drawer was opened from a click, or called by another function
    var externalCall = false;

    // Prevent following href if link is clicked
    if (evt) {
      evt.preventDefault();
    } else {
      externalCall = true;
    }

    // Without this, the drawer opens, the click event bubbles up to $nodes.page
    // which closes the drawer.
    if (evt && evt.stopPropagation) {
      evt.stopPropagation();
      // save the source of the click, we'll focus to this on close
      this.$activeSource = $(evt.currentTarget);
    }

    if (this.drawerIsOpen && !externalCall) {
      return this.close();
    }

    // Add is-transitioning class to moved elements on open so drawer can have
    // transition for close animation
    this.$nodes.moved.addClass('is-transitioning');
    this.$drawer.prepareTransition();

    this.$nodes.parent.addClass(this.config.openClass + ' ' + this.config.dirOpenClass);
    this.drawerIsOpen = true;

    // Set focus on drawer
    this.trapFocus(this.$drawer, 'drawer_focus');

    // Run function when draw opens if set
    if (this.config.onDrawerOpen && typeof(this.config.onDrawerOpen) == 'function') {
      if (!externalCall) {
        this.config.onDrawerOpen();
      }
    }

    if (this.$activeSource && this.$activeSource.attr('aria-expanded')) {
      this.$activeSource.attr('aria-expanded', 'true');
    }

    // Lock scrolling on mobile
    this.$nodes.page.on('touchmove.drawer', function () {
      return false;
    });

    this.$nodes.page.on('click.drawer', $.proxy(function () {
      this.close();
      return false;
    }, this));
  };

  Drawer.prototype.close = function () {
    if (!this.drawerIsOpen) { // don't close a closed drawer
      return;
    }

    // deselect any focused form elements
    $(document.activeElement).trigger('blur');

    // Ensure closing transition is applied to moved elements, like the nav
    this.$nodes.moved.prepareTransition({ disableExisting: true });
    this.$drawer.prepareTransition({ disableExisting: true });

    this.$nodes.parent.removeClass(this.config.dirOpenClass + ' ' + this.config.openClass);

    this.drawerIsOpen = false;

    // Remove focus on drawer
    this.removeTrapFocus(this.$drawer, 'drawer_focus');

    this.$nodes.page.off('.drawer');
  };

  Drawer.prototype.trapFocus = function ($container, eventNamespace) {
    var eventName = eventNamespace ? 'focusin.' + eventNamespace : 'focusin';

    $container.attr('tabindex', '-1');
  };

  Drawer.prototype.removeTrapFocus = function ($container, eventNamespace) {
    var eventName = eventNamespace ? 'focusin.' + eventNamespace : 'focusin';

    $container.removeAttr('tabindex');
    $(document).off(eventName);
  };

  return Drawer;
})();

$(document).ready(function() {
  // Initialize Timber's JS on docready
  $(timber.init);
  PaloAlto.init();
  PaloAlto.initSections();
});
