const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const Admin = require("../Model/Admin");
require("dotenv").config();

const setupAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("Connected to MongoDB");

    const adminId = process.env.ADMIN_ID;
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminId || !adminPassword) {
      console.error(
        "ADMIN_ID and ADMIN_PASSWORD must be set in environment variables"
      );
      process.exit(1);
    }

    const existingAdmin = await Admin.findOne({ username: adminId });

    if (existingAdmin) {
      console.log("Admin already exists. Updating password...");

      const saltRounds = 12;
      const hashedPassword = await bcrypt.hash(adminPassword, saltRounds);

      existingAdmin.password = hashedPassword;
      await existingAdmin.save();

      console.log("Admin password updated successfully!");
    } else {
      const saltRounds = 12;
      const hashedPassword = await bcrypt.hash(adminPassword, saltRounds);

      const admin = new Admin({
        username: adminId,
        password: hashedPassword,
      });

      await admin.save();
      console.log("Admin created successfully!");
    }

    console.log(`Admin username: ${adminId}`);
    console.log("Admin setup completed successfully!");
  } catch (error) {
    console.error("Error setting up admin:", error);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB");
    process.exit(0);
  }
};

setupAdmin();
