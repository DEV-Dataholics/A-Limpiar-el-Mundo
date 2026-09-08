<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class SeedInitialData extends Migration
{
    public function up()
    {
        $this->db->disableForeignKeyChecks();

        // 1. Seed Campaign
        $this->db->table('campaigns')->insert([
            'slug' => 'a-limpiar-el-mundo',
            'name' => 'A Limpiar el Mundo 2026',
            'start_date' => '2026-09-01',
            'end_date' => '2026-09-30',
            'is_registration_open' => 1,
            'type' => 'MASIVO',
            'created_at' => date('Y-m-d H:i:s')
        ]);
        $campaignId = $this->db->insertID();

        // 2. Seed Corporates
        $this->db->table('corporates')->insertBatch([
            [
                'name' => 'LEAR Corporation',
                'slug' => 'lear-corporation',
                'code' => 'LEAR',
                'created_at' => date('Y-m-d H:i:s')
            ],
            [
                'name' => 'APTIV',
                'slug' => 'aptiv',
                'code' => 'APTIV',
                'created_at' => date('Y-m-d H:i:s')
            ]
        ]);

        $learId = $this->db->table('corporates')->where('code', 'LEAR')->get()->getRow()->id;
        $aptivId = $this->db->table('corporates')->where('code', 'APTIV')->get()->getRow()->id;

        // 3. Seed Lear Divisions
        $this->db->table('corporate_divisions')->insertBatch([
            ['corporate_id' => $learId, 'name' => 'División Piel', 'code' => 'PIEL', 'created_at' => date('Y-m-d H:i:s')],
            ['corporate_id' => $learId, 'name' => 'División Asientos', 'code' => 'ASIENTOS', 'created_at' => date('Y-m-d H:i:s')]
        ]);
        
        $pielId = $this->db->table('corporate_divisions')->where('code', 'PIEL')->get()->getRow()->id;

        // 4. Seed Plants
        $this->db->table('corporate_plants')->insertBatch([
            ['corporate_id' => $learId, 'division_id' => $pielId, 'name' => 'Planta MTO', 'code' => 'MTO', 'created_at' => date('Y-m-d H:i:s')],
            ['corporate_id' => $learId, 'division_id' => $pielId, 'name' => 'Planta Torres', 'code' => 'TORRES', 'created_at' => date('Y-m-d H:i:s')],
            ['corporate_id' => $aptivId, 'division_id' => null, 'name' => 'Planta 1', 'code' => 'APTIV-1', 'created_at' => date('Y-m-d H:i:s')],
            ['corporate_id' => $aptivId, 'division_id' => null, 'name' => 'Planta 2', 'code' => 'APTIV-2', 'created_at' => date('Y-m-d H:i:s')]
        ]);

        $this->db->enableForeignKeyChecks();
    }

    public function down()
    {
        $this->db->table('corporate_plants')->truncate();
        $this->db->table('corporate_divisions')->truncate();
        $this->db->table('corporates')->truncate();
        $this->db->table('campaigns')->truncate();
    }
}
