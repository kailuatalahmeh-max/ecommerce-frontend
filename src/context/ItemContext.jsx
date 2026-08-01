import { createContext, useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const ItemContext = createContext();

const apiUrl = import.meta.env.VITE_API_URL;

export default function ItemProvider({ children }) {
  const [itemsData, setItemsData] = useState([]);

  useEffect(() => {
    axios
      .get(`${apiUrl}/api/getItemsData`)
      .then((response) => {
        setItemsData(
          Array.isArray(response.data.itemsData) ? response.data.itemsData : [],
        );
      })
      .catch((err) => {
        const serverErrorMessage = err.response?.data?.message;
        toast.error(serverErrorMessage || "فشل جلب البيانات!");
      });
  }, []);

  return (
    <ItemContext.Provider value={{ itemsData, setItemsData }}>
      {children}
    </ItemContext.Provider>
  );
}

export { ItemContext };
