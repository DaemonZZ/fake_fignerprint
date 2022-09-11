var firstLoad = true;
var jsonData = {
	localIP: "8.8.8.8",
	localIP_RP: "8.8.8.8",
	card: "HD3000",
	canvasNoiseR: 10,
	canvasNoiseG: 10,
	canvasNoiseB: 10,
	canvasNoiseA: 10,
	webglNoise: 10,
	webgl_35661: 10,
	webgl_36349: 10,
	webgl_34930: 10,
	webgl_34076: 10,
	webgl_3413: 10,
	webgl_3386: 10,
	webgl_else: 10,
	mediaDevice1: 10,
	mediaDevice2: 10,
	gl_version: "2.0",
	gl_vendor: "Google",
	gl_renderer: "2.0",
	gl_shading_language: "en-US",
	gl_unmasked_vendor: "Google",
	font_offset: 10,
	audioContext_1: 10,
	audioContext_2: 10,
	audioContext_3: 10,
	audioContext_4: 10,
	userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/105.0.0.0 Safari/537.36",
	deviceMemory: "2",
	hardwareConcurrency: 10,
}
function generate(obj){
	obj.canvasNoiseR = getRandomFloat(0.1, 0.9, 1);
    obj.canvasNoiseG = getRandomFloat(0.1, 0.9, 1);
    obj.canvasNoiseB = getRandomFloat(0.1, 0.9, 1);
    obj.canvasNoiseA = getRandomFloat(0.1, 0.9, 1);
    obj.font_offset = "[" + randomFontOffset().toString() + "]";
    obj.card = makeText(20);
    obj.hardwareConcurrency = randomInt(1, 8);
    obj.deviceMemory = randomInt(2, 32);
    obj.webgl_34076 = randomInt(12000, 64000);
    obj.webgl_34930 = randomInt(0, 64);
    obj.webgl_3413 = randomInt(0, 8);obj.canvasNoiseR = getRandomFloat(0.1, 0.9, 1);
    obj.canvasNoiseG = getRandomFloat(0.1, 0.9, 1);
    obj.canvasNoiseB = getRandomFloat(0.1, 0.9, 1);
    obj.canvasNoiseA = getRandomFloat(0.1, 0.9, 1);
    obj.font_offset = "[" + randomFontOffset().toString() + "]";
    obj.card = makeText(20);
    obj.hardwareConcurrency = randomInt(1, 8);
    obj.deviceMemory = randomInt(2, 32);
    obj.webgl_34076 = randomInt(12000, 64000);
    obj.webgl_34930 = randomInt(0, 64);
    obj.webgl_3413 = randomInt(0, 8);
	jsonData = obj;
}

function getRandomFloat(min, max, decimals) {
    const str = (Math.random() * (max - min) + min).toFixed(decimals);

    return parseFloat(str);
}

function randomFontOffset() {
    var a = [...Array(8)].map(() => Math.floor(Math.random() * 4) - 2);
    console.log(a);
    return [...Array(8)].map(() => Math.floor(Math.random() * 4) - 2);
}

function makeText(length) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() *
            charactersLength));
    }
    return result;
}

function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

browser.runtime.getPlatformInfo(info => {
	browser.storage.local.set({ os: "win" == info.os ? 1 : 0 })
});
browser.runtime.onMessage.addListener((request, sender, sendResponse) => {
	if (request.msg == 'reOpen') {
		browser.sessions.getRecentlyClosed({ maxResults: 1 }, sessions => {
			sessions.length && (sessions[0].tab ? browser.sessions.restore(sessions[0].tab.sessionId) : browser.sessions.restore(sessions[0].window.sessionId))
		})
	} else {
		browser.tabs.query({ active: true, currentWindow: true }, tabs => {
			console.log(request.msg);
			switch (request.msg) {
				case 'newTab':
					console.log("Close");
					browser.windows.update(tabs[0].windowId, { state: 'minimized' });
					break;
				case 'closeTab':
					browser.tabs.remove(tabs[0].id);
					break;
				case 'prevTab':
					browser.tabs.query({ currentWindow: true }, curTabs => {
						var w = (tabs[0].index - 1 + curTabs.length) % curTabs.length;
						browser.tabs.update(curTabs[w].id, { active: true })
					});
					break;
				case 'nextTab':
					browser.tabs.query({ currentWindow: true }, curTabs => {
						var n = (tabs[0].index + 1) % curTabs.length;
						browser.tabs.update(curTabs[n].id, { active: true })
					});
					break;
				case 'closeOther':
					browser.tabs.query({ currentWindow: true }, curTabs => {
						curTabs.forEach(tab => {
							tab.id !== tabs[0].id && !tab.pinned && browser.tabs.remove(tab.id)
						})
					});
					break;
				case 'pinTab':
					browser.tabs.update(tabs[0].id, { pinned: !tabs[0].pinned });
					break;
				case 'closeWin':
					browser.windows.remove(tabs[0].windowId);
					break;
				case 'minWin':
					browser.windows.update(tabs[0].windowId, { state: 'minimized' });
					break;
				case 'request_data':
					console.log("request_data");
					for (var i = 0; i < tabs.length; ++i)
						browser.tabs.sendMessage(tabs[i].id, {
							message: 'first',
							data: firstLoad,
							jsonData:jsonData
						}, () => {
							browser.runtime.lastError
						});
					if (firstLoad) {
						browser.browserAction.setBadgeBackgroundColor({ 'color': 'red' });
						firstLoad = false;
					}
					break;
				case 'doubleTab':
					browser.tabs.duplicate(tabs[0].id)
			}
		})
	}
});
void 0 !== browser.runtime.onInstalled && browser.runtime.onInstalled.addListener(details => {
	"install" == details.reason && browser.runtime.openOptionsPage()
});
browser.storage.onChanged.addListener(details => {
	details.wow && browser.tabs.query({}, tabs => {
		for (var i = 0; i < tabs.length; ++i)
			browser.tabs.sendMessage(tabs[i].id, {
				message: 'up',
				data: details.wow.newValue
			}, () => {
				browser.runtime.lastError
			})
	})
});



function updateCount(tabId, isOnRemoved) {
	console.log("Test");
	browser.tabs.query({})
		.then((tabs) => {
			let length = tabs.length;

			if (isOnRemoved && tabId && tabs.map((t) => { return t.id; }).includes(tabId)) {
				length--;
			}

			browser.browserAction.setBadgeText({ text: length.toString() });
			if (firstLoad) {
				browser.browserAction.setBadgeBackgroundColor({ 'color': 'green' });
			} else {
				browser.browserAction.setBadgeBackgroundColor({ 'color': 'red' });

			}
		});
}


browser.tabs.onRemoved.addListener(
	(tabId) => {
		updateCount(tabId, true);
	});
browser.tabs.onCreated.addListener(
	(tabId) => {
		updateCount(tabId, false);
	});
generate(jsonData);
updateCount();
