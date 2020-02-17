import colors from "colors";

import createUser from "./user";

async function seedDatabase() {
  console.log(colors.green("Creating User"));
  await createUser({ password: "password" });

  process.exit();
}

seedDatabase();
