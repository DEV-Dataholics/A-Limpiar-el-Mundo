<?php

namespace App\Database\Seeds;

use CodeIgniter\Database\Seeder;

class CorporateCatalogSeeder extends Seeder
{
    public function run()
    {
        $this->db->disableForeignKeyChecks();

        // 1. Limpieza de tablas de estructura corporativa
        $this->db->table('corporate_plants')->truncate();
        $this->db->table('corporate_divisions')->truncate();
        $this->db->table('corporates')->truncate();

        $this->db->enableForeignKeyChecks();

        $now = date('Y-m-d H:i:s');

        // 2. Corporativos (Socios Donantes)
        $corporatesData = [
            ['name' => "3M EDUMEX", 'slug' => "3m-edumex", 'is_active' => 1, 'created_at' => $now, 'updated_at' => $now],
            ['name' => "ALIGNTECH DE MEXICO", 'slug' => "aligntech-de-mexico", 'is_active' => 1, 'created_at' => $now, 'updated_at' => $now],
            ['name' => "ANGSTROM", 'slug' => "angstrom", 'is_active' => 1, 'created_at' => $now, 'updated_at' => $now],
            ['name' => "APTIV", 'slug' => "aptiv", 'is_active' => 1, 'created_at' => $now, 'updated_at' => $now],
            ['name' => "ARNESES DE JRZ/MOTHERSON", 'slug' => "arneses-de-jrz-motherson", 'is_active' => 1, 'created_at' => $now, 'updated_at' => $now],
            ['name' => "AVERY", 'slug' => "avery", 'is_active' => 1, 'created_at' => $now, 'updated_at' => $now],
            ['name' => "BORGWARNER", 'slug' => "borgwarner", 'is_active' => 1, 'created_at' => $now, 'updated_at' => $now],
            ['name' => "BRASA", 'slug' => "brasa", 'is_active' => 1, 'created_at' => $now, 'updated_at' => $now],
            ['name' => "BWI", 'slug' => "bwi", 'is_active' => 1, 'created_at' => $now, 'updated_at' => $now],
            ['name' => "CARDINAL HEALTH", 'slug' => "cardinal-health", 'is_active' => 1, 'created_at' => $now, 'updated_at' => $now],
            ['name' => "CIA. MAD. CHIHUAHUA", 'slug' => "cia-mad-chihuahua", 'is_active' => 1, 'created_at' => $now, 'updated_at' => $now],
            ['name' => "COMMSCOPE", 'slug' => "commscope", 'is_active' => 1, 'created_at' => $now, 'updated_at' => $now],
            ['name' => "CONDUENT", 'slug' => "conduent", 'is_active' => 1, 'created_at' => $now, 'updated_at' => $now],
            ['name' => "COOPER LIGHTING", 'slug' => "cooper-lighting", 'is_active' => 1, 'created_at' => $now, 'updated_at' => $now],
            ['name' => "CUMMINS", 'slug' => "cummins", 'is_active' => 1, 'created_at' => $now, 'updated_at' => $now],
            ['name' => "EATON", 'slug' => "eaton", 'is_active' => 1, 'created_at' => $now, 'updated_at' => $now],
            ['name' => "EGAO", 'slug' => "egao", 'is_active' => 1, 'created_at' => $now, 'updated_at' => $now],
            ['name' => "ELECTROCOMPONENTES", 'slug' => "electrocomponentes", 'is_active' => 1, 'created_at' => $now, 'updated_at' => $now],
            ['name' => "ELECTROLUX", 'slug' => "electrolux", 'is_active' => 1, 'created_at' => $now, 'updated_at' => $now],
            ['name' => "FOXCONN", 'slug' => "foxconn", 'is_active' => 1, 'created_at' => $now, 'updated_at' => $now],
            ['name' => "GENPACT", 'slug' => "genpact", 'is_active' => 1, 'created_at' => $now, 'updated_at' => $now],
            ['name' => "HARMAN", 'slug' => "harman", 'is_active' => 1, 'created_at' => $now, 'updated_at' => $now],
            ['name' => "INTEVA", 'slug' => "inteva", 'is_active' => 1, 'created_at' => $now, 'updated_at' => $now],
            ['name' => "JOHNSON & JOHNSON", 'slug' => "johnson-johnson", 'is_active' => 1, 'created_at' => $now, 'updated_at' => $now],
            ['name' => "LEAR", 'slug' => "lear", 'is_active' => 1, 'created_at' => $now, 'updated_at' => $now],
            ['name' => "LEXMARK", 'slug' => "lexmark", 'is_active' => 1, 'created_at' => $now, 'updated_at' => $now],
            ['name' => "MAHLE", 'slug' => "mahle", 'is_active' => 1, 'created_at' => $now, 'updated_at' => $now],
            ['name' => "MAQUILADOS TECNICOS", 'slug' => "maquilados-tecnicos", 'is_active' => 1, 'created_at' => $now, 'updated_at' => $now],
            ['name' => "MERSEN", 'slug' => "mersen", 'is_active' => 1, 'created_at' => $now, 'updated_at' => $now],
            ['name' => "NOVAMEX", 'slug' => "novamex", 'is_active' => 1, 'created_at' => $now, 'updated_at' => $now],
            ['name' => "ONE MOBILITY", 'slug' => "one-mobility", 'is_active' => 1, 'created_at' => $now, 'updated_at' => $now],
            ['name' => "PANGEA", 'slug' => "pangea", 'is_active' => 1, 'created_at' => $now, 'updated_at' => $now],
            ['name' => "PHINIA", 'slug' => "phinia", 'is_active' => 1, 'created_at' => $now, 'updated_at' => $now],
            ['name' => "PRODUCTOS MARINE", 'slug' => "productos-marine", 'is_active' => 1, 'created_at' => $now, 'updated_at' => $now],
            ['name' => "RECKITT", 'slug' => "reckitt", 'is_active' => 1, 'created_at' => $now, 'updated_at' => $now],
            ['name' => "ROBERT BOSCH", 'slug' => "robert-bosch", 'is_active' => 1, 'created_at' => $now, 'updated_at' => $now],
            ['name' => "SMALLPARTS", 'slug' => "smallparts", 'is_active' => 1, 'created_at' => $now, 'updated_at' => $now],
            ['name' => "STEERINGMEX", 'slug' => "steeringmex", 'is_active' => 1, 'created_at' => $now, 'updated_at' => $now],
            ['name' => "TESORO MEXICO ARCO", 'slug' => "tesoro-mexico-arco", 'is_active' => 1, 'created_at' => $now, 'updated_at' => $now],
            ['name' => "TORO", 'slug' => "toro", 'is_active' => 1, 'created_at' => $now, 'updated_at' => $now],
            ['name' => "VERSIGENT", 'slug' => "versigent", 'is_active' => 1, 'created_at' => $now, 'updated_at' => $now],
            ['name' => "YAZAKI", 'slug' => "yazaki", 'is_active' => 1, 'created_at' => $now, 'updated_at' => $now],
        ];

        $this->db->table('corporates')->insertBatch($corporatesData);

        // Mapear IDs de Corporativos insertados
        $corpRows = $this->db->table('corporates')->get()->getResultArray();
        $corpMap = [];
        foreach ($corpRows as $row) {
            $corpMap[$row['name']] = (int) $row['id'];
        }

        // 3. Divisiones de LEAR Corporation (Excepción LEAR)
        $learId = $corpMap['LEAR'] ?? null;
        $divMap = [];
        if ($learId) {
            $divisionsData = [
                ['corporate_id' => $learId, 'name' => 'División MTO', 'code' => 'MTO', 'created_at' => $now, 'updated_at' => $now],
                ['corporate_id' => $learId, 'name' => 'División LDO (Leather)', 'code' => 'LDO', 'created_at' => $now, 'updated_at' => $now],
                ['corporate_id' => $learId, 'name' => 'División JIT (Asientos)', 'code' => 'JIT', 'created_at' => $now, 'updated_at' => $now],
                ['corporate_id' => $learId, 'name' => 'División E-Systems (Electrónica)', 'code' => 'ESYST', 'created_at' => $now, 'updated_at' => $now],
                ['corporate_id' => $learId, 'name' => 'División Estructuras', 'code' => 'METALS', 'created_at' => $now, 'updated_at' => $now],
                ['corporate_id' => $learId, 'name' => 'División HQ', 'code' => 'HQ', 'created_at' => $now, 'updated_at' => $now],
            ];
            $this->db->table('corporate_divisions')->insertBatch($divisionsData);

            $divRows = $this->db->table('corporate_divisions')->where('corporate_id', $learId)->get()->getResultArray();
            foreach ($divRows as $row) {
                $divMap[$row['name']] = (int) $row['id'];
            }
        }

        // 4. Plantas
        $rawPlants = [
            ['corp' => "3M EDUMEX", 'plant' => "EDUMEX", 'div' => null],
            ['corp' => "ALIGNTECH DE MEXICO", 'plant' => "ALIGN", 'div' => null],
            ['corp' => "ANGSTROM", 'plant' => "ANGSTROM", 'div' => null],
            ['corp' => "APTIV", 'plant' => "CENTEC JUAREZ (RBE I)", 'div' => null],
            ['corp' => "APTIV", 'plant' => "CENTEC I,II,III", 'div' => null],
            ['corp' => "APTIV", 'plant' => "APTIV REYNOSA", 'div' => null],
            ['corp' => "APTIV", 'plant' => "APTIV MATAMOROS", 'div' => null],
            ['corp' => "APTIV", 'plant' => "APTIV MONTERREY", 'div' => null],
            ['corp' => "ARNESES DE JRZ/MOTHERSON", 'plant' => "MOTHERSON", 'div' => null],
            ['corp' => "AVERY", 'plant' => "AVERY", 'div' => null],
            ['corp' => "BORGWARNER", 'plant' => "BORGWARNER TORREON", 'div' => null],
            ['corp' => "BRASA", 'plant' => "BRASA", 'div' => null],
            ['corp' => "BWI", 'plant' => "BWI", 'div' => null],
            ['corp' => "CARDINAL HEALTH", 'plant' => "CONVERTORS", 'div' => null],
            ['corp' => "CARDINAL HEALTH", 'plant' => "CIRPRO", 'div' => null],
            ['corp' => "CARDINAL HEALTH", 'plant' => "QUIROPRODUCTOS", 'div' => null],
            ['corp' => "CIA. MAD. CHIHUAHUA", 'plant' => "HAGALO", 'div' => null],
            ['corp' => "COMMSCOPE", 'plant' => "COMMSCOPE BERMUDEZ", 'div' => null],
            ['corp' => "COMMSCOPE", 'plant' => "COMMSCOPE PRADERA", 'div' => null],
            ['corp' => "COMMSCOPE", 'plant' => "COMMSCOPE DELICIAS", 'div' => null],
            ['corp' => "CONDUENT", 'plant' => "CONDUENT", 'div' => null],
            ['corp' => "COOPER LIGHTING", 'plant' => "COOPER LIGHTING", 'div' => null],
            ['corp' => "CUMMINS", 'plant' => "CUMMINS", 'div' => null],
            ['corp' => "EATON", 'plant' => "EATON TORRES", 'div' => null],
            ['corp' => "EATON", 'plant' => "EATON (OP. DE MAQUILA)", 'div' => null],
            ['corp' => "EGAO", 'plant' => "EC LEGAL", 'div' => null],
            ['corp' => "ELECTROCOMPONENTES", 'plant' => "ELECTROCOMPONENTES 1", 'div' => null],
            ['corp' => "ELECTROCOMPONENTES", 'plant' => "ELECTROCOMPONENTES 3 Y 7", 'div' => null],
            ['corp' => "ELECTROCOMPONENTES", 'plant' => "ELECTROCOMPONENTES 5", 'div' => null],
            ['corp' => "ELECTROCOMPONENTES", 'plant' => "ELECTROCOMPONENTES 8", 'div' => null],
            ['corp' => "ELECTROLUX", 'plant' => "ELECTROLUX", 'div' => null],
            ['corp' => "FOXCONN", 'plant' => "FOXCONN", 'div' => null],
            ['corp' => "GENPACT", 'plant' => "GENPACT", 'div' => null],
            ['corp' => "HARMAN", 'plant' => "HARMAN", 'div' => null],
            ['corp' => "HARMAN", 'plant' => "HARMAN TIJUANA", 'div' => null],
            ['corp' => "INTEVA", 'plant' => "INTEVA", 'div' => null],
            ['corp' => "JOHNSON & JOHNSON", 'plant' => "J&J ETHICON", 'div' => null],
            ['corp' => "JOHNSON & JOHNSON", 'plant' => "J&J CORDIS", 'div' => null],
            ['corp' => "JOHNSON & JOHNSON", 'plant' => "J&J HORIZONTES", 'div' => null],
            ['corp' => "LEAR", 'plant' => "LEAR MTO CENTRAL", 'div' => "División MTO"],
            ['corp' => "LEAR", 'plant' => "LEAR MTO FUENTES", 'div' => "División MTO"],
            ['corp' => "LEAR", 'plant' => "LEAR MTO LA CUESTA", 'div' => "División MTO"],
            ['corp' => "LEAR", 'plant' => "LEAR MTO LAMINADORA", 'div' => "División MTO"],
            ['corp' => "LEAR", 'plant' => "LEAR MTO ZARAGOZA", 'div' => "División MTO"],
            ['corp' => "LEAR", 'plant' => "LEAR MTO RIO BRAVO", 'div' => "División MTO"],
            ['corp' => "LEAR", 'plant' => "LEAR MTO SAN LORENZO", 'div' => "División MTO"],
            ['corp' => "LEAR", 'plant' => "LEAR LDO BERMUDEZ", 'div' => "División LDO (Leather)"],
            ['corp' => "LEAR", 'plant' => "LEAR LDO JARUDO", 'div' => "División LDO (Leather)"],
            ['corp' => "LEAR", 'plant' => "LEAR E SYST CENTRALES", 'div' => "División E-Systems (Electrónica)"],
            ['corp' => "LEAR", 'plant' => "LEAR E SYST MONARCA", 'div' => "División E-Systems (Electrónica)"],
            ['corp' => "LEAR", 'plant' => "LEAR E SYST TORRES", 'div' => "División E-Systems (Electrónica)"],
            ['corp' => "LEAR", 'plant' => "LEAR HQ", 'div' => "División HQ"],
            ['corp' => "LEAR", 'plant' => "LEAR E SYST NOVA-AMERICAS", 'div' => "División E-Systems (Electrónica)"],
            ['corp' => "LEAR", 'plant' => "LEAR APODACA", 'div' => "División E-Systems (Electrónica)"],
            ['corp' => "LEAR", 'plant' => "LEAR E SYST MATAMOROS I", 'div' => "División E-Systems (Electrónica)"],
            ['corp' => "LEAR", 'plant' => "LEAR E SYST MATAMOROS II", 'div' => "División E-Systems (Electrónica)"],
            ['corp' => "LEAR", 'plant' => "LEAR LDO LEON", 'div' => "División LDO (Leather)"],
            ['corp' => "LEAR", 'plant' => "LEAR ARTEAGA", 'div' => "División Estructuras"],
            ['corp' => "LEAR", 'plant' => "LEAR SALTILLO", 'div' => "División Estructuras"],
            ['corp' => "LEAR", 'plant' => "LEAR JIT HERMOSILLO I Y II", 'div' => "División JIT (Asientos)"],
            ['corp' => "LEAR", 'plant' => "LEAR JIT HUAMANTLA", 'div' => "División JIT (Asientos)"],
            ['corp' => "LEAR", 'plant' => "LEAR MTO PANZACOLA  II", 'div' => "División MTO"],
            ['corp' => "LEAR", 'plant' => "LEAR JIT PUEBLA", 'div' => "División JIT (Asientos)"],
            ['corp' => "LEAR", 'plant' => "LEAR JIT RAMOS ARIZPE II", 'div' => "División JIT (Asientos)"],
            ['corp' => "LEAR", 'plant' => "LEAR JIT SAN LUIS", 'div' => "División JIT (Asientos)"],
            ['corp' => "LEAR", 'plant' => "LEAR JIT SILAO", 'div' => "División JIT (Asientos)"],
            ['corp' => "LEAR", 'plant' => "LEAR JIT TOLUCA", 'div' => "División JIT (Asientos)"],
            ['corp' => "LEAR", 'plant' => "LEAR TLAHUAC", 'div' => "División Estructuras"],
            ['corp' => "LEAR", 'plant' => "LEAR MTO CASAS GRANDES I", 'div' => "División MTO"],
            ['corp' => "LEAR", 'plant' => "LEAR MTO CASAS GRANDES II", 'div' => "División MTO"],
            ['corp' => "LEAR", 'plant' => "LEAR MTO MEOQUI", 'div' => "División MTO"],
            ['corp' => "LEAR", 'plant' => "LEAR PIEDRAS NEGRAS I,II,III,IV", 'div' => "División Estructuras"],
            ['corp' => "LEAR", 'plant' => "LEAR MTO VILLA AHUMADA", 'div' => "División MTO"],
            ['corp' => "LEAR", 'plant' => "LEAR MTO ZACATECAS", 'div' => "División MTO"],
            ['corp' => "LEAR", 'plant' => "LEAR NAUCALPAN", 'div' => "División Estructuras"],
            ['corp' => "LEAR", 'plant' => "LEAR QUERETARO", 'div' => "División Estructuras"],
            ['corp' => "LEAR", 'plant' => "LEAR JIT AGUA PRIETA", 'div' => "División JIT (Asientos)"],
            ['corp' => "LEAR", 'plant' => "LEAR JIT REYNOSA", 'div' => "División JIT (Asientos)"],
            ['corp' => "LEXMARK", 'plant' => "LEXMARK", 'div' => null],
            ['corp' => "MAHLE", 'plant' => "MAHLE  COMPRESORES", 'div' => null],
            ['corp' => "MAHLE", 'plant' => "MAHLE BEHR", 'div' => null],
            ['corp' => "MAQUILADOS TECNICOS", 'plant' => "MAQUILADOS", 'div' => null],
            ['corp' => "MERSEN", 'plant' => "MERSEN", 'div' => null],
            ['corp' => "NOVAMEX", 'plant' => "NOVAMEX JRZ", 'div' => null],
            ['corp' => "NOVAMEX", 'plant' => "NOVAMEX MEXICALI", 'div' => null],
            ['corp' => "ONE MOBILITY", 'plant' => "ONE MOBILITY", 'div' => null],
            ['corp' => "PANGEA", 'plant' => "PANGEA NUEVO LAREDO", 'div' => null],
            ['corp' => "PHINIA", 'plant' => "PHINIA CHIHUAHUA", 'div' => null],
            ['corp' => "PHINIA", 'plant' => "PHINIA SEC", 'div' => null],
            ['corp' => "PHINIA", 'plant' => "PHINIA MTC", 'div' => null],
            ['corp' => "PRODUCTOS MARINE", 'plant' => "MERCURY", 'div' => null],
            ['corp' => "RECKITT", 'plant' => "RB DELICIAS", 'div' => null],
            ['corp' => "ROBERT BOSCH", 'plant' => "BOSCH JRZ I", 'div' => null],
            ['corp' => "ROBERT BOSCH", 'plant' => "BOSCH JRZ 2", 'div' => null],
            ['corp' => "SMALLPARTS", 'plant' => "SMALL PARTS", 'div' => null],
            ['corp' => "STEERINGMEX", 'plant' => "NEXTEER", 'div' => null],
            ['corp' => "TESORO MEXICO ARCO", 'plant' => "ARCO JUAREZ", 'div' => null],
            ['corp' => "TESORO MEXICO ARCO", 'plant' => "ARCO MOCHIS", 'div' => null],
            ['corp' => "TESORO MEXICO ARCO", 'plant' => "ARCO MEXICALI", 'div' => null],
            ['corp' => "TORO", 'plant' => "TORO", 'div' => null],
            ['corp' => "VERSIGENT", 'plant' => "VERSIGENT MTC", 'div' => null],
            ['corp' => "VERSIGENT", 'plant' => "VERSIGENT COMPLEJO (II, X)", 'div' => null],
            ['corp' => "VERSIGENT", 'plant' => "VERSIGENT IV", 'div' => null],
            ['corp' => "VERSIGENT", 'plant' => "VERSIGENT V", 'div' => null],
            ['corp' => "VERSIGENT", 'plant' => "VERSIGENT XXI", 'div' => null],
            ['corp' => "VERSIGENT", 'plant' => "VERSIGENT MEOQUI", 'div' => null],
            ['corp' => "VERSIGENT", 'plant' => "VERSIGENT MOCHIS", 'div' => null],
            ['corp' => "VERSIGENT", 'plant' => "VERSIGENT PARRAL", 'div' => null],
            ['corp' => "VERSIGENT", 'plant' => "VERSIGENT DURANGO I", 'div' => null],
            ['corp' => "VERSIGENT", 'plant' => "VERSIGENT DURANGO II", 'div' => null],
            ['corp' => "VERSIGENT", 'plant' => "VERSIGENT VICENTE GUERREO", 'div' => null],
            ['corp' => "VERSIGENT", 'plant' => "VERSIGENT GUAMUCHIL", 'div' => null],
            ['corp' => "VERSIGENT", 'plant' => "VERSIGENT FRONTERA", 'div' => null],
            ['corp' => "VERSIGENT", 'plant' => "VERSIGENT LINARES", 'div' => null],
            ['corp' => "VERSIGENT", 'plant' => "VERSIGENT NUEVO LAREDO III", 'div' => null],
            ['corp' => "VERSIGENT", 'plant' => "VERSIGENT NUEVO LAREDO CAB", 'div' => null],
            ['corp' => "YAZAKI", 'plant' => "YAZAKI ASCENSION", 'div' => null],
            ['corp' => "YAZAKI", 'plant' => "YAZAKI CASAS GRANDES", 'div' => null],
            ['corp' => "YAZAKI", 'plant' => "YAZAKI CANATLAN", 'div' => null],
            ['corp' => "YAZAKI", 'plant' => "YAZAKI EL SALTO", 'div' => null],
            ['corp' => "YAZAKI", 'plant' => "YAZAKI GUADALUPE VICTORIA", 'div' => null],
            ['corp' => "YAZAKI", 'plant' => "YAZAKI SAN FELIPE", 'div' => null],
            ['corp' => "YAZAKI", 'plant' => "YAZAKI NAVOJOA", 'div' => null],
            ['corp' => "YAZAKI", 'plant' => "YAZAKI NUEVO IDEAL", 'div' => null],
            ['corp' => "YAZAKI", 'plant' => "YAZAKI OBREGON", 'div' => null],
            ['corp' => "YAZAKI", 'plant' => "YAZAKI BUENAVENTURA", 'div' => null],
            ['corp' => "YAZAKI", 'plant' => "YAZAKI CHIHUAHUA", 'div' => null],
            ['corp' => "YAZAKI", 'plant' => "YAZAKI GOMEZ FARIAS", 'div' => null],
            ['corp' => "YAZAKI", 'plant' => "YAZAKI LAZARO CARDENAS", 'div' => null],
            ['corp' => "YAZAKI", 'plant' => "YAZAKI ZARAGOZA", 'div' => null],
            ['corp' => "YAZAKI", 'plant' => "YAZAKI LEON", 'div' => null],
            ['corp' => "YAZAKI", 'plant' => "YAZAKI COLIMA", 'div' => null],
            ['corp' => "YAZAKI", 'plant' => "YAZAKI BACUM", 'div' => null],
            ['corp' => "YAZAKI", 'plant' => "YAZAKI PEDSA I", 'div' => null],
            ['corp' => "YAZAKI", 'plant' => "YAZAKI PEDSA II", 'div' => null],
            ['corp' => "YAZAKI", 'plant' => "YAZAKI PEDSA III  / CENTRAL", 'div' => null],
            ['corp' => "YAZAKI", 'plant' => "YAZAKI PEDSA IV", 'div' => null],
            ['corp' => "YAZAKI", 'plant' => "YAZAKI PEDSA JDC", 'div' => null],
            ['corp' => "YAZAKI", 'plant' => "YAZAKI PEDSA V", 'div' => null],
            ['corp' => "YAZAKI", 'plant' => "YAZAKI PONCITALN", 'div' => null],
            ['corp' => "YAZAKI", 'plant' => "YAZAKI SAN LUIS RIO COLORADO", 'div' => null],
            ['corp' => "YAZAKI", 'plant' => "YAZAKI SILAO", 'div' => null],
            ['corp' => "YAZAKI", 'plant' => "YAZAKI TECOMAN", 'div' => null],
            ['corp' => "YAZAKI", 'plant' => "YAZAKI TLAJOMULCO", 'div' => null],
            ['corp' => "YAZAKI", 'plant' => "YAZAKI ARNECOM", 'div' => null],
            ['corp' => "YAZAKI", 'plant' => "YAZAKI TAPACHULA", 'div' => null],
        ];

        $plantsData = [];
        foreach ($rawPlants as $rp) {
            $cId = $corpMap[$rp['corp']] ?? null;
            if (!$cId) continue;

            $dId = null;
            if ($rp['div'] && isset($divMap[$rp['div']])) {
                $dId = $divMap[$rp['div']];
            }

            $plantsData[] = [
                'corporate_id' => $cId,
                'division_id'  => $dId,
                'name'         => $rp['plant'],
                'created_at'   => $now,
                'updated_at'   => $now,
            ];
        }

        if (!empty($plantsData)) {
            $chunks = array_chunk($plantsData, 50);
            foreach ($chunks as $chunk) {
                $this->db->table('corporate_plants')->insertBatch($chunk);
            }
        }

        echo "[OK] Seeder ejecutado: " . count($corporatesData) . " corporativos, " . count($divMap) . " divisiones y " . count($plantsData) . " plantas insertadas.\n";
    }
}
