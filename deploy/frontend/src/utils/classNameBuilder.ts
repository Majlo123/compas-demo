function classNameBuilder(
  ...args: (string | false | null | undefined)[]
): string {
  return args.filter(Boolean).join(' ');
}
export default classNameBuilder;
