<?php

namespace App\Controllers\Admin;

use CodeIgniter\RESTful\ResourceController;

class Metrics extends ResourceController
{
    public function index()
    {
        try {
            $db = \Config\Database::connect();
            $month = $this->request->getGet('month'); // e.g., '09' for September

            $builder = $db->table('activities')->where('deleted_at', null)->where('status', 'approved');
            if ($month) {
                $builder->where('MONTH(registration_date)', $month);
            }

            // General Metrics
            $totalVolunteers = $builder->selectSum('total_volunteers', 'value')->get()->getRow()->value ?? 0;

            // Re-instantiate builder for each count/sum since get() modifies it
            $builder = $db->table('activities')->where('deleted_at', null)->where('status', 'approved');
            if ($month) $builder->where('MONTH(registration_date)', $month);
            $totalActions = $builder->countAllResults();

            $builder = $db->table('activities')->where('deleted_at', null)->where('status', 'approved');
            if ($month) $builder->where('MONTH(registration_date)', $month);
            $hoursQuery = $builder->select('COALESCE(SUM(total_volunteers * individual_hours_duration), 0) AS value', false)->get()->getRow()->value ?? 0;

            $builder = $db->table('activities')->where('deleted_at', null)->where('status', 'pending');
            if ($month) $builder->where('MONTH(registration_date)', $month);
            $pendingApprovals = $builder->countAllResults();

            $general = [
                'total_volunteers'    => (int) $totalVolunteers,
                'total_actions'       => $totalActions,
                'total_registrations' => $totalActions,
                'total_hours'         => (float) $hoursQuery,
                'total_beneficiaries' => 0,
                'pending_approvals'   => $pendingApprovals,
            ];

            // Top 3 Corporativos por Actividades Registradas
            $builder = $db->table('activities a')
                ->select('
                    COALESCE(c.name, "Organización / Colectivo") as name,
                    COALESCE(c.name, "Organización / Colectivo") as corporate_name,
                    COUNT(a.id) as total_activities,
                    COUNT(a.id) as count,
                    COALESCE(SUM(a.total_volunteers), 0) as total_volunteers,
                    COALESCE(SUM(a.total_volunteers), 0) as volunteers,
                    COALESCE(SUM(a.total_volunteers * a.individual_hours_duration), 0) as hours,
                    COALESCE(SUM(a.total_volunteers * a.individual_hours_duration), 0) as total_hours
                ')
                ->join('corporates c', 'c.id = a.corporate_id', 'left')
                ->where('a.deleted_at', null)
                ->where('a.status', 'approved');
            if ($month) {
                $builder->where('MONTH(a.registration_date)', $month);
            }
            $topCorporates = $builder->groupBy(['a.corporate_id', 'c.name'])
                ->orderBy('total_activities', 'DESC')
                ->limit(3)
                ->get()
                ->getResultArray();

            // Institutional Activities (Causas Institucionales de activities_catalog)
            $instBuilder = $db->table('activities_catalog')
                ->where('type', 'institutional');
            if ($db->fieldExists('deleted_at', 'activities_catalog')) {
                $instBuilder->where('deleted_at', null);
            }
            $rawInstitutional = $instBuilder->get()->getResultArray();
            $institutional = [];

            foreach ($rawInstitutional as $cat) {
                $catId = (int) $cat['id'];
                $catName = $cat['name'];

                $volBuilder = $db->table('activities')
                    ->select('COALESCE(SUM(total_volunteers), 0) AS value')
                    ->where('deleted_at', null)
                    ->where('status', 'approved')
                    ->groupStart()
                        ->like('description', $catName)
                        ->orWhere('modality', 'Institucional')
                    ->groupEnd();
                if ($month) {
                    $volBuilder->where('MONTH(registration_date)', $month);
                }
                $currentRegs = (int) ($volBuilder->get()->getRow()->value ?? 0);

                $institutional[] = [
                    'id'                    => $catId,
                    'name'                  => $catName,
                    'description'           => $cat['description'] ?? '',
                    'min_capacity'          => (int) ($cat['min_capacity'] ?? 0),
                    'max_capacity'          => (int) ($cat['max_capacity'] ?? 100),
                    'current_registrations' => $currentRegs,
                    'event_date'            => $cat['event_date'] ?? '',
                    'status'                => $cat['status'] ?? 'published',
                ];
            }

            // Hierarchical Location/Plant Breakdown
            $builder = $db->table('activities a')
                ->select('cp.name as plant_name, cd.name as division_name, COUNT(a.id) as total_activities')
                ->join('corporate_plants cp', 'cp.id = a.plant_id', 'left')
                ->join('corporate_divisions cd', 'cd.id = a.division_id', 'left')
                ->where('a.deleted_at', null)
                ->where('a.status', 'approved');
            if ($month) {
                $builder->where('MONTH(a.registration_date)', $month);
            }
            $locations = $builder->groupBy(['a.plant_id', 'a.division_id'])
                ->orderBy('total_activities', 'DESC')
                ->get()
                ->getResultArray();

            $commBuilder = $db->table('activities_catalog')->where('type', 'community');
            if ($db->fieldExists('deleted_at', 'activities_catalog')) {
                $commBuilder->where('deleted_at', null);
            }
            $communityCount = $commBuilder->countAllResults();

            return $this->respond([
                'status' => 200,
                'data'   => [
                    'general'         => $general,
                    'top_corporates'  => $topCorporates,
                    'institutional'   => $institutional,
                    'locations'       => $locations,
                    'community_count' => $communityCount,
                ]
            ]);
        } catch (\Throwable $e) {
            log_message('error', 'Metrics::index failed: {message}', ['message' => $e->getMessage()]);
            return $this->failServerError('Error interno al cargar métricas.');
        }
    }
}
