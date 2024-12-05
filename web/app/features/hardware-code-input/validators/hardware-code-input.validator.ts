import { z } from "zod";

export const hardwareCodeInputValidator = z.object({
  hardwareCode: z.string().min(1, "Hardware ID tidak boleh kosong!"),
});
