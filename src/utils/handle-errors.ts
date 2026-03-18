import axios from "axios";
import { toast } from "react-toastify";

// type ErrorTypes = { response: { data: { message: string } } };

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function handleRequestError(error: any, message: string) {
  const errorMessage = axios.isAxiosError(error) && error.response?.data?.message ? error.response.data.message : message;
  toast.error(errorMessage);
}
