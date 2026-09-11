import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

import { API_URL } from '../config';

export type FlowType = 'A' | 'B' | null;

export function useRegistrationForm() {
  const { token, user } = useAuth();
  const [flow, setFlow] = useState<FlowType>(null);
  const [legalConsent, setLegalConsent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // General fields (pre-filled if user is logged in)
  const [name, setName] = useState(user ? `${user.name} ${user.last_name}` : '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState('');

  // Flow A fields
  const [activityId, setActivityId] = useState('');
  const [scheduledDate, setScheduledDate] = useState('');
  const [volunteerCount, setVolunteerCount] = useState(1);

  // Flow B fields (extended)
  const [description, setDescription] = useState('');
  const [evidenceImage, setEvidenceImage] = useState<File | null>(null);
  const [customActivityName, setCustomActivityName] = useState('');
  const [activityType, setActivityType] = useState(user?.organization_name ? 'Corporativa' : 'Personal');
  const [groupName, setGroupName] = useState(user?.organization_name || '');
  const [locationName, setLocationName] = useState('');
  const [state, setState] = useState(user?.state || '');
  const [municipality, setMunicipality] = useState(user?.municipality || '');
  const [locationAddress, setLocationAddress] = useState('');
  const [durationHours, setDurationHours] = useState('');
  const [beneficiariesCount, setBeneficiariesCount] = useState('');
  const [testimonials, setTestimonials] = useState('');
  const [evidenceLinks, setEvidenceLinks] = useState('');

  const [accompaniedByFuch, setAccompaniedByFuch] = useState(false);
  const [corporateId, setCorporateId] = useState<number | null>(null);
  const [plantId, setPlantId] = useState<number | null>(null);
  const [divisionId, setDivisionId] = useState<number | null>(null);

  // Sincronizar si el usuario carga después
  useEffect(() => {
    if (user) {
      if (!name) setName(`${user.name} ${user.last_name}`);
      if (!email) setEmail(user.email);
      if (!phone && user.phone) setPhone(user.phone);
      if (!groupName && user.organization_name) {
        setGroupName(user.organization_name);
        // Si el usuario es corporativo, cambiamos el tipo por defecto a Corporativa
        if (activityType === 'Personal') setActivityType('Corporativa');
      }
      if (!state && user.state) setState(user.state);
      if (!municipality && user.municipality) setMunicipality(user.municipality);
    }
  }, [user]);


  const getMinDate = () => {
    const minDate = new Date();
    minDate.setDate(minDate.getDate() + 10);
    return minDate.toISOString().split('T')[0];
  };

  const canSubmit = () => {
    if (!legalConsent || !name || !email) return false;
    
    // Si es institucional, activityId es obligatorio, si no, customActivityName es obligatorio
    const hasNameOrId = activityType === 'Institucional' ? activityId !== '' : customActivityName !== '';

    // Validar restricción estricta de mes de septiembre
    const isSeptember = scheduledDate && scheduledDate.split('-')[1] === '09';

    return hasNameOrId && description && activityType && locationName && 
           isSeptember && volunteerCount > 0 && evidenceLinks;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validación de seguridad de fecha en septiembre
    if (!scheduledDate || scheduledDate.split('-')[1] !== '09') {
      setError('La actividad debe realizarse exclusivamente durante el mes de septiembre de 2026.');
      return;
    }

    if (!canSubmit()) return;

    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('email', email);
      formData.append('phone', phone);
      formData.append('legal_consent_accepted', '1');
      
      if (activityType === 'Institucional') {
        formData.append('activity_id', activityId);
        formData.append('custom_activity_name', ''); // Vacío porque usamos ID oficial
      } else {
        // Para actividades no institucionales, el backend resuelve una actividad abierta válida.
        formData.append('custom_activity_name', customActivityName);
      }
      
      formData.append('description', description);
      formData.append('scheduled_date', scheduledDate);
      formData.append('registration_date', scheduledDate);
      formData.append('volunteer_count', volunteerCount.toString());
      formData.append('total_volunteers', volunteerCount.toString());
      formData.append('activity_type', activityType);
      formData.append('modality', activityType);
      formData.append('group_name', groupName);
      formData.append('location_name', locationName);
      formData.append('location_address', `${municipality}, ${state}`);
      formData.append('duration_hours', durationHours);
      formData.append('individual_hours_duration', durationHours);
      formData.append('beneficiaries_count', beneficiariesCount);
      formData.append('testimonials', testimonials);
      formData.append('evidence_links', evidenceLinks);
      formData.append('accompanied_by_fuch', accompaniedByFuch ? '1' : '0');
      if (corporateId) formData.append('corporate_id', corporateId.toString());
      if (plantId) formData.append('plant_id', plantId.toString());
      if (divisionId) formData.append('division_id', divisionId.toString());
      
      const response = await fetch(`${API_URL}/api/registrations`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.messages?.error || 'Error al procesar la solicitud');
      }

      alert('¡Registro exitoso! Gracias por sumar a la comunidad.');
      
      // Reset state
      setFlow(null);
      setLegalConsent(false);
      setActivityId('');
      setScheduledDate('');
      setVolunteerCount(1);
      setDescription('');
      setCustomActivityName('');
      setGroupName('');
      setLocationName('');
      setLocationAddress('');
      setDurationHours('');
      setBeneficiariesCount('');
      setTestimonials('');
      setEvidenceLinks('');
      setAccompaniedByFuch(false);
      setCorporateId(null);
      setPlantId(null);
      setDivisionId(null);
      
    } catch (err: any) {
      setError(err.message || 'Error al procesar la solicitud');
    } finally {
      setLoading(false);
    }
  };

  return {
    flow, setFlow,
    legalConsent, setLegalConsent,
    loading, error,
    activityId, setActivityId,
    scheduledDate, setScheduledDate,
    volunteerCount, setVolunteerCount,
    description, setDescription,
    evidenceImage, setEvidenceImage,
    customActivityName, setCustomActivityName,
    activityType, setActivityType,
    groupName, setGroupName,
    locationName, setLocationName,
    state, setState,
    municipality, setMunicipality,
    locationAddress, setLocationAddress,
    durationHours, setDurationHours,
    beneficiariesCount, setBeneficiariesCount,
    testimonials, setTestimonials,
    evidenceLinks, setEvidenceLinks,
    name, setName,
    email, setEmail,
    phone, setPhone,
    accompaniedByFuch, setAccompaniedByFuch,
    corporateId, setCorporateId,
    plantId, setPlantId,
    divisionId, setDivisionId,
    getMinDate,
    canSubmit,
    handleSubmit
  };
}


