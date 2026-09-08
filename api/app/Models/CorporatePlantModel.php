<?php

namespace App\Models;

use CodeIgniter\Model;

class CorporatePlantModel extends Model
{
    protected $table = 'corporate_plants';
    protected $primaryKey = 'id';
    protected $returnType = 'array';
    protected $allowedFields = [
        'corporate_id', 'division_id', 'name', 'code', 'plant_headcount', 'location_name'
    ];
    protected $useTimestamps = true;
}
