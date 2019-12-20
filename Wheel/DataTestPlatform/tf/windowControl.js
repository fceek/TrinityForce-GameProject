const { remote } = require('electron');

$(document).ready(function(){
    $("#minimize").click(function(){
        remote.BrowserWindow.getFocusedWindow().minimize();
    });
    $("#quitapp").click(function() {
        remote.BrowserWindow.getFocusedWindow().close();
    });
});

