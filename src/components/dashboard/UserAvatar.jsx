"use client";

import React, { useState } from "react";

export default function Avatar({ src, name, size = 32 }) {
  const [imgError, setImgError] = useState(false);

  const initial = name ? name.charAt(0).toUpperCase() : "?";

  return imgError || !src ? (
    <div
      className="flex items-center justify-center bg-primary text-white rounded-full font-bold"
      style={{ width: size, height: size, fontSize: size / 2 }}
    >
      {initial}
    </div>
  ) : (
    <img
      src={src}
      alt={name}
      className="rounded-full"
      style={{ width: size, height: size, objectFit: "cover" }}
      onError={() => setImgError(true)}
    />
  );
}