// src/lib/formParser.js
import Busboy from "busboy";

export function parseFormData(buffer, boundary) {
  return new Promise((resolve, reject) => {
    const fields = {};
    const files = {};

    const busboy = Busboy({
      headers: {
        "content-type": `multipart/form-data; boundary=${boundary}`,
      },
    });

    busboy.on("field", (name, value) => {
      fields[name] = value;
    });

    busboy.on("file", (name, file, info) => {
      const { filename, encoding, mimeType } = info;
      const chunks = [];

      file.on("data", (data) => {
        chunks.push(data);
      });

      file.on("end", () => {
        files[name] = {
          originalname: filename,
          buffer: Buffer.concat(chunks),
          encoding,
          mimetype: mimeType,
        };
      });
    });

    busboy.on("finish", () => {
      resolve({ fields, files });
    });

    busboy.on("error", (err) => {
      reject(err);
    });

    busboy.end(buffer);
  });
}
