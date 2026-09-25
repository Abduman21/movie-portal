import { useState } from "react";
import { imageUrl } from "../services/movieApi";
import Icon from "./Icon";

export default function MovieImage({
  path,
  title,
  backdrop = false,
  eager = false,
  className = "",
}) {
  const [failedPath, setFailedPath] = useState(null);
  return path && failedPath !== path ? (
    <img
      className={className}
      src={imageUrl(path, backdrop ? "w1280" : "w500")}
      alt={backdrop ? "" : `${title} poster`}
      loading={eager ? "eager" : "lazy"}
      onError={() => setFailedPath(path)}
    />
  ) : (
    <div
      className={`image-fallback ${className}`}
      role={backdrop ? undefined : "img"}
      aria-label={backdrop ? undefined : `${title}: poster unavailable`}
    >
      <Icon name="film" size={40} />
      {!backdrop && <span>Poster unavailable</span>}
    </div>
  );
}
