import { sendbypassApi } from "@/services/base";
import { setUser } from "@/store/slices/authSlice";
import { makeFormData } from "@/utils";

import {
  ProfilePatchBody,
  ProfileResponse,
  TransformedBusinessProfile,
} from "./types";

export const profileCacheKey = "user";

export const profileApi = sendbypassApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    profile: builder.query<ProfileResponse, void>({
      query: () => "/profile",
      providesTags: ["profile"],
      async onCacheEntryAdded(_arg, { dispatch, cacheDataLoaded }) {
        cacheDataLoaded.then((result) => {
          if (result?.data) {
            dispatch(setUser(result.data));
          }
        });
      },
    }),

    businessProfile: builder.query<
      TransformedBusinessProfile,
      { biz_id: string } | void
    >({
      query: (params) => {
        return {
          url: `/businesses/‍‍${params?.biz_id}`,
        };
      },
      providesTags: ["businessProfile"],
    }),

    updateBusinessProfile: builder.mutation<
      void,
      Partial<ProfilePatchBody & { biz_id: string }>
    >({
      query: (data) => {
        const body = makeFormData(data);

        return {
          url: `/profile`,
          method: "PUT",
          body,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        };
      },
      invalidatesTags: ["businessProfile"],
    }),

    updateProfile: builder.mutation<void, Partial<ProfilePatchBody>>({
      query: (data) => {
        const body = makeFormData(data);

        return {
          url: "/profile",
          method: "PATCH",
          body,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        };
      },
      invalidatesTags: ["profile"],
    }),
  }),
});

export const {
  useProfileQuery,
  useLazyProfileQuery,
  useUpdateProfileMutation,
  useBusinessProfileQuery,
  useLazyBusinessProfileQuery,
  useUpdateBusinessProfileMutation,
} = profileApi;
