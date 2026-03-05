"use client";

import { ConfigCatProvider, PollingMode } from "configcat-react";
import { ConfigCatFlags, DefaultFlags } from "@/lib/feature-flags";
import type { ReactNode } from "react";

const SDK_KEY_PROD = process.env.NEXT_PUBLIC_CONFIGCAT_SDK_KEY_PROD;
const SDK_KEY_TEST = process.env.NEXT_PUBLIC_CONFIGCAT_SDK_KEY_TEST;

export function FeatureFlagProvider({ children }: { children: ReactNode }) {
  const isDev = process.env.NODE_ENV === "development";
  const sdkKey = isDev ? (SDK_KEY_TEST || SDK_KEY_PROD) : SDK_KEY_PROD;

  if (!sdkKey) {
    return <DefaultFlags>{children}</DefaultFlags>;
  }

  const environment = isDev ? "test" : "production";

  return (
    <ConfigCatProvider
      sdkKey={sdkKey}
      pollingMode={PollingMode.AutoPoll}
      options={{
        pollIntervalSeconds: 60,
        defaultUser: {
          identifier: "anonymous",
          custom: {
            environment,
          },
        },
      }}
    >
      <ConfigCatFlags>{children}</ConfigCatFlags>
    </ConfigCatProvider>
  );
}
