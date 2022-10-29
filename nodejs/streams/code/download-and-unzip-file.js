/*
    GOAL: write a file to a temporary file and unpack it
*/

const StreamZip = require("node-stream-zip");
const tmp = require("tmp");
const fs = require("fs");

const duplicateFile = async (sourcePath, targetPath) => {
    const rs = fs.createReadStream(sourcePath);
    const ws = fs.createWriteStream(targetPath);

    rs.on("data", (chunk) => {
        ws.write(chunk);
    });

    rs.on("end", () => {
        rs.close();
        ws.close();
    });

    ws.on("close", async () => {
        unzipFileToStdout(targetPath);
    });
};


const unzipFileToStdout = async (sourcePath) => {
    console.log(sourcePath);
    const zip = new StreamZip.async({ file: sourcePath  });
    const entryData = await zip.entries()
    
    for (const entry of Object.values(entryData)) {
        if (!entry.isFile) continue;
        
        const zipStream = await zip.stream(entry);
        console.log(`ENTRY ${entry.name}\nCONTENTS:`);
        zipStream.pipe(process.stdout);
        }
    }

const main = async () => {
    const tmpObj = tmp.fileSync({ mode: 0644, postfix: '.zip' });
    await duplicateFile("../assets/archive.zip", tmpObj.name);
}

(async () => {
    await main()
})();