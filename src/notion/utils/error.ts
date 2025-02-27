import { isNotionClientError } from "@notionhq/client";
import { Toast } from "@raycast/api";
import { showToast } from "@raycast/api";

export function handleError<T>(err: unknown, title: string, returnValue: T): T {
    console.error(err);
    if (isNotionClientError(err)) {
      showToast({
        style: Toast.Style.Failure,
        title: err.message,
      });
    } else {
      showToast({
        style: Toast.Style.Failure,
        title,
      });
    }
    return returnValue;
  }