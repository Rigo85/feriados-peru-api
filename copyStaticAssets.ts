const shell = require("shelljs");

// shell.mkdir("dist/public/");
shell.cp("-R", "src/public/", "dist/");
