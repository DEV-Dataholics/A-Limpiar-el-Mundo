<?php

namespace App\Database\Seeds;

use CodeIgniter\Database\Seeder;

class AdminSeeder extends Seeder
{
    public function run()
    {
        $data = [
            'name'       => 'Administrador',
            'last_name'  => 'Sistema',
            'email'      => 'admin@somoscomunidad.org',
            'password'   => password_hash('Admin1234!', PASSWORD_DEFAULT),
            'role_id'    => 1, // 1 = Admin
            'created_at' => date('Y-m-d H:i:s'),
            'updated_at' => date('Y-m-d H:i:s'),
        ];

        // Verificar si ya existe para no duplicar
        $existing = $this->db->table('users')->where('email', 'admin@somoscomunidad.org')->get()->getRow();
        if (!$existing) {
            $this->db->table('users')->insert($data);
        }
    }
}
