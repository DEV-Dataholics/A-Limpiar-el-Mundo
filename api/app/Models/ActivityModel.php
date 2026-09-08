<?php

namespace App\Models;

use CodeIgniter\Model;

class ActivityModel extends Model
{
    protected $table = 'activities';
    protected $primaryKey = 'id';
    protected $returnType = 'array';
    protected $useSoftDeletes = true;
    protected $allowedFields = [
        'campaign_id', 'corporate_id', 'plant_id', 'division_id', 'user_id', 
        'registration_date', 'total_volunteers', 'individual_hours_duration', 
        'accompanied_by_fuch', 'modality', 'status', 'evidence_image_url', 'description'
    ];
    protected $useTimestamps = true;
}
