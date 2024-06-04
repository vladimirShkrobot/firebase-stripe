import express, { Request } from "express";
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

app.get(
  "/get-payment-methods",
  async (req: Request<{}, {}, {}, { email: string }>, res) => {
    const { email } = req.query;
    const customer = (await stripe.customers.list({ email })).data[0];

    if (!customer) {
      return res.status(404).send({ error: "Customer not found" });
    }

    const paymentMethods = await stripe.paymentMethods.list({
      customer: customer.id,
      type: "card",
    });

    const defaultPaymentMethodId =
      customer.invoice_settings.default_payment_method;
    res.send({
      paymentMethods: paymentMethods.data,
      defaultPaymentMethodId,
    });
  }
);

app.get("/products", async (req, res) => {
  try {
    const products = await stripe.products.list({ limit: 100 });
    const prices = await stripe.prices.list({ limit: 100 });

    const productList = products.data.map((product) => {
      const productPrices = prices.data.filter(
        (price) => price.product === product.id
      );
      return {
        ...product,
        prices: productPrices,
      };
    });

    res.send(productList);
  } catch (error: any) {
    res.status(500).send({ error: error.message });
  }
});

app.get("/products", async (req, res) => {
  try {
    const products = await stripe.products.list({ limit: 100 });
    const prices = await stripe.prices.list({ limit: 100 });

    const productList = products.data.map((product) => {
      const productPrices = prices.data.filter(
        (price) => price.product === product.id
      );
      return {
        ...product,
        prices: productPrices,
      };
    });

    res.send(productList);
  } catch (error: any) {
    res.status(500).send({ error: error.message });
  }
});

// Эндпоинт для подписки
app.post("/subscribe", async (req, res) => {
  const { email, paymentMethodId, priceId } = req.body;

  try {
    // Найдите клиента по email
    let customers = await stripe.customers.list({
      email,
      limit: 1,
    });
    let customer = customers.data[0];

    // Если клиента нет, создайте нового
    if (!customer) {
      customer = await stripe.customers.create({ email });
    }

    // Привяжите метод оплаты к клиенту
    const paymentMethod = await stripe.paymentMethods.attach(paymentMethodId, {
      customer: customer.id,
    });

    // Установите метод оплаты по умолчанию для клиента
    await stripe.customers.update(customer.id, {
      invoice_settings: {
        default_payment_method: paymentMethod.id,
      },
    });

    // Создайте подписку
    const subscription = await stripe.subscriptions.create({
      customer: customer.id,
      items: [{ price: priceId }],
      default_payment_method: paymentMethod.id,
      expand: ["latest_invoice.payment_intent"],
    });

    res.send({
      subscriptionId: subscription.id,
      status: subscription.status,
      customerId: customer.id,
      paymentMethodId: paymentMethod.id,
    });
  } catch (error: any) {
    console.log(error)
    res.status(500).send({ error: error.message });
  }
});

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
