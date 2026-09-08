<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class AddAdminRoleAndSoftDeletes extends Migration
{
    public function up()
    {
        // 1. Añadir role_id y deleted_at a users
        $this->forge->addColumn('users', [
            'role_id' => [
                'type'       => 'INT',
                'constraint' => 11,
                'default'    => 2, // 1 = Admin, 2 = Voluntario regular
                'after'      => 'id',
            ],
            'deleted_at' => [
                'type' => 'DATETIME',
                'null' => true,
            ],
        ]);

        // 2. Añadir deleted_at a activities_catalog
        $this->forge->addColumn('activities_catalog', [
            'deleted_at' => [
                'type' => 'DATETIME',
                'null' => true,
            ],
        ]);

        // 3. Añadir deleted_at a impact_registrations
        $this->forge->addColumn('impact_registrations', [
            'deleted_at' => [
                'type' => 'DATETIME',
                'null' => true,
            ],
        ]);
    }

    public function down()
    {
        $this->forge->dropColumn('users', ['role_id', 'deleted_at']);
        $this->forge->dropColumn('activities_catalog', 'deleted_at');
        $this->forge->dropColumn('impact_registrations', 'deleted_at');
    }
}
