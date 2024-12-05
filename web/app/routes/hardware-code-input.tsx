import { zodResolver } from "@hookform/resolvers/zod";
import { ActionFunctionArgs, redirect } from "@remix-run/node";
import { Form, useActionData } from "@remix-run/react";
import { CheckIcon, InfoIcon } from "lucide-react";
import React from "react";
import { useForm } from "react-hook-form";
import { DEFAULT_HARDWARE_ID_INPUT } from "~/features/hardware-code-input/constants/hardware-code-input.constants";
import { HardwareCodeInput } from "~/features/hardware-code-input/types/hardware-code-input.types";
import { hardwareCodeInputValidator } from "~/features/hardware-code-input/validators/hardware-code-input.validator";
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
import { HARDWARE_CODE_KEY } from "~/shared/constants/hardware-code.constants";

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const hardwareCode = formData.get("hardwareCode")?.toString();

  const session = await getSession(request.headers.get(HARDWARE_CODE_KEY));

  if (!hardwareCode) {
    return { error: "Hardware ID tidak boleh kosong!" };
  }

  session.set(HARDWARE_CODE_KEY, hardwareCode);
  return redirect("/", {
    headers: { "Set-Cookie": await commitSession(session) },
  });
};

export default function HardwareCodeInputPage() {
  const form = useForm<HardwareCodeInput>({
    resolver: zodResolver(hardwareCodeInputValidator),
    defaultValues: DEFAULT_HARDWARE_ID_INPUT,
  });

  const actionData = useActionData<typeof action>();
  React.useEffect(() => {
    if (actionData?.error) {
      form.setError("hardwareCode", {
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
          action="/hardware-code-input"
        >
          <FormField
            control={form.control}
            name="hardwareCode"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Hardware ID</FormLabel>

                <FormControl>
                  <Input
                    {...field}
                    name="hardwareCode"
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
