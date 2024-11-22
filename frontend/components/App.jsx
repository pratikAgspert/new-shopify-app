import { QueryClient } from "react-query";
import Story from "./Story";
import { QueryClientProvider } from "@tanstack/react-query";

export default function App({ home }) {
  console.log("Home", home);
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <div className="tw-flex tw-flex-col tw-justify-center tw-items-center tw-h-screen">
        <Story />
      </div>
    </QueryClientProvider>
  );
}
