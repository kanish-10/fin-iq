/* eslint-disable camelcase */
// app/api/webhook/route.ts
import {Webhook} from "svix";
import {headers} from "next/headers";
import {WebhookEvent} from "@clerk/nextjs/server";
import {db} from "@/lib/prisma";

export async function POST(req: Request) {
  // Get the webhook secret from your environment variables
  const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    throw new Error(
      "Please add WEBHOOK_SECRET from Clerk Dashboard to .env or .env.local",
    );
  }

  // Get the headers
  const headerPayload = await headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response("Error occured -- no svix headers", {
      status: 400,
    });
  }

  // Get the body
  const payload = await req.json();
  const body = JSON.stringify(payload);

  // Create a new Svix instance with your secret.
  const wh = new Webhook(WEBHOOK_SECRET);

  let evt: WebhookEvent;

  // Verify the payload
  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error("Error verifying webhook:", err);
    return new Response("Error occured", {
      status: 400,
    });
  }

  // Handle the event
  switch (evt.type) {
    case "user.created": {
      const {
        id: clerkId,
        email_addresses,
        first_name,
        last_name,
        image_url,
      } = evt.data;

      await db.user.create({
        data: {
          clerkId,
          email: email_addresses[0].email_address,
          firstName: first_name || "",
          lastName: last_name || "",
          profileImage: image_url || "",
        },
      });
      break;
    }

    case "user.updated": {
      const {
        id: clerkId,
        email_addresses,
        first_name,
        last_name,
        image_url,
      } = evt.data;

      await db.user.update({
        where: { clerkId },
        data: {
          email: email_addresses[0].email_address,
          firstName: first_name || "",
          lastName: last_name || "",
          profileImage: image_url || "",
        },
      });
      break;
    }

    case "user.deleted": {
      const { id: clerkId } = evt.data;

      await db.user.delete({
        where: { clerkId },
      });
      break;
    }
  }

  return new Response("Webhook processed successfully", { status: 200 });
}
