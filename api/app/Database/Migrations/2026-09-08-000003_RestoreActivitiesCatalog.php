<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class RestoreActivitiesCatalog extends Migration
{
    public function up()
    {
        if (!$this->db->tableExists('activities_catalog')) {
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
                'description' => [
                    'type'       => 'VARCHAR',
                    'constraint' => '255',
                    'null'       => true,
                ],
                'long_description' => [
                    'type' => 'TEXT',
                    'null' => true,
                ],
                'type' => [
                    'type'       => 'ENUM',
                    'constraint' => ['institutional', 'community'],
                    'default'    => 'community',
                ],
                'image_url' => [
                    'type'       => 'VARCHAR',
                    'constraint' => '255',
                    'null'       => true,
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
                'event_date' => [
                    'type' => 'DATE',
                    'null' => true,
                ],
                'cancellation_days_before' => [
                    'type'       => 'INT',
                    'constraint' => 11,
                    'null'       => true,
                ],
                'status' => [
                    'type'       => 'ENUM',
                    'constraint' => ['draft', 'published', 'archived'],
                    'default'    => 'published',
                ],
                'default_hours' => [
                    'type'       => 'DECIMAL',
                    'constraint' => '5,2',
                    'null'       => true,
                ],
                'default_beneficiaries' => [
                    'type'       => 'INT',
                    'constraint' => 11,
                    'null'       => true,
                ],
                'is_open_mobilization' => [
                    'type'    => 'BOOLEAN',
                    'default' => false,
                ],
                'requires_10_days_notice' => [
                    'type'    => 'BOOLEAN',
                    'default' => false,
                ],
                'created_at' => [
                    'type' => 'DATETIME',
                    'null' => true,
                ],
                'updated_at' => [
                    'type' => 'DATETIME',
                    'null' => true,
                ],
                'deleted_at' => [
                    'type' => 'DATETIME',
                    'null' => true,
                ],
            ]);
            $this->forge->addKey('id', true);
            $this->forge->createTable('activities_catalog');

            // Sembrar causas iniciales alineadas a A Limpiar el Mundo 2026
            $this->db->table('activities_catalog')->insertBatch([
                [
                    'name' => 'Recuperación de Parques Públicos',
                    'description' => 'Limpieza, pintura y revitalización de áreas infantiles y canchas.',
                    'long_description' => 'Jornada comunitaria integral para revitalizar parques y áreas recreativas en colonias prioritarias.',
                    'type' => 'institutional',
                    'status' => 'published',
                    'min_capacity' => 10,
                    'max_capacity' => 100,
                    'default_hours' => 4.0,
                    'default_beneficiaries' => 250,
                    'image_url' => '/campana-07.jpg',
                    'created_at' => date('Y-m-d H:i:s'),
                    'updated_at' => date('Y-m-d H:i:s')
                ],
                [
                    'name' => 'Reforestación Urbana y Áreas Verdes',
                    'description' => 'Plantación de especies nativas adaptadas al clima de Chihuahua.',
                    'long_description' => 'Plantación y acondicionamiento de camellones, jardineras públicas y senderos con flora desértica.',
                    'type' => 'institutional',
                    'status' => 'published',
                    'min_capacity' => 5,
                    'max_capacity' => 60,
                    'default_hours' => 3.5,
                    'default_beneficiaries' => 500,
                    'image_url' => '/campana-04.jpg',
                    'created_at' => date('Y-m-d H:i:s'),
                    'updated_at' => date('Y-m-d H:i:s')
                ],
                [
                    'name' => 'Limpieza de Banquetas y Entornos Escolares',
                    'description' => 'Retiro de escombros, maleza y residuos en accesos a primarias y secundarias.',
                    'long_description' => 'Mejoramiento de banquetas y perímetros escolares para garantizar caminos seguros y limpios a los estudiantes.',
                    'type' => 'community',
                    'status' => 'published',
                    'min_capacity' => 5,
                    'max_capacity' => 40,
                    'default_hours' => 3.0,
                    'default_beneficiaries' => 350,
                    'image_url' => '/campana-08.jpg',
                    'created_at' => date('Y-m-d H:i:s'),
                    'updated_at' => date('Y-m-d H:i:s')
                ],
                [
                    'name' => 'Brigada de Separación y Reciclaje de Residuos',
                    'description' => 'Acopio y clasificación de PET, aluminio y cartón en centros comunitarios.',
                    'long_description' => 'Talleres prácticos y clasificación comunitaria de residuos para evitar focos de infección y promover economía circular.',
                    'type' => 'community',
                    'status' => 'published',
                    'min_capacity' => 5,
                    'max_capacity' => 50,
                    'default_hours' => 2.5,
                    'default_beneficiaries' => 150,
                    'image_url' => '/campana-14.jpg',
                    'created_at' => date('Y-m-d H:i:s'),
                    'updated_at' => date('Y-m-d H:i:s')
                ]
            ]);
        }
    }

    public function down()
    {
        $this->forge->dropTable('activities_catalog', true);
    }
}
