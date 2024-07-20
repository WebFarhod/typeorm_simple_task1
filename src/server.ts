import "reflect-metadata";
import app from "./app";
import { AppDataSource } from "./config";
import User from "./entities/User";
import bcrypt from "bcrypt";

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  try {
    await AppDataSource.initialize();
    const userRepository = AppDataSource.getRepository(User);
    const adminUser = await userRepository.findOneBy({ username: "admin" });
    if (!adminUser) {
      const hashedPassword = await bcrypt.hash("admin", 10);
      const newUser = userRepository.create({
        username: "admin",
        password: hashedPassword,
      });
      await userRepository.save(newUser);
    }
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
};

startServer();
