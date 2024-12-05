import { z } from "zod";
import { hardwareIdInputValidator } from "../validators/hardware-id-input.validator";

export type HardwareIdInput = z.infer<typeof hardwareIdInputValidator>;
