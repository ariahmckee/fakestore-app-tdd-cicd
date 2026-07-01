import { useState } from "react";

const FALLBACK_IMAGE =
  "https://placehold.co/400x400/f7f3ef/3e2f23?text=Image+Unavailable";

function ProductImage({ src, alt, className = "", style = {} }) {
  const [imageSrc, setImageSrc] = useState(src || FALLBACK_IMAGE);

  return (
    <img
      src={imageSrc}
      alt={alt}
      className={className}
      style={style}
      onError={() => setImageSrc(FALLBACK_IMAGE)}
    />
  );
}

export default ProductImage;
