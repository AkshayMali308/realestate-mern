import dotenv from "dotenv";
import connectDB from "../config/db.js";
import User from "../models/User.js";
import Property from "../models/Property.js";
import Favorite from "../models/Favorite.js";
import Inquiry from "../models/Inquiry.js";
import { users, generateProperties } from "./seedData.js";

dotenv.config();
await connectDB();

const importData = async () => {
  try {
    await Inquiry.deleteMany();
    await Favorite.deleteMany();
    await Property.deleteMany();
    await User.deleteMany();

    const createdUsers = await User.create(users);
    const ownerIds = createdUsers.filter((u) => u.role !== "buyer").map((u) => u._id);

    const properties = generateProperties(ownerIds);
    await Property.create(properties);

    console.log(`Seeded ${createdUsers.length} users and ${properties.length} properties.`);
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await Inquiry.deleteMany();
    await Favorite.deleteMany();
    await Property.deleteMany();
    await User.deleteMany();
    console.log("Data destroyed.");
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

if (process.argv[2] === "-d") {
  destroyData();
} else {
  importData();
}
