<?php

namespace App\Models;

use CodeIgniter\Model;

class ActivityCatalogModel extends Model
{
    protected $table            = 'activities_catalog';
    protected $primaryKey       = 'id';
    protected $useAutoIncrement = true;
    protected $returnType       = 'array';
    protected $useSoftDeletes   = true;
    protected $protectFields    = true;
    protected $allowedFields    = ['name', 'min_capacity', 'max_capacity', 'is_open_mobilization', 'requires_10_days_notice', 'image_url', 'long_description', 'description', 'type', 'event_date', 'cancellation_days_before', 'status', 'default_hours', 'default_beneficiaries'];

    protected bool $allowEmptyInserts = false;

    // Dates
    protected $useTimestamps = true;
    protected $dateFormat    = 'datetime';
    protected $createdField  = 'created_at';
    protected $updatedField  = 'updated_at';
    protected $deletedField  = 'deleted_at';

    // Validation
    protected $validationRules      = [
        'name' => 'required|max_length[200]'
    ];
}
