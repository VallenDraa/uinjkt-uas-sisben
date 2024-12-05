import { useMutation } from "@tanstack/react-query";
import { MutationConfig } from "~/lib/react-query";
import { updateBabyNotification } from "../api/update-baby-notification.api";

type UseUpdateBabyNotificationOptions = {
  mutationConfig?: MutationConfig<typeof updateBabyNotification>;
};

export const useUpdateBabyNotification = ({
  mutationConfig,
}: UseUpdateBabyNotificationOptions = {}) => {
  return useMutation({
    ...mutationConfig,
    mutationFn: updateBabyNotification,
  });
};
