<?php

namespace App\Database\Seeds;

use CodeIgniter\Database\Seeder;

class AdminSeeder extends Seeder
{
    public function run()
    {
        $users = [
            [
                'name'              => 'Administrador',
                'last_name'         => 'United Way',
                'email'             => 'admin@alimpiarelmundo.org.mx',
                'password'          => password_hash('Admin2026!', PASSWORD_BCRYPT),
                'role_id'           => 1, // 1 = Admin
                'state'             => 'Chihuahua',
                'municipality'      => 'Chihuahua',
                'organization_name' => 'United Way Chihuahua',
                'phone'             => '6141234567',
                'created_at'        => date('Y-m-d H:i:s'),
                'updated_at'        => date('Y-m-d H:i:s'),
            ],
            [
                'name'              => 'Voluntario',
                'last_name'         => 'Comunitario',
                'email'             => 'voluntario@alimpiarelmundo.org.mx',
                'password'          => password_hash('Voluntario2026!', PASSWORD_BCRYPT),
                'role_id'           => 2, // 2 = Voluntario
                'state'             => 'Chihuahua',
                'municipality'      => 'Chihuahua',
                'organization_name' => 'Comunidad Activa',
                'phone'             => '6149876543',
                'age'               => 28,
                'created_at'        => date('Y-m-d H:i:s'),
                'updated_at'        => date('Y-m-d H:i:s'),
            ]
        ];

        foreach ($users as $user) {
            $existing = $this->db->table('users')->where('email', $user['email'])->get()->getRow();
            if ($existing) {
                $this->db->table('users')->where('email', $user['email'])->update([
                    'password'   => $user['password'],
                    'role_id'    => $user['role_id'],
                    'updated_at' => date('Y-m-d H:i:s')
                ]);
            } else {
                $this->db->table('users')->insert($user);
            }
        }
    }
}
