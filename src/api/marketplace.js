import { apiFetch } from "./client";

const Agrani_token =
  "Bearer eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJBY1cwSW16UGd1MWpnb2RzYm40LVYybC1LLVFPUGE5T0ZxbS1QcWVLLVhFIn0.eyJleHAiOjE3ODg3NjM0ODEsImlhdCI6MTc4ODE1ODY4MSwiYXV0aF90aW1lIjoxNzg3OTgxNTU0LCJqdGkiOiJmMDc3MjM4Ni1kMTBlLTQ0M2UtYjIzYS1hODAzNzlmYmZhNjIiLCJpc3MiOiJodHRwczovL2F1dGgtZGV2LmFncmFuaS50ZWNoL3JlYWxtcy9hZ3JhbmkiLCJhdWQiOiJhY2NvdW50Iiwic3ViIjoiNGE2YmQ2ZWUtYzQ4OS00NDJkLWEzZWQtNzk1Njg4MmFhZTU4IiwidHlwIjoiQmVhcmVyIiwiYXpwIjoiYWdyYW5pLXdlYnNpdGUiLCJzaWQiOiJiODE3MWZjYy01MmY1LTQxY2ItOTlhNy03Y2M1MzU0MDBjYTEiLCJhY3IiOiIwIiwiYWxsb3dlZC1vcmlnaW5zIjpbIioiXSwicmVhbG1fYWNjZXNzIjp7InJvbGVzIjpbImFncmFuaSIsIm9mZmxpbmVfYWNjZXNzIiwiYWRtaW4iLCJkZXZlbG9wZXIiLCJkZWZhdWx0LXJvbGVzLWFncmFuaSIsInVtYV9hdXRob3JpemF0aW9uIl19LCJyZXNvdXJjZV9hY2Nlc3MiOnsiYWNjb3VudCI6eyJyb2xlcyI6WyJtYW5hZ2UtYWNjb3VudCIsIm1hbmFnZS1hY2NvdW50LWxpbmtzIiwidmlldy1wcm9maWxlIl19fSwic2NvcGUiOiJvcGVuaWQgcHJvZmlsZSBlbWFpbCIsImFzc2lnbmVkX2RvbWFpbnMiOlsiQmFua2luZyJdLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwicHJvZmlsZSI6Imh0dHBzOi8vYWdyYW5pLW1lZGlhLnMzLmFwLXNvdXRoLTEuYW1hem9uYXdzLmNvbS9hZ3JhbmlfYmFja2VuZF92Mi9wdWJsaWMvaW1hZ2VzL2RlZmF1bHRfcHJvZmlsZS5wbmciLCJncm91cHMiOlsiYWRtaW4iXSwicHJlZmVycmVkX3VzZXJuYW1lIjoiOTEzMzQzNTU0MyIsIm9yZ2FuaXphdGlvbl9uYW1lIjoiTGVhZHMgQ29ubmVjdCIsImdpdmVuX25hbWUiOiJDaGFyYW4iLCJhc3NpZ25lZF96b25lX2NvZGVzIjpbIjkiXSwib3JnYW5pemF0aW9uX2NvZGUiOiIzMTM3ODUyODk5MTQiLCJlbXBsb3llZV9jb2RlIjoiREVWMDAxIiwib3JnYW5pemF0aW9uX2NhdGVnb3J5IjoibGVhZHNjb25uZWN0Iiwib3JnYW5pemF0aW9uX2lkIjoiOGZkZWIwZmYtNjIzMC00NTE3LThhNzEtODdlNjY0MDE2Y2M2IiwibmFtZSI6IkNoYXJhbiBLdW1hciIsIm9yZ2FuaXphdGlvbl90eXBlIjoiYWdyYW5pIiwiYXNzaWduZWRfem9uZSI6IlN0YXRlIiwiZmFtaWx5X25hbWUiOiJLdW1hciIsImVtYWlsIjoiY2hhcmFuLmt1bWFyQGxlYWRzY29ubmVjdC5pbiJ9.M-Qfs7rawL4Dv16Nr1fZ8nOZLarI00YIwJKFDuuKlQ-K3_zk2sC0chR8PvQlqGX4gT7daOTYqXXNJA_daFUBz-yU0VyWHVrpUcOLa38Nl2RjOi8JXh-cGq4L7qI_NUNnuGf-4S4T3ot0Pm2cQinwpRwtPgnd1ovi7eY8dIY2_htgzB3HhZtmtMkdXtVdTczgGHy18kKgdvmH1gwWdkshpw1bj0pnnUyLmII08mntDCCL1ejadxceGF2wSOPyDm7wOAGF-RxXbLyzvVbRabioUZ1sLC_9d6hM-QghhlJkNd6N0b7NYZTMdlLMKITp-vmstAuQjOO9Daj217VjpO4VEw";

export const getStates = () => apiFetch("/api/v1/master/states");

export const getDistrictsByState = (stateCode) =>
  apiFetch(`/api/v1/master/districts?state_code=${stateCode}`);

export const getDeliveryLocation = (sellerMobile) =>
  apiFetch(
    `/marketplace/api/me/delivery-locations/?seller_mobile=${sellerMobile}`,
    {
      headers: {
        Authorization: Agrani_token,
      },
    },
  );

export const createDeliveryLocation = (payload) =>
  apiFetch("/marketplace/api/me/delivery-locations/", {
    method: "POST",
    body: payload,
    headers: {
      Authorization: Agrani_token,
    },
  });

export const updateDeliveryLocation = (id, payload) =>
  apiFetch(`/marketplace/api/me/delivery-locations/${id}/`, {
    method: "PATCH",
    body: payload,
    headers: {
      Authorization: Agrani_token,
    },
  });
