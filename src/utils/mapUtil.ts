import type { IStreetletInfo } from "@/models/loc";
import type { IMaterialTypeInfo } from "@/models/matl";
import { pickBy, identity } from 'lodash';

export function buildbooleanMap(nullText: string, trueText: string, falseText: string) {
  return new Map<string, string>().set('', nullText).set('true', trueText).set('false', falseText);
}


export function buildMaterialTypeMap(options?: IMaterialTypeInfo[]) {
  const map = new Map<string, string>();
  map.set('', '全部');
  if (options) {
    options.forEach(x => {
      map.set(x.materialType, x.displayName);
    });
  }
  return map;
}

export async function buildStreetletMap(options?: IStreetletInfo[]) {
  const map = new Map();
  map.set(undefined, '全部');
  if (options) {
    options.forEach(x => {
      map.set(x.streetletId, x.streetletCode);
    });
  }
  return map;
}

export function trimArgs(args: any) {
  const obj = pickBy(args, identity);
  Object.keys(obj).forEach(k => {
    if (obj[k] === 'true') {
      obj[k] = true;
    } else if (obj[k] === 'false') {
      obj[k] = false;
    }
  });
  return obj;
}
