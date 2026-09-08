<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class CleanTestImpactData extends Migration
{
    public function up()
    {
        $db = \Config\Database::connect();
        $db->query('SET FOREIGN_KEY_CHECKS = 0');
        $db->query('TRUNCATE TABLE impact_registrations');
        $db->query('SET FOREIGN_KEY_CHECKS = 1');
    }

    public function down()
    {
        // No hay vuelta atrás para una limpieza de datos de prueba
    }
}
