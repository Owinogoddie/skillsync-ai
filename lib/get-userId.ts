import { auth } from "@clerk/nextjs/server";

export const getUserId = async () => {
  const { userId } = auth();
  return userId;
};
