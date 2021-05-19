import { IntlShape } from "react-intl";
import { useDispatch } from "react-redux";
import { IndexedContacts } from "../redux/contacts/types";
import { Payload, TextPayload } from "../redux/commons/types";
import { Profile } from "../redux/profile/types";
import { ReduxDispatch } from "../redux/types";

// returns a new object with the values at each key mapped using mapFn(value)
// optional keyFn if user wants to uniformly edit the keys as well
export const objectMap = (
  object: any,
  mapFn: (v: any) => any,
  keyFn?: (v: string) => string
): any => {
  return Object.keys(object).reduce((result: any, key) => {
    let newKey: string | undefined;
    if (keyFn) newKey = keyFn(key);
    newKey
      ? (result[newKey] = mapFn(object[key]))
      : (result[key] = mapFn(object[key]));
    return result;
  }, {});
};

export const monthToString = (month: number, intl: IntlShape) => {
  switch (month) {
    case 0:
      return intl.formatMessage({ id: "app.groups.media.january" })!;
    case 1:
      return intl.formatMessage({ id: "app.groups.media.february" })!;
    case 2:
      return intl.formatMessage({ id: "app.groups.media.march" })!;
    case 3:
      return intl.formatMessage({ id: "app.groups.media.april" })!;
    case 4:
      return intl.formatMessage({ id: "app.groups.media.may" })!;
    case 5:
      return intl.formatMessage({ id: "app.groups.media.june" })!;
    case 6:
      return intl.formatMessage({ id: "app.groups.media.july" })!;
    case 7:
      return intl.formatMessage({ id: "app.groups.media.august" })!;
    case 8:
      return intl.formatMessage({ id: "app.groups.media.september" })!;
    case 9:
      return intl.formatMessage({ id: "app.groups.media.october" })!;
    case 10:
      return intl.formatMessage({ id: "app.groups.media.november" })!;
    case 11:
      return intl.formatMessage({ id: "app.groups.media.december" })!;
    default:
      break;
  }
};

export const indexContacts: (contacts: Profile[]) => IndexedContacts = (
  contacts
) => {
  let indexedContacts: IndexedContacts = {};
  if (contacts.length > 0) {
    let char = contacts[0].username.charAt(0).toUpperCase();
    indexedContacts[char] = [];
    contacts.forEach((contact: Profile) => {
      const currChar = contact.username.charAt(0).toUpperCase();
      if (currChar !== char) {
        char = currChar;
        indexedContacts[char] = [];
      }
      const currArr = indexedContacts[currChar];
      currArr.push(contact);
    });
  }
  const orderedIndexedContacts = Object.keys(indexedContacts)
    .sort()
    .reduce((obj: any, key: any) => {
      obj[key] = indexedContacts[key];
      return obj;
    }, {});
  return orderedIndexedContacts;
};

export const debounce: (callback: () => any, delay?: number) => Function = (
  callback,
  delay = 500
) => {
  // TODO: does this work in browser??
  let timeout: NodeJS.Timeout;
  return () => {
    clearTimeout(timeout);
    timeout = setTimeout(callback, delay);
  };
};

export const useAppDispatch = () => useDispatch<ReduxDispatch>();

export const convertCamelToSnake = (arg: string) =>
  arg.replace(/([A-Z])/g, "_$1").toLowerCase();

export const convertSnakeToCamel = (arg: string) =>
  arg.replace(/([-_]\w)/g, (g) => g[1].toUpperCase());

export const Uint8ArrayToBase64 = (arr: Uint8Array): string =>
  Buffer.from(arr)
    .toString("base64")
    .replaceAll(/\//g, "_")
    .replaceAll(/\+/g, "-");

export const base64ToUint8Array = (base64: string) =>
  new Uint8Array(
    Buffer.from(
      base64.replaceAll("_", "/").replaceAll("-", "+"),
      "base64"
    ).buffer
  );

export const convertSizeToReadableSize = (size: number) =>
  (size / 1024 / 1024).toFixed(2) === "0.00"
    ? `${(size / 1024 / 1024).toFixed(2)}mb`
    : `${(size / 1024).toFixed(2)}kb`;

type SearchContacts = (
  contacts: { [key: string]: Profile },
  username: string
) => Profile | undefined;

export const searchContacts: SearchContacts = (contacts, username) =>
  Object.values(contacts).find((curr) => username === curr.username);

export const timestampToDate = (timestamp: number[]) => {
  let { 0: seconds, 1: nanoseconds } = timestamp;
  let date = new Date(seconds * 1000 + nanoseconds * 10 ** -6);
  return date;
};

export const dateToTimestamp = (date: Date) => {
  let milliseconds = date.getTime();
  let seconds = (milliseconds / 1000) >> 0;
  let nanoseconds = (milliseconds % 1000) * 10 ** 6;
  let ret: [number, number] = [seconds, nanoseconds];
  return ret;
};

export const isTextPayload = (payload: Payload) => payload.type === "TEXT";