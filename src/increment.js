#!/usr/bin/env node

const { execSync } = require("child_process");
const { exit } = require("process");
const incrementAndroid = require("./android.js");
const incrementIOS = require("./ios.js");

function logError(message) {
  console.log('\x1b[31m%s\x1b[0m', message);  //red
}

function usage() {
  console.log(
    "Making new version",
    "\n",
    "\n",
    "-h --help",
    "\n",
    "--bundle={bundle}",
    "\n",
    "--version={vx.x.x}",
    "\n",
    "--patch",
    "\n",
    "--minor",
    "\n",
    "--major",
    "\n",
    "\n"
  )
}

function tryExec(command) {
  try {
    return execSync(command, { encoding: 'utf8', timeout: 2000 });
  } catch (e) {
    logError(e);
    exit();
  }
}

const COMMIT = ""
const SEMVER = "patch"

const commit = tryExec("git rev-list --tags --max-count=1");

const OLDVERSION = tryExec(`git describe --tags ${commit}`);

var argv = require('minimist')(process.argv.slice(2));


if (argv["help"]) {
  usage();
  exit();
}

if (argv.hasOwnProperty("commit") && (typeof argv["commit"] !== "string" || argv["commit"] === "")) {
  logError("Commit cannot be empty");
  exit();
}

if (!argv.hasOwnProperty("bundle") || argv.hasOwnProperty("bundle") && (typeof argv["bundle"] !== "string" || argv["bundle"] === "")) {
  logError("Bundle cannot be empty");
  exit();
}

if (Object.keys(argv).filter(x => ["patch", "minor", "major"].includes(x)).length > 1) {
  logError("Cannot have more than one sementic version flag");
  exit();
}

const REGEX = new RegExp("([0-9]+).([0-9]+).([0-9]+)");

const parts = REGEX.exec(OLDVERSION);
const versionParts = {
  MAJOR: parts[1],
  MINOR: parts[2],
  PATCH: parts[3],
}

const newVersionParts = {
  MAJOR: argv["major"] ? parseInt(versionParts.MAJOR, 10) + 1 : versionParts.MAJOR,
  MINOR: argv["minor"] ? parseInt(versionParts.MINOR, 10) + 1 : (argv["major"] ? 0 : versionParts.MINOR),
  PATCH: argv["patch"] ? parseInt(versionParts.PATCH, 10) + 1 : (argv["minor"] || argv["major"] ? 0 : versionParts.PATCH),
}

const NEWVERSION = argv["version"] || `${newVersionParts.MAJOR}.${newVersionParts.MINOR}.${newVersionParts.PATCH}`

console.log(
  "\n",
  "Updating version number\n",
  "==========================================\n",
  `${OLDVERSION.trim()} -> v${NEWVERSION}\n`,
  "==========================================\n",
);

console.log("Android");
incrementAndroid(NEWVERSION)
console.log("");

console.log("IOS");
incrementIOS(NEWVERSION, argv["bundle"])
console.log("");

console.log("npm");
tryExec(`npm version --new-version v${NEWVERSION} --no-git-tag-version --allow-same-version`)
console.log(`package.json version is now ${NEWVERSION}`);
