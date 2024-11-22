import { useState } from "react";
import {
  Card,
  Select,
  Checkbox,
  Button,
  Frame,
  Toast,
  Banner,
  Layout,
  FormLayout,
  Text,
} from "@shopify/polaris";
import { useProducts } from "../apiHooks/useProducts";

const ProductMetaFields = () => {
  const [selectedProductId, setSelectedProductId] = useState("");
  const [showProductStory, setShowProductStory] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [toastActive, setToastActive] = useState(false);
  const [error, setError] = useState("");

  const handleSaveSettings = async () => {
    setIsLoading(true);
    setError("");

    console.log(
      "showProductStory, selectedProductId-===>",
      showProductStory,
      selectedProductId
    );

    try {
      const response = await fetch("/api/themes/update-metafields", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ showProductStory, selectedProductId }),
      });

      const result = await response.json();

      if (result.success) {
        setToastActive(true);
      } else {
        throw new Error(result.error || "Failed to update settings");
      }
    } catch (error) {
      console.error("Failed to update settings:", error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const {
    data: products,
    isLoading: isProductsLoading,
    isError: isProductsError,
  } = useProducts();

  console.log("products==>", products);

  const productOptions = products?.map((product) => ({
    label: product.name,
    value: product.source_id,
  }));

  const toastMarkup = toastActive ? (
    <Toast
      content="Settings saved successfully"
      onDismiss={() => setToastActive(false)}
    />
  ) : null;

  return (
    <Frame>
      <Layout>
        <Layout.Section>
          <Card>
            <Card.Section>
              <Text variant="headingMd" as="h2">
                Product Settings
              </Text>
            </Card.Section>

            <Card.Section>
              <FormLayout>
                <Select
                  label="Select product"
                  options={productOptions}
                  onChange={setSelectedProductId}
                  value={selectedProductId}
                  disabled={isLoading}
                />

                <Checkbox
                  label="Show Product Story"
                  checked={showProductStory}
                  onChange={setShowProductStory}
                  disabled={isLoading}
                />

                {error && (
                  <Banner status="critical">
                    <p>{error}</p>
                  </Banner>
                )}
              </FormLayout>
            </Card.Section>

            <Card.Section>
              <Button
                primary
                loading={isLoading}
                disabled={!selectedProductId || isLoading}
                onClick={handleSaveSettings}
                fullWidth
              >
                Save Settings
              </Button>
            </Card.Section>
          </Card>
        </Layout.Section>
      </Layout>
      {toastMarkup}
    </Frame>
  );
};

export default ProductMetaFields;
