import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

async function main() {
  try {
    const cats = await db.category.createMany({
      data: [
        { name: "Computer Science" },
        { name: "Music" },
        { name: "Fitness" },
        { name: "Photography" },
        { name: "Engineering" },
        { name: "Filming" },
        { name: "Accounting" },
        { name: "Law" },
        { name: "Big Data" },
      ],
    });

    console.log(cats)
  } catch (error) {
    console.log("error seeding", error);
  } finally {
    await db.$disconnect();
  }
}
main();
