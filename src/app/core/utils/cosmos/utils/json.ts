export function prepareSignBytes(obj: any): any {
  if (Array.isArray(obj)) {
    return obj.map(prepareSignBytes);
  }

  // string, number, or null
  if (typeof obj !== `object` || obj === null) {
    return obj;
  }

  const sorted: any = {};

  Object.keys(obj)
    .sort()
    .forEach((key) => {
      if (obj[key] === undefined || obj[key] === null) return;
      sorted[key] = prepareSignBytes(obj[key]);
    });
  return sorted;
}

export abstract class JSONSerializable<A, D, P> {
  public abstract toAmino(): A;
  public abstract toData(): D;
  public abstract toProto(): P;
  public toJSON(): string {
    return JSON.stringify(prepareSignBytes(this.toData()));
  }
  public toAminoJSON(): string {
    return JSON.stringify(prepareSignBytes(this.toAmino()));
  }
}
