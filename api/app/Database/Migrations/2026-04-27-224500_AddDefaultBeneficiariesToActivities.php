<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class AddDefaultBeneficiariesToActivities extends Migration
{
    public function up()
    {
        $this->forge->addColumn('activities_catalog', [
            'default_beneficiaries' => [
                'type'       => 'INT',
                'constraint' => 11,
                'null'       => true,
                'default'    => 0,
            ],
        ]);
    }

    public function down()
    {
        $this->forge->dropColumn('activities_catalog', 'default_beneficiaries');
    }
}
