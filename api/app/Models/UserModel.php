<?php

namespace App\Models;

use CodeIgniter\Model;

class UserModel extends Model
{
    protected $table            = 'users';
    protected $primaryKey       = 'id';
    protected $useAutoIncrement = true;
    protected $returnType       = 'array';
    protected $useSoftDeletes   = true;
    protected $protectFields    = true;
    protected $allowedFields    = ['role_id', 'name', 'last_name', 'age', 'email', 'phone', 'password', 'organization_name', 'state', 'municipality', 'plant_id', 'division_id'];

    protected bool $allowEmptyInserts = false;

    // Dates
    protected $useTimestamps = true;
    protected $dateFormat    = 'datetime';
    protected $createdField  = 'created_at';
    protected $updatedField  = 'updated_at'; // Ajustamos para mejor práctica
    protected $deletedField  = 'deleted_at';

    // Validation
    protected $validationRules      = [
        'name'  => 'required|max_length[150]',
        'email' => 'required|valid_email|is_unique[users.email]',
    ];
}
