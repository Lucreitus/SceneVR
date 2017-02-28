/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(1);


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	const Story = __webpack_require__(2);

	const exampleSpreadsheetId = '1tTyJECAoiLjHQh9_RWtVavhO_rLk133dt8-5c6lN-F0';

	function initalize() {
	  const qs = getQueryParams(window.location.search);
	  qs.source = qs.hasOwnProperty('source') ? qs.source : exampleSpreadsheetId;

	  let s = new Story(qs);
	}

	function getQueryParams(qs) {
	  qs = qs.split("+").join(" ");

	  var params = {}, tokens,
	  re = /[?&]?([^=]+)=([^&]*)/g;

	  while (tokens = re.exec(qs)) {
	    params[decodeURIComponent(tokens[1])]
	    = decodeURIComponent(tokens[2]);
	  }

	  return params;
	}

	window.onload = initalize;


/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	const ui = __webpack_require__(3);
	const gapiClient = __webpack_require__(4);
	const template = __webpack_require__(5);

	module.exports = class Story {
	  constructor(config) {
	    this.config = config;

	    this.buildScene().then(() => {
	      document.querySelector('body').appendChild(this.scene);
	      ui.addEventListeners();
	    });
	  }

	  buildScene() {
	    return gapiClient.getSpreadsheetData(this.config.source).then(response => {
	      let templateData = { images: [] };
	      response.entry.forEach(e => {
	        templateData.images.push({
	          path: e.gsx$sceneimageurl.$t,
	          text: e.gsx$bodytext.$t
	        });
	      });

	      this.scene = template.buildTemplate(templateData);
	    }, response => {
	      console.log(response.result.error.message);
	    });
	  }
	}

/***/ },
/* 3 */
/***/ function(module, exports) {

	module.exports = {
	  addEventListeners: () => {
	    // Fade transitions
	    let skyIndex = 0;
	    const storyLength = document.querySelectorAll('a-assets .sky').length;
	    const aSkyEl = document.querySelector('a-sky');
	    const aSkyFadeOut = document.querySelector('a-sky #fade-out');
	    const aSkyFadeIn = document.querySelector('a-sky #fade-in');
	    const nextButton = document.getElementById('next');
	    const fullscreenButton = document.getElementById('fullscreen');
	    const thumbnailElements = [...document.querySelectorAll('.thumbnail')];

	    // Compass
	    const cameraEl = document.getElementById('camera');
	    let angle, angleInRadians = 0;
	    const pointerEl = document.getElementById('pointer');

	    aSkyFadeOut.addEventListener('animationend', () => {
	      // update the selected thumbnail in the footer
	      let selectedThumbnail = document.querySelector('.selected-thumbnail');
	      selectedThumbnail.className = selectedThumbnail.className.replace('selected-thumbnail','');
	      document.querySelector(`#thumbnail-${skyIndex}`).className += ' selected-thumbnail';

	      // fade in the new a-sky
	      aSkyEl.emit('fadeIn');
	    });

	    // change a-sky to next image 
	    nextButton.addEventListener('click', () => {
	      if (skyIndex < storyLength - 1) {
	        aSkyEl.emit('fadeOut');
	        aSkyEl.setAttribute('src', `#sky-${++skyIndex}`);
	      }
	    });

	    // full screen on click
	    fullscreenButton.addEventListener('click', () => {
	      document.querySelector('a-scene').enterVR();
	    });

	    // change a-sky on click
	    thumbnailElements.forEach((t, i) => {
	      t.addEventListener('click', () => {
	        if (skyIndex !== i) {
	          aSkyEl.emit('fadeOut');
	          skyIndex = i;
	          aSkyEl.setAttribute('src', `#sky-${skyIndex}`);
	        }
	      });
	    });

	    // update compass when camera is rotated
	    cameraEl.addEventListener('componentchanged', (event) => {
	      if (event.detail.name === 'rotation' && event.detail.newData.y !== angle) {
	        angle = event.detail.newData.y;
	        angleInRadians = angle * (Math.PI / 180);
	        pointerEl.style.transform = `rotateZ(${-angle}deg)`
	      }
	    });
	  }
	}

/***/ },
/* 4 */
/***/ function(module, exports) {

	module.exports = {
	  getSpreadsheetData: (spreadsheetId) => {
	    return new Promise((resolve, reject) => {
	      let xhr = new XMLHttpRequest();
	      const url = `https://spreadsheets.google.com/feeds/list/${spreadsheetId}/1/public/values?alt=json`
	      xhr.open("GET", url, true);
	      xhr.onload = function (e) {
	        if (xhr.readyState === 4) {
	          if (xhr.status === 200) {
	            resolve(JSON.parse(xhr.response).feed);
	          } else {
	            reject({
	              status: this.status,
	              statusText: xhr.statusText
	            });
	          }
	        }
	      };
	      xhr.onerror = function (e) {
	        reject({
	          status: this.status,
	          statusText: xhr.statusText
	        });
	      };
	      xhr.send(null);
	    });
	  }
	}

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	const dom = __webpack_require__(6);

	module.exports = {
		template: `<a-scene>
	      <a-assets>
	      </a-assets>
	      <a-entity id="camera" camera look-controls>
	      </a-entity>
	      <a-sky src="#sky-0">
	        <a-animation id="fade-out" attribute="material.opacity" begin="fadeOut" to="0"></a-animation>
	        <a-animation id="fade-in" attribute="material.opacity" begin="fadeIn" to="1"></a-animation>
	      </a-sky>
	    </a-scene>
	    <div id="ui">
	      <div id="black-background"></div>
	      <img id="next" src="/assets/chevron-right.svg">
	      <img id="cardboard" src="/assets/google-cardboard.svg">
	      <img id="fullscreen" src="/assets/fullscreen.svg">
	      <div id="compass-container">
	        <svg id="compass" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 334.47 334.47">
	          <title>Compass</title>
	          <circle class="a" cx="167.24" cy="167.24" r="155.24"/>
	          <circle class="b" cx="167.24" cy="167.24" r="30.1"/>
	          <path id="pointer" d="M79,81.61l52.85,52.86c2.18-2.22,16.12-15.92,37.67-14.92,18.71,0.87,30.42,12.24,33,14.92l52.85-52.85c-6.94-6.89-36.09-34.28-82.18-36.49C119.69,42.55,84.73,76,79,81.61Z"/>
	        </svg>
	      </div>
	      <div id="footer">
	        <div id="footer-content">
	          <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod
	          tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,
	          quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
	          consequat.</p>
	        </div>
	        <div id="thumbnails">
	        </div>
	      </div>
	    </div>`,
	  buildTemplate: (templateData) => {
	    let scene = document.createElement('section');
	    scene.id = 'rendered-template';
	    scene.innerHTML = module.exports.template
	    let assets = scene.querySelector('a-assets');
	    let thumbnails = scene.querySelector('#thumbnails');
	    templateData.images.forEach((img, i) => {
	      let skyEl = dom.createElement('img', `sky-${i}`, ['sky']);
	      skyEl.setAttribute('src', img.path);
	      assets.appendChild(skyEl);

	      let thumbnailEl = dom.createElement('img', `thumbnail-${i}`, ['thumbnail', `${i === 0 ? "selected-thumbnail" : ""}`]);
	      thumbnailEl.setAttribute('src', img.path);
	      thumbnails.appendChild(thumbnailEl);
	    });

	    return scene;
	  }
	}

/***/ },
/* 6 */
/***/ function(module, exports) {

	module.exports = {
	  createElement: (tag, id, classes) => {
	    let el = document.createElement(tag);
	    el.id = id;
	    el.className = classes.join(' ');
	    return el;
	  }
	}

/***/ }
/******/ ]);