"use client";

import { useEffect } from "react";

// La versión anterior de la landing aceptaba ?section=<id> (enlaces y anuncios existentes). Las anclas
// viejas siguen en la página; esto solo lleva el scroll hasta ellas.
export const LegacySectionScroll = () => {
  useEffect(() => {
    const section = new URLSearchParams(window.location.search).get("section");
    if (!section || !/^[\w-]{1,64}$/.test(section)) return;
    document.getElementById(section)?.scrollIntoView();
  }, []);
  return null;
};
