const express = require("express");
require("dotenv").config({ path: "c:/xampp/Fullstack-Project-TI/backend/.env" });
const upload = require("./src/middlewares/uploadMiddleware");

const app = express();
app.post("/test-upload", (req, res) => {
  upload.single("image")(req, res, function (err) {
    if (err) {
      console.error("Multer Error:", err);
      return res.status(500).json({ error: err.message, stack: err.stack });
    }
    console.log("File uploaded:", req.file);
    res.json({ file: req.file });
  });
});

const server = app.listen(5001, async () => {
  console.log("Test server running on 5001");
  try {
    const fs = require("fs");
    
    const formData = new FormData();
    const blob = new Blob([fs.readFileSync("c:/xampp/Fullstack-Project-TI/frontend/public/hero_banner.png")], { type: "image/png" });
    formData.append("image", blob, "hero_banner.png");

    const response = await fetch("http://localhost:5001/test-upload", {
      method: "POST",
      body: formData
    });
    const data = await response.json();
    console.log("Success:", data);
  } catch (error) {
    console.error("Fetch Error:", error);
  } finally {
    server.close();
  }
});
