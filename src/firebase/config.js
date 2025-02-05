import { Client, ID, Storage } from "appwrite";

const client = new Client()
  .setEndpoint("https://cloud.appwrite.io/v1")
  .setProject("67a3644b00276dd51def");

const storage = new Storage(client);

export const uploadFile = (file) => {
  const promise = storage.createFile(
    "67a3659800104b283ec6",
    ID.unique(),
    file
  );
  return promise.then(
    function (response) {
      return response
    },
    function (error) {
      console.log(error); // Failure
    }
  );
};
