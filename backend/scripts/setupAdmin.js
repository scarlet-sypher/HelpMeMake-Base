const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const Admin = require("../Model/Admin");
require("dotenv").config();

const setupAdmin = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URL);
    console.log("Connected to MongoDB");

    // Get admin credentials from environment variables
    const adminId = process.env.ADMIN_ID;
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminId || !adminPassword) {
      console.error(
        "ADMIN_ID and ADMIN_PASSWORD must be set in environment variables"
      );
      process.exit(1);
    }

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ username: adminId });

    if (existingAdmin) {
      console.log("Admin already exists. Updating password...");

      // Hash the new password
      const saltRounds = 12;
      const hashedPassword = await bcrypt.hash(adminPassword, saltRounds);

      // Update existing admin
      existingAdmin.password = hashedPassword;
      await existingAdmin.save();

      console.log("Admin password updated successfully!");
    } else {
      // Hash the password
      const saltRounds = 12;
      const hashedPassword = await bcrypt.hash(adminPassword, saltRounds);

      // Create new admin
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
