var REDFIN_REGEX = new RegExp(/https:\/\/www.redfin.ca\/bc\/.+\/.+\/home\/.+/)
var REALTOR_REGEX = new RegExp(/https:\/\/www.realtor.ca\/real-estate\/.+\/.+/)
var ZOLO_REGEX = new RegExp(/https:\/\/www.zolo.ca\/.+\/.+/)
var ZEALTY_REGEX = new RegExp(/https:\/\/www.zealty.ca\/.+\/.+\//)

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {	
    if (changeInfo.title) {
        getHomeDetails(tab.url, changeInfo.title)			
    }
})
 
chrome.tabs.onActivated.addListener(function(activeInfo) {
    chrome.tabs.get(activeInfo.tabId, function(tab){
        getHomeDetails(tab.url, tab.title)
    })
})

var getHomeDetails = (url, address) => {
    var site = url.match(REDFIN_REGEX)? 'redfin' :
        url.match(REALTOR_REGEX)? 'realtor' :
		url.match(ZEALTY_REGEX)? 'zealty' :
        url.match(ZOLO_REGEX)? 'zolo' : null
			
	getHomeAddress(site, address)
    //getHomePrice(site)
}

var getHomeAddress = (site, address) => {
    var a = null
    // Redfin
    if (site === 'redfin') { 
        a = address.split(', BC')[0]
        var i = a.indexOf('#')
        if (i > 0) {
            var j = a.indexOf(',') 
            a = a.substring(i+1,j) + '-' + a.substring(0,i-1) + a.substring(j+1)
        }
    }
    // Realtor.ca
    if (site === 'realtor') {
        a = address.split('For sale: ')[1].split(', British Columbia')[0]
    }
    // Zolo
    if (site === 'zolo') {		
        //a = address
		a = address.split(' — For Sale')[0].split(' | Zolo.ca')[0]
    }

	// ZEALTY
	if (site === 'zealty') {		
        a = address.split(' | ')[1].split(', BC')[0]
    }

    if (a) {
        a = a.toUpperCase()
            .replace(' CIRCLE', ' CIR')
            .replace(' BLVD', ' BOULEVARD')
    }		
    chrome.storage.local.set({'bcre-address': a})
}


var getHomePrice = (site) => {
    if (site) {
        chrome.scripting.executeScript({
			target:{tabId: tab.id},
            code: `var site = "${site}"`
        }, () => {
            chrome.scripting.executeScript({
				target:{tabId: tab.id},
                file: 'script.js'
            })
        })
    }
}