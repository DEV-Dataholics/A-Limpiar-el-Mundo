<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class AddFineTuningFields extends Migration
{
    public function up()
    {
        // Añadir campos a la tabla users
        $this->forge->addColumn('users', [
            'last_name' => [
                'type'       => 'VARCHAR',
                'constraint' => 100,
                'null'       => true,
            ],
            'age' => [
                'type'       => 'INT',
                'constraint' => 3,
                'null'       => true,
            ],
            'password' => [
                'type'       => 'VARCHAR',
                'constraint' => 255,
                'null'       => true, // Permitimos null por compatibilidad con los que ya existan sin clave
            ],
        ]);

        // Añadir campos a activities_catalog
        $this->forge->addColumn('activities_catalog', [
            'image_url' => [
                'type'       => 'VARCHAR',
                'constraint' => 255,
                'null'       => true,
            ],
            'long_description' => [
                'type'       => 'TEXT',
                'null'       => true,
            ],
        ]);
    }

    public function down()
    {
        $this->forge->dropColumn('users', 'last_name');
        $this->forge->dropColumn('users', 'age');
        $this->forge->dropColumn('users', 'password');
        
        $this->forge->dropColumn('activities_catalog', 'image_url');
        $this->forge->dropColumn('activities_catalog', 'long_description');
    }
}
