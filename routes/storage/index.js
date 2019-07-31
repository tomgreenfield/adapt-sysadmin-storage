const bytes = require("bytes");
const configuration = require("../../lib/configuration");
const server = require("express")();

server.get("/storage", function(req, res, next) {
	const { spawn } = require("child_process");
	const childProcess = spawn("du", [ "-sB1" ]);
	const collateOutput = data => output += data.toString();
	let output = "";

	childProcess.stdout.on("data", collateOutput);
	childProcess.stderr.on("data", collateOutput);

	childProcess.on("close", code => {
		if (code) return res.status(500).json({ output: output });

		const getSizeString = size => bytes.format(size, { unitSeparator: " " });
		const used = parseInt(output.split(/\D/)[0], 10);
		const limit = bytes.parse(configuration.getConfig("storageLimit")) || null;

		res.status(200).json({
			used: getSizeString(used),
			limit: getSizeString(limit),
			percent: Math.round(used / limit * 100)
		});
	});
});

module.exports = server;
