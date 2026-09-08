-- ============================================================
-- Somos Comunidad — Full Database Setup
-- 
-- INSTRUCTIONS:
--   1. In phpMyAdmin, click your somos_comunidad database
--      in the LEFT PANEL first (it may be named noodluis_SC
--      or noodluis_somos_comunidad — whatever you created in cPanel).
--      If it doesn't exist yet, go to Databases tab → Create it first.
--   2. Then click the SQL tab at the top.
--   3. Paste this entire script and click Go.
-- ============================================================

SET FOREIGN_KEY_CHECKS = 0;

-- ── CodeIgniter migrations tracking table ──────────────────
CREATE TABLE IF NOT EXISTS `migrations` (
  `id`        BIGINT(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  `version`   VARCHAR(255) NOT NULL,
  `class`     TEXT NOT NULL,
  `group`     VARCHAR(255) NOT NULL,
  `namespace` VARCHAR(255) NOT NULL,
  `time`      INT(11) NOT NULL,
  `batch`     INT(11) UNSIGNED NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ── users ──────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS `users` (
  `id`                INT(11) UNSIGNED NOT NULL AUTO_INCREMENT,
  `role_id`           INT(11) NOT NULL DEFAULT 2,
  `name`              VARCHAR(150) NOT NULL,
  `email`             VARCHAR(150) NOT NULL,
  `phone`             VARCHAR(20) DEFAULT NULL,
  `created_at`        DATETIME DEFAULT NULL,
  `updated_at`        DATETIME DEFAULT NULL,
  `last_name`         VARCHAR(100) DEFAULT NULL,
  `age`               INT(3) DEFAULT NULL,
  `password`          VARCHAR(255) DEFAULT NULL,
  `organization_name` VARCHAR(255) DEFAULT NULL,
  `state`             VARCHAR(100) DEFAULT NULL,
  `municipality`      VARCHAR(100) DEFAULT NULL,
  `deleted_at`        DATETIME DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ── activities_catalog ─────────────────────────────────────
CREATE TABLE IF NOT EXISTS `activities_catalog` (
  `id`                       INT(11) UNSIGNED NOT NULL AUTO_INCREMENT,
  `name`                     VARCHAR(200) NOT NULL,
  `min_capacity`             INT(11) DEFAULT NULL,
  `max_capacity`             INT(11) DEFAULT NULL,
  `is_open_mobilization`     TINYINT(1) NOT NULL DEFAULT 0,
  `requires_10_days_notice`  TINYINT(1) NOT NULL DEFAULT 0,
  `image_url`                VARCHAR(255) DEFAULT NULL,
  `long_description`         TEXT DEFAULT NULL,
  `created_at`               DATETIME DEFAULT NULL,
  `updated_at`               DATETIME DEFAULT NULL,
  `deleted_at`               DATETIME DEFAULT NULL,
  `description`              TEXT DEFAULT NULL,
  `type`                     VARCHAR(50) NOT NULL DEFAULT 'institutional',
  `event_date`               DATE DEFAULT NULL,
  `cancellation_days_before` INT(11) DEFAULT 10,
  `status`                   VARCHAR(50) NOT NULL DEFAULT 'active',
  `default_hours`            DECIMAL(5,2) DEFAULT 0.00,
  `default_beneficiaries`    INT(11) DEFAULT 0,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ── impact_registrations ───────────────────────────────────
CREATE TABLE IF NOT EXISTS `impact_registrations` (
  `id`                     INT(11) UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id`                INT(11) UNSIGNED NOT NULL,
  `activity_id`            INT(11) UNSIGNED NOT NULL,
  `scheduled_date`         DATE DEFAULT NULL,
  `execution_date`         DATE DEFAULT NULL,
  `volunteer_count`        INT(11) NOT NULL DEFAULT 1,
  `description`            TEXT DEFAULT NULL,
  `evidence_image_url`     VARCHAR(255) DEFAULT NULL,
  `legal_consent_accepted` TINYINT(1) NOT NULL DEFAULT 0,
  `status`                 ENUM('pending','approved','cancelled') NOT NULL DEFAULT 'pending',
  `created_at`             DATETIME DEFAULT NULL,
  `updated_at`             DATETIME DEFAULT NULL,
  `custom_activity_name`   VARCHAR(255) DEFAULT NULL,
  `activity_type`          VARCHAR(100) DEFAULT NULL,
  `group_name`             VARCHAR(255) DEFAULT NULL,
  `location_name`          VARCHAR(255) DEFAULT NULL,
  `location_address`       VARCHAR(255) DEFAULT NULL,
  `duration_hours`         DECIMAL(5,2) DEFAULT NULL,
  `beneficiaries_count`    INT(11) DEFAULT NULL,
  `testimonials`           TEXT DEFAULT NULL,
  `evidence_links`         TEXT DEFAULT NULL,
  `deleted_at`             DATETIME DEFAULT NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_ir_user`
    FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_ir_activity`
    FOREIGN KEY (`activity_id`) REFERENCES `activities_catalog` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ── Record all migrations as already applied (batch 1) ─────
INSERT INTO `migrations` (`version`, `class`, `group`, `namespace`, `time`, `batch`) VALUES
  ('2026-04-26-100001', 'App\\Database\\Migrations\\CreateUsers',                         'default', 'App', UNIX_TIMESTAMP(), 1),
  ('2026-04-26-100002', 'App\\Database\\Migrations\\CreateActivitiesCatalog',             'default', 'App', UNIX_TIMESTAMP(), 1),
  ('2026-04-26-100003', 'App\\Database\\Migrations\\CreateImpactRegistrations',           'default', 'App', UNIX_TIMESTAMP(), 1),
  ('2026-04-26-103300', 'App\\Database\\Migrations\\AddFineTuningFields',                 'default', 'App', UNIX_TIMESTAMP(), 1),
  ('2026-04-26-114800', 'App\\Database\\Migrations\\AddRobustFieldsToRegistrations',      'default', 'App', UNIX_TIMESTAMP(), 1),
  ('2026-04-27-142200', 'App\\Database\\Migrations\\AddProfileFieldsToUsers',             'default', 'App', UNIX_TIMESTAMP(), 1),
  ('2026-04-27-210700', 'App\\Database\\Migrations\\AddAdminRoleAndSoftDeletes',          'default', 'App', UNIX_TIMESTAMP(), 1),
  ('2026-04-27-211200', 'App\\Database\\Migrations\\AddMissingTimestamps',                'default', 'App', UNIX_TIMESTAMP(), 1),
  ('2026-04-27-213500', 'App\\Database\\Migrations\\AddActivityManagerFields',            'default', 'App', UNIX_TIMESTAMP(), 1),
  ('2026-04-27-214700', 'App\\Database\\Migrations\\AddDefaultHoursToActivities',         'default', 'App', UNIX_TIMESTAMP(), 1),
  ('2026-04-27-214900', 'App\\Database\\Migrations\\CleanTestImpactData',                 'default', 'App', UNIX_TIMESTAMP(), 1),
  ('2026-04-27-224500', 'App\\Database\\Migrations\\AddDefaultBeneficiariesToActivities', 'default', 'App', UNIX_TIMESTAMP(), 1);

SET FOREIGN_KEY_CHECKS = 1;

-- ── DONE ───────────────────────────────────────────────────
-- Tables created. Now visit:
--   https://somoscomunidad.dataholics.com.mx/api/public/admin_setup.php
-- to create the admin user (password: Admin1234!)
-- Then DELETE admin_setup.php and migrate_run.php immediately!
