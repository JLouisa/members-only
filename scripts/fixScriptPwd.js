#! /usr/bin/env node
console.log("This script fix the password of the users with bcryptjs in the database.");

const UserCollection = require("../models/userModel");
const dotenv = require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

mongoose.set("strictQuery", false); // Prepare for Mongoose 7

//! MongoDB Setup
const mongoInit = process.env.MONGODB_INIT;
const cluster = process.env.MONGODB_CLUSTER;
const clusterID = process.env.MONGODB_CLUSTERID;
const database = process.env.MONGODB_DB;
const mongoHost = process.env.MONGODB_HOST;
const mongoUser = encodeURIComponent(process.env.MONGODB_USER);
const mongoPass = encodeURIComponent(process.env.MONGODB_PASS);

const mongoDB =
  process.env.MONGODB_URI || `${mongoInit}${mongoUser}:${mongoPass}@${cluster}${clusterID}${database}${mongoHost}`;

main().catch((err) => console.log(err));

//! Generate the data
async function main() {
  console.log("Debug: About to connect");
  await mongoose.connect(mongoDB);
  console.log("Debug: Should be connected?");
  await editAndSave();
  console.log("Debug: Closing mongoose");
  mongoose.connection.close();
}

async function editAndSave() {
  const users = await UserCollection.find({}).exec();
  const promises = users.map(async (user) => {
    return new Promise((resolve, reject) => {
      bcrypt.hash(user.password, +process.env.HASH_NUM, (err, hashedPassword) => {
        if (err) {
          return reject(err);
        }
        UserCollection.findOneAndUpdate({ _id: user._id }, { password: hashedPassword })
          .then(() => {
            console.log(`${user.firstName} password was updated.`);
            resolve();
          })
          .catch(reject);
      });
    });
  });

  try {
    await Promise.all(promises);
  } catch (err) {
    console.error("Error updating passwords:", err);
  }
}
