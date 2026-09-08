<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class CreateActivitiesCatalog extends Migration
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
            'name' => [
                'type'       => 'VARCHAR',
                'constraint' => '200',
            ],
            'min_capacity' => [
                'type'       => 'INT',
                'constraint' => 11,
                'null'       => true,
            ],
            'max_capacity' => [
                'type'       => 'INT',
                'constraint' => 11,
                'null'       => true,
            ],
            'is_open_mobilization' => [
                'type'       => 'BOOLEAN',
                'default'    => false,
            ],
            'requires_10_days_notice' => [
                'type'       => 'BOOLEAN',
                'default'    => false,
            ],
        ]);
        $this->forge->addKey('id', true);
        $this->forge->createTable('activities_catalog');
    }

    public function down()
    {
        $this->forge->dropTable('activities_catalog');
    }
}
