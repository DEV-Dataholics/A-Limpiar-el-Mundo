<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class AddMissingTimestamps extends Migration
{
    public function up()
    {
        // 1. Añadir updated_at a users
        $this->forge->addColumn('users', [
            'updated_at' => [
                'type' => 'DATETIME',
                'null' => true,
                'after' => 'created_at',
            ],
        ]);

        // 2. Añadir created_at y updated_at a activities_catalog
        $this->forge->addColumn('activities_catalog', [
            'created_at' => [
                'type' => 'DATETIME',
                'null' => true,
            ],
            'updated_at' => [
                'type' => 'DATETIME',
                'null' => true,
            ],
        ]);
    }

    public function down()
    {
        $this->forge->dropColumn('users', 'updated_at');
        $this->forge->dropColumn('activities_catalog', ['created_at', 'updated_at']);
    }
}
