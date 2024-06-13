import prisma from "@/lib/db";

export const getTwoFactorConfirmationByUserId = async (userId: string) => {
  try {
    const twofactorConfirmation = await prisma.twoFactorConfirmation.findUnique(
      { where: { userId } }
    );
    return twofactorConfirmation
  } catch {
    return null;
  }
};
