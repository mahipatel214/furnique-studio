# Furnique Studio — defect and issue log

| ID | Severity | Summary | Reproduction / evidence | Resolution | Status |
|---|---|---|---|---|---|
| DEF-001 | High | File repository could fail to replace an existing order file on Windows | Early JUnit run exercised persistence replacement and exposed a platform-specific move failure | Added a Windows-compatible replacement fallback; repository recreation and persistence regression test pass | Fixed |
| DEF-002 | High | Shaded executable JAR failed startup because dependency signature metadata no longer matched the combined JAR | `java -jar` printed `Invalid signature file digest for Manifest main attributes` and exited before opening port 8099 | Shade configuration excludes `.SF`, `.DSA`, `.RSA`, and `.EC` signature files; service metadata is merged. Clean verification and packaged-server startup/HTTP smoke checks pass | Fixed |
| DEF-003 | Medium | Newsletter form described consent but did not require a separate affirmative action | Browser form validation accepted an email without a consent checkbox before the update | Added required opt-in checkbox and validates the whole form; browser check confirms invalid before consent and valid after consent | Fixed |
| DEF-004 | Low | Category query initialization previously caused a temporal-dead-zone error | Prior browser check of category navigation exposed the error | Moved initialization before state construction; Living, Dining, and Bedroom query filters pass browser checks | Fixed |

## Known issues / accepted prototype limitations

These are not marked as resolved defects; they block production use:

- Product catalogue and stock are in-memory demo values, not shared/persistent inventory.
- Browser admin is a local demo UI with no authentication and is not connected to the protected API.
- No production payment, fulfilment, user account, email, real consent withdrawal, or live cloud environment exists.
- PostgreSQL/GCS service integrations and Cloud Run deployment remain unverified. Shaded-JAR duplicate-resource/module-info warnings remain non-fatal and should be reviewed before production packaging.
- No real-user usability study, browser/device matrix, penetration test, disaster-recovery drill, or public launch evidence is available.
