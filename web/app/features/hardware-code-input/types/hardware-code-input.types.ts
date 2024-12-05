import { z } from "zod";
import { hardwareCodeInputValidator } from "../validators/hardware-code-input.validator";

export type HardwareCodeInput = z.infer<typeof hardwareCodeInputValidator>;
