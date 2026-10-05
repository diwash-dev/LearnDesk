import { prisma } from "../server.js";

export const getCatalog = async (req, res) => {
  try {
    const semesters = await prisma.semester.findMany({
      orderBy: {
        number: "asc",
      },
      include: {
        subjects: {
          orderBy: {
            name: "asc",
          },
        },
      },
    });

    res.json(semesters);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to fetch catalog",
    });
  }
};
