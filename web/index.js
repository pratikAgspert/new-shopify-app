// @ts-check
import { join } from "path";
import { readFileSync } from "fs";
import express from "express";
import serveStatic from "serve-static";
import crypto from "crypto";
import axios from "axios";

import shopify from "./shopify.js";
import productCreator from "./product-creator.js";
import PrivacyWebhookHandlers from "./privacy.js";

const PORT = parseInt(
  process.env.BACKEND_PORT || process.env.PORT || "3000",
  10
);

const STATIC_PATH =
  process.env.NODE_ENV === "production"
    ? `${process.cwd()}/frontend/dist`
    : `${process.cwd()}/frontend/`;

const app = express();

// Set up Shopify authentication and webhook handling
app.get(shopify.config.auth.path, shopify.auth.begin());
app.get(
  shopify.config.auth.callbackPath,
  shopify.auth.callback(),
  shopify.redirectToShopifyOrAppRoot()
);
app.post(
  shopify.config.webhooks.path,
  shopify.processWebhooks({ webhookHandlers: PrivacyWebhookHandlers })
);

// If you are adding routes outside of the /api path, remember to
// also add a proxy rule for them in web/frontend/vite.config.js

app.use("/api/*", shopify.validateAuthenticatedSession());

app.use(express.json());

app.get("/api/knox-token", async (_req, res) => {
  const client = new shopify.api.clients.Graphql({
    session: res.locals.shopify.session,
  });
  const shopData = await client.query({
    data: `{
      shop {
        name
        email
        myshopifyDomain
        plan {
          displayName
        }
        primaryDomain {
          url
          host
        }
      }
    }`,
  });
  const body = {
    access_token: res.locals.shopify.session.accessToken,
    shop: res.locals.shopify.session.shop,
    shop_id: res.locals.shopify.session.state,
    email: shopData.body?.data?.shop?.email,
    first_name: "a",
    last_name: "a",
  };
  console.log("body", body, shopData.body?.data?.shop);
  const response = await axios.post(
    "https://g9bvvvyptqo7uxa0.agspert-ai.com/shopify/auth/login/",
    JSON.stringify(body),
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  // const response = await fetch(
  //   "https://g9bvvvyptqo7uxa0.agspert-ai.com/shopify/auth/login/",
  //   {
  //     method: "POST",
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //     body: JSON.stringify(body),
  //   }
  // );

  // if (!res.ok) {
  //   return res
  //     .status(response.status)
  //     .send({ error: "Failed to fetch Knox token" });
  // }

  const { token } = await response.data;
  res.status(200).send({ token, shop: res.locals.shopify.session.shop });
});

app.get("/api/products/count", async (_req, res) => {
  const client = new shopify.api.clients.Graphql({
    session: res.locals.shopify.session,
  });
  const accessToken = res.locals.shopify.session.accessToken;

  const shopData = await client.query({
    data: `{
      shop {
        name
        email
        myshopifyDomain
        plan {
          displayName
        }
        primaryDomain {
          url
          host
        }
      }
    }`,
  });

  const countData = await client.request(`
    query shopifyProductCount {
      productsCount {
        count
      }
    }
  `);

  res
    .status(200)
    .send({ count: countData.data.productsCount.count, shop: shopData?.body });
});

app.get("/api/products", async (_req, res) => {
  const client = new shopify.api.clients.Graphql({
    session: res.locals.shopify.session,
  });

  try {
    const productsData = await client.request(`
      query {
        products(first: 250) {
          edges {
            node {
              id
              title
              description
              handle
              status
              metafields(first: 10){
                edges{
                  node{
                    id
                    key
                    value
                    jsonValue
                    createdAt
                  }
                }
              }
            }
          }
        }
      }
    `);

    const products = productsData.data.products.edges.map((edge) => edge.node);
    res.status(200).send({ products });
  } catch (error) {
    console.log(`Failed to fetch products: ${error.message}`);
    res.status(500).send({ error: error.message });
  }
});

app.get("/api/products/:productId", async (req, res) => {
  const { productId } = req.params;

  // Validate product ID
  if (!productId) {
    return res.status(400).send({ error: "Product ID is required" });
  }

  const client = new shopify.api.clients.Graphql({
    session: res.locals.shopify.session,
  });

  try {
    const productData = await client.request(
      `
      query getProduct($productId: ID!) {
        product(id: $productId) {
          id
          title
          description
          handle
          metafields(first: 10) {
            edges {
              node {
                id
                key
                value
                jsonValue
                createdAt
              }
            }
          }
          images(first: 5) {
            edges {
              node {
                id
                url
                altText
              }
            }
          }
          variants(first: 5) {
            edges {
              node {
                id
                title
                price
                availableForSale
                sku
              }
            }
          }
          priceRange {
            minVariantPrice {
              amount
              currencyCode
            }
            maxVariantPrice {
              amount
              currencyCode
            }
          }
        }
      }
    `,
      {
        variables: {
          productId: `gid://shopify/Product/${productId}`,
        },
      }
    );

    // Check if product exists
    if (!productData.data.product) {
      return res.status(404).send({ error: "Product not found" });
    }

    res.status(200).send({ product: productData.data.product });
  } catch (error) {
    console.error(`Failed to fetch product details: ${error.message}`);

    // Check for specific GraphQL errors
    if (error.message.includes("Invalid ID")) {
      return res.status(400).send({ error: "Invalid product ID format" });
    }

    res.status(500).send({ error: "Failed to fetch product details" });
  }
});

app.post("/api/products", async (_req, res) => {
  let status = 200;
  let error = null;

  try {
    await productCreator(res.locals.shopify.session);
  } catch (e) {
    console.log(`Failed to process products/create: ${e.message}`);
    status = 500;
    error = e.message;
  }
  res.status(status).send({ success: status === 200, error });
});

// app.post("/api/themes/update-metafields", async (req, res) => {
//   const { showProductStory, selectedProductId } = req.body;

//   try {
//     const client = new shopify.api.clients.Graphql({
//       session: res.locals.shopify.session,
//     });

//     // Update metafields to control display of the #root section
//     const response = await client.query({
//       data: {
//         query: `
//           mutation updateProductMetafields($id: ID!, $showProductStory: String!) {
//             productUpdate(
//               input: {
//                 id: $id
//                 metafields: [
//                   {
//                     namespace: "custom"
//                     key: "show_product_story"
//                     value: $showProductStory
//                     type: "single_line_text_field"
//                   }
//                 ]
//               }
//             ) {
//               product {
//                 id
//               }
//               userErrors {
//                 field
//                 message
//               }
//             }
//           }
//         `,
//         variables: {
//           id: `gid://shopify/Product/${selectedProductId}`,
//           showProductStory: showProductStory.toString(),
//         },
//       },
//     });

//     // Check for user errors
//     if (response.body.data?.productUpdate?.userErrors?.length > 0) {
//       throw new Error(response.body.data.productUpdate.userErrors[0].message);
//     }

//     res.status(200).send({
//       success: true,
//       message: "Metafields updated successfully",
//       data: response.body.data,
//     });
//   } catch (error) {
//     console.error("Failed to update metafields:", error);
//     res.status(500).send({
//       success: false,
//       error: error.message,
//     });
//   }
// });

app.post("/api/themes/update-metafields", async (req, res) => {
  // Bulk update metafields
  const { products } = req.body; // Expect array of {id, story}

  try {
    const client = new shopify.api.clients.Graphql({
      session: res.locals.shopify.session,
    });

    // Create mutation string for each product
    const mutations = products
      .map(
        (product, index) => `
      product${index}: productUpdate(
        input: {
          id: "gid://shopify/Product/${product.id}"
          metafields: [
            {
              namespace: "custom"
              key: "show_product_story"
              value: "${product.story.toString()}"
              type: "single_line_text_field"
            }
          ]
        }
      ) {
        product {
          id
        }
        userErrors {
          field
          message
        }
      }
    `
      )
      .join("\n");

    // Execute bulk mutation
    const response = await client.query({
      data: {
        query: `
          mutation bulkUpdateProductMetafields {
            ${mutations}
          }
        `,
      },
    });

    // Check for user errors across all operations
    const userErrors = Object.values(response.body.data).reduce(
      (errors, result) => {
        if (result.userErrors && result.userErrors.length > 0) {
          errors.push(...result.userErrors);
        }
        return errors;
      },
      []
    );

    if (userErrors.length > 0) {
      throw new Error(JSON.stringify(userErrors));
    }

    res.status(200).send({
      success: true,
      message: "Metafields updated successfully",
      data: response.body.data,
    });
  } catch (error) {
    console.error("Failed to update metafields:", error);
    res.status(500).send({
      success: false,
      error: error.message,
    });
  }
});

app.get("/api/themes/product-sections", async (_req, res) => {
  const client = new shopify.api.clients.Graphql({
    session: res.locals.shopify.session,
  });

  try {
    const response = await client.request(`
      query getThemeSections {
        currentTheme: theme(role: MAIN) {
          id
          name
          sections: templates(first: 1, templates: PRODUCT) {
            edges {
              node {
                id
                name
                sections: body {
                  content
                  type
                  settings
                  blocks {
                    type
                    settings
                    id
                  }
                }
              }
            }
          }
        }
      }
    `);

    // Extract and format the sections data
    const templateData = response.data.currentTheme.sections.edges[0]?.node;

    if (!templateData) {
      return res.status(404).send({
        success: false,
        error: "No product template found",
      });
    }

    const formattedResponse = {
      themeId: response.data.currentTheme.id,
      themeName: response.data.currentTheme.name,
      template: {
        id: templateData.id,
        name: templateData.name,
        sections: templateData.sections.map((section) => ({
          type: section.type,
          content: section.content,
          settings: JSON.parse(section.settings || "{}"),
          blocks:
            section.blocks?.map((block) => ({
              id: block.id,
              type: block.type,
              settings: JSON.parse(block.settings || "{}"),
            })) || [],
        })),
      },
    };

    res.status(200).send({
      success: true,
      data: formattedResponse,
    });
  } catch (error) {
    console.error("Failed to fetch product sections:", error);
    res.status(500).send({
      success: false,
      error: error.message,
    });
  }
});

app.get("/api/themes", async (_req, res) => {
  const client = new shopify.api.clients.Graphql({
    session: res.locals.shopify.session,
  });

  try {
    const themesData = await client.request(`
      query  {
         themes(first: 100) {
              edges {
              node {
                  id
                  name
                  role
                  processing
                  createdAt
                  updatedAt
                  themeStoreId
                  processingFailed
                  prefix
                }
              }
            }
          }
      `);

    const themes = themesData.data.themes.edges.map((edge) => edge.node);

    res.status(200).send(themes);
  } catch (error) {
    console.log(`Failed to fetch themes: ${error.message}`);
    res.status(500).send({ error: error.message });
  }
});

app.post("/webhooks/app-uninstalled", express.json(), (req, res) => {
  const hmac = req.get("X-Shopify-Hmac-Sha256");
  const body = req.body;

  // Verify the request
  const generatedHash = crypto
    .createHmac("sha256", process.env.SHOPIFY_API_SECRET)
    .update(JSON.stringify(body), "utf8")
    .digest("base64");

  if (generatedHash !== hmac) {
    return res.status(401).send("Unauthorized");
  }

  // Process the webhook data
  const shop = body.myshopify_domain;
  console.log(`App uninstalled from shop: ${shop}`);

  // Perform any cleanup or data storage here

  res.status(200).send("Webhook received");
});

app.post("/webhooks/shop-update", express.json(), (req, res) => {
  const hmac = req.get("X-Shopify-Hmac-Sha256");
  const body = req.body;

  // Verify the request
  const generatedHash = crypto
    .createHmac("sha256", process.env.SHOPIFY_API_SECRET)
    .update(JSON.stringify(body), "utf8")
    .digest("base64");

  if (generatedHash !== hmac) {
    return res.status(401).send("Unauthorized");
  }

  // Extract shop information
  const shopInfo = {
    shopDomain: body.domain,
    shopName: body.name,
    shopEmail: body.email,
    accessToken: req.headers["x-shopify-access-token"], // Assuming you have access to the token
  };

  console.log("shopInfo", shopInfo);
  // Send shopInfo to your external system to create a user account
  createUserInExternalSystem(shopInfo);

  res.status(200).send("Webhook received");
});

// Function to send shop info to your external system
function createUserInExternalSystem(shopInfo) {
  // Implement the logic to create a user in your external system
  console.log("Creating user in external system:", shopInfo);
}

app.use(shopify.cspHeaders());
app.use(serveStatic(STATIC_PATH, { index: false }));

app.use("/*", shopify.ensureInstalledOnShop(), async (_req, res, _next) => {
  return res
    .status(200)
    .set("Content-Type", "text/html")
    .send(
      readFileSync(join(STATIC_PATH, "index.html"))
        .toString()
        .replace("%VITE_SHOPIFY_API_KEY%", process.env.SHOPIFY_API_KEY || "")
    );
});

app.listen(PORT);
