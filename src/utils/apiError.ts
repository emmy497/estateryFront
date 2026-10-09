// The server's error message from a failed API call, or a fallback
export const apiErrorMessage = (error: unknown, fallback: string): string => {
  const message = (error as { response?: { data?: { message?: unknown } } })
    ?.response?.data?.message;
  return typeof message === "string" && message ? message : fallback;
};
