import { Link } from "react-router-dom";

import styles from "./itemList.module.css";
export default function ItemList({ _id, imageURL, itemName }) {
  return (
    <Link to={`/itemDetails/${_id}`} className={styles.itemCard}>
      <img src={imageURL} alt={itemName} />
      <span>{itemName}</span>
    </Link>
  );
}
