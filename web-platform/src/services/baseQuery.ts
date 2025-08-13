import { fetchBaseQuery, retry } from "@reduxjs/toolkit/query/react";

import { logout } from "@/store/slices/authSlice";
import { destroyToken, getToken } from "@/utils";

export const customBaseQuery = retry(
  async (args, api, extraOptions) => {
    const result = await fetchBaseQuery({
      baseUrl: `${process.env.NEXT_PUBLIC_BASE_API_URL}/${process.env.NEXT_PUBLIC_API_VERSION}`,
      prepareHeaders: (headers) => {
        const token = getToken("access");
        if (token) {
          headers.set("Authorization", `Bearer ${token}`);
        }

        if (!headers.has("Content-Type")) {
          headers.set("Content-Type", "application/json");
        }
        if (headers.get("Content-Type") === "multipart/form-data") {
          headers.delete("Content-Type");
        }
        headers.set("Accept", "*/*");

        return headers;
      },
    })(args, api, extraOptions);

    if (result.error) {
      if (result.error?.status === 401) {
        destroyToken();
        api?.dispatch(logout());
        location.reload();
      }

      if (result.error?.status < "500") {
        retry.fail(result.error);
      }
    }

    return result;
  },
  { maxRetries: 3 },
);
