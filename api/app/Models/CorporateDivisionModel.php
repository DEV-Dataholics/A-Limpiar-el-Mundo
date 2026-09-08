<?php

namespace App\Models;

use CodeIgniter\Model;

class CorporateDivisionModel extends Model
{
    protected $table = 'corporate_divisions';
    protected $primaryKey = 'id';
    protected $returnType = 'array';
    protected $allowedFields = [
        'corporate_id', 'name', 'code'
    ];
    protected $useTimestamps = true;
}
