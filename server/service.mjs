// src/service.ts
import { env } from "../server/storage.mjs";
import { getLocalUser as getChatGPTUser } from "../server/identity.mjs";

// src/seed.json
var seed_default = [
  {
    id: "international",
    name: "International Sporting Bodies",
    parent: null
  },
  {
    id: "national",
    name: "National Sport Federations",
    parent: null
  },
  {
    id: "administration",
    name: "Administration",
    parent: null
  },
  {
    id: "intl-1",
    name: "International Olympic Committee (IOC)",
    parent: "international"
  },
  {
    id: "intl-2",
    name: "Commonwealth Sport",
    parent: "international"
  },
  {
    id: "intl-3",
    name: "Association of National Olympic Committees of Africa (ANOCA)",
    parent: "international"
  },
  {
    id: "intl-4",
    name: "International Sports Federations",
    parent: "international"
  },
  {
    id: "intl-5",
    name: "African Sports Organizations",
    parent: "international"
  },
  {
    id: "intl-6",
    name: "International Games and Competitions",
    parent: "international"
  },
  {
    id: "intl-7",
    name: "International Partnerships and Agreements",
    parent: "international"
  },
  {
    id: "intl-8",
    name: "International Correspondence",
    parent: "international"
  },
  {
    id: "intl-9",
    name: "International Meetings and Reports",
    parent: "international"
  },
  {
    id: "intl-10",
    name: "Other International Organizations",
    parent: "international"
  },
  {
    id: "olympic",
    name: "Olympic Sports Federations",
    parent: "national"
  },
  {
    id: "olympic-1",
    name: "Athletics Federation of Nigeria (AFN)",
    parent: "olympic"
  },
  {
    id: "olympic-2",
    name: "Nigeria Badminton Federation",
    parent: "olympic"
  },
  {
    id: "olympic-3",
    name: "Nigeria Basketball Federation (NBBF)",
    parent: "olympic"
  },
  {
    id: "olympic-4",
    name: "Nigeria Amateur Boxing Federation",
    parent: "olympic"
  },
  {
    id: "olympic-5",
    name: "Nigeria Cycling Federation",
    parent: "olympic"
  },
  {
    id: "olympic-6",
    name: "Nigeria Fencing Federation",
    parent: "olympic"
  },
  {
    id: "olympic-7",
    name: "Nigeria Football Federation (NFF)",
    parent: "olympic"
  },
  {
    id: "olympic-8",
    name: "Nigeria Golf Federation",
    parent: "olympic"
  },
  {
    id: "olympic-9",
    name: "Nigeria Gymnastics Federation",
    parent: "olympic"
  },
  {
    id: "olympic-10",
    name: "Nigeria Handball Federation",
    parent: "olympic"
  },
  {
    id: "olympic-11",
    name: "Nigeria Hockey Federation",
    parent: "olympic"
  },
  {
    id: "olympic-12",
    name: "Nigeria Judo Federation",
    parent: "olympic"
  },
  {
    id: "olympic-13",
    name: "Nigeria Modern Pentathlon Federation",
    parent: "olympic"
  },
  {
    id: "olympic-14",
    name: "Nigeria Rowing, Canoeing and Sailing Federation",
    parent: "olympic"
  },
  {
    id: "olympic-15",
    name: "Nigeria Rugby Federation",
    parent: "olympic"
  },
  {
    id: "olympic-16",
    name: "Nigeria Shooting Sport Federation",
    parent: "olympic"
  },
  {
    id: "olympic-17",
    name: "Nigeria Table Tennis Federation",
    parent: "olympic"
  },
  {
    id: "olympic-18",
    name: "Nigeria Taekwondo Federation",
    parent: "olympic"
  },
  {
    id: "olympic-19",
    name: "Nigeria Tennis Federation",
    parent: "olympic"
  },
  {
    id: "olympic-20",
    name: "Nigeria Triathlon Union",
    parent: "olympic"
  },
  {
    id: "olympic-21",
    name: "Nigeria Volleyball Federation",
    parent: "olympic"
  },
  {
    id: "olympic-22",
    name: "Nigeria Weightlifting Federation",
    parent: "olympic"
  },
  {
    id: "olympic-23",
    name: "Nigeria Wrestling Federation",
    parent: "olympic"
  },
  {
    id: "olympic-24",
    name: "Nigeria Archery Federation",
    parent: "olympic"
  },
  {
    id: "olympic-25",
    name: "Nigeria Aquatics Federation",
    parent: "olympic"
  },
  {
    id: "non-olympic",
    name: "Non-Olympic Sports Federations",
    parent: "national"
  },
  {
    id: "non-olympic-1",
    name: "Nigeria Baseball and Softball Federation",
    parent: "non-olympic"
  },
  {
    id: "non-olympic-2",
    name: "Nigeria Bowling Federation",
    parent: "non-olympic"
  },
  {
    id: "non-olympic-3",
    name: "Nigeria Chess Federation",
    parent: "non-olympic"
  },
  {
    id: "non-olympic-4",
    name: "Nigeria Cricket Federation",
    parent: "non-olympic"
  },
  {
    id: "non-olympic-5",
    name: "Deaf Sport Federation of Nigeria",
    parent: "non-olympic"
  },
  {
    id: "non-olympic-6",
    name: "Nigeria Karate Federation",
    parent: "non-olympic"
  },
  {
    id: "non-olympic-7",
    name: "Nigeria Netball Federation",
    parent: "non-olympic"
  },
  {
    id: "non-olympic-8",
    name: "Nigeria Polo Federation",
    parent: "non-olympic"
  },
  {
    id: "non-olympic-9",
    name: "Nigeria Scrabble Federation",
    parent: "non-olympic"
  },
  {
    id: "non-olympic-10",
    name: "Nigeria Fives Federation",
    parent: "non-olympic"
  },
  {
    id: "non-olympic-11",
    name: "Nigeria Squash Rackets Federation",
    parent: "non-olympic"
  },
  {
    id: "non-olympic-12",
    name: "Nigeria Wushu Kunfu Federation",
    parent: "non-olympic"
  },
  {
    id: "non-olympic-13",
    name: "Nigeria Traditional Sports Federation",
    parent: "non-olympic"
  },
  {
    id: "non-olympic-14",
    name: "Nigeria Water Ski Federation",
    parent: "non-olympic"
  },
  {
    id: "non-olympic-15",
    name: "Tug of War Sport Federation of Nigeria",
    parent: "non-olympic"
  },
  {
    id: "recognized",
    name: "Other Recognized National Federations and Bodies",
    parent: "national"
  },
  {
    id: "recognized-1",
    name: "Nigeria Arm Wrestling Federation",
    parent: "recognized"
  },
  {
    id: "recognized-2",
    name: "Nigeria Padel Federation",
    parent: "recognized"
  },
  {
    id: "recognized-3",
    name: "Bobsled & Skeleton Federation of Nigeria",
    parent: "recognized"
  },
  {
    id: "recognized-4",
    name: "Nigerian Boxing Board of Control (NBBofC)",
    parent: "recognized"
  },
  {
    id: "admin-1",
    name: "Office of the President",
    parent: "administration"
  },
  {
    id: "admin-2",
    name: "Office of the Secretary General",
    parent: "administration"
  },
  {
    id: "admin-3",
    name: "Board and Executive Management",
    parent: "administration"
  },
  {
    id: "admin-4",
    name: "Human Resources and Personnel",
    parent: "administration"
  },
  {
    id: "admin-5",
    name: "Finance and Accounting",
    parent: "administration"
  },
  {
    id: "admin-6",
    name: "Procurement and Contracts",
    parent: "administration"
  },
  {
    id: "admin-7",
    name: "Legal Affairs and Compliance",
    parent: "administration"
  },
  {
    id: "admin-8",
    name: "Information Technology",
    parent: "administration"
  },
  {
    id: "admin-9",
    name: "Internal Memoranda",
    parent: "administration"
  },
  {
    id: "admin-10",
    name: "Incoming Correspondence",
    parent: "administration"
  },
  {
    id: "admin-11",
    name: "Outgoing Correspondence",
    parent: "administration"
  },
  {
    id: "admin-12",
    name: "Meetings and Minutes",
    parent: "administration"
  },
  {
    id: "admin-13",
    name: "Policies and Procedures",
    parent: "administration"
  },
  {
    id: "admin-14",
    name: "Projects and Workplans",
    parent: "administration"
  },
  {
    id: "admin-15",
    name: "Reports and Publications",
    parent: "administration"
  },
  {
    id: "admin-16",
    name: "Travel and Logistics",
    parent: "administration"
  },
  {
    id: "admin-17",
    name: "Facilities and Assets",
    parent: "administration"
  },
  {
    id: "admin-18",
    name: "Historical Administrative Records",
    parent: "administration"
  },
  {
    id: "admin-19",
    name: "Other Administrative Documents",
    parent: "administration"
  }
];

// src/policy.ts
var roles = ["Super Administrator", "Records Manager", "Department Administrator", "Staff Member", "Executive / Approver", "Read-Only User"];
function canWrite(role) {
  return role !== "Read-Only User";
}
function canManage(role) {
  return ["Super Administrator", "Records Manager"].includes(role);
}
function canRead(user, doc) {
  return user.role === "Super Administrator" || doc.owner === user.id || doc.reviewer === user.id || ["PUBLIC", "INTERNAL"].includes(doc.classification);
}
function assertMove(id, parent, folders) {
  const seen = /* @__PURE__ */ new Set([id]);
  while (parent) {
    if (seen.has(parent)) throw new Error("A folder cannot be moved into itself or its descendants.");
    seen.add(parent);
    const f = folders.find((x) => x.id === parent);
    if (!f) throw new Error("Parent folder does not exist.");
    parent = f.parent;
  }
}
function mayDelete(doc, now2 = (/* @__PURE__ */ new Date()).toISOString().slice(0, 10)) {
  return !doc.hold && (!doc.retain_until || doc.retain_until <= now2);
}
function nextStatus(current, action) {
  const map = { submit: { Draft: "Submitted", Rejected: "Submitted", "Revision Requested": "Submitted" }, review: { Submitted: "Under Review" }, approve: { "Under Review": "Approved" }, reject: { "Under Review": "Rejected" }, revise: { "Under Review": "Revision Requested" } };
  const next = map[action]?.[current];
  if (!next) throw new Error("This workflow transition is not allowed.");
  return next;
}
function validateFile(name, bytes) {
  const ext = name.split(".").pop()?.toLowerCase();
  const text = new TextDecoder().decode(bytes.slice(0, 512));
  const sig = (a) => a.every((n, i) => bytes[i] === n);
  let mime = "";
  if (ext === "pdf" && text.startsWith("%PDF-")) mime = "application/pdf";
  if (ext === "png" && sig([137, 80, 78, 71, 13, 10, 26, 10])) mime = "image/png";
  if (["jpg", "jpeg"].includes(ext || "") && sig([255, 216, 255])) mime = "image/jpeg";
  if (["txt", "csv"].includes(ext || "") && !bytes.includes(0) && !/<\s*(script|html|svg|iframe)/i.test(text)) mime = ext === "csv" ? "text/csv" : "text/plain";
  if (["docx", "xlsx", "pptx"].includes(ext || "") && sig([80, 75, 3, 4])) mime = "application/octet-stream";
  if (["doc", "xls", "ppt"].includes(ext || "") && sig([208, 207, 17, 224, 161, 177, 26, 225])) mime = "application/octet-stream";
  if (!mime) throw new Error("Unsupported file type or file signature does not match.");
  return mime;
}

// src/service.ts
var database = () => {
  if (!env.DB) throw new Error("Database is not configured.");
  return env.DB;
};
var all = async (sql, ...args) => {
  const r = await database().prepare(sql).bind(...args).all();
  return r.results;
};
var one = async (sql, ...args) => (await all(sql, ...args))[0];
var statement = (sql, ...args) => database().prepare(sql).bind(...args);
var uid = () => crypto.randomUUID();
var now = () => (/* @__PURE__ */ new Date()).toISOString();
function audit(actor, action, target, detail = "") {
  return statement("INSERT INTO events VALUES(?,?,?,?,?,?)", uid(), actor, action, target, detail, now());
}
function notification(user, message, document) {
  return statement("INSERT INTO notifications VALUES(?,?,?,?,0,?)", uid(), user, message, document, now());
}
async function identity() {
  const who = await getChatGPTUser();
  if (!who) throw new Error("AUTH_REQUIRED");
  let u = await one("SELECT * FROM users WHERE id=?", who.userId);
  if (!u) {
    await statement("INSERT OR IGNORE INTO users(id,email,name,role,active) SELECT ?,?,?,CASE WHEN EXISTS(SELECT 1 FROM users) THEN 'Read-Only User' ELSE 'Super Administrator' END,1", who.userId, who.email, who.displayName).run();
    u = await one("SELECT * FROM users WHERE id=?", who.userId);
  }
  if (!u.active) throw new Error("Account suspended.");
  return u;
}
async function seedFolders() {
  await database().batch(seed_default.map((f) => statement("INSERT OR IGNORE INTO folders(id,name,parent,description,archived,protected,created) VALUES(?,?,?,'',0,?,?)", f.id, f.name, f.parent, f.parent === null ? 1 : 0, now())));
}
async function getDocument(id, user) {
  const d = await one("SELECT * FROM documents WHERE id=?", id);
  if (!d || !canRead(user, d)) throw new Error("Record not found or access denied.");
  return d;
}
async function snapshot(req) {
  const u = await identity();
  await seedFolders();
  const url = new URL(req.url);
  if (url.searchParams.get("file")) {
    const d = await getDocument(url.searchParams.get("file"), u);
    if (d.deleted) throw new Error("Record is in recovery.");
    const version = Number(url.searchParams.get("version") || d.version);
    const v = await one("SELECT * FROM versions WHERE document=? AND number=?", d.id, version);
    if (!v || !env.BUCKET) throw new Error("File not available.");
    const obj = await env.BUCKET.get(String(v.key));
    if (!obj) throw new Error("File not available.");
    await audit(u.id, "Downloaded document", String(d.id), `Version ${version}`).run();
    return new Response(obj.body, { headers: { "Content-Type": String(v.mime), "Content-Disposition": `${url.searchParams.get("preview") && ["application/pdf", "image/png", "image/jpeg", "text/plain"].includes(String(v.mime)) ? "inline" : "attachment"}; filename*=UTF-8''${encodeURIComponent(String(v.filename))}`, "Cache-Control": "private, no-store", "X-Content-Type-Options": "nosniff", "Content-Security-Policy": "sandbox; default-src 'none'" } });
  }
  if (url.searchParams.get("document")) {
    const d = await getDocument(url.searchParams.get("document"), u);
    return Response.json({ document: d, versions: await all("SELECT id,document,number,filename,mime,size,actor,note,created FROM versions WHERE document=? ORDER BY number DESC", d.id), events: await all("SELECT * FROM events WHERE target=? ORDER BY created DESC", d.id) });
  }
  const docs = await all("SELECT d.*,v.filename,v.mime,v.size,EXISTS(SELECT 1 FROM stars s WHERE s.document=d.id AND s.user=?) starred FROM documents d LEFT JOIN versions v ON v.document=d.id AND v.number=d.version WHERE (d.classification IN ('PUBLIC','INTERNAL') OR d.owner=? OR d.reviewer=? OR ?='Super Administrator') ORDER BY d.updated DESC", u.id, u.id, u.id, u.role);
  const visible = new Set(docs.map((d) => d.id));
  return Response.json({ user: u, folders: await all("SELECT * FROM folders ORDER BY name"), documents: docs, users: u.role === "Super Administrator" ? await all("SELECT * FROM users") : await all("SELECT id,name,role FROM users WHERE active=1"), events: canManage(u.role) ? (await all("SELECT * FROM events ORDER BY created DESC LIMIT 150")).filter((e) => visible.has(e.target) || !String(e.action).toLowerCase().includes("document")) : [], correspondence: (await all("SELECT * FROM correspondence ORDER BY created DESC")).filter((c) => (c.owner === u.id || canManage(u.role)) && (!c.document || visible.has(c.document))), notifications: (await all("SELECT * FROM notifications WHERE user=? ORDER BY created DESC LIMIT 100", u.id)).filter((n) => !n.document || visible.has(n.document)) });
}
var str = (x, max = 300) => {
  if (typeof x !== "string" || !x.trim() || x.length > max) throw new Error("Please provide a valid value.");
  return x.trim();
};
async function mutate(req) {
  const u = await identity();
  if (req.headers.get("origin") !== new URL(req.url).origin) throw new Error("Invalid request origin.");
  if (req.headers.get("content-type")?.includes("multipart/form-data")) return upload(req, u);
  const b = await req.json();
  const action = str(b.action);
  if (action === "readNotification") {
    await statement("UPDATE notifications SET read=1 WHERE id=? AND user=?", str(b.id), u.id).run();
    return Response.json({ ok: true });
  }
  if (action === "star") {
    await getDocument(str(b.id), u);
    const id = `${u.id}:${b.id}`;
    if (await one("SELECT id FROM stars WHERE id=?", id)) await statement("DELETE FROM stars WHERE id=?", id).run();
    else await statement("INSERT INTO stars VALUES(?,?,?)", id, u.id, b.id).run();
    return Response.json({ ok: true });
  }
  if (!canWrite(u.role)) throw new Error("Your role is read-only.");
  if (action === "folder") {
    if (!canManage(u.role)) throw new Error("Records Manager permission required.");
    const parent = b.parent ? str(b.parent) : null;
    if (!parent) throw new Error("Create a folder inside one of the three core directories.");
    const folders = await all("SELECT * FROM folders");
    const p = folders.find((f) => f.id === parent);
    if (!p || p.archived) throw new Error("Choose an active parent folder.");
    const id = b.id ? str(b.id) : uid();
    assertMove(id, parent, folders);
    const old = folders.find((f) => f.id === id);
    if (old?.protected) throw new Error("Core directories are protected.");
    await database().batch([statement("INSERT INTO folders VALUES(?,?,?,?,0,0,?) ON CONFLICT(id) DO UPDATE SET name=excluded.name,parent=excluded.parent,description=excluded.description", id, str(b.name), parent, String(b.description || ""), now()), audit(u.id, old ? "Updated folder" : "Created folder", id, str(b.name))]);
  } else if (action === "folderArchive") {
    if (!canManage(u.role)) throw new Error("Records Manager permission required.");
    const f = await one("SELECT * FROM folders WHERE id=?", str(b.id));
    if (!f || f.protected) throw new Error("Core directories are protected.");
    const count = await one("SELECT (SELECT COUNT(*) FROM folders WHERE parent=? AND archived=0)+(SELECT COUNT(*) FROM documents WHERE folder=? AND archived=0 AND deleted=0) total", b.id, b.id);
    if (!b.restore && Number(count.total) > 0) throw new Error("Archive or move active contents first.");
    await database().batch([statement("UPDATE folders SET archived=? WHERE id=?", b.restore ? 0 : 1, b.id), audit(u.id, b.restore ? "Restored folder" : "Archived folder", str(b.id))]);
  } else if (action === "user") {
    if (u.role !== "Super Administrator") throw new Error("Administrator permission required.");
    if (b.id === u.id) throw new Error("You cannot change your own administrator access.");
    if (!roles.includes(b.role)) throw new Error("Invalid role.");
    await database().batch([statement("UPDATE users SET role=?,active=? WHERE id=?", b.role, b.active ? 1 : 0, str(b.id)), audit(u.id, "Updated user access", str(b.id), String(b.role))]);
  } else if (action === "correspondence") {
    if (b.document) await getDocument(str(b.document), u);
    if (!["Incoming", "Outgoing"].includes(String(b.direction))) throw new Error("Invalid correspondence direction.");
    const id = uid();
    await database().batch([statement("INSERT INTO correspondence VALUES(?,?,?,?,?,?,?,?,?,?)", id, b.direction, str(b.subject), str(b.party), str(b.priority), b.deadline || null, "Open", b.document || null, u.id, now()), audit(u.id, "Registered correspondence", id, str(b.subject))]);
  } else if (action === "closeCorrespondence") {
    const c = await one("SELECT * FROM correspondence WHERE id=?", str(b.id));
    if (!c || c.owner !== u.id && !canManage(u.role)) throw new Error("Access denied.");
    await database().batch([statement("UPDATE correspondence SET status='Closed' WHERE id=?", b.id), audit(u.id, "Closed correspondence", str(b.id))]);
  } else {
    const d = await getDocument(str(b.id), u);
    const manager = canManage(u.role);
    const owner = d.owner === u.id;
    if (!manager && !owner && d.reviewer !== u.id) throw new Error("You cannot modify this document.");
    const id = String(d.id);
    let st = [];
    if (["submit", "review", "approve", "reject", "revise"].includes(action)) {
      if (d.deleted || d.archived) throw new Error("Restore this record before changing its workflow.");
      if (["review", "approve", "reject", "revise"].includes(action) && d.reviewer !== u.id && u.role !== "Super Administrator") throw new Error("Only the assigned reviewer may decide.");
      const status = nextStatus(String(d.status), action);
      if (["reject", "revise"].includes(action) && !b.note) throw new Error("Provide a reason for your decision.");
      let reviewer = d.reviewer;
      if (action === "submit") {
        reviewer = str(b.reviewer);
        if (!await one("SELECT id FROM users WHERE id=? AND active=1 AND role IN ('Super Administrator','Executive / Approver','Records Manager')", reviewer)) throw new Error("Select an authorized reviewer.");
      }
      st = [statement("UPDATE documents SET status=?,reviewer=?,due=?,updated=? WHERE id=?", status, reviewer, b.due || d.due || null, now(), id), notification(String(action === "submit" ? reviewer : d.owner), `${d.title}: ${status}`, id), audit(u.id, "Document workflow", id, JSON.stringify({ version: d.version, status, note: b.note || "" }))];
    } else if (action === "archive" || action === "restore" || action === "delete" || action === "recover") {
      if (!manager && !owner) throw new Error("Owner permission required.");
      if (action === "delete" && (!manager || !mayDelete(d))) throw new Error("Deletion blocked: retention policy, legal hold, or permissions.");
      const field = action === "delete" || action === "recover" ? "deleted" : "archived";
      st = [statement(`UPDATE documents SET ${field}=?,updated=? WHERE id=?`, ["archive", "delete"].includes(action) ? 1 : 0, now(), id), audit(u.id, `${action} document`, id)];
    } else if (action === "metadata") {
      if (d.deleted || d.archived) throw new Error("Restore this record before editing.");
      if ((b.retainUntil || null) !== d.retain_until && !manager) throw new Error("Records Manager permission is required to change retention.");
      if (!owner && !manager) throw new Error("Owner permission required.");
      if (!["PUBLIC", "INTERNAL", "RESTRICTED", "CONFIDENTIAL"].includes(String(b.classification))) throw new Error("Invalid classification.");
      if (!await one("SELECT id FROM folders WHERE id=? AND archived=0", str(b.folder))) throw new Error("Choose an active folder.");
      st = [statement("UPDATE documents SET title=?,folder=?,classification=?,metadata=?,retain_until=?,updated=? WHERE id=?", str(b.title), b.folder, b.classification, JSON.stringify(b.metadata || {}), b.retainUntil || null, now(), id), audit(u.id, "Updated document metadata", id)];
    } else if (action === "hold") {
      if (!manager) throw new Error("Records Manager permission required.");
      st = [statement("UPDATE documents SET hold=? WHERE id=?", b.hold ? 1 : 0, id), audit(u.id, "Changed document legal hold", id, String(!!b.hold))];
    } else if (action === "lock") {
      if (d.locked_by && d.locked_by !== u.id && !manager) throw new Error("Checked out by another user.");
      st = [statement("UPDATE documents SET locked_by=? WHERE id=?", b.lock ? u.id : null, id), audit(u.id, b.lock ? "Checked out document" : "Checked in document", id)];
    } else if (action === "restoreVersion") {
      if (d.deleted || d.archived || d.locked_by && d.locked_by !== u.id) throw new Error("Restore and check in this record before restoring a version.");
      if (!owner && !manager) throw new Error("Owner permission required.");
      const v = await one("SELECT * FROM versions WHERE document=? AND number=?", id, Number(b.number));
      if (!v) throw new Error("Version not found.");
      const n = Number(d.version) + 1;
      st = [statement("INSERT INTO versions VALUES(?,?,?,?,?,?,?,?,?,?)", uid(), id, n, v.key, v.filename, v.mime, v.size, u.id, `Restored version ${v.number}`, now()), statement("UPDATE documents SET version=?,status='Draft',updated=? WHERE id=?", n, now(), id), audit(u.id, "Restored document version", id, String(v.number))];
    } else throw new Error("Unknown action.");
    await database().batch(st);
  }
  return Response.json({ ok: true });
}
async function upload(req, u) {
  if (!canWrite(u.role)) throw new Error("Your role is read-only.");
  if (Number(req.headers.get("content-length")) > 21 * 1024 * 1024) throw new Error("Maximum upload size is 20 MB.");
  if (!env.BUCKET) throw new Error("Private storage is not configured.");
  const form = await req.formData();
  const file = form.get("file");
  if (!(file instanceof File) || !file.size || file.size > 20 * 1024 * 1024) throw new Error("Choose a non-empty file up to 20 MB.");
  const bytes = new Uint8Array(await file.arrayBuffer());
  const mime = validateFile(file.name, bytes);
  let d;
  const existing = form.get("document");
  if (existing) {
    d = await getDocument(String(existing), u);
    if (d.owner !== u.id && !canManage(u.role)) throw new Error("You cannot revise this document.");
    if (d.locked_by && d.locked_by !== u.id) throw new Error("Document is checked out.");
    if (d.deleted || d.archived) throw new Error("Restore this record before revising it.");
  }
  const folder = d?.folder || str(form.get("folder"));
  if (!await one("SELECT id FROM folders WHERE id=? AND archived=0", folder)) throw new Error("Choose an active folder.");
  const classification = String(form.get("classification") || "INTERNAL");
  if (!["PUBLIC", "INTERNAL", "RESTRICTED", "CONFIDENTIAL"].includes(classification)) throw new Error("Invalid classification.");
  const id = d ? String(d.id) : uid();
  const version = d ? Number(d.version) + 1 : 1;
  const key = `documents/${id}/${uid()}`;
  await env.BUCKET.put(key, bytes, { httpMetadata: { contentType: mime } });
  const title = String(form.get("title") || file.name).slice(0, 300);
  const date = now();
  const statements = [statement("INSERT INTO versions VALUES(?,?,?,?,?,?,?,?,?,?)", uid(), id, version, key, file.name, mime, file.size, u.id, String(form.get("note") || "Initial registration"), date), audit(u.id, d ? "Uploaded document revision" : "Registered document", id, `${title} \xB7 version ${version}`)];
  if (d) statements.unshift(statement("UPDATE documents SET version=?,status='Draft',updated=? WHERE id=?", version, date, id));
  else statements.unshift(statement("INSERT INTO documents(id,ref,title,folder,owner,classification,created,updated,metadata) VALUES(?,?,?,?,?,?,?,?,?)", id, `NOC/${(/* @__PURE__ */ new Date()).getFullYear()}/${uid().slice(0, 8).toUpperCase()}`, title, folder, u.id, classification, date, date, JSON.stringify({ description: String(form.get("description") || ""), tags: String(form.get("tags") || "") })));
  try {
    await database().batch(statements);
  } catch (e) {
    await env.BUCKET.delete(key);
    throw e;
  }
  return Response.json({ ok: true, id });
}
export {
  all,
  identity,
  mutate,
  seedFolders,
  snapshot
};
