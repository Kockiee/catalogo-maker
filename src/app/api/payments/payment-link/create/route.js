import verifyJWTToken from '@/app/api/middlewares/verifyJWTToken';

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

export async function POST(req) {
  return await verifyJWTToken(req, async() => {
    const body = await req.json()
    const { uid, recurrenceType } = body;
  
    if (uid && recurrenceType && uid !== "" && recurrenceType !== "") {
      const price_id = recurrenceType === 1 ? 
      'price_1OrPUhH1tqRgYbc3wlwQf7zb' 
      : recurrenceType === 2 ? 
      'price_1OrQjSH1tqRgYbc3Imc73UUL' 
      : recurrenceType === 3 &&
      'price_1P6HsiH1tqRgYbc3qTmjXtir'
      
      const paymentLinks = await stripe.paymentLinks.list();
  
      for (let i = 0; i < paymentLinks.data.length; i++) {
        if (paymentLinks.data[i].metadata.user_id === uid && paymentLinks.data[i].metadata.recurrenceType === `${recurrenceType}` && paymentLinks.data[i].active) {
          return Response.json({ success: true, payment_link: paymentLinks.data[i].url }, { status: 200 });
        }
      }
  
      const paymentLink = await stripe.paymentLinks.create(recurrenceType === 1 ? 
      {
        line_items: [
          {
            price: price_id,
            quantity: 1,
          },
        ],
        metadata: {
          user_id: uid,
          recurrenceType: recurrenceType
        },
        allow_promotion_codes: true,
        after_completion: {
          type: "redirect",
          redirect: {
            url: `${process.env.NEXT_PUBLIC_SITE_URL}/dashboard/payment-finished`
          }
        },
        restrictions: {
          completed_sessions: {
            limit: 1
          }
        },
        subscription_data: {
          trial_period_days: 7
        }
      } : {
        line_items: [
          {
            price: price_id,
            quantity: 1,
          },
        ],
        metadata: {
          user_id: uid,
          recurrenceType: recurrenceType
        },
        allow_promotion_codes: true,
        after_completion: {
          type: "redirect",
          redirect: {
            url: `${process.env.NEXT_PUBLIC_SITE_URL}/dashboard/payment-finished`
          }
        },
        restrictions: {
          completed_sessions: {
            limit: 1
          }
        }
      })
  
      return Response.json({ success: true, payment_link: paymentLink.url }, { status: 201 });
    } else {
      return Response.json({ error: "Parâmetros inválidos fornecidos." }, { status: 400 });
    }
  })
}