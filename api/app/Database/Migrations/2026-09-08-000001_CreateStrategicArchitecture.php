<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class CreateStrategicArchitecture extends Migration
{
    public function up()
    {
        $this->db->disableForeignKeyChecks();

        // 1. Drop Legacy Tables
        $this->forge->dropTable('impact_registrations', true);
        $this->forge->dropTable('activities_catalog', true);

        // 2. Campaigns
        $this->forge->addField([
            'id' => ['type' => 'INT', 'unsigned' => true, 'auto_increment' => true],
            'slug' => ['type' => 'VARCHAR', 'constraint' => '100', 'unique' => true],
            'name' => ['type' => 'VARCHAR', 'constraint' => '255'],
            'start_date' => ['type' => 'DATE', 'null' => true],
            'end_date' => ['type' => 'DATE', 'null' => true],
            'is_registration_open' => ['type' => 'TINYINT', 'constraint' => 1, 'default' => 0],
            'type' => ['type' => 'VARCHAR', 'constraint' => '50', 'default' => 'MASIVO'],
            'created_at' => ['type' => 'DATETIME', 'null' => true],
            'updated_at' => ['type' => 'DATETIME', 'null' => true],
            'deleted_at' => ['type' => 'DATETIME', 'null' => true],
        ]);
        $this->forge->addKey('id', true);
        $this->forge->createTable('campaigns');

        // 3. Corporates
        $this->forge->addField([
            'id' => ['type' => 'INT', 'unsigned' => true, 'auto_increment' => true],
            'name' => ['type' => 'VARCHAR', 'constraint' => '255'],
            'slug' => ['type' => 'VARCHAR', 'constraint' => '100', 'unique' => true],
            'code' => ['type' => 'VARCHAR', 'constraint' => '50', 'null' => true],
            'logo_url' => ['type' => 'VARCHAR', 'constraint' => '255', 'null' => true],
            'total_headcount' => ['type' => 'INT', 'default' => 0],
            'is_active' => ['type' => 'TINYINT', 'constraint' => 1, 'default' => 1],
            'created_at' => ['type' => 'DATETIME', 'null' => true],
            'updated_at' => ['type' => 'DATETIME', 'null' => true],
            'deleted_at' => ['type' => 'DATETIME', 'null' => true],
        ]);
        $this->forge->addKey('id', true);
        $this->forge->createTable('corporates');

        // 4. Corporate Divisions (Lear Exception)
        $this->forge->addField([
            'id' => ['type' => 'INT', 'unsigned' => true, 'auto_increment' => true],
            'corporate_id' => ['type' => 'INT', 'unsigned' => true],
            'name' => ['type' => 'VARCHAR', 'constraint' => '255'],
            'code' => ['type' => 'VARCHAR', 'constraint' => '50', 'null' => true],
            'created_at' => ['type' => 'DATETIME', 'null' => true],
            'updated_at' => ['type' => 'DATETIME', 'null' => true],
        ]);
        $this->forge->addKey('id', true);
        $this->forge->addForeignKey('corporate_id', 'corporates', 'id', 'CASCADE', 'CASCADE');
        $this->forge->createTable('corporate_divisions');

        // 5. Corporate Plants
        $this->forge->addField([
            'id' => ['type' => 'INT', 'unsigned' => true, 'auto_increment' => true],
            'corporate_id' => ['type' => 'INT', 'unsigned' => true],
            'division_id' => ['type' => 'INT', 'unsigned' => true, 'null' => true],
            'name' => ['type' => 'VARCHAR', 'constraint' => '255'],
            'code' => ['type' => 'VARCHAR', 'constraint' => '50', 'null' => true],
            'plant_headcount' => ['type' => 'INT', 'default' => 0],
            'location_name' => ['type' => 'VARCHAR', 'constraint' => '255', 'null' => true],
            'created_at' => ['type' => 'DATETIME', 'null' => true],
            'updated_at' => ['type' => 'DATETIME', 'null' => true],
        ]);
        $this->forge->addKey('id', true);
        $this->forge->addForeignKey('corporate_id', 'corporates', 'id', 'CASCADE', 'CASCADE');
        $this->forge->addForeignKey('division_id', 'corporate_divisions', 'id', 'CASCADE', 'CASCADE');
        $this->forge->createTable('corporate_plants');

        // 6. Add fields to users for profile editing
        $fields = [
            'plant_id' => ['type' => 'INT', 'unsigned' => true, 'null' => true, 'after' => 'municipality'],
            'division_id' => ['type' => 'INT', 'unsigned' => true, 'null' => true, 'after' => 'plant_id'],
        ];
        $this->forge->addColumn('users', $fields);
        // Note: For simplicity we aren't enforcing strict FK on users in codeigniter migration here to avoid issues if data exists, but we can.

        // 7. Activities (replaces impact_registrations)
        $this->forge->addField([
            'id' => ['type' => 'INT', 'unsigned' => true, 'auto_increment' => true],
            'campaign_id' => ['type' => 'INT', 'unsigned' => true],
            'corporate_id' => ['type' => 'INT', 'unsigned' => true],
            'plant_id' => ['type' => 'INT', 'unsigned' => true, 'null' => true],
            'division_id' => ['type' => 'INT', 'unsigned' => true, 'null' => true],
            'user_id' => ['type' => 'INT', 'unsigned' => true],
            'registration_date' => ['type' => 'DATE'],
            'total_volunteers' => ['type' => 'INT', 'default' => 1],
            'individual_hours_duration' => ['type' => 'DECIMAL', 'constraint' => '5,2', 'default' => 0],
            'accompanied_by_fuch' => ['type' => 'TINYINT', 'constraint' => 1, 'default' => 0],
            'modality' => ['type' => 'VARCHAR', 'constraint' => '50', 'default' => 'CORPORATIVA'],
            'status' => ['type' => 'ENUM', 'constraint' => ['pending', 'approved', 'cancelled'], 'default' => 'approved'],
            'evidence_image_url' => ['type' => 'VARCHAR', 'constraint' => '255', 'null' => true],
            'description' => ['type' => 'TEXT', 'null' => true],
            'created_at' => ['type' => 'DATETIME', 'null' => true],
            'updated_at' => ['type' => 'DATETIME', 'null' => true],
            'deleted_at' => ['type' => 'DATETIME', 'null' => true],
        ]);
        $this->forge->addKey('id', true);
        $this->forge->addForeignKey('campaign_id', 'campaigns', 'id', 'CASCADE', 'CASCADE');
        $this->forge->addForeignKey('corporate_id', 'corporates', 'id', 'CASCADE', 'CASCADE');
        $this->forge->addForeignKey('plant_id', 'corporate_plants', 'id', 'CASCADE', 'CASCADE');
        $this->forge->addForeignKey('division_id', 'corporate_divisions', 'id', 'CASCADE', 'CASCADE');
        $this->forge->addForeignKey('user_id', 'users', 'id', 'CASCADE', 'CASCADE');
        $this->forge->createTable('activities');

        $this->db->enableForeignKeyChecks();
    }

    public function down()
    {
        $this->db->disableForeignKeyChecks();
        $this->forge->dropTable('activities', true);
        $this->forge->dropColumn('users', 'plant_id');
        $this->forge->dropColumn('users', 'division_id');
        $this->forge->dropTable('corporate_plants', true);
        $this->forge->dropTable('corporate_divisions', true);
        $this->forge->dropTable('corporates', true);
        $this->forge->dropTable('campaigns', true);
        $this->db->enableForeignKeyChecks();
    }
}
