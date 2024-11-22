import { Card, Page, Layout, Text, Button } from "@shopify/polaris";
import { useContext } from "react";
import { AuthContext } from "../services/context";
import HomePage2 from "../components/HomePage2/HomePage2";

export default function HomePage() {
  const { isLoading, isAuthenticated, refetchToken } = useContext(AuthContext);

  if (isLoading) {
    return (
      // <Page>
      //   <Layout>
      //     <Layout.Section>
      //       <Card>
      //         <div style={{ textAlign: 'center', padding: '2rem' }}>
      //           <Spinner accessibilityLabel="Loading" size="large" />
      //           <div style={{ marginTop: '1rem' }}>
      //             <Text variant="bodyMd" as="p">
      //               Authenticating...
      //             </Text>
      //           </div>
      //         </div>
      //       </Card>
      //     </Layout.Section>
      //   </Layout>
      // </Page>
      <></>
    );
  }

  if (!isAuthenticated) {
    return (
      <Page>
        <Layout>
          <Layout.Section>
            <Card>
              <div style={{ textAlign: "center", padding: "2rem" }}>
                <Text variant="headingMd" as="h2">
                  Authentication Failed
                </Text>
                <div style={{ marginTop: "1rem" }}>
                  <Button onClick={() => refetchToken()}>
                    Retry Authentication
                  </Button>
                </div>
              </div>
            </Card>
          </Layout.Section>
        </Layout>
      </Page>
    );
  }

  return <HomePage2 />;
}
