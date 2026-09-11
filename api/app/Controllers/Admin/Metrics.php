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
                ->select('COALESCE(c.name, "Organización / Colectivo") as corporate_name, COUNT(a.id) as total_activities, COALESCE(SUM(a.total_volunteers), 0) as total_volunteers')
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

            return $this->respond([
                'status' => 200,
                'data'   => [
                    'general'         => $general,
                    'top_corporates'  => $topCorporates,
                    'institutional'   => $topCorporates,
                    'locations'       => $locations,
                    'community_count' => 0,
                ]
            ]);
        } catch (\Throwable $e) {
            log_message('error', 'Metrics::index failed: {message}', ['message' => $e->getMessage()]);
            return $this->failServerError('Error interno al cargar métricas.');
        }
    }
}
