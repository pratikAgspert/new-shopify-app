export const makeRequest = async (url, method, token, data = "") => {
  try {
    const response = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
      body: method === "GET" ? null : JSON.stringify(data),
    });

    const statusCode = response.status;

    if (statusCode === 204) return "Successful";

    if (statusCode === 406) {
      const responseData = await response.json();
      throw new Error(responseData?.detail || "Not Acceptable");
    }

    if (`${statusCode}`?.charAt(0) === "5")
      throw new Error(
        `Internal server error! Please try again after some time`
      );

    const responseData = await response.json();
    if (response.ok) return responseData;

    //  CASE: Response is an array w/ error message
    if (responseData?.length) throw new Error(`${responseData?.[0]}`);

    //  CASE: Response is a text
    // If an array throw the first one, else throw the message
    if (responseData?.detail) throw new Error(`${responseData?.detail}`);

    //  CASE: Response is a dictionary/object
    if (!responseData?.detail) {
      const targetKey = Object.keys(responseData)?.[0] ?? undefined;

      const errorMessage =
        responseData?.[targetKey]?.[0] ?? "Something went wrong";

      throw new Error(`${errorMessage}`);
    }
  } catch (error) {
    throw new Error(
      `${
        error?.message ??
        `Something went wrong with error code ${error?.status}`
      }`
    );
  }
};
