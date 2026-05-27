export function getErrorMessage(error: unknown): string {
  const rawMessage = getErrorText(error);

  if (/42501|row-level security/i.test(rawMessage)) {
    return "이 작업을 수행할 권한이 없습니다.";
  }

  if (/failed to fetch/i.test(rawMessage)) {
    return "인터넷 연결을 확인해주세요.";
  }

  if (/not found|not_found|notfound/i.test(rawMessage)) {
    return "요청한 게시글을 찾을 수 없습니다.";
  }

  return "일시적인 오류가 발생했습니다. 잠시 후 다시 시도해주세요.";
}

function getErrorText(error: unknown): string {
  if (!error) {
    return "";
  }

  if (typeof error === "string") {
    return error;
  }

  if (typeof error === "object") {
    if (error instanceof Error) {
      return error.message;
    }

    if ("message" in error && typeof (error as any).message === "string") {
      return (error as any).message;
    }

    if ("error" in error && typeof (error as any).error === "string") {
      return (error as any).error;
    }

    if ("status" in error && typeof (error as any).status === "string") {
      return (error as any).status;
    }

    return JSON.stringify(error);
  }

  return String(error);
}
