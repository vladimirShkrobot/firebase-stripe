import express from "express";
import Stripe from "stripe";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

const PORT = process.env.PORT || 5000;
const app = express();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

app.use(express.json());
app.use(cors({ origin: "http://localhost:3000" }));

app.post("/create-payment-intent", async (req, res) => {
  const { paymentMethodId, amount } = req.body;
  console.log(paymentMethodId, amount);
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: "usd",
    });

    res.send({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    if (typeof error === "object" && error !== null && "message" in error) {
      res.status(500).send({ error: error.message });
    }
  }
});

app.post("/create-setup-intent", async (req, res) => {
  const { email } = req.body;

  try {
    // Проверьте, существует ли клиент с таким email
    let customer = (await stripe.customers.list({ email })).data[0];

    // Если клиента нет, создайте его
    if (!customer) {
      customer = await stripe.customers.create({ email });
    }

    // Создайте SetupIntent для клиента
    const setupIntent = await stripe.setupIntents.create({
      customer: customer.id,
    });

    res.send({
      clientSecret: setupIntent.client_secret,
      customerId: customer.id,
    });
  } catch (error: any) {
    res.status(500).send({ error: error.message });
  }
});

app.post("/save-payment-method", async (req, res) => {
  const { customerId, paymentMethodId } = req.body;

  try {
    // Привязка метода оплаты к клиенту
    await stripe.paymentMethods.attach(paymentMethodId, {
      customer: customerId,
    });

    // Установите метод оплаты по умолчанию
    await stripe.customers.update(customerId, {
      invoice_settings: {
        default_payment_method: paymentMethodId,
      },
    });

    res.send({ success: true });
  } catch (error: any) {
    res.status(500).send({ error: error.message });
  }
});

app.post("/create-payment-intent", async (req, res) => {
  const { email, amount } = req.body;

  try {
    // Найдите клиента по email
    const customers = await stripe.customers.list({ email });
    const customer = customers.data[0];

    if (!customer) {
      throw new Error("Customer not found");
    }

    // Получите связанные методы оплаты
    const paymentMethods = await stripe.paymentMethods.list({
      customer: customer.id,
      type: "card",
    });

    const paymentMethodId = paymentMethods.data[0].id;

    // Создайте PaymentIntent и подтвердите его
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: "usd",
      customer: customer.id,
      payment_method: paymentMethodId,
      off_session: true,
      confirm: true,
    });

    res.send({ success: true, paymentIntent });
  } catch (error: any) {
    res.status(500).send({ error: error.message });
  }
});

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
