"use client";

import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";
import { type ComponentProps } from "react";

type Props = ComponentProps<"button"> & {
  pendingText?: string;
};

export function SubmitButton({ children, pendingText, ...props }: Props) {
  const { pending, action } = useFormStatus();

  const isPending = pending && action === props.formAction;

  return (
    <Button type="submit" disabled={isPending} {...props}>
      {isPending ? pendingText : children}
    </Button>
  );
}
