<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class AddActivityManagerFields extends Migration
{
    public function up()
    {
        $this->forge->addColumn('activities_catalog', [
            'description' => [
                'type' => 'TEXT',
                'null' => true,
            ],
            'type' => [
                'type'       => 'VARCHAR',
                'constraint' => 50,
                'default'    => 'institutional', // institutional, community
            ],
            'event_date' => [
                'type' => 'DATE',
                'null' => true,
            ],
            'cancellation_days_before' => [
                'type'       => 'INT',
                'constraint' => 11,
                'null'       => true,
                'default'    => 10,
            ],
            'status' => [
                'type'       => 'VARCHAR',
                'constraint' => 50,
                'default'    => 'active', // active, cancelled
            ],
        ]);
    }

    public function down()
    {
        $this->forge->dropColumn('activities_catalog', ['description', 'type', 'event_date', 'cancellation_days_before', 'status']);
    }
}
