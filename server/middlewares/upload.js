import fs from "fs";
import { google } from "googleapis";
import apikey from "../apikey.json";

async function authorize() {
  const jwtClient = new google.auth.JWT(
    apikey.client_email,
    null,
    apikey.private_key,
    process.env.SCOPE
  );
  await jwtClient.authorize();
  return jwtClient;
}

export async function uploadFile(authClient) {
  return new Promise((resolve, reject) => {
    const drive = google.drive({ version: "v3", auth: authClient });

    const fileMetaData = {
      name: "myimage.jpg",
      parents: [""],
    };
  });
}
