"use client";

import { useEffect } from "react";

export default function BodyAttributes() {
  useEffect(() => {
    // Only run on the client side
    if (typeof document !== "undefined") {
      document.body.setAttribute("br-mode", "off");
      document.body.setAttribute("saccades-color", "");
      document.body.setAttribute("fixation-strength", "2");
      document.body.setAttribute("saccades-interval", "0");
      document.body.style.setProperty("--fixation-edge-opacity", "80%");
      document.body.style.setProperty("--br-line-height", "1");
      document.body.style.setProperty("--br-boldness", "600");
    }
  }, []);

  return null;
}
