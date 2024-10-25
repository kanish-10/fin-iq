/* eslint-disable camelcase */
import {Webhook} from "svix";
import {headers} from "next/headers";
import {WebhookEvent} from "@clerk/nextjs/server";
import {db} from "@/lib/prisma"; // Ensure Prisma client is imported
import {NextResponse} from "next/server";

export async function POST(req: Request) {
  const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    throw new Error(
      "Please add WEBHOOK_SECRET from Clerk Dashboard to .env or .env.local",
    );
  }

  // Get Svix headers for verification
  const headerPayload = await headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  if (!svix_id || !svix_timestamp || !svix_signature) {
    console.error("Missing Svix headers");
    return NextResponse.json(
      { error: "Missing Svix headers" },
      { status: 400 },
    );
  }

  // Parse the JSON payload
  const payload = await req.json();
  const body = JSON.stringify(payload);

  // Initialize Svix webhook verification
  const wh = new Webhook(WEBHOOK_SECRET);
  let evt: WebhookEvent;

  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
    console.log("Verification successful");
  } catch (err) {
    console.error("Error verifying webhook:", err);
    return NextResponse.json({ error: "Verification failed" }, { status: 400 });
  }

  // Process event types
  const eventType = evt.type;
  console.log(`Received event type: ${eventType}`);

  try {
    if (eventType === "user.created") {
      const {
        id: clerkId,
        email_addresses,
        first_name,
        last_name,
        image_url,
      } = evt.data;

      console.log("User created event data:", evt.data);

      const newUser = await db.user.create({
        data: {
          clerkId,
          email: email_addresses[0].email_address,
          firstName: first_name,
          lastName: last_name,
          profileImage: image_url,
        },
      });

      return NextResponse.json({
        message: "User created in Supabase",
        user: newUser,
      });
    }

    if (eventType === "user.updated") {
      const {
        id: clerkId,
        email_addresses,
        first_name,
        last_name,
        image_url,
      } = evt.data;

      console.log("User updated event data:", evt.data);

      const updatedUser = await db.user.update({
        where: { clerkId },
        data: {
          email: email_addresses[0].email_address,
          firstName: first_name,
          lastName: last_name,
          profileImage: image_url,
        },
      });

      return NextResponse.json({
        message: "User updated in Supabase",
        user: updatedUser,
      });
    }

    if (eventType === "user.deleted") {
      const { id: clerkId } = evt.data;

      console.log("User deleted event data:", evt.data);

      const deletedUser = await db.user.delete({
        where: { clerkId },
      });

      return NextResponse.json({
        message: "User deleted from Supabase",
        user: deletedUser,
      });
    }
  } catch (error) {
    console.error("Error handling event:", error);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }

  return NextResponse.json({ message: "Event not handled" });
}
