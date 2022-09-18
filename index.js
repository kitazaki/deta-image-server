const { Deta } = require("deta");
const express = require("express");
const upload = require("express-fileupload");

const app = express();

app.use(upload());

const deta = Deta("Product Key");
const drive = deta.Drive("images");

app.get('/', (req, res) => {
    res.send(`
    <form action="/upload" enctype="multipart/form-data" method="post">
      <input type="file" name="file">
      <input type="submit" value="Upload">
    </form>`);
});

app.post("/upload", async (req, res) => {
    const name = req.files.file.name;
    const contents = req.files.file.data;
    const img = await drive.put(name, {data: contents});
    res.send(img);
});

app.get("/download/:name", async (req, res) => {
    const name = req.params.name;
    const img = await drive.get(name);
    const buffer = await img.arrayBuffer();
    res.type(name);
    res.send(Buffer.from(buffer));
}); 

app.listen(3000);
module.exports = app;

