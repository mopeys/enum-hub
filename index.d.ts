declare class EnumHub<FR extends (n: string) => unknown> {
  private fetchRemote: FR;
  constructor(options: { fetchRemote: FR; max?: number });
  getEnum: <
    LFR extends (n: string, f?: (n: string) => unknown) => unknown = FR
  >(
    name: string,
    fetchRemote?: LFR
  ) => Promise<
    LFR extends (n: string) => infer LR
      ? LR
      : FR extends (n: string) => infer R
      ? R
      : never
  >;
}

export default EnumHub;
