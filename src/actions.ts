"use server";

import { imagekit } from "./utils";

export const shareAction = async (
  formData: FormData,
  settings: {
    type: "original" | "wide" | "square";
    sensitive: boolean;
  }
) => {
  const file = formData.get("file") as File;
  const desc = formData.get("desc") as string;
  console.log(file, desc);

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const trans = `w-600, ${
    settings.type === "square"
      ? "ar-1-1"
      : settings.type === "wide"
      ? "ar-16-9"
      : ""
  }`;

  imagekit.upload(
    {
      file: buffer, //required
      fileName: file.name, //required
      folder: "/posts",
      transformation: {
        pre: trans,
      },
      customMetadata: {
        sensitive: settings.sensitive,
      },
    },
    function (error, result) {
      if (error) console.log(error);
      else console.log(result);
    }
  );
};
