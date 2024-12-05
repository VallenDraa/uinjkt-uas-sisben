import { redirect } from "@remix-run/node";
import { getSession } from "~/lib/sessions";
import { HARDWARE_CODE_KEY } from "~/shared/constants/hardware-code.constants";

export const requirehardwareCodeMiddleware = async (request: Request) => {
  const session = await getSession(request.headers.get("Cookie"));
  const hardwareCode = session.get(HARDWARE_CODE_KEY);
  console.log(
    "🚀 ~ requirehardwareCodeMiddleware ~ hardwareCode:",
    hardwareCode,
  );

  if (!session || !hardwareCode) {
    throw redirect("/hardware-code-input");
  }

  return {
    hardwareCode,
  };
};
