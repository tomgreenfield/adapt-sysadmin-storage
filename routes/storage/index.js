const bytes = require("bytes");
const configuration = require("../../lib/configuration");
const Folders = require("../../lib/outputmanager").Constants.Folders;
const fs = require("fs");
const logger = require("../../lib/logger");
const path = require("path");
const server = require("express")();
const { spawn } = require("child_process");

const tempPath = path.join(configuration.tempDir, configuration.getConfig("masterTenantID"));
const frameworkPath = path.join(tempPath, Folders.Framework);
const contentPluginPath = path.join(Folders.Plugins, "content");
const frameworkSourcePath = path.join(frameworkPath, Folders.Source);
const limit = bytes.parse(configuration.getConfig("storageLimit")) || null;

const paths = {
	total: [],
	assets: [ "data" ],
	cache: [
		path.join(tempPath, Folders.Exports),
		path.join(frameworkPath, Folders.AllCourses)
	],
	plugins: [
		path.join(contentPluginPath, "bower", "bowercache"),
		path.join(contentPluginPath, "component", "versions"),
		path.join(contentPluginPath, "extension", "versions"),
		path.join(contentPluginPath, "menu", "versions"),
		path.join(contentPluginPath, "theme", "versions"),
		path.join(frameworkSourcePath, Folders.Components),
		path.join(frameworkSourcePath, Folders.Extensions),
		path.join(frameworkSourcePath, Folders.Menu),
		path.join(frameworkSourcePath, Folders.Theme)
	]
};

function getDiskUsage(directoryList) {
	return new Promise((resolve, reject) => {
		const validPaths = directoryList.filter(fs.existsSync);

		if (!validPaths.length && directoryList.length) return resolve(0);

		const childProcess = spawn("du", [ "-scB1" ].concat(validPaths));
		let output = "";
		let error = "";

		childProcess.stdout.on("data", data => output += data.toString());
		childProcess.stderr.on("data", data => error += data.toString());

		childProcess.on("close", code => {
			code ? reject(error) : resolve(parseInt(output.match(/^(\d+)/gm).pop(), 10));
		});
	});
}

function getStats(size) {
	return {
		raw: size,
		string: bytes.format(size, { unitSeparator: " " }),
		percent: Math.round(size / limit * 100)
	};
}

server.get("/storage", async function(req, res, next) {
	try {
		const types = [ "total", "assets", "cache", "plugins" ];
		const sizes = await Promise.all(types.map(type => getDiskUsage(paths[type])));
		const stats = {};
		const coreSize = sizes.reduce((total, size) => total - size);

		sizes.forEach((size, index) => stats[types[index]] = getStats(size));

		res.status(200).json({
			...stats,
			...{ core: getStats(coreSize) },
			...{ limit: getStats(limit) }
		});
	} catch(error) {
		logger.log("error", error);
		res.status(500).json({ error });
	}
});

module.exports = server;
