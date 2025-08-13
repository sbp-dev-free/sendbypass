import {
  isFulfilled,
  isRejectedWithValue,
  type Middleware,
} from "@reduxjs/toolkit";
import Link from "next/link";
import { closeSnackbar, enqueueSnackbar } from "notistack";

import { RequestStatus } from "@/enums/requests";

interface BaseQueryMeta {
  request?: {
    method?: string;
    url?: string;
  };
  response?: {
    status?: number;
  };
}

interface PayloadData {
  status?: string;
  data?: {
    detail?: string;
  };
}

const getErrorMessage = (detail?: string) => {
  if (typeof detail === "string") {
    try {
      const parsed = JSON.parse(detail);
      if (parsed && typeof parsed === "object" && "message" in parsed) {
        return parsed.message;
      }
    } catch {
      return "Something went wrong!";
    }
  }

  return "Something went wrong!,try again.";
};

const getRequestType = (requestBody: {
  originalArgs?: unknown;
}): string | null => {
  if (
    requestBody?.originalArgs &&
    typeof requestBody.originalArgs === "object" &&
    requestBody.originalArgs !== null &&
    "type" in requestBody.originalArgs
  ) {
    return (requestBody.originalArgs as { type?: string }).type || null;
  }
  return null;
};

const createActionLink = (href: string, linkText: string) => {
  const ActionLinkComponent = (snackbarId: string | number) => {
    const handleClose = () => {
      closeSnackbar(snackbarId);
    };

    return (
      <Link
        href={href}
        onClick={handleClose}
        className="text-primary hover:underline text-label-large"
      >
        {linkText}
      </Link>
    );
  };

  ActionLinkComponent.displayName = "SnackbarActionLink";

  return ActionLinkComponent;
};

export const notificationCenter: Middleware = () => (next) => (action) => {
  if (isFulfilled(action)) {
    const meta = action.meta as { baseQueryMeta?: BaseQueryMeta };
    const statusCode = meta?.baseQueryMeta?.response?.status;
    const method = meta?.baseQueryMeta?.request?.method || "GET";
    const url = meta?.baseQueryMeta?.request?.url || "";
    const bodyData = action.payload as PayloadData;

    if (statusCode) {
      switch (statusCode) {
        case 200:
          if (method === "PATCH") {
            if (url.includes("/user_locations")) {
              enqueueSnackbar("Success! Confirm your location.", {
                variant: "success",
              });
              break;
            }
            if (url.includes("/contacts")) {
              enqueueSnackbar("Success!", {
                variant: "success",
              });
              break;
            }
            if (url.includes("/trips")) {
              enqueueSnackbar("Success! Under admin review.", {
                variant: "success",
              });
              break;
            }
            if (url.includes("/requirements")) {
              enqueueSnackbar("Success! Under admin review.", {
                variant: "success",
              });
              break;
            }
            if (url.includes("/requests")) {
              const status = bodyData?.status;
              if (status === RequestStatus.REJECTED) {
                enqueueSnackbar("Request rejected!", {
                  variant: "success",
                });
              } else if (status === RequestStatus.ACCEPTED) {
                enqueueSnackbar("Accepted! Please complete order steps.", {
                  variant: "success",
                });
              } else if (status === RequestStatus.CANCELED) {
                enqueueSnackbar("Request successfully canceled.", {
                  variant: "success",
                });
              }
              break;
            }
          }
          break;

        case 201:
          if (url.includes("/trips")) {
            enqueueSnackbar(" Success! Under admin review.", {
              variant: "success",
              action: createActionLink(
                "/connect-hub/start-to-shop",
                "Connect Hub",
              ),
              longerAction: true,
            });
            break;
          }
          if (url.includes("/requirements")) {
            enqueueSnackbar("Success! Under admin review.", {
              variant: "success",
              action: createActionLink(
                "/connect-hub/request-to-passengers",
                "Connect Hub",
              ),
              longerAction: true,
            });
            break;
          }
          if (url.includes("/requests")) {
            enqueueSnackbar("Success! Awaiting user acceptance.", {
              variant: "success",
            });
            break;
          }
          if (url.includes("/tickets")) {
            enqueueSnackbar(
              "Thank you! Your message has been sent successfully.",
              {
                variant: "success",
              },
            );
            break;
          }
          if (url.includes("/account_requests")) {
            type RequestBodyWithOriginalArgs = { originalArgs?: unknown };
            const requestBody = action.meta.arg as RequestBodyWithOriginalArgs;
            const requestType = getRequestType(requestBody);

            switch (requestType) {
              case "DELETE_ACCOUNT":
                enqueueSnackbar(
                  "Thank you! Your account deletion request has been successfully submitted.",
                  { variant: "success" },
                );
                break;
              case "RESET_PASSWORD":
                enqueueSnackbar(
                  "Reset link sent! Please check your email to continue.",
                  {
                    variant: "success",
                  },
                );
                break;
              case "VERIFY_EMAIL":
                enqueueSnackbar("Verification email sent successfully!", {
                  variant: "success",
                });
                break;
            }
            break;
          }
          enqueueSnackbar("Item added successfully!", {
            variant: "success",
          });
          break;

        case 204:
          if (method === "DELETE") {
            if (url.includes("/trips")) {
              enqueueSnackbar("Trip deleted successfully.", {
                variant: "success",
              });
              break;
            }
            if (url.includes("/requirements")) {
              enqueueSnackbar("Need deleted successfully.", {
                variant: "success",
              });
              break;
            }
            enqueueSnackbar("Your item has been deleted successfully.", {
              variant: "success",
            });
          }
          break;
      }
    }
  }

  if (isRejectedWithValue(action)) {
    const meta = action.meta as { baseQueryMeta?: BaseQueryMeta };
    const statusCode = meta?.baseQueryMeta?.response?.status;
    const bodyData = action.payload as PayloadData;
    const detail = bodyData.data?.detail;

    if (statusCode) {
      switch (statusCode) {
        case 400:
          enqueueSnackbar(getErrorMessage(detail), {
            variant: "error",
          });
          break;
        case 401:
          enqueueSnackbar("Access denied!", {
            variant: "error",
          });
          break;
        case 403:
          enqueueSnackbar("Please log in to continue.", {
            variant: "error",
          });
          break;
        default:
          enqueueSnackbar(getErrorMessage(detail), {
            variant: "error",
          });
          break;
      }
    } else {
      enqueueSnackbar(getErrorMessage(detail), {
        variant: "error",
      });
    }
  }

  return next(action);
};
