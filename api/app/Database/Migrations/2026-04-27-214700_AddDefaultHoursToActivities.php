<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class AddDefaultHoursToActivities extends Migration
{
    public function up()
    {
        $this->forge->addColumn('activities_catalog', [
            'default_hours' => [
                'type'       => 'DECIMAL',
                'constraint' => '5,2',
                'null'       => true,
                'default'    => 0.00,
            ],
        ]);
    }

    public function down()
    {
        $this->forge->dropColumn('activities_catalog', 'default_hours');
    }
}
