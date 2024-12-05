import { z } from "zod";

export const hardwareIdInputValidator = z.object({
  hardwareId: z.string().min(1, "Hardware ID tidak boleh kosong!"),
});
