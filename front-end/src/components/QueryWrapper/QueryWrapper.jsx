"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React, { useState } from "react";

const QueryWrapper = ({ children }) => {
  const [queryClient] = useState(() => new QueryClient());
  return <QueryClientProvider  client={queryClient}>{children}</QueryClientProvider>;
};

export default QueryWrapper;
