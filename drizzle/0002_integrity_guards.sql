CREATE TRIGGER folders_insert_parent BEFORE INSERT ON folders WHEN NEW.parent IS NOT NULL AND NOT EXISTS(SELECT 1 FROM folders WHERE id=NEW.parent) BEGIN SELECT RAISE(ABORT, 'Parent folder does not exist'); END;
--> statement-breakpoint
CREATE TRIGGER folders_update_parent BEFORE UPDATE OF parent ON folders WHEN NEW.parent IS NOT NULL BEGIN SELECT RAISE(ABORT, 'Invalid folder hierarchy') WHERE NEW.parent=NEW.id OR NOT EXISTS(SELECT 1 FROM folders WHERE id=NEW.parent) OR EXISTS(WITH RECURSIVE descendants(id) AS (SELECT id FROM folders WHERE parent=NEW.id UNION SELECT f.id FROM folders f JOIN descendants d ON f.parent=d.id) SELECT 1 FROM descendants WHERE id=NEW.parent); END;
--> statement-breakpoint
CREATE TRIGGER protected_root_update BEFORE UPDATE ON folders WHEN OLD.protected=1 AND (NEW.parent IS NOT NULL OR NEW.archived=1 OR NEW.protected=0) BEGIN SELECT RAISE(ABORT, 'Core directory is protected'); END;
--> statement-breakpoint
CREATE TRIGGER folder_delete_guard BEFORE DELETE ON folders WHEN OLD.protected=1 OR EXISTS(SELECT 1 FROM folders WHERE parent=OLD.id) OR EXISTS(SELECT 1 FROM documents WHERE folder=OLD.id) BEGIN SELECT RAISE(ABORT, 'Folder contains preserved records or is protected'); END;
--> statement-breakpoint
CREATE TRIGGER document_insert_folder BEFORE INSERT ON documents WHEN NOT EXISTS(SELECT 1 FROM folders WHERE id=NEW.folder AND archived=0) BEGIN SELECT RAISE(ABORT, 'Active folder required'); END;
--> statement-breakpoint
CREATE TRIGGER document_update_folder BEFORE UPDATE OF folder ON documents WHEN NOT EXISTS(SELECT 1 FROM folders WHERE id=NEW.folder AND archived=0) BEGIN SELECT RAISE(ABORT, 'Active folder required'); END;
--> statement-breakpoint
CREATE TRIGGER version_insert_document BEFORE INSERT ON versions WHEN NOT EXISTS(SELECT 1 FROM documents WHERE id=NEW.document) BEGIN SELECT RAISE(ABORT, 'Document record required'); END;
--> statement-breakpoint
CREATE TRIGGER document_retention_guard BEFORE UPDATE OF deleted ON documents WHEN NEW.deleted=1 AND (OLD.hold=1 OR OLD.retain_until>date('now')) BEGIN SELECT RAISE(ABORT, 'Legal hold or retention prevents deletion'); END;
--> statement-breakpoint
CREATE TRIGGER preserve_document_history BEFORE DELETE ON documents BEGIN SELECT RAISE(ABORT, 'Use controlled soft deletion'); END;
--> statement-breakpoint
CREATE TRIGGER audit_append_only_update BEFORE UPDATE ON events BEGIN SELECT RAISE(ABORT, 'Audit records are immutable'); END;
--> statement-breakpoint
CREATE TRIGGER audit_append_only_delete BEFORE DELETE ON events BEGIN SELECT RAISE(ABORT, 'Audit records are immutable'); END;
