<?php

namespace App\Models;

use CodeIgniter\Model;

class ImpactRegistrationModel extends Model
{
    protected $table            = 'impact_registrations';
    protected $primaryKey       = 'id';
    protected $useAutoIncrement = true;
    protected $returnType       = 'array';
    protected $useSoftDeletes   = true;
    protected $protectFields    = true;
    protected $allowedFields    = [
        'user_id', 
        'activity_id', 
        'scheduled_date', 
        'execution_date', 
        'volunteer_count', 
        'description', 
        'evidence_image_url', 
        'legal_consent_accepted', 
        'status',
        'custom_activity_name',
        'activity_type',
        'group_name',
        'location_name',
        'location_address',
        'duration_hours',
        'beneficiaries_count',
        'testimonials',
        'evidence_links',
        'admin_feedback' // Agregado para el flujo de administración
    ];

    protected bool $allowEmptyInserts = false;

    // Dates
    protected $useTimestamps = true;
    protected $dateFormat    = 'datetime';
    protected $createdField  = 'created_at';
    protected $updatedField  = 'updated_at';
    protected $deletedField  = 'deleted_at';

    // Validation
    protected $validationRules      = [
        'user_id' => 'required|is_natural_no_zero',
        'activity_id' => 'required|is_natural_no_zero',
        'status' => 'in_list[pending,approved,cancelled]'
    ];
}
