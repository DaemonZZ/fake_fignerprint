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
	webgl_35661: "[128,192,256]",
	webgl_36349: 10,
	webgl_34930: 10,
	webgl_34076: 10,
	webgl_3413: 10,
	webgl_3386: 10,
	webgl_else: 1,
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
	screenRes: [1024,768]
}
var listVGA = ["AMD Radeon HD 6350", "AMD Radeon HD 6450", "AMD Radeon HD 6800 Series", "AMD Radeon HD 7310 Graphics", "AMD Radeon HD 7340 Graphics", "AMD Radeon HD 7520G", "AMD Radeon HD 7640G", "AMD Radeon HD 7700 Series", "AMD Radeon HD 7800 Series", "AMD Radeon HD 8240", "AMD Radeon R7 200 Series", "AMD Radeon R7 300 Series", "AMD Radeon R9 200 Series", "AMD Radeon R9 300 Series", "AMD Radeon R9 400 Series", "AMD Radeon RX 5500 XT", "AMD Radeon RX 5600 XT", "AMD Radeon RX 5700 XT", "AMD Radeon(TM) Vega 8 Graphics", "AMD Radeon(TM) HD 6480G", "AMD Radeon(TM) HD 6520G", "ATI Mobility Radeon HD 4250", "ATI Mobility Radeon HD 5470", "ATI Mobility Radeon HD 5650", "ATI Radeon HD 4200", "ATI Radeon HD 4300/4500 Series", "ATI Radeon HD 4600 Series", "ATI Radeon HD 5470", "ATI Radeon HD 5570", "ATI Radeon HD 5670", "Intel(R) HD Graphics", "Intel(R) HD Graphics Family", "Intel(R) HD Graphics 2000", "Intel(R) HD Graphics 3000", "Intel(R) HD Graphics 2500", "Intel(R) HD Graphics 4000", "Intel(R) HD Graphics 4200", "Intel(R) HD Graphics 4400", "Intel(R) HD Graphics 4600", "Intel(R) HD Graphics 5000", "Intel(R) HD Graphics 5300", "Intel(R) HD Graphics 5500", "Intel(R) HD Graphics 6000", "Intel(R) HD Graphics 6100", "Intel(R) HD Graphics 6200", "Intel(R) HD Graphics 610", "Intel(R) HD Graphics 615", "Intel(R) HD Graphics 620", "Intel(R) HD Graphics 630", "Intel(R) UHD Graphics 610", "Intel(R) UHD Graphics 615", "Intel(R) UHD Graphics 617", "Intel(R) UHD Graphics 620", "Intel(R) UHD Graphics 630", "Mobile Intel(R) 4 Series Express Chipset Family", "Mobile Intel(R) 965 Express Chipset Family", "Intel(R) Q35 Express Chipset Family", "Intel(R) Q45/Q43 Express Chipset", "Intel(R) Q965/Q963 Express Chipset Family", "Intel(R) 4 Series Internal Chipset", "Intel(R) 82945G Express Chipset Family", "Intel(R) G33/G31 Express Chipset Family", "Intel(R) G41 Express Chipset", "Intel(R) G45/G43 Express Chipset", "Intel(R) Graphics Media Accelerator 3150", "Intel(R) Graphics Media Accelerator 3600 Series", "Intel(R) Graphics Media Accelerator HD", "NVIDIA GeForce 8400 GS", "NVIDIA GeForce 9200", "NVIDIA GeForce 9500 GT", "NVIDIA GeForce 9800 GT", "NVIDIA GeForce GT 220", "NVIDIA GeForce GT 240", "NVIDIA GeForce GT 430", "NVIDIA GeForce GT 440", "NVIDIA GeForce GT 610", "NVIDIA GeForce GT 620", "NVIDIA GeForce GT 630", "NVIDIA GeForce GT 640", "NVIDIA GeForce GTX 550 Ti", "NVIDIA GeForce GTX 560", "NVIDIA GeForce GTX 560 Ti", "NVIDIA GeForce GTX 650", "NVIDIA GeForce GTX 660", "NVIDIA GeForce GTX 670", "NVIDIA GeForce GTX 680", "NVIDIA GeForce GTX 760", "NVIDIA Quadro 4000M", "NVIDIA Quadro 2000M", "NVIDIA Quadro K2000M", "NVIDIA Quadro K420", "NVIDIA Quadro NVS 140M", "NVIDIA Quadro NVS 150M", "NVIDIA Quadro NVS 160M", "NVIDIA GeForce GTX 960M", "NVIDIA GeForce GTX 970M", "NVIDIA GeForce GTX 980M", "NVIDIA GeForce GTX 1050M", "NVIDIA GeForce GTX 1060M", "NVIDIA GeForce GTX 1070M", "NVIDIA GeForce GTX 1080M"]
function generate(obj) {
	obj.localIP = randomIP();
	obj.localIP_RP = "N/A";
	obj.canvasNoiseR = getRandomFloat(0.1, 0.9, 1);
	obj.canvasNoiseG = getRandomFloat(0.1, 0.9, 1);
	obj.canvasNoiseB = getRandomFloat(0.1, 0.9, 1);
	obj.canvasNoiseA = getRandomFloat(0.1, 0.9, 1);
	obj.font_offset = "[" + randomArray(2,-2,8).toString() + "]";
	obj.card = listVGA[randomInt(0,100)];
	obj.hardwareConcurrency = randomInt(1, 8);
	obj.deviceMemory = randomInt(2, 32);
	obj.webglNoise = getRandomFloat(0.1, 0.9, 1);
	obj.webgl_34076 = randomInt(12000, 64000);
	obj.webgl_34930 = randomInt(0, 64);
	obj.webgl_3413 = randomInt(0, 8);
	obj.webgl_36349 = randomInt(0, 8) * 1024;
	obj.webgl_3386 = randomInt(0, 8) * 1024;
	obj.webgl_35661 = "[" + randomArray(512,0,3).toString() + "]";
	obj.audioContext_1 = getRandomFloat(0, 1, 1);
	obj.audioContext_2 = getRandomFloat(0, 1, 1);
	obj.audioContext_3 = getRandomFloat(0, 1, 1);
	obj.audioContext_4 = getRandomFloat(0, 1, 1);
	obj.screenRes = "[" + randomArray(1920,1366,2) + "]";
	jsonData = obj;
}

function randomIP() {
	return randomInt(0, 255) + "." + randomInt(0, 255) + "." + randomInt(0, 255) + "." + randomInt(0, 255);
}

function getRandomFloat(min, max, decimals) {
	const str = (Math.random() * (max - min) + min).toFixed(decimals);

	return parseFloat(str);
}

function randomArray(max,min,size) {
	return [...Array(size)].map(() => Math.floor(Math.random() * (max-min)) +min);
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
							jsonData: jsonData
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
