const fs = require('fs');
const path = require('path');
const readline = require('readline');
const {spawn} = require('child_process');
const mkdirp = require('mkdirp');
const dir = require('node-dir');
const mapLimit = require('async/mapLimit');

// Some things to exclude, if this were part of the automation:
// - C:/Windows/*.swp
// - C:/Windows/History/
// - C:/Windows/Offline Web Pages/
// - C:/Windows/Temporary Internet Files/
// - C:/Windows/Downloaded Program Files/
// - C:/Windows/Cookies/
// - C:/Windows/TEMP/
// - C:/Windows/System/CatRoot/
// - anything related to VMware

const pathToResourcesExtract = "resourcesextract-x64/ResourcesExtract.exe";

const resourcesExtract = (sourceFolderPath, destinationFolderPath, callback)=> {
	const sourcePattern = sourceFolderPath + "\\*.*";
	const args = [
		"/ExtractIcons", "1",
		"/ExtractCursors", "1",
		"/ExtractBitmaps", "1",
		"/ExtractAnimatedIcons", "1",
		"/ExtractAnimatedCursors", "1",
		"/ExtractAVI", "1",
		"/ExtractHTML", "0",
		"/ExtractManifests", "0",
		"/ExtractTypeLib", "0",
		"/ExtractBinary", "0",
		"/FileExistMode", "1", // 1 = Overwrite, 2 = Save with another name
		"/ScanSubFolders", "0",
		"/SubFolderDepth", "0", // 0 = Unlimited (this shouldn't come into play)
		"/OpenDestFolder", "0",
		"/Source", sourcePattern,
		"/DestFolder", destinationFolderPath,
	];
	// return console.log(pathToResourcesExtract, args.join(" "));
	console.log("Run ResourceExtract on", sourcePattern);
	const child = spawn(pathToResourcesExtract, args);

	let calledBack = false;
	child.on('error', (err) => {
		if (calledBack) { return }
		callback(err);
		calledBack = true;
	});

	child.stdout.on('data', (data) => {
		console.log(`child stdout:\n${data}`);
	});

	child.stderr.on('data', (data) => {
		console.error(`child stderr:\n${data}`);
	});

	child.on('exit', function (code, signal) {
		// console.log(
		// 	'child process exited with ' +
		// 	`code ${code} and signal ${signal}`
		// );
		if (calledBack) { return; }
		if (code === 0) {
			callback();
			calledBack = true;
		} else {
			callback(new Error(
				"child process ResourcesExtract exited with " +
				`code ${code} and signal ${signal}`
			));
			calledBack = true;
		}
	});
};

const deleteDirectorySync = (directoryPath)=> {
	if (fs.existsSync(directoryPath)) {
		for (const entryName of fs.readdirSync(directoryPath)) {
			const entryPath = path.join(directoryPath, entryName);
			if (fs.lstatSync(entryPath).isDirectory()) {
				deleteDirectorySync(entryPath);
			} else {
				fs.unlinkSync(entryPath);
			}
		}
		fs.rmdirSync(directoryPath);
	}
};

const extractResourcesToCorrespondingDirectoryStructure = (sourceRootPath, destinationRootPath)=> {
	console.log(`Extracting resources from: ${sourceRootPath}`);

	dir.subdirs(sourceRootPath, (err, sourceSubDirectoryPaths)=> {
		if (err) { throw err; }
		const sourceDirectoryPaths = [sourceRootPath].concat(sourceSubDirectoryPaths);

		mapLimit(sourceDirectoryPaths, 1,
			(sourceDirectoryPath, callback)=> {
				const sharedPath = path.relative(sourceRootPath, sourceDirectoryPath);
				const destinationDirectoryPath = path.join(destinationRootPath, sharedPath);
				mkdirp.sync(destinationDirectoryPath);
				resourcesExtract(sourceDirectoryPath, destinationDirectoryPath, (err)=> {
					if (err) { return callback(err); }
					fs.readdir(sourceDirectoryPath, (err, sourceFnames)=> {
						if (err) { return callback(err); }
						fs.readdir(destinationDirectoryPath, (err, destinationFnames)=> {
							if (err) { return callback(err); }
							// resultantResourceFnames = fnames;
							// may include directories; i'm assuming they won't match for now
							const subresources = destinationFnames.map((destinationFname)=> {
								const subresourcePath = path.join(destinationDirectoryPath, destinationFname);
								const fromSuperResourceName = destinationFname.replace(/_.*/, "");
								const fromSuperResourceFileName = sourceFnames.find(
									(sourceFname)=> sourceFname.indexOf(fromSuperResourceName) === 0
								);
								const fromSuperResourcePath = path.join(sourceDirectoryPath, fromSuperResourceFileName);
								const subResourceID = destinationFname.replace(/[^_]*_/, "").replace(/\..+/, ""); // can be an index number or ID_APP etc.
								return {
									fileName: destinationFname,
									path: subresourcePath,
									fromSuperResourceName,
									fromSuperResourceFileName,
									fromSuperResourcePath,
									subResourceID,
								};
							});
							console.log("Extracted subresources:", subresources);
							setTimeout(()=> {
								callback(null, subresources);
							}, 1000);
						});
					});
				});
			},
			(err, results)=> {
				if (err) {
					console.error(err);
				} else {
					console.log("DONE with all resource extraction!");
					console.log(results);
					console.log("DONE with all resource extraction! see above for results");
					fs.writeFileSync("temp/catalog.json", JSON.stringify(results), "utf8");
				}
			}
		);
	});
};

const sourceRootPath = process.argv[2];
if(!sourceRootPath){
	console.error("Usage: node extract-resources.js <top level source folder path>");
	process.exit(1);
}
const destinationRootPath = path.join(__dirname, "temp/extracted");

if(fs.existsSync(destinationRootPath)){
	console.log(`Deleting old folder: ${destinationRootPath}`);
	deleteDirectorySync(destinationRootPath);
}

extractResourcesToCorrespondingDirectoryStructure(sourceRootPath, destinationRootPath);

