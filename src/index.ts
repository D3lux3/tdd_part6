import fs from "fs";

const filePath = process.argv[2];
const iterations = Number(process.argv[3]) || undefined;

if (!filePath || !iterations) {
    throw new Error("Please provide a file path and iterations");
}


const fileContent = fs.readFileSync(filePath, "utf-8");
const lines = fileContent.replace(/\r\n/g, "\n").split("\n");
lines.forEach((line) => {
    console.log(line);
});