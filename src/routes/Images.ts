import { Router } from "express";
import Jimp from "jimp";
import path from "path";
import StatusCodes from "http-status-codes";

const { BAD_REQUEST } = StatusCodes;

const router = Router();

router.get("/", function (req, res, next) {
  const imagePath = path.join(__dirname, "../public/images/");
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
