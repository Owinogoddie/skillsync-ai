import { auth, currentUser } from "@clerk/nextjs/server";
export const getUserId2 = async () => {
  const userId = "clwn1ur7o0000zsgw58hg4mlz";
  return userId;
};

export const getUserId = async () => {
  const { userId } = auth();
  // const session = await auth();

  // const userId = session?.user.id;
  return userId;
};
