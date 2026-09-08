<?php

namespace App\Models;

use CodeIgniter\Model;

class CampaignModel extends Model
{
    protected $table = 'campaigns';
    protected $primaryKey = 'id';
    protected $returnType = 'array';
    protected $useSoftDeletes = true;
    protected $allowedFields = [
        'slug', 'name', 'start_date', 'end_date', 'is_registration_open', 'type'
    ];
    protected $useTimestamps = true;
}
