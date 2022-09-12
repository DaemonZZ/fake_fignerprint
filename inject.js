var localIp = "";
var background = (function () {
    var tmp = {};
    chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
        for (var id in tmp) {
            if (tmp[id] && (typeof tmp[id] === "function")) {
                if (request.path === 'background-to-page') {
                    if (request.method === id) tmp[id](request.data);
                }
            }
        }
    });


    return {
        "receive": function (id, callback) {
            tmp[id] = callback
        },
        "send": function (id, data) {
            chrome.runtime.sendMessage({ "path": 'page-to-background', "method": id, "data": data })
        }
    }
})();

(function () {
    var coordinates = null,
        mouseUp = false,
        wheelFlag = false,
        osFlag = false,
        osTimer,
        settings = [],
        send = message => browser.runtime.sendMessage(message),
        trust = event => event.isTrusted,
        prevent = event => {
            return event.preventDefault(),
                osFlag = false,
                coordinates = null,
                mouseUp = true,
                true
        },
        heights = () => document.body.scrollHeight || document.documentElement.scrollHeight,
        events = [
            () => { send({ msg: 'newTab' }) },
            () => { send({ msg: 'closeTab' }) },
            () => { send({ msg: 'nextTab' }) },
            () => { send({ msg: 'prevTab' }) },
            () => { location.reload() },
            () => { send({ msg: 'reOpen' }) },
            () => { history.forward() },
            () => { history.back() },
            () => { window.scrollBy(0, -heights()) },
            () => { window.scrollBy(0, heights()) },
            () => { send({ msg: 'closeOther' }) },
            () => { send({ msg: 'pinTab' }) },
            () => { send({ msg: 'closeWin' }) },
            () => { send({ msg: 'minWin' }) },
            () => { send({ msg: 'doubleTab' }) }
        ],
        letsMath = (start, end) => {
            var x = end.x - start.x,
                //console.log(end.x+","+end.y);
                y = end.y - start.y,
                h = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
            if (x == 0) return [y > 0 ? 3 : 7, h];
            var a = Math.atan(y / x) * 180 / Math.PI;
            a = x > 0 ? a + 90 : a + 270;
            a = a - 23 < 0 ? 360 - a : a - 23;
            a = Math.floor(a / 45);
            return [a, h]
        };


    browser.runtime.onMessage.addListener((request, sender, sendResponse) => {
        console.log(request.message + "   " + request.data);
        if ('first' == request.message) {
            injectJS(request.jsonData);
        }
        'up' == request.message && request.data && 10 == request.data.length && (settings = request.data)
    })

    window.addEventListener('mousedown', event => {
        console.log(event.clientX + "," + event.clientY);
        if (event.clientY == 2 && event.clientX == 2) {
            events[13] && events[13](),
                osFlag = false
        }


    }, true)


})();

var inject = function () {

    const toBlob = HTMLCanvasElement.prototype.toBlob;
    const toDataURL = HTMLCanvasElement.prototype.toDataURL;
    const getImageData = CanvasRenderingContext2D.prototype.getImageData;
    const setLocalDescription = RTCPeerConnection.prototype.setLocalDescription;
    const createOffer = RTCPeerConnection.prototype.createOffer;


    //
    var noisify = function (canvas, context) {
        const shift = {
            'r': Math.floor(canvasNoiseR * 10) - 5,
            'g': Math.floor(canvasNoiseG * 10) - 5,
            'b': Math.floor(canvasNoiseB * 10) - 5,
            'a': Math.floor(canvasNoiseA * 10) - 5
        };
        //
        const width = canvas.width, height = canvas.height;
        const imageData = getImageData.apply(context, [0, 0, width, height]);
        for (let i = 0; i < height; i++) {
            for (let j = 0; j < width; j++) {
                const n = ((i * (width * 4)) + (j * 4));
                imageData.data[n + 0] = imageData.data[n + 0] + shift.r;
                imageData.data[n + 1] = imageData.data[n + 1] + shift.g;
                imageData.data[n + 2] = imageData.data[n + 2] + shift.b;
                imageData.data[n + 3] = imageData.data[n + 3] + shift.a;
            }
        }
        //
        context.putImageData(imageData, 0, 0);
    };
    //
    Object.defineProperty(HTMLCanvasElement.prototype, "toBlob", {
        "value": function () {
            noisify(this, this.getContext("2d"));
            return toBlob.apply(this, arguments);
        }
    });


    //
    Object.defineProperty(HTMLCanvasElement.prototype, "toDataURL", {
        "value": function () {
            noisify(this, this.getContext("2d"));
            return toDataURL.apply(this, arguments);
        }
    });
    //
    Object.defineProperty(CanvasRenderingContext2D.prototype, "getImageData", {
        "value": function () {
            noisify(this.canvas, this);
            return getImageData.apply(this, arguments);
        }
    });


    Object.defineProperty(RTCPeerConnection.prototype, "createOffer", {
        "value": function () {

            var onicecandidate = this.onicecandidate;
            this.onicecandidate = function (evt) {
                evt.candidate.candidate = evt.candidate.candidate.replace(evt.candidate.candidate.split(" ")[4], localIP_RP);
                //console.log(" bb "+evt.candidate.candidate);
                onicecandidate(evt);
            };
            return createOffer.apply(this, arguments);
        }
    });

    Object.defineProperty(RTCPeerConnection.prototype, "setLocalDescription", {
        "value": function () {

            var onicecandidate = this.onicecandidate;
            this.onicecandidate = function (evt) {
                console.log(" bb " + evt.candidate.candidate.split(" ")[0]);
                if ("candidate:1" === evt.candidate.candidate.split(" ")[0]) {
                    evt.candidate.candidate = evt.candidate.candidate.replace(evt.candidate.candidate.split(" ")[4], localIP);
                } else {
                    evt.candidate.candidate = evt.candidate.candidate.replace(evt.candidate.candidate.split(" ")[4], localIP_RP);
                }
                console.log(" bb " + evt.candidate.candidate);
                onicecandidate(evt);
            };
            return setLocalDescription.apply(this, arguments);
        }
    });
    var config = {
        "random": {
            "value": function () {
                return Math.random()
            },
            "item": function (e) {
                var rand = e.length * config.random.value();
                return e[Math.floor(rand)];
            },
            "array": function (e) {
                var rand = config.random.item(e);
                return new Int32Array([rand, rand]);
            },
            "items": function (e, n) {
                var length = e.length;
                var result = new Array(n);
                var taken = new Array(length);
                if (n > length) n = length;
                //
                while (n--) {
                    var i = Math.floor(config.random.value() * length);
                    result[n] = e[i in taken ? taken[i] : i];
                    taken[i] = --length in taken ? taken[length] : length;
                }
                //
                return result;
            }
        },
        "spoof": {
            "webgl": {
                "buffer": function (target) {
                    const bufferData = target.prototype.bufferData;
                    Object.defineProperty(target.prototype, "bufferData", {
                        "value": function () {
                            var index = Math.floor(webglNoise * 10);
                            var noise = 0.1 * webglNoise * arguments[1][index];
                            arguments[1][index] = arguments[1][index] + noise;
                            //
                            return bufferData.apply(this, arguments);
                        }
                    });
                },
                "parameter": function (target) {
                    const getParameter = target.prototype.getParameter;
                    Object.defineProperty(target.prototype, "getParameter", {
                        "value": function () {
                            var float32array = new Float32Array([1, 8192]);
                            //
                            console.log(arguments[0]);
                            if (arguments[0] === 3415) return 0;
                            else if (arguments[0] === 3414) return 24;
                            else if (arguments[0] === 35661) return webgl_35661;
                            else if (arguments[0] === 37446) return card;
                            else if (arguments[0] === 3386) return new Int32Array([webgl_3386, webgl_3386]);
                            else if (arguments[0] === 36349 || arguments[0] === 36347) return webgl_36349;
                            else if (arguments[0] === 34047 || arguments[0] === 34921) return config.random.items([2, 4, 8, 16]);
                            else if (arguments[0] === 7938) return gl_version;
                            else if (arguments[0] === 7936) return gl_vendor;
                            else if (arguments[0] === 7937) return gl_renderer;
                            else if (arguments[0] === 35724) return gl_shading_language;
                            else if (arguments[0] === 0x9245) return gl_unmasked_vendor;
                            else if (arguments[0] === 33901 || arguments[0] === 33902) return float32array;
                            else if (arguments[0] === 34930 || arguments[0] === 36348 || arguments[0] === 35660) return webgl_34930;
                            else if (arguments[0] === 34076 || arguments[0] === 34024 || arguments[0] === 3379) return webgl_34076;
                            else if (arguments[0] === 3413 || arguments[0] === 3412 || arguments[0] === 3411 || arguments[0] === 3410 || arguments[0] === 34852) return webgl_3413;
                            else return Math.pow(2, webgl_else);
                            //
                            return getParameter.apply(this, arguments);
                        }
                    });
                }
            }
        }
    };
    //
    config.spoof.webgl.buffer(WebGLRenderingContext);
    config.spoof.webgl.buffer(WebGL2RenderingContext);
    config.spoof.webgl.parameter(WebGLRenderingContext);
    config.spoof.webgl.parameter(WebGL2RenderingContext);
    //

    /*
    font fingerprint
    */


    var rand = {
        "noise": function () {
            var SIGN = Math.random() < Math.random() ? -1 : 1;
            return Math.floor(Math.random() + SIGN * Math.random());
        },
        "sign": function () {
            const tmp = [-1, -1, -1, -1, -1, -1, +1, -1, -1, -1];
            const index = Math.floor(Math.random() * tmp.length);
            return tmp[index];
        }
    };
    //
    Object.defineProperty(HTMLElement.prototype, "offsetHeight", {
        get() {
            const height = Math.floor(this.getBoundingClientRect().height);
            if (height % 2 == 0) {
                result = height + font_offset[0];
            }
            if (height % 3 == 0) {
                result = height + font_offset[1];
            }
            if (height % 4 == 0) {
                result = height + font_offset[2];
            }
            if (height % 5 == 0) {
                result = height + font_offset[3];
            }
            return result;
        }
    });


    //
    Object.defineProperty(HTMLElement.prototype, "offsetWidth", {
        get() {
            const width = Math.floor(this.getBoundingClientRect().width);
            //const valid = width && rand.sign() === 1;
            //const result = valid ? width + rand.noise() : width;
            if (width % 2 == 0) {
                result = width + font_offset[4];
            }
            if (width % 3 == 0) {
                result = width + font_offset[5];
            }
            if (width % 4 == 0) {
                result = width + font_offset[6];
            }
            if (width % 5 == 0) {
                result = width + font_offset[7];
            }
            return result;
        }
    });
    /*
    audio context
    */
    const context = {
        "BUFFER": null,
        "getChannelData": function (e) {
            const getChannelData = e.prototype.getChannelData;
            Object.defineProperty(e.prototype, "getChannelData", {
                "value": function () {
                    const results_1 = getChannelData.apply(this, arguments);
                    if (context.BUFFER !== results_1) {
                        context.BUFFER = results_1;
                        for (var i = 0; i < results_1.length; i += 100) {
                            let index = Math.floor(audioContext_1 * i);
                            results_1[index] = results_1[index] + audioContext_2 * 0.0000001;
                        }
                    }
                    //
                    return results_1;
                }
            });
        },
        "createAnalyser": function (e) {
            const createAnalyser = e.prototype.__proto__.createAnalyser;
            Object.defineProperty(e.prototype.__proto__, "createAnalyser", {
                "value": function () {
                    const results_2 = createAnalyser.apply(this, arguments);
                    const getFloatFrequencyData = results_2.__proto__.getFloatFrequencyData;
                    Object.defineProperty(results_2.__proto__, "getFloatFrequencyData", {
                        "value": function () {
                            window.top.postMessage("audiocontext-fingerprint-defender-alert", '*');
                            const results_3 = getFloatFrequencyData.apply(this, arguments);
                            for (var i = 0; i < arguments[0].length; i += 100) {
                                let index = Math.floor(audioContext_3 * i);
                                arguments[0][index] = arguments[0][index] + audioContext_4 * 0.1;
                            }
                            //
                            return results_3;
                        }
                    });
                    //
                    return results_2;
                }
            });
        }
    };
    /*
        Navigator
        appCodeName :always Mozilla
        appName :always Netscape
        product :always Gecko
    */


    Object.defineProperty(Document.prototype, "visibilityState", {
        get() {
            //console.log("visibilityState detecion");
            return 'visible';
        }
    });
    Object.defineProperty(Document.prototype, "hidden", {
        get() {
            //console.log("hidden detecion");
            return false;
        }
    });
    Object.defineProperty(Navigator.prototype, "appVersion", {
        get() {
            //console.log("appVersion detecion");
            return userAgent.replace('Mozilla/', '')
        }
    });


    Object.defineProperty(Navigator.prototype, "product", {
        get() {
            console.log("product detecion");
            return " "
        }
    });
    Object.defineProperty(Navigator.prototype, "userAgent", {
        get() {
            return userAgent;
        }
    });
    Object.defineProperty(Navigator.prototype, "hardwareConcurrency", {
        get() {
            //console.log("hardwareConcurrency detecion");
            return hardwareConcurrency;
        }
    });
    Object.defineProperty(Navigator.prototype, "oscpu", {
        get() {
            console.log("oscpu detecion");
            return userAgent.split('(')[1].split(')')[0];
        }
    });
    Object.defineProperty(Navigator.prototype, "productSub", {
        get() {
            console.log("productSub detecion");
            return userAgent.split('(')[1].split(')')[0];
        }
    });
    // Object.defineProperty(Navigator.prototype, "deviceMemory", {
    //     get() {
    //         return deviceMemory;
    //     }
    // });
    // true : automation - false normal
    Object.defineProperty(Navigator.prototype, "webdriver", {
        get() {
            console.log("selenium detecion");
            return false;
        }
    });


    // context.getChannelData(AudioBuffer);
    // context.createAnalyser(AudioContext);
    // context.getChannelData(OfflineAudioContext);
    // context.createAnalyser(OfflineAudioContext);
    document.documentElement.dataset.cbscriptallow = true;

    /**
   * Spoof screen resolution.
   */

    /**
   * Define property on an object.
   */
    var defineProp = function (obj, prop, val) {
        Object.defineProperty(obj, prop, {
            enumerable: true,
            configurable: true,
            value: val
        });
    };
    /**
     * Return screen attributes based on the most commons ones.
     */
    var getScreenAttrs = function () {
        return {
            width: screenRes[0],
            height: screenRes[1],
            colorDepth: 32,
            pixelDepth: 32
        };
    };
    /**
     * Spoof screen resolution.
     */
    var spoofScreenResolution = function () {
        var screen = getScreenAttrs();
        defineProp(window.screen, "width", screen.width);
        defineProp(window.screen, "height", screen.height);
        defineProp(window.screen, "availWidth", screen.width);
        defineProp(window.screen, "availHeight", screen.height);
        defineProp(window.screen, "top", 0);
        defineProp(window.screen, "left", 0);
        defineProp(window.screen, "availTop", 0);
        defineProp(window.screen, "availLeft", 0);
        defineProp(window.screen, "colorDepth", screen.colorDepth);
        defineProp(window.screen, "pixelDepth", screen.pixelDepth);
        
    };

    /**
     * Initialize script
     */
    var init = function () {
        console.log("obj");
        console.log(screenRes);
        spoofScreenResolution();
    };
    init();

};

window.addEventListener("load", () => {
    browser.runtime.sendMessage({ msg: "request_data" });
});

function injectJS(obj) {
    
    var script_1 = document.createElement('script');
    script_1.id = "mainScript";
    script_1.textContent = "var localIP='" + obj.localIP + "';" +
        "var localIP_RP='" + obj.localIP_RP + "';" +
        "var card='" + obj.card + "';" +
        "var canvasNoiseR=" + obj.canvasNoiseR + ";" +
        "var canvasNoiseG=" + obj.canvasNoiseG + ";" +
        "var canvasNoiseB=" + obj.canvasNoiseB + ";" +
        "var canvasNoiseA=" + obj.canvasNoiseA + ";" +
        "var webglNoise=" + obj.webglNoise + ";" +
        "var webgl_35661=" + obj.webgl_35661 + ";" +
        "var webgl_36349=" + obj.webgl_36349 + ";" +
        "var webgl_34930=" + obj.webgl_34930 + ";" +
        "var webgl_34076=" + obj.webgl_34076 + ";" +
        "var webgl_3413=" + obj.webgl_3413 + ";" +
        "var webgl_3386=" + obj.webgl_3386 + ";" +
        "var webgl_else=" + obj.webgl_else + ";" +
        "var mediaDevice1=" + obj.mediaDevice1 + ";" +
        "var mediaDevice2=" + obj.mediaDevice2 + ";" +
        "var gl_version='" + obj.gl_version + "';" +
        "var gl_vendor='" + obj.gl_vendor + "';" +
        "var gl_renderer='" + obj.gl_renderer + "';" +
        "var gl_shading_language='" + obj.gl_shading_language + "';" +
        "var gl_unmasked_vendor='" + obj.gl_unmasked_vendor + "';" +
        "var font_offset=" + obj.font_offset + ";" +
        "var audioContext_1=" + obj.audioContext_1 + ";" +
        "var audioContext_2=" + obj.audioContext_2 + ";" +
        "var audioContext_3=" + obj.audioContext_3 + ";" +
        "var audioContext_4=" + obj.audioContext_4 + ";" +
        "var userAgent='" + obj.userAgent + "';" +
        "var hardwareConcurrency=" + obj.hardwareConcurrency + ";" +
        "var screenRes=" + obj.screenRes + ";" +
        "(" + inject + ")()";
    document.documentElement.appendChild(script_1);
    if (document.documentElement.dataset.cbscriptallow !== "true") {
        var script_2 = document.createElement('script');
        script_2.textContent = `{
    const iframes = window.top.document.querySelectorAll("iframe[sandbox]");
    for (var i = 0; i < iframes.length; i++) {
      if (iframes[i].contentWindow) {
        if (iframes[i].contentWindow.CanvasRenderingContext2D) {
          iframes[i].contentWindow.CanvasRenderingContext2D.prototype.getImageData = CanvasRenderingContext2D.prototype.getImageData;
        }
        if (iframes[i].contentWindow.HTMLCanvasElement) {
          iframes[i].contentWindow.HTMLCanvasElement.prototype.toBlob = HTMLCanvasElement.prototype.toBlob;
          iframes[i].contentWindow.HTMLCanvasElement.prototype.toDataURL = HTMLCanvasElement.prototype.toDataURL;
        }
        if (iframes[i].contentWindow.WebGLRenderingContext) {
          iframes[i].contentWindow.WebGLRenderingContext.prototype.bufferData = WebGLRenderingContext.prototype.bufferData;
          iframes[i].contentWindow.WebGLRenderingContext.prototype.getParameter = WebGLRenderingContext.prototype.getParameter;
        }
        if (iframes[i].contentWindow.WebGL2RenderingContext) {
          iframes[i].contentWindow.WebGL2RenderingContext.prototype.bufferData = WebGL2RenderingContext.prototype.bufferData;
          iframes[i].contentWindow.WebGL2RenderingContext.prototype.getParameter = WebGL2RenderingContext.prototype.getParameter;
        }
        if (iframes[i].contentWindow) {
          if (iframes[i].contentWindow.HTMLElement) {
            iframes[i].contentWindow.HTMLElement.prototype.offsetWidth = HTMLElement.prototype.offsetWidth;
            iframes[i].contentWindow.HTMLElement.prototype.offsetHeight = HTMLElement.prototype.offsetHeight;
          }
          if (iframes[i].contentWindow.AudioBuffer) {
          if (iframes[i].contentWindow.AudioBuffer.prototype) {
            if (iframes[i].contentWindow.AudioBuffer.prototype.getChannelData) {
              iframes[i].contentWindow.AudioBuffer.prototype.getChannelData = AudioBuffer.prototype.getChannelData;
            }
          }
        }
        }
      }
    }
  }`;
        //
        window.top.document.documentElement.appendChild(script_2);
    }

}

//injectJS('192.168.1.13');

window.addEventListener("message", function (e) {
    if (e.data && e.data === "canvas-fingerprint-defender-alert") {
        background.send("fingerprint", { "host": document.location.host });
    }
}, false);

