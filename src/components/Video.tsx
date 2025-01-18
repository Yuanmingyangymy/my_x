"use client";
import { IKVideo } from "imagekitio-next";

const urlEndpoint = process.env.NEXT_PUBLIC_URL_ENDPOINT;

export default function Video({
  path,
  className,
}: {
  path: string;
  className?: string;
}) {
  return (
    <IKVideo
      urlEndpoint={urlEndpoint}
      path={path}
      className={className}
      controls
      transformation={[{ width: "1920", height: "1080", q: "90" }]}
    />
  );
}
