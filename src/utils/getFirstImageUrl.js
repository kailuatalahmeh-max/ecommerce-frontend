import { PLACEHOLDER_IMAGE } from "./constants";

export function getFirstImageUrl(item) {
  if (item?.images && item.images.length > 0) {
    return item.images[0].imageURL;
  }

  if (item?.imageURL) {
    return item.imageURL;
  }

  return PLACEHOLDER_IMAGE;
}

export function getAllImageUrls(item) {
  if (item?.images && item.images.length > 0) {
    return item.images.map((img) => img.imageURL);
  }

  if (item?.imageURL) {
    return [item.imageURL];
  }

  return [PLACEHOLDER_IMAGE];
}
