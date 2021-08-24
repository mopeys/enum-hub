export default EnumHub;
class EnumHub {
  constructor(options: { fetchRemote: Function; max?: number }) {}
  getEnum: (
    name: string,
    fetchRemote?: Function
  ) => Promise<ReturnType<typeof fetchRemote>>;
}
