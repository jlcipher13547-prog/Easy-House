# Security Specification for PataKeja

## 1. Data Invariants
- A property must have a valid price (non-negative).
- Landlord contact details (phone/WhatsApp) must be valid string formats.
- `isVerified` can only be set to `true` by an admin (or during creation if we have an admin flow).
- `createdAt` is immutable.
- `updatedAt` must be set to `request.time`.

## 2. The "Dirty Dozen" Payloads
1. **Empty Read**: Unauthorized list query without any constraints (Allowed for this app as it's a public search platform, but limited to available properties).
2. **Identity Spoofing**: Attempt to set `isVerified` to `true` by a non-admin.
3. **Price Poisoning**: Set price to a negative value.
4. **ID Poisoning**: Use a massive string as property ID.
5. **Shadow Field**: Adding a `discountCode` field that isn't in the schema.
6. **Immutable Breach**: Attempt to change `createdAt`.
7. **Size Attack**: Sending a 1MB string in the `description`.
8. **Resource Exhaustion**: Sending an array of 1000 amenities.
9. **Timestamp Fraud**: Setting `updatedAt` to a future date manually.
10. **Landlord Spoofing**: Changing the `landlordPhone` of a property you didn't create.
11. **Type Mismatch**: Sending a string for `price`.
12. **Null Bypass**: Creating a property without the `required` fields.

## 3. The Test Runner
A `firestore.rules.test.ts` would normally verify these. I will implement the rules to block these.
