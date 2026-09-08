<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class CreateImpactRegistrations extends Migration
{
    public function up()
    {
        $this->forge->addField([
            'id' => [
                'type'           => 'INT',
                'constraint'     => 11,
                'unsigned'       => true,
                'auto_increment' => true,
            ],
            'user_id' => [
                'type'           => 'INT',
                'constraint'     => 11,
                'unsigned'       => true,
            ],
            'activity_id' => [
                'type'           => 'INT',
                'constraint'     => 11,
                'unsigned'       => true,
            ],
            'scheduled_date' => [
                'type' => 'DATE',
                'null' => true,
            ],
            'execution_date' => [
                'type' => 'DATE',
                'null' => true,
            ],
            'volunteer_count' => [
                'type'       => 'INT',
                'constraint' => 11,
                'default'    => 1,
            ],
            'description' => [
                'type' => 'TEXT',
                'null' => true,
            ],
            'evidence_image_url' => [
                'type'       => 'VARCHAR',
                'constraint' => '255',
                'null'       => true,
            ],
            'legal_consent_accepted' => [
                'type'    => 'BOOLEAN',
                'default' => false,
            ],
            'status' => [
                'type'       => 'ENUM',
                'constraint' => ['pending', 'approved', 'cancelled'],
                'default'    => 'pending',
            ],
            'created_at' => [
                'type' => 'DATETIME',
                'null' => true,
            ],
            'updated_at' => [
                'type' => 'DATETIME',
                'null' => true,
            ],
        ]);
        $this->forge->addKey('id', true);
        $this->forge->addForeignKey('user_id', 'users', 'id', 'CASCADE', 'CASCADE');
        $this->forge->addForeignKey('activity_id', 'activities_catalog', 'id', 'CASCADE', 'CASCADE');
        $this->forge->createTable('impact_registrations');
    }

    public function down()
    {
        $this->forge->dropTable('impact_registrations');
    }
}
