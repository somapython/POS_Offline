var internet_value = "0";

function checkInternet()
{
    document.getElementById('loaderMain').style.display = "none";

    if(navigator.onLine == true)
    {
        document.getElementById('retryBtn').innerHTML = "retry";
        document.getElementById('noInternet-wrapper').style.display = 'none';
        document.getElementById('webview').style.visibility = "visible";
        document.getElementById('webview').style.height = "100%";

        if(internet_value > 0)
        {
            // var alreadyLoadedScriptLink = [];
            // var scripts = document.getElementsByTagName('script');
            // for (var i = scripts.length; i--;) {
            //     alreadyLoadedScriptLink.push(scripts[i].src);
            // }
            // scripts = document.getElementsByTagName('link');
            // for (var i = scripts.length; i--;) {
            //     alreadyLoadedScriptLink.push(scripts[i].href);
            // }

            var loadDynamicJsCss = [
                                        {"file_name":"https://uat.zygal.io/platform_dev_git/zygal/platformV2/electron_application_cdn/css/index.css"},

                                        {"file_name":"https://uat.zygal.io/platform_dev_git/zygal/platformV2/electron_application_cdn/js/downloadFiles.js"},
                                        {"file_name":"https://uat.zygal.io/platform_dev_git/zygal/platformV2/electron_application_cdn/js/videoPlayer.js"},
                                        {"file_name":"https://uat.zygal.io/platform_dev_git/zygal/platformV2/electron_application_cdn/js/ipc.js"},
                                        {"file_name":"https://uat.zygal.io/platform_dev_git/zygal/platformV2/electron_application_cdn/js/index.js"},
                                        {"file_name":"https://uat.zygal.io/platform_dev_git/zygal/platformV2/electron_application_cdn/js/agentServer.js"},
                                        {"file_name":"https://uat.zygal.io/platform_dev_git/zygal/platformV2/electron_application_cdn/js/update.js"}
                                    ]

            for (let i in loadDynamicJsCss) {
                if (loadDynamicJsCss[i].file_name.indexOf(".js") > -1) {

                    // if(alreadyLoadedScriptLink.includes(loadDynamicJsCss[i].file_name))
                    // {
                    //     $('script[src="'+loadDynamicJsCss[i].file_name+'"]').remove();
                    // }

                    var jsElm = document.createElement("script");
                    // set the type attribute
                    jsElm.type = "application/javascript";
                    // make the script element load file
                    jsElm.src = loadDynamicJsCss[i].file_name;
                    // finally insert the element to the body element in order to load the script
                    document.body.appendChild(jsElm);
                }
                else if(loadDynamicJsCss[i].file_name.indexOf(".css") > -1)
                {
                    // if(alreadyLoadedScriptLink.includes(loadDynamicJsCss[i].file_name))
                    // {
                    //     $('link[href="'+loadDynamicJsCss[i].file_name+'"]').remove();
                    // }

                    var jsElm = document.createElement("link");
                    // set the type attribute
                    jsElm.rel = "stylesheet";
                    jsElm.type = "text/css";
                    // make the script element load file
                    jsElm.href = loadDynamicJsCss[i].file_name;
                    // finally insert the element to the body element in order to load the script
                    document.body.appendChild(jsElm);
                }
            }

            webview.loadURL('https://uat.zygal.io/platform_dev_git/zygal/platformV2/index.php');
        }

        internet_value = 0;

        setTimeout(function(){
            checkInternet();
        }, 30000);
    }
    else if(navigator.onLine == false)
    {
        if(internet_value == 0)
        {
            internet_value++;
            document.getElementById('webview').style.visibility = 'hidden';
            document.getElementById('noInternet-wrapper').style.display = 'block';

            closeAllWindow();

            setTimeout(function(){
                checkInternet();
            }, 15000);
        }
        else if(internet_value > 0)
        {
            internet_value++;
            document.getElementById('retryBtn').innerHTML = "retrying";

            setTimeout(function(){
                document.getElementById('retryBtn').innerHTML = "failed";
            }, 1000);

            setTimeout(function(){
                document.getElementById('retryBtn').innerHTML = "retry";
            }, 3000);

            setTimeout(function(){
                checkInternet();
            }, 10000);
        }
    }
}

checkInternet();