"use client";

import { useEffect } from "react";
import { posthog } from "@/lib/posthog-client";

export default function ProfileViewTracker() {
  useEffect(() => {
    posthog.capture("profile_view");
  }, []);

  return null;
}
