console.log("🔄 Replacing image paths with jsDelivr URLs...");

const fs = require("fs");
const path = require("path");

const username = "samuelkiszka";    // GitHub username
const repo = "tiblog";              // repo name

// Get commit SHA from environment variable or fallback to branch
const commitSHA = process.env.COMMIT_SHA || "gh-pages";


const root = path.join(__dirname, "../_site");

function replaceInFile(filePath) {
  let content = fs.readFileSync(filePath, "utf8");

  const regexSrc = new RegExp(
    `src=(["'])\\/?(tiblog)(\\/[^"']*)\\1`,
    "g"
  );
  content = content.replace(regexSrc, (_, quote, folder, imgPath) => {
    // console.log(`Replacing image : src='${imgPath}'`);
    return `src=${quote}https://cdn.jsdelivr.net/gh/${username}/${repo}@${commitSHA}${imgPath}${quote}`;
  });

  const regexUrl = new RegExp(
    `url\\((["'])\\/?(tiblog)(\\/[^"']*)\\1`,
    "g"
  );
  content = content.replace(regexUrl, (_, quote, folder, imgPath) => {
    // console.log(`Replacing image: url(${imgPath})`);
    return `url(${quote}https://cdn.jsdelivr.net/gh/${username}/${repo}@${commitSHA}${imgPath}${quote}`;
  });


  fs.writeFileSync(filePath, content, "utf8");
}

function walkDir(dir) {
  fs.readdirSync(dir).forEach((file) => {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      walkDir(fullPath);
    } else if (fullPath.endsWith(".html") || fullPath.endsWith(".css")) {
      replaceInFile(fullPath);
    }
  });
}

walkDir(root);
console.log("✅ Replacing image paths with jsDelivr URLs done.");
