<?php

namespace App\Controllers\Admin;

use CodeIgniter\RESTful\ResourceController;

class Metrics extends ResourceController
{
    public function index()
    {
        try {
            $db = \Config\Database::connect();

            $hasRegDeletedAt = $db->fieldExists('deleted_at', 'impact_registrations');
            $hasActDeletedAt = $db->fieldExists('deleted_at', 'activities_catalog');
            $hasRegActivityType = $db->fieldExists('activity_type', 'impact_registrations');
            $hasRegDurationHours = $db->fieldExists('duration_hours', 'impact_registrations');
            $hasRegBeneficiaries = $db->fieldExists('beneficiaries_count', 'impact_registrations');
            $hasActDefaultBeneficiaries = $db->fieldExists('default_beneficiaries', 'activities_catalog');
            $hasUserMunicipality = $db->fieldExists('municipality', 'users');

            $institutionalBeneficiaries = 0;
            if ($hasActDefaultBeneficiaries) {
                $q = $db->table('activities_catalog')
                    ->select('SUM(default_beneficiaries) AS value')
                    ->where('type', 'institutional');
                if ($hasActDeletedAt) {
                    $q->where('deleted_at', null);
                }
                $institutionalBeneficiaries = (int) (($q->get()->getRow()->value ?? 0));
            }

            $communityBeneficiaries = 0;
            if ($hasRegBeneficiaries) {
                $q = $db->table('impact_registrations')
                    ->select('SUM(beneficiaries_count) AS value')
                    ->where('status', 'approved');
                if ($hasRegDeletedAt) {
                    $q->where('deleted_at', null);
                }
                $communityBeneficiaries = (int) (($q->get()->getRow()->value ?? 0));
            }

            $qVolunteers = $db->table('impact_registrations')
                ->select('SUM(volunteer_count) AS value')
                ->where('status', 'approved');
            if ($hasRegDeletedAt) {
                $qVolunteers->where('deleted_at', null);
            }
            $totalVolunteers = (int) (($qVolunteers->get()->getRow()->value ?? 0));

            $qRegistrations = $db->table('impact_registrations')->where('status', 'approved');
            if ($hasRegDeletedAt) {
                $qRegistrations->where('deleted_at', null);
            }
            $totalRegistrations = $qRegistrations->countAllResults();

            $qActions = $db->table('impact_registrations')->where('status', 'approved');
            if ($hasRegDeletedAt) {
                $qActions->where('deleted_at', null);
            }
            if ($hasRegActivityType) {
                $qActions->where('activity_type !=', 'Institucional');
            }
            $totalActions = $qActions->countAllResults();

            $totalHours = 0;
            if ($hasRegDurationHours) {
                $qHours = $db->table('impact_registrations')
                    ->select('SUM(duration_hours * volunteer_count) AS value')
                    ->where('status', 'approved');
                if ($hasRegDeletedAt) {
                    $qHours->where('deleted_at', null);
                }
                $totalHours = (float) (($qHours->get()->getRow()->value ?? 0));
            }

            $qPending = $db->table('impact_registrations')->where('status', 'pending');
            if ($hasRegDeletedAt) {
                $qPending->where('deleted_at', null);
            }
            $pendingApprovals = $qPending->countAllResults();

            $general = [
                'total_volunteers'    => $totalVolunteers,
                'total_registrations' => $totalRegistrations,
                'total_actions'       => $totalActions,
                'total_hours'         => $totalHours,
                'total_beneficiaries' => $institutionalBeneficiaries + $communityBeneficiaries,
                'pending_approvals'   => $pendingApprovals,
            ];

            $qInstitutional = $db->table('activities_catalog')->where('type', 'institutional');
            if ($hasActDeletedAt) {
                $qInstitutional->where('deleted_at', null);
            }
            $institutional = $qInstitutional->get()->getResultArray();

            foreach ($institutional as &$act) {
                $qActivityVol = $db->table('impact_registrations')
                    ->select('SUM(volunteer_count) AS value')
                    ->where('activity_id', $act['id']);
                if ($hasRegDeletedAt) {
                    $qActivityVol->where('deleted_at', null);
                }
                $act['current_registrations'] = (int) (($qActivityVol->get()->getRow()->value ?? 0));
            }
            unset($act);

            $locationColumn = $hasUserMunicipality ? 'users.municipality' : 'impact_registrations.location_name';
            $qLocations = $db->table('impact_registrations')
                ->select($locationColumn . ' AS municipality, COUNT(impact_registrations.id) AS count')
                ->join('users', 'users.id = impact_registrations.user_id', 'left');
            if ($hasRegDeletedAt) {
                $qLocations->where('impact_registrations.deleted_at', null);
            }
            if ($hasRegActivityType) {
                $qLocations->where('impact_registrations.activity_type !=', 'Institucional');
            }
            $locations = $qLocations
                ->groupBy($locationColumn)
                ->get()
                ->getResultArray();

            $qCommunity = $db->table('activities_catalog')->where('type', 'community');
            if ($hasActDeletedAt) {
                $qCommunity->where('deleted_at', null);
            }
            $communityCount = $qCommunity->countAllResults();

            return $this->respond([
                'status' => 200,
                'data'   => [
                    'general'         => $general,
                    'institutional'   => $institutional,
                    'locations'       => $locations,
                    'community_count' => $communityCount
                ]
            ]);
        } catch (\Throwable $e) {
            log_message('error', 'Metrics::index failed: {message}', ['message' => $e->getMessage()]);
            return $this->failServerError('Error interno al cargar métricas. Verifica esquema de base de datos y configuración.');
        }
    }
}
