const fs = require("fs");

const path = "android/app/build.gradle";

function getNewVersionCode(versionCode) {
  return versionCode ? versionCode + 1 : 1;
}

function tryReadFile(path) {
  try {
    return fs.readFileSync(path, "utf8");
  } catch (err) {
    throw new Error(`File could not be read at ${path}`);
  }
}

function updateVersionName(file, version) {
  console.log(`Version name is now ${version}`);
  return file.replace(/versionName (["'])(.*)["']/, "versionName $1" + version + "$1");
}

function updateVersionCode(gradleFile) {
  return gradleFile.replace(/versionCode (\d+)/, function (
    _,
    oldVersionName
  ) {
    const newCode = getNewVersionCode(parseInt(oldVersionName, 10));
    console.log(`Version code is now ${newCode}`);
    return "versionCode " + newCode;
  });
}

function incrementAndroid(newVersion) {
  let gradleFile;

  gradleFile = tryReadFile(path)
  gradleFile = updateVersionName(gradleFile, newVersion);
  gradleFile = updateVersionCode(gradleFile, newVersion);

  fs.writeFileSync(path, gradleFile);
}

module.exports = incrementAndroid
