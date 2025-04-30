"use server"
import { clerkClient, currentUser } from '@clerk/nextjs/server'
import {prisma} from "@/lib/prisma";

export async function syncClerkUserToDb() {
  const user:any = await currentUser()
  const isDoctor = user.privateMetadata?.doctor;

  if (!user || !user.id) return null

  let existingUser = await prisma.user.findUnique({
    where: { clerkId: user.id },
  })

  if (existingUser) {
    existingUser = await prisma.user.update({
        where:{
            clerkId: user.id
        },
        data:{
            isDoctor: isDoctor
        }
    })
    return existingUser;
  }

  return await prisma.user.create({
    data: {
      clerkId: user.id,
      email: user.emailAddresses[0].emailAddress,
      name: user.firstName + ' ' + user.lastName,
    },
  })
}


export async function checkDoctorMetadata(): Promise<boolean> {
    const user = await currentUser();
  
    if (!user) return false;
    const isDoctor = user.privateMetadata?.doctor;
    console.log("isDoctor:"+isDoctor)
  
    return Boolean(isDoctor); 
  }

  export async function setDoctorMetadata(isDoctor: boolean) {
    try {
      const user = await currentUser();
        console.log("isDoctor" + isDoctor);
      if (!user || !user.id) {
        console.error("No logged-in user found");
        return;
      }
  
      // Update Clerk metadata
      await clerkClient?.users?.updateUser(user.id, {
        privateMetadata: {
          doctor: isDoctor,
        },
      });
  
      // Update your local Prisma database
      await prisma.user.update({
        where: { clerkId: user.id }, // adjust field if your DB uses another name
        data: { isDoctor },
      });
  
      console.log(`User ${user.id} doctor status set to: ${isDoctor}`);
    } catch (error) {
      console.error("Error updating doctor metadata:", error);
    }
  }