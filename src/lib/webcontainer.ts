// Stub implementation for non-WebContainer environments
export async function getWebContainer(): Promise<any> {
  return Promise.resolve({
    // Stub methods if needed
    mount: async () => {},
    spawn: async () => {},
    teardown: async () => {},
  });
}

export async function teardownWebContainer(): Promise<void> {
  // No-op in non-WebContainer environments
  return Promise.resolve();
}