"use client";

import { ChakraProvider as Provider, defaultSystem } from "@chakra-ui/react";
import { ColorModeProvider, type ColorModeProviderProps } from "./color-mode";

export function ChakraProvider(props: ColorModeProviderProps) {
  return (
    <Provider value={defaultSystem}>
      <ColorModeProvider {...props} />
    </Provider>
  );
}
