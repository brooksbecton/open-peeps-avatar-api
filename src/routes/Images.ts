import { Router } from "express";
import Jimp from "jimp";
import path from "path";
import StatusCodes from "http-status-codes";
import fs from "fs";
const { INTERNAL_SERVER_ERROR, BAD_REQUEST, OK } = StatusCodes;

const router = Router();
const imagePath = path.join(__dirname, "../public/images/");

const removePNGExtension = (s: string) => s.slice(0, s.length - 4);

router.get("/info", function (req, res, next) {
  const faces = fs.readdirSync(imagePath + "faces").map(removePNGExtension);
  const heads = fs.readdirSync(imagePath + "heads").map(removePNGExtension);
  res.json({ faces, heads });
});

router.get("/", function (req, res, next) {
  const requestedHead = req.query.head;
  const requestedFace = req.query.face;

  const headName = `heads/${requestedHead}.png`;
  const faceName = `faces/${requestedFace}.png`;
  const fileName = `${requestedHead}${requestedFace}.png`;

  // Load in images
  Jimp.read(imagePath + headName)
    .then((headImage) => {
      Jimp.read(imagePath + faceName)
        .then((faceImage) => {
          headImage
            //Combine Images
            .composite(faceImage, 0, 0, {
              mode: Jimp.BLEND_MULTIPLY,
              opacitySource: 1,
              opacityDest: 1,
            })
            // Write Combined Image file
            .writeAsync(`${imagePath}/generated/${fileName}`)
            .then(() => {
              var options = {
                root: path.join(__dirname, "../public/images/generated/"),
                dotfiles: "deny",
                headers: {
                  "x-timestamp": Date.now(),
                  "x-sent": true,
                },
              };

              res.sendFile(fileName, options, function (err) {
                if (err) {
                  next(err);
                } else {
                  console.log("Sent:", fileName);
                }
              });
            });
        })
        .catch(() => {
          // Bad Face Image
          res.sendStatus(BAD_REQUEST);
        });
    })
    .catch(() => {
      // Bad Head Image
      res.sendStatus(BAD_REQUEST);
    });
});

export default router;
