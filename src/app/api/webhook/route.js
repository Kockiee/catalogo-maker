const stripe = require('stripe')(process.env.STRIPE_TEST_SECRET_KEY);
import { headers } from 'next/headers';
import { collection, doc, getDocs, query, updateDoc, where } from "firebase/firestore";
import { db } from '@/app/utils/firebase';

export async function POST(req) {
  const body = await req.text();
  const headersList = headers();
  const sig = headersList.get('stripe-signature');
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;

  try {
    event = stripe.webhooks.constructEvent(body, sig, endpointSecret);
  } catch (err) {
    return Response.json({message: err.message}, {status: 400});
  };

  if (event.type === "checkout.session.completed" && event.data.object.payment_status === "paid" && event.data.object.metadata.user_id) {
    const userId = event.data.object.metadata.user_id;
    const userRef = doc(db, "accounts", userId);
    await updateDoc(userRef, {
      premium: true,
      last_subscription_id: event.data.object.subscription
    });
  };

  if (event.type === "customer.subscription.deleted" && event.data.object.status === "canceled") {
    const subscriptionId = event.data.object.id;
    const q = query(collection(db, "accounts"), where("last_subscription_id", "==", subscriptionId));
    const querySnapshot = await getDocs(q);
    for(const doc of querySnapshot) {
      await updateDoc(doc.ref, {
        premium: false
      });
    }
  };

  return Response.json({status: 200});
};

// iniciar ouvinte local de webhook
// stripe trigger checkout.session.completed
// stripe listen --forward-to localhost:3000/api/webhook