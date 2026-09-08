<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class AddRobustFieldsToRegistrations extends Migration
{
    public function up()
    {
        $fields = [
            'custom_activity_name' => [
                'type' => 'VARCHAR',
                'constraint' => 255,
                'null' => true,
            ],
            'activity_type' => [
                'type' => 'VARCHAR',
                'constraint' => 100,
                'null' => true,
            ],
            'group_name' => [
                'type' => 'VARCHAR',
                'constraint' => 255,
                'null' => true,
            ],
            'location_name' => [
                'type' => 'VARCHAR',
                'constraint' => 255,
                'null' => true,
            ],
            'location_address' => [
                'type' => 'VARCHAR',
                'constraint' => 255,
                'null' => true,
            ],
            'duration_hours' => [
                'type' => 'DECIMAL',
                'constraint' => '5,2',
                'null' => true,
            ],
            'beneficiaries_count' => [
                'type' => 'INT',
                'constraint' => 11,
                'null' => true,
            ],
            'testimonials' => [
                'type' => 'TEXT',
                'null' => true,
            ],
            'evidence_links' => [
                'type' => 'TEXT',
                'null' => true,
            ],
        ];

        $this->forge->addColumn('impact_registrations', $fields);
    }

    public function down()
    {
        $this->forge->dropColumn('impact_registrations', [
            'custom_activity_name',
            'activity_type',
            'group_name',
            'location_name',
            'location_address',
            'duration_hours',
            'beneficiaries_count',
            'testimonials',
            'evidence_links'
        ]);
    }
}
