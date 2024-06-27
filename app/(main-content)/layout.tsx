import db from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import React from "react";

const Layout = async ({ children }: { children: React.ReactNode }) => {
  const { userId } = auth();
  if (!userId) {
    return redirect("/");
  }
  let user = await db.user.findUnique({ where: { id: userId } });
  if (!user) {
    // console.log(`User not found in DB. Fetching details from Clerk for userId: ${userId}`);
    // const response = await fetch(`https://api.clerk.dev/v1/users/${userId}`, {
    //   headers: {
    //     Authorization: `Bearer ${process.env.CLERK_API_KEY}`,
    //   },
    // });
    // if (!response.ok) {
    //   console.error(`Failed to fetch Clerk user for userId: ${userId}`);
    //   throw new Error('Failed to fetch Clerk user');
    // }
    // const clerkUser = await response.json();
    // console.log(`Fetched Clerk user details for userId: ${userId}`, clerkUser);
    user = await db.user.create({
      data: {
        id: userId,
        // email: clerkUser.email_addresses[0].email_address,
        // Add any other necessary user fields
      },
    });
    // console.log(`Created new user in DB for userId: ${userId}`);
  } else {
    // console.log(`User already exists in DB for userId: ${userId}`);
  }
  return <div>{children}</div>;
};

export default Layout;
