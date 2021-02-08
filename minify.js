const { minify } = require("terser");
const { readdirSync, statSync, writeFileSync, readFileSync } = require("fs");
const { join, resolve } = require("path");

function getAllFiles({ path, arrayOfFiles = [] }) {
  let files = readdirSync(path);

  files.forEach((file) => {
    if (statSync(`${path}/${file}`).isDirectory()) {
      arrayOfFiles = getAllFiles({ path: `${path}/${file}`, arrayOfFiles });
    } else {
      if (file.match(/\.js$/)) {
        arrayOfFiles.push(join(resolve(), `${path}/${file}`));
      }
    }
  });

  return arrayOfFiles;
}

function minifyFiles(filePaths) {
  filePaths.forEach(async (filePath) => {
    let mini = await minify(readFileSync(filePath, "utf8"));
    let minicode = mini.code;
    writeFileSync(filePath, minicode);
  });
}

const libFiles = getAllFiles({ path: "./lib" });

minifyFiles(libFiles);
