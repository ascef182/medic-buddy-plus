
import { supabase } from "@/integrations/supabase/client";

// Function to check for missed medications and create alerts
export const checkMissedMedications = async () => {
  try {
    const now = new Date();
    
    // Get all medications that should have been taken
    const { data: medications, error: medError } = await supabase
      .from("patient_medications")
      .select(`
        id, 
        name, 
        patient_id, 
        times, 
        last_taken, 
        alert_threshold, 
        auto_alert_contact_id,
        patients(full_name)
      `)
      .not('auto_alert_contact_id', 'is', null);  // Only get medications with alert contacts set
    
    if (medError) throw medError;
    
    if (!medications || medications.length === 0) {
      return;
    }
    
    const missedMedications = [];
    
    // Check each medication
    for (const med of medications) {
      const lastTaken = med.last_taken ? new Date(med.last_taken) : null;
      const threshold = med.alert_threshold || 60; // Default 60 minutes
      
      // Check each medication time
      for (const timeStr of med.times) {
        const [hours, minutes] = timeStr.split(':').map(n => parseInt(n));
        const scheduledTime = new Date();
        scheduledTime.setHours(hours, minutes, 0, 0);
        
        // Calculate alert time (scheduled time + threshold minutes)
        const alertTime = new Date(scheduledTime);
        alertTime.setMinutes(alertTime.getMinutes() + threshold);
        
        // If current time is past alert time, and medication wasn't taken today or was taken before scheduled time
        if (now > alertTime && 
            (!lastTaken || 
             lastTaken.toDateString() !== now.toDateString() || 
             (lastTaken.toDateString() === now.toDateString() && lastTaken < scheduledTime))) {
          
          // Check if an alert has already been sent for this medication and time today
          const { data: existingAlerts, error: alertError } = await supabase
            .from("medication_alerts")
            .select("*")
            .eq("medication_id", med.id)
            .gte("alert_time", new Date(now.setHours(0, 0, 0, 0)).toISOString())
            .lte("alert_time", new Date(now.setHours(23, 59, 59, 999)).toISOString());
          
          if (alertError) throw alertError;
          
          // If no alert was sent today for this medication
          if (!existingAlerts || existingAlerts.length === 0) {
            // Create alert
            const { data: alert, error: createError } = await supabase
              .from("medication_alerts")
              .insert({
                medication_id: med.id,
                patient_id: med.patient_id,
                alert_time: now.toISOString(),
                alert_sent: true,
                alert_contact_id: med.auto_alert_contact_id
              })
              .select();
              
            if (createError) throw createError;
            
            missedMedications.push({
              medicationName: med.name,
              patientName: med.patients.full_name,
              alertId: alert?.[0]?.id,
              contactId: med.auto_alert_contact_id
            });
          }
        }
      }
    }
    
    // For each missed medication, get contact details and send notification
    // (In a real app, this would trigger email/SMS via edge function)
    for (const missed of missedMedications) {
      const { data: contact, error: contactError } = await supabase
        .from("patient_contacts")
        .select("name, email, phone")
        .eq("id", missed.contactId)
        .single();
        
      if (contactError) {
        console.error("Error getting contact:", contactError);
        continue;
      }
      
      if (contact) {
        console.log(`[ALERT] Would send notification to ${contact.name} (${contact.email || contact.phone}) about missed medication ${missed.medicationName} for patient ${missed.patientName}`);
        
        // In a real app, this would call an edge function to send email/SMS
        // For this demo, we'll just mark the alert as sent
        await supabase
          .from("medication_alerts")
          .update({ alert_sent: true })
          .eq("id", missed.alertId);
      }
    }
    
    return missedMedications;
    
  } catch (error) {
    console.error("Error checking for missed medications:", error);
    return [];
  }
};
