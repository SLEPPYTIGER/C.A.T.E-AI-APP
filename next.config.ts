import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    // Memory optimization settings
    memoryBasedWorkersCount: true, // Automatically adjust workers based on available memory
    optimizePackageImports: ['framer-motion', '@langchain/core', 'lucide-react'],
    // Optimize for Edge runtime
    serverComponentsExternalPackages: ['@langchain/anthropic'],
  },
  // Reduce memory usage during builds
  onDemandEntries: {
    // Number of pages that should be kept simultaneously without being disposed
    maxInactiveAge: 15 * 1000, // 15 seconds
    // Number of pages that should be kept in memory
    pagesBufferLength: 2,
  },
  // Increase timeout for API routes
  api: {
    responseLimit: '8mb', // Limit response size
    bodyParser: {
      sizeLimit: '4mb', // Limit request body size
    },
  },
};

export default nextConfig;
