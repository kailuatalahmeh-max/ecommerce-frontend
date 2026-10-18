import { PLACEHOLDER_IMAGE } from "./constants";

export function getFirstImageUrl(item) {
  if (item?.images && item.images.length > 0) {
    return item.images[0].imageURL;
  }

  return PLACEHOLDER_IMAGE;
}

export function getAllImageUrls(item) {
  if (item?.images && item.images.length > 0) {
    return item.images.map((img) => img.imageURL);
  }

  return [PLACEHOLDER_IMAGE];
}
