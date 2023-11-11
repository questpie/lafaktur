"use client";
import { Provider, createStore } from "jotai";
import { type PropsWithChildren } from "react";
import { ConfirmDialogProvider } from "~/app/_components/ui/alert-dialog";
import { DialogProvider } from "~/app/_components/ui/dialog";

export const rootStore = createStore();

export function StoreProvider(props: PropsWithChildren) {
  return (
    <Provider store={rootStore}>
      <DialogProvider>
        <ConfirmDialogProvider>{props.children}</ConfirmDialogProvider>
      </DialogProvider>
    </Provider>
  );
}
