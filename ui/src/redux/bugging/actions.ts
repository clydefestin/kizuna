import { deserializeHash } from "@holochain-open-dev/core-types";
import { pushError } from "../error/actions";
import { ThunkAction } from "../types";

export const sendFoo =
  (receiver: string): ThunkAction =>
  async (dispatch, _getState, { callZome }) => {
    let receiver_key = deserializeHash(receiver);
    try {
      const foo = await callZome({
        zomeName: "bugging",
        fnName: "send_foo",
        payload: receiver_key,
      });
      console.log(foo);
      return foo;
    } catch (e) {
      dispatch(pushError("TOAST", {}, { id: "redux.err.generic" }));
    }
    return null;
  };

export const getAllFoos =
  (): ThunkAction =>
  async (dispatch, getState, { callZome }) => {
    try {
      const foos = await callZome({
        zomeName: "bugging",
        fnName: "get_all_foos",
      });
      console.log(foos);
      return foos;
    } catch (e) {
      dispatch(pushError("TOAST", {}, { id: "redux.err.generic" }));
    }
    return null;
  };