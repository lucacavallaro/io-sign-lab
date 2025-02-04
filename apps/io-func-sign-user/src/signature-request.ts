import {
  SignatureRequestToBeSigned,
  SignatureRequestRejected,
  SignatureRequestSigned,
} from "@io-sign/io-sign/signature-request";

import { Id } from "@io-sign/io-sign/id";
import * as E from "fp-ts/lib/Either";
import * as TE from "fp-ts/lib/TaskEither";
import * as O from "fp-ts/lib/Option";

import * as t from "io-ts";
import { pipe } from "fp-ts/lib/function";
import { ActionNotAllowedError } from "@io-sign/io-sign/error";

export const SignatureRequest = t.union([
  SignatureRequestToBeSigned,
  SignatureRequestRejected,
  SignatureRequestSigned,
]);

export type SignatureRequest = t.TypeOf<typeof SignatureRequest>;

export type GetSignatureRequest = (
  id: Id
) => (signerId: Id) => TE.TaskEither<Error, O.Option<SignatureRequest>>;

export type InsertSignatureRequest = (
  request: SignatureRequest
) => TE.TaskEither<Error, SignatureRequest>;

export type UpsertSignatureRequest = (
  request: SignatureRequest
) => TE.TaskEither<Error, SignatureRequest>;

export type NotifySignatureRequestWaitForSignatureEvent = (
  requestToBeSigned: SignatureRequestToBeSigned
) => TE.TaskEither<Error, string>;

type Action_MARK_AS_SIGNED = {
  name: "MARK_AS_SIGNED";
};

type Action_MARK_AS_REJECTED = {
  name: "MARK_AS_REJECTED";
  payload: {
    reason: string;
  };
};

type SignatureRequestAction = Action_MARK_AS_SIGNED | Action_MARK_AS_REJECTED;

const dispatch =
  (action: SignatureRequestAction) =>
  (request: SignatureRequest): E.Either<Error, SignatureRequest> =>
    request.status === "WAIT_FOR_SIGNATURE"
      ? pipe(request, onWaitForSignatureStatus(action))
      : E.left(
          new ActionNotAllowedError(
            "This operation is prohibited because the signature request has already been signed"
          )
        );

const onWaitForSignatureStatus =
  (action: SignatureRequestAction) =>
  (
    request: SignatureRequestToBeSigned
  ): E.Either<Error, SignatureRequestSigned | SignatureRequestRejected> => {
    switch (action.name) {
      case "MARK_AS_SIGNED":
        return E.right({
          ...request,
          status: "SIGNED",
          signedAt: new Date(),
        });
      case "MARK_AS_REJECTED":
        return E.right({
          ...request,
          status: "REJECTED",
          rejectedAt: new Date(),
          rejectReason: action.payload.reason,
        });
      default:
        return E.left(
          new ActionNotAllowedError(
            "This operation is prohibited if the signature request is in WAIT_FOR_SIGNATURE status"
          )
        );
    }
  };

export const markAsSigned = dispatch({ name: "MARK_AS_SIGNED" });
export const markAsRejected = (reason: string) =>
  dispatch({
    name: "MARK_AS_REJECTED",
    payload: { reason },
  });
