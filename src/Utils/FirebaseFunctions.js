import { ref, set } from "firebase/database";
import { db } from "../firebase.config";

export const setRealtimeDatabase = (data) => {
  set(ref(db, `Users-Tertiary/${data.id}`), {
    id: data.id,
    emailaddress: data.emailaddress,
    firstname: data.firstname,
    lastname: data.lastname,
    course: data.course,
    yearlevel: data.yearlevel,
    urlLink: data.urlLink,
    imageId: data.imageId,
  });
};
