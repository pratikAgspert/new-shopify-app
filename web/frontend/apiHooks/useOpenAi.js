import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { OPEN_AI_API_KEY } from '../services/baseURL';
import { makeRequest } from '../services/networkRequest';


function isObject(obj) {
  return obj !== null && typeof obj === 'object' && !Array.isArray(obj);
}

export const useStatsSummary = () => {
  const queryClient = useQueryClient()

  const getAIResponse = async (formData) => {
    try {
      const systemMessage = [{
        "role": "system",
        // "content": "You are a sales analytics summarizer. Given some JSON data, your task is to analyze and summarize the statistics in clear, plain English. Make sure the summary is concise, accurate, and easy to understand. Tailor your summary to fit the type of entity represented by the data, such as products, customers, or sales regions. Ensure that all financial figures are reported in Indian Rupees (₹). The tone should resemble that of a human analyst, focusing on key insights and avoiding technical jargon. Always start answering as a human would, like he already know what to say even as he wasn't given dataset"
        // "content": "You are a sales analytics summarizer. Given some JSON data, you need to summarize the statistics in plain English. Always describe the data given in the JSON and ensure the summary is short, precise, and understandable. Additionally, consider the type of data provided to tailor the summary more precisely to the relevant entity in context."
        "content": "You are a sale analytics summarizer. Summarize anything to second person in conversation in plain english sentences. Keep it short and precise. Describe each metrics in a single sentence. Ensure that all financial figures are reported in Indian Rupees (₹). Negative figures represent amounts to be paid by second person. Don't use any analytics related terms."
      }, { role: 'user', content: `Type of entities to summarize for: ${formData?.title}` }]
      console.log("popover formdata", formData)
      const endPoint = "https://summarizer.ruraldevs.dev/summarize";
      if (!isObject(formData?.json)) {
        throw new Error("No data to analyze")
      }
      const cachedData = queryClient.getQueryData(['statsSummary', JSON.stringify(formData.json)]);
      if (cachedData) {
        return cachedData
      }
      const data = await makeRequest(endPoint, 'post', "", { messages: systemMessage, json: formData?.json });
      return data;
    } catch (error) {
      throw new Error("Try Again after some time");
    }
  };

  const mutation = useMutation({
    mutationFn: getAIResponse,
    onSuccess: async (serverData, variables) => {
      queryClient.setQueryData(['statsSummary', JSON.stringify(variables.json)], serverData);
    },
  });

  return { ...mutation };
}
export const useCategoryTrend = () => {
  const queryClient = useQueryClient()

  const getAIResponse = async (formData) => {
    try {
      const systemMessage = [{
        "role": "system",
        "content": "You are a trend analyst. Highlight increases or decreases in financial metrics and explain possible causes for these trends, including any seasonal or external factors. Use clear and plain language to describe each observation in a single sentence. Ensure that all figures are reported in Indian Rupees (₹), and explain whether they represent profits or losses. Focus on identifying the broader trend rather than individual data points. Generate bullet points not markdown"
      }, { role: 'user', content: `The given data is for a category and items belonging to that category. Current quantity represents leftover quantity and original_quantity represents the amount we procured for each item. Sale of an item is original_quantity - current_quantity.Analyzing trends on quantity, price, consumption for overall caetgory data. Use category data to represent things to user. Don't use technical/jargon words like data, quantity in reponse.` }]
      console.log("category formdata", formData)
      const endPoint = "https://summarizer.ruraldevs.dev/analyze-trend";
      if (!isObject(formData?.data) || formData?.data?.items?.length === 0) {
        throw new Error("No data to analyze")
      }
      const cachedData = queryClient.getQueryData(['categoryTrend', JSON.stringify(formData.data)]);
      if (cachedData) {
        return cachedData
      }
      const data = await makeRequest(endPoint, 'post', "", { messages: systemMessage, data: formData?.data });
      return data;
    } catch (error) {
      throw new Error(error?.message || "Try Again after some time");
    }
  };

  const mutation = useMutation({
    mutationFn: getAIResponse,
    onSuccess: async (serverData, variables) => {
      queryClient.setQueryData(['categoryTrend', JSON.stringify(variables.data)], serverData);
    },
  });

  return { ...mutation };
}
