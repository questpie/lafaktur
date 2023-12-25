"use client";
import { Provider, createStore } from "jotai";
import { AppProgressBar } from "next-nprogress-bar";
import { type PropsWithChildren } from "react";
import { ConfirmDialogProvider } from "~/app/_components/ui/alert-dialog";
import { DialogProvider } from "~/app/_components/ui/dialog";
import { Toaster } from "~/app/_components/ui/sonner";

export const rootStore = createStore();

export function AppProvider(props: PropsWithChildren) {
  return (
    <Provider store={rootStore}>
      <AppProgressBar
        height="4px"
        color="hsl(142.1, 76.2%, 36.3%)"
        shallowRouting
        options={{
          showSpinner: false,
        }}
      />
      <Toaster />
      <DialogProvider>
        <ConfirmDialogProvider>{props.children}</ConfirmDialogProvider>
      </DialogProvider>
    </Provider>
  );
}
