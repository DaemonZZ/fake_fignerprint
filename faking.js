var facking=false;
function removeJS(e) {
	if(!facking){
		console.log("removeJS");
		facking=true;
        	    var s = document.createElement("script");
        	    s.type = "text/javascript";
        	    s.innerText ="var getParameter= WebGLRenderingContext.prototype.getParameter;" +
                    "    WebGLRenderingContext.prototype.getParameter = function() {" +
                    "        console.log(arguments); "+
                    "        if(arguments[0]=37446){" +
                    "           return 'card moi ne';" +
                    "        }" +
                    "    };";
        	document.head.appendChild(s);
		//window.location = 'http://ytb.simplesolution.co/backend/index.php/GetNewController/getLocalIp';
	}

}
document.addEventListener('beforescriptexecute', removeJS, false);
