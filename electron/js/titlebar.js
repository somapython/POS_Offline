//title bar
const customTitlebar = require('custom-electron-titlebar');

//create the custom title bar of electron application
var titleBar = new customTitlebar.Titlebar({
	backgroundColor: customTitlebar.Color.fromHex('#ccc'),
	menu: false,
	drag: true,
	maximizable: false,
	minimizable: true,
	icon: './images/favicon/company_logo.png'
});

//to empty custom title bar
//$('.window-title').text('');