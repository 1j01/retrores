const fs = require('fs');
const path = require('path');
const readline = require('readline');
const {spawn} = require('child_process');
const mkdirp = require('mkdirp');
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

const getDirectoryStructureSync = (directoryPath) => {
	const entries = [];
	const entryNames = fs.readdirSync(directoryPath);
	for (const entryName of entryNames) {
		const entryPath = path.join(directoryPath, entryName);
		const stats = fs.statSync(entryPath);
		if (stats.isDirectory()) {
			entries.push({
				path: entryPath,
				entries: getDirectoryStructureSync(entryPath),
			});
		} else {
			entries.push({
				path: entryPath,
			});
		}
	}
	return entries;
};

const extractResourcesToCorrespondingDirectoryStructure = (sourceFolderPath, destinationFolderPath)=> {

	const entries = getDirectoryStructureSync(sourceFolderPath)
	// console.log(entries);
	const findDirectories = (entries)=> {
		let directories = [];
		for (const entry of entries) {
			if (entry.entries) { // if entry is a directory
				directories.push(entry);
				directories = directories.concat(findDirectories(entry.entries));
			}
		}
		return directories;
	};
	const directories = findDirectories(entries);
	// console.log(directories);

	mapLimit(directories, 1,
		(directory, callback)=> {
			const sharedPath = path.relative(sourceFolderPath, directory.path);
			const correspondingDestinationDirectoryPath = path.join(destinationFolderPath, sharedPath);
			mkdirp.sync(correspondingDestinationDirectoryPath);
			resourcesExtract(directory.path, correspondingDestinationDirectoryPath, (err)=> {
				if (err) { return callback(err); }
				fs.readdir(correspondingDestinationDirectoryPath, (err, fnames)=> {
					if (err) { return callback(err); }
					// resultantResourceFnames = fnames;
					console.log("Created", fnames);
					setTimeout(()=> {
						callback(null, fnames);
					}, 1000);
				});
			});
		},
		(err, results)=> {
			if (err) {
				console.error(err);
			} else {
				console.log("DONE with all resource extraction!");
				console.log(entries);
			}
		}
	);
};

const sourceFolderPath = process.argv[2];
if(!sourceFolderPath){
	console.error("Usage: node extract-resources.js <top level source folder path>");
	process.exit(1);
}
const destinationFolderPath = path.join(__dirname, "temp/extracted");

if(fs.existsSync(destinationFolderPath)){
	console.log(`Deleting old folder: ${destinationFolderPath}`);
	deleteDirectorySync(destinationFolderPath);
}

console.log(`Extracting resources from: ${sourceFolderPath}`);

extractResourcesToCorrespondingDirectoryStructure(sourceFolderPath, destinationFolderPath);

