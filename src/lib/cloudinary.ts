import { CLOUDINARY_CLOUD_NAME } from "@/constants";
import { Cloudinary } from "@cloudinary/url-gen";
import { dpr, format, quality } from "@cloudinary/url-gen/actions/delivery";
import { source } from "@cloudinary/url-gen/actions/overlay";
import { fill } from "@cloudinary/url-gen/actions/resize";
import { compass } from "@cloudinary/url-gen/qualifiers/gravity";
import { Position } from "@cloudinary/url-gen/qualifiers/position";
import { text } from "@cloudinary/url-gen/qualifiers/source";
import { TextStyle } from "@cloudinary/url-gen/qualifiers/textStyle";

const cld = new Cloudinary({ cloud: { cloudName: CLOUDINARY_CLOUD_NAME } });

export const bannerPhoto = (imageCldPublic: string, name: string) =>
  cld
    .image(imageCldPublic)
    .resize(fill().width(1200).height(297)) // Aspect ratio 5:1
    // Optimize for web
    .delivery(format("auto"))
    .delivery(quality("auto"))
    .delivery(dpr("auto"))
    // Text overlay with name
    .overlay(
      source(
        text(name, new TextStyle("roboto", 42).fontWeight("bold")).textColor(
          "white",
        ),
      ).position(
        new Position()
          .gravity(compass("south_west"))
          .offsetY(0.2)
          .offsetX(0.02),
      ),
    );

// export const bannerPhoto = (imageCldPublic: string, name: string) =>
//   cld
//     .image(imageCldPublic)
//     .resize(fill()) // Aspect ratio 5:1
//     // Optimize for web
//     .delivery(format("auto"))
//     .delivery(quality("auto"))
//     .delivery(dpr("auto"))
//     // Text overlay with name
//     .overlay(
//       source(
//         text(name, new TextStyle("roboto", 100).fontWeight("bold")).textColor(
//           "white",
//         ),
//       ).position(new Position().gravity(compass("west")).offsetX(0.02)),
//     );
