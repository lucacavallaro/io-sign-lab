# io-func-sign-user

## 1.0.0

### Major Changes

- b005cb3: major release test

## 0.3.0

### Minor Changes

- a562450: Add signature mock to create a valid signature for QTSP and fix some errors

### Patch Changes

- a562450: Add base64 url encoded for createFilledDocument
- a9e668e: [SFEQS-1238] round coordinates for QTSP

## 0.2.0

### Minor Changes

- b6d4d87: [SFEQS-1208, SFEQS-1156] Implement CreateSignature and ValidateQtspSignature endpoint
- deb99dd: [SFEQS-1204, SFEQS-1214] Implement `CreateSignatureRequest`, `GetSignatureRequest`, `MarkAsWaitForSignature` Azure Functions

### Patch Changes

- bd627ee: [SFEQS-1218] Added required fields to QtspClausesMetadataDetailView openapi
- 324e2b5: [SFEQS-1217] Added location header to `createFilledDocument` endpoint
- Updated dependencies [336cd7a]
- Updated dependencies [deb99dd]
  - @io-sign/io-sign@0.9.0
