# NOC EFDMS — Local Mac edition 1.1

The existing NOC records workspace, with individual email/password logins for all six roles and a white Commonwealth Sport wordmark in dark mode. Designed for the Node.js 22.19.0 already working on your macOS 12.6 Mac. No Cloudflare, Docker, Codespaces, paid hosting, or manual database commands are required.

## Upgrade from your previous local edition — keep your records

1. Stop the old app with Ctrl+C.
2. Copy its entire `data` folder to a separate backup location.
3. Unzip this download into a new folder. Do not overwrite your only copy of the old app.
4. Copy the old app's entire `data` folder into this new `noc-efdms-local` folder, alongside `package.json`. Do this BEFORE launching the new app. If you have already launched the new app with an empty database, stop it and move that newly created `data` folder aside before copying the original.
5. In VS Code, choose File → Open Folder and open the new `noc-efdms-local` folder.
6. Open Terminal → New Terminal and run `npm run dev`.
7. Open http://127.0.0.1:5173. Create your administrator login with your name, email and a password of at least 12 characters.

The first login setup keeps the original local-administrator identity, so existing documents and ownership are preserved. Migration runs automatically. Do not copy only records.sqlite: uploads must travel with it. Do not move cloud/Codespaces database files into this edition; those are a separate format and workflow.

## Fresh start

Open the extracted folder in VS Code and run `npm run dev`. The included build starts without `npm install`. The app initializes its database and 79 folders, then asks you to create an administrator login. There are no built-in shared passwords or preset staff accounts.

Your Node version should be 22.19.0 or a later compatible version. Check with `node --version`. Node 22 may show a SQLite experimental warning; it is informational. Stop with Ctrl+C. If port 5173 is occupied, stop the old app or run `PORT=5174 npm run dev` and use the printed address.

## Add and use accounts

As administrator, open **People → Add account**. Enter a name, email, initial password and role. Share credentials privately with that person; the app does not send email.

Supported roles:
- Super Administrator
- Records Manager
- Department Administrator
- Staff Member
- Executive / Approver
- Read-Only User

A role is an access level, not a preset account. Create as many named accounts as you need. Administrators can change another user's role or suspend/reactivate them with **Manage role**, or set a replacement password with **Reset password**. A password reset invalidates the user's open sessions. You cannot suspend or change your own administrator role.

Every user can change their own password under **Settings → Change your password**, supplying their current password. They must sign in again afterwards. Users who forget their password must ask an administrator; there is no email password recovery. Keep your administrator password safely stored, or create a second administrator for recovery.

Sign out using the icon beside your name before another user signs in. Separate browser profiles can keep different accounts signed in. Sessions expire after eight hours and end when the server restarts.

## Permissions and local scope

Read-only users cannot upload or modify records. Confidential/restricted documents are limited to their owner, assigned reviewer and super administrators. PUBLIC/INTERNAL records are visible to signed-in users. Independent reviewers can receive submissions and approve/reject records within the existing workflow. Accounts use the same records database on this Mac; they do not each get a separate private database.

This is still a local-only server bound to 127.0.0.1. Other computers cannot connect to it. Separate staff access over a network or internet hosting requires a separate deployment setup. The hosted site is unchanged and is not synchronized with this download.

Passwords are stored as unique salted scrypt hashes. Sessions use random HttpOnly, SameSite cookies; login attempts are rate-limited and mutations require the local origin. These are application-level controls, not protection against someone who can directly read or alter your Mac's files. Records/uploads are not encrypted by this app. Keep your Mac account and backups protected.

## Edit in VS Code

Run `npm install` once, then `npm run dev`. Source edits are rebuilt automatically; refresh the browser after **Rebuilt** appears. Server changes require signing in again.

- `src/workspace.tsx`: records interface and interactions.
- `src/accounts.tsx`: login, account creation and password screens.
- `src/styles.css`: light/dark themes and layout.
- `src/service.ts`: records operations and permissions.
- `src/policy.ts`: validation and workflow rules.
- `server/accounts.mjs`: password hashing, sessions and account administration.
- `server/storage.mjs`: SQLite and disk storage; automatic migrations.
- `server/index.mjs`: local HTTP server.
- `public/brand/`: logos, light/dark Commonwealth variants and credits.

`npm run build` rebuilds the included bundles. `npm start` runs the build without watching source. `npm test` verifies the domain services, logins for every role, permission boundaries, password updates, suspension, upgrade and persistence.

## Features retained

Apple-inspired interface, official NOC and Commonwealth branding, favicon, dark mode, 79 folders, uploads/downloads, metadata search, favorites, version history/restoration, review states, correspondence, notifications, reports, audit history, archiving, legal hold, and recovery. Commonwealth lettering turns white in dark mode while its coloured symbol is unchanged.

As with the previous app, malware scanning, OCR, department-scoped folder ACLs, configurable multi-stage approvals and enterprise backup administration are not implemented. Department Administrator and Staff Member retain the existing general staff permissions, not separate department boundaries. Office documents are download-only; PDF/image/text previews remain supported. Maximum upload is 20 MB.

## Backups

Records and credentials are in `data/records.sqlite`; files are in `data/uploads/`. Stop the app, then back up the ENTIRE `data` folder. Restore only while stopped, preserving your current data separately first. Clearing browser data does not delete records. The .gitignore excludes data and node_modules from Git.

## Verification

Build and tests passed on Linux using Node.js 22.19.0. Tests cover all six role logins, wrong passwords, duplicate accounts, forbidden account creation, origin protection, read-only restrictions, confidential file access, independent approval, password changes/resets, session invalidation, suspended accounts, restart persistence, and upgrading an existing local database without losing administrator identity or documents. The existing 23 records checks also pass.

The first-run login screen and white Commonwealth text in dark mode were visually checked in a browser preview. macOS 12.6 itself was not available here; the original local edition ran successfully on your Mac, and this update uses the same Node/SQLite approach.
