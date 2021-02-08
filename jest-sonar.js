const replace = require("replace-in-file");

async function run() {
  try {
    const regex = (path) => new RegExp(path, "gi");
    const results = await replace({
      files: "reports/test/result.xml",
      from: [
        regex("/home/ldiego/Documents/Github/micro-lambda-api"),
        regex("/home/runner/work/micro-lambda-api/micro-lambda-api"),
        regex("/Users/luisdiegopinchi/Documents/Github/micro-lambda-api"),
      ],
      to: "/github/workspace",
    });
    console.log("Replacement results:", results);
  } catch (error) {
    console.error("Error occurred:", error);
  }
}

run();
