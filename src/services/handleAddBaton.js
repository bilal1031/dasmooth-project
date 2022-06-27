import { collection, addDoc, getFirestore } from "firebase/firestore";
import { handleAddNotification } from "./handleAddNotification";

export const handleAddBaton = async (data) => {
  try {
    let temp = data;
    delete temp["docId"];
    const db = getFirestore();
    const docRef = await addDoc(collection(db, "batons"), temp);
    console.log("Document written with ID: ", docRef.id);
    return docRef.id
  } catch (ex) {
    console.log(ex);
    throw new Error(ex);
  }
};
