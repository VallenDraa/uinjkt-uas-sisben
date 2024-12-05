import { redirect } from "@remix-run/node";
import { HARDWARE_ID_KEY } from "~/features/hardware-id-input/constants/hardware-id-input.constants";
import { getSession } from "~/lib/sessions";

export const requirehardwareIdMiddleware = async (request: Request) => {
  const session = await getSession(request.headers.get("Cookie"));
  const hardwareId = session.get(HARDWARE_ID_KEY);

  if (!session || !hardwareId) {
    throw redirect("/hardware-id-input");
  }

  return {
    hardwareId,
  };
};
