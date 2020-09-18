const fs = require("fs");


function tryReadFile(path) {
  try {
    return fs.readFileSync(path, "utf8");
  } catch (err) {
    throw new Error(`File could not be read at ${path}`);
  }
}

function incrementIOS(newVersion, bundle) {
  const path = `ios/${bundle}.xcodeproj/project.pbxproj`;
  let pbxprojFile;

  pbxprojFile = tryReadFile(path)

  pbxprojFile = pbxprojFile.replace(/MARKETING_VERSION = (.*)/g, "MARKETING_VERSION = " + newVersion + ";");
  console.log(`Marketing version is now ${newVersion}`);

  fs.writeFileSync(path, pbxprojFile);
}

module.exports = incrementIOS;
