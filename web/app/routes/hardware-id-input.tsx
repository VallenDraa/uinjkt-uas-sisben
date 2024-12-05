import { zodResolver } from "@hookform/resolvers/zod";
import { ActionFunctionArgs, redirect } from "@remix-run/node";
import { Form, useActionData } from "@remix-run/react";
import { CheckIcon, InfoIcon } from "lucide-react";
import React from "react";
import { useForm } from "react-hook-form";
import {
  DEFAULT_HARDWARE_ID_INPUT,
  HARDWARE_ID_KEY,
} from "~/features/hardware-id-input/constants/hardware-id-input.constants";
import { HardwareIdInput } from "~/features/hardware-id-input/types/hardware-id-input.types";
import { hardwareIdInputValidator } from "~/features/hardware-id-input/validators/hardware-id-input.validator";
import { commitSession, getSession } from "~/lib/sessions";
import { PageLayout } from "~/shared/components/layouts/page-layout";
import { Button } from "~/shared/components/ui/button";
import {
  Form as RHFForm,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/shared/components/ui/form";
import { Input } from "~/shared/components/ui/input";

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const hardwareId = formData.get("hardwareId")?.toString();

  const session = await getSession(request.headers.get(HARDWARE_ID_KEY));

  if (!hardwareId) {
    return { error: "Hardware ID tidak boleh kosong!" };
  }

  session.set(HARDWARE_ID_KEY, hardwareId);
  return redirect("/", {
    headers: { "Set-Cookie": await commitSession(session) },
  });
};

export default function HardwareIdInputPage() {
  const form = useForm<HardwareIdInput>({
    resolver: zodResolver(hardwareIdInputValidator),
    defaultValues: DEFAULT_HARDWARE_ID_INPUT,
  });

  const actionData = useActionData<typeof action>();
  React.useEffect(() => {
    if (actionData?.error) {
      form.setError("hardwareId", {
        type: "value",
        message: actionData.error,
      });
    }
  }, [actionData?.error, form]);

  return (
    <PageLayout
      title="Masukkan hardware ID !"
      description="Hardware ID dapat dilihat pada perangkat monitoring anda."
    >
      <RHFForm {...form}>
        <Form
          className="space-y-10 grow mt-6"
          method="POST"
          action="/hardware-id-input"
        >
          <FormField
            control={form.control}
            name="hardwareId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Hardware ID</FormLabel>

                <FormControl>
                  <Input
                    {...field}
                    name="hardwareId"
                    disabled={form.formState.isSubmitting}
                    placeholder="0k123abc098fed"
                  />
                </FormControl>
                <FormDescription className="flex items-center gap-2">
                  <InfoIcon className="size-4" />
                  <span>
                    ID akan digunakan untuk proses koneksi perangkat monitoring
                    anda dengan aplikasi web SeeBaby.
                  </span>
                </FormDescription>

                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            disabled={form.formState.isSubmitting}
            type="submit"
            className="self-end w-full md:w-max"
          >
            <CheckIcon className="size-7" />
            Gunakan ID
          </Button>
        </Form>
      </RHFForm>
    </PageLayout>
  );
}
