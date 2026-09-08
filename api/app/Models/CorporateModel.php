<?php

namespace App\Models;

use CodeIgniter\Model;

class CorporateModel extends Model
{
    protected $table = 'corporates';
    protected $primaryKey = 'id';
    protected $returnType = 'array';
    protected $useSoftDeletes = true;
    protected $allowedFields = [
        'name', 'slug', 'code', 'logo_url', 'total_headcount', 'is_active'
    ];
    protected $useTimestamps = true;
}
