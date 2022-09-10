browser.runtime.getPlatformInfo(info=>{
	browser.storage.local.set({os:"win"==info.os?1:0})
});
browser.runtime.onMessage.addListener((request,sender,sendResponse)=>{
	if(request.msg=='reOpen'){
		browser.sessions.getRecentlyClosed({maxResults:1},sessions=>{
			sessions.length && (sessions[0].tab?browser.sessions.restore(sessions[0].tab.sessionId):browser.sessions.restore(sessions[0].window.sessionId))
		})
	}else{
		browser.tabs.query({active:true,currentWindow:true},tabs=>{
			switch(request.msg){
				case 'newTab':
					browser.windows.update(tabs[0].windowId,{state:'minimized'});
					break;
				case 'closeTab':
					browser.tabs.remove(tabs[0].id);
					break;
				case 'prevTab':
					browser.tabs.query({currentWindow:true},curTabs=>{
						var w=(tabs[0].index-1+curTabs.length)%curTabs.length;
                        browser.tabs.update(curTabs[w].id,{active:true})
					});
					break;
				case 'nextTab':
					browser.tabs.query({currentWindow:true},curTabs=>{
						var n=(tabs[0].index+1)%curTabs.length;
                        browser.tabs.update(curTabs[n].id,{active:true})
					});
					break;
				case 'closeOther':
					browser.tabs.query({currentWindow:true},curTabs=>{
						curTabs.forEach(tab=>{
							tab.id!==tabs[0].id&&!tab.pinned&&browser.tabs.remove(tab.id)
						})
					});
					break;
				case 'pinTab':
					browser.tabs.update(tabs[0].id,{pinned:!tabs[0].pinned});
					break;
				case 'closeWin':
					browser.windows.remove(tabs[0].windowId);
					break;
				case 'minWin':
					browser.windows.update(tabs[0].windowId,{state:'minimized'});
					break;
				case 'doubleTab':
					browser.tabs.duplicate(tabs[0].id)
			}
		})
	}
});
void 0!==browser.runtime.onInstalled && browser.runtime.onInstalled.addListener(details=>{
	"install"==details.reason && browser.runtime.openOptionsPage()
});
browser.storage.onChanged.addListener(details=>{
	details.wow && browser.tabs.query({},tabs=>{
		for(var i=0;i<tabs.length;++i)
			browser.tabs.sendMessage(tabs[i].id,{
				message:'up',
				data:details.wow.newValue
			},()=>{
				browser.runtime.lastError
			})
	})
});