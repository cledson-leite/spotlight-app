import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { Webhook } from "svix"
import {api} from "./_generated/api"

const http = httpRouter()

http.route({
  path: "/clerk-webhook",
  method: "POST",
  handler: httpAction(async (ctx, req) => {
    const webhookSecret = process.env.CLERK_WEBHOOK_SECRET
    if(!webhookSecret) {
      throw new Error("CLERK_WEBHOOK_SECRET não encontrado")
    }
    const svix_id = req.headers.get("svix-id")
    const svix_signature = req.headers.get("svix-signature")
    const svix_timestamp = req.headers.get("svix-timestamp")
    if(!svix_id || !svix_timestamp || !svix_signature) {
      return new Response("Cabeçalho não encontrado: svix-id, svix-timestamp e svix-signature-required", {
        status: 400
      })
    }
    const payload = await req.json()
    const body = JSON.stringify(payload)

    const wh = new Webhook(webhookSecret)
    let event
    try {
      event = wh.verify(body, {"svix-id":svix_id, "svix-signature":  svix_signature,"svix-timestamp": svix_timestamp}) as any
    }catch(e) {
      console.log('Error ao processar webhook', e)
      return new Response("Erro ao processar webhook", {
        status: 400
      })
    }
    const eventType = event.type

    if(eventType === "user.created") {
      const {id, email_addresses, first_name, last_name, image_url} = event.data
      const email = email_addresses[0].email_address
      const fullname = `${first_name || ""} ${last_name || ""}`.trim()
      const username = email.split("@")[0]

      try {
        await ctx.runMutation(api.user.createUser, {clerkId: id, email, fullname, image: image_url, username})
      }catch(e) {
        console.log('Error ao criar usuario', e)
        return new Response("Error ao criar usuario", {
          status: 500
        })
      }
    }
    return new Response("Usuario processado com sucesso", {
      status: 201
    })
  })
})

export default http