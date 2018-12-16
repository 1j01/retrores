const slug = require('slug')

const Windows98SE = {
	shortName: "Windows 98",
	mediumShortName: "Windows 98 SE",
	name: "Windows 98 Second Edition (OEM Full)",
	downloadPage: "https://winworldpc.com/download/417d71c2-ae18-c39a-11c3-a4e284a2c3a5",
	vmwareInstallationInstructionsPage: "https://www.vmware.com/support/ws3/doc/ws32_guestos9.html",
	aProductKey: "RW9MG-QR4G3-2WRR9-TG7BH-33GXB",
}

const resources = [
	{
		type: "Animated Cursor",
		embeddedTitle: "Hour Glass",
		title: "Hour Glass Cursor",
		// grabbedFromOS: "Windows 98 Second Edition",
		copyright: "© 1995 Microsoft",
		description: "An hourglass filling and periodically turning over",
		tags: [
			"Hourglass",
			"Hour Glass",
			"Sand",
			"Sands of Time",
			"Time",
			"Timer",
			"Wait",
			"Waiting",
			"Please Wait",
			"Busy",
			"Loading",
			"Progress",
			"Processing",
			"Standby",
			"Stand By",
			"Filling",
			"Spin",
			"Spinning",
			"Spinner",
			"Turn",
			"Turning",
			"Rotate",
			"Rotating",
		],
		files: [
			{
				name: "HOURGLAS.ANI",
				path: "/static/resources/cursors/ani/HOURGLAS.ANI",
				type: "ani",
				// bytes: "?",
				// frames: "?"
			},
			{
				name: "HOURGLAS.GIF",
				path: "/static/resources/cursors/gif/HOURGLAS.GIF",
				type: "gif",
				// bytes: "?",
				// frames: "?"
			}
		]
	},
	{
		type: "Animated Cursor",
		embeddedTitle: "Application Starting Hour Glass",
		title: "Hour Glass Arrow Cursor",
		// grabbedFromOS: "Windows 98 Second Edition",
		copyright: "© 1995 Microsoft",
		description: "An arrow with an hourglass filling and periodically turning over",
		tags: [
			"Hourglass",
			"Hour Glass",
			"Sand",
			"Sands of Time",
			"Time",
			"Timer",
			"Wait",
			"Waiting",
			"Please Wait",
			"Busy",
			"Loading",
			"Progress",
			"Processing",
			"Standby",
			"Stand By",
			"Filling",
			"Spin",
			"Spinning",
			"Spinner",
			"Turn",
			"Turning",
			"Rotate",
			"Rotating",
			"Arrow",
			"Background Processing",
		],
		files: [
			{
				name: "APPSTART.ANI",
				path: "/static/resources/cursors/ani/APPSTART.ANI",
				type: "ani",
				// bytes: "?",
				// frames: "?"
			},
			{
				name: "APPSTART.GIF",
				path: "/static/resources/cursors/gif/APPSTART.GIF",
				type: "gif",
				// bytes: "?",
				// frames: "?"
			}
		]
	},
	{
		type: "Animated Cursor",
		// embeddedTitle: "", // not present
		title: "Globe / Downloading Cursor",
		// grabbedFromOS: "Windows 98 Second Edition",
		copyright: "© 1998(?) Microsoft",
		description: "Receiving information from the Internet",
		tags: [
			"Download",
			"Downloading",
			"Wait",
			"Waiting",
			"Please Wait",
			"Busy",
			"Loading",
			"Progress",
			"Processing",
			"Standby",
			"Stand By",
			"Receiving",
			"Recieving", //tyop
			"Information",
			"Data",
			"Internet",
			"Web",
			"Transfer",
			"Downlink",
			"Globe",
			"World",
			"World Wide Web",
			"WWW",
			"Computer",
			"Network",
			"Monitor"
		],
		files: [
			{
				name: "GLOBE.ANI",
				path: "/static/resources/cursors/ani/GLOBE.ANI",
				type: "ani",
				// bytes: "?",
				// frames: "?"
			},
			{
				name: "GLOBE.GIF",
				path: "/static/resources/cursors/gif/GLOBE.GIF",
				type: "gif",
				// bytes: "?",
				// frames: "?"
			}
		]
	},
]

resources.forEach(function (resource) {
	if(!resource.title){
		throw new TypeError("Resource is missing title! " + JSON.stringify(resource))
	}
	resource.pagePathSlug = slug(resource.title, {lower: true})
	resource.pagePath = '/' + resource.pagePathSlug + '/'
	resource.id = resource.pagePathSlug
})

module.exports = resources
