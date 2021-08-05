import { AxiosResponse } from "axios";
import parseLinkHeader from "parse-link-header";

export type PaginatedData<T> = {
  data : Array<T>;
  meta : PaginationMetadata;
};

export type PaginationMetadata = {
  lastPage : number;
  total : number;
}

export function assemblePaginatedData(response : AxiosResponse) : PaginationMetadata {
  const linkHeader = response.headers["link"] ?? {};
  const parsedLinkHeader = parseLinkHeader(linkHeader)!;

  return {
    lastPage : parseInt(parsedLinkHeader?.last?._page ?? 1),
    total : response.headers?.["x-total-count"]
  };
}