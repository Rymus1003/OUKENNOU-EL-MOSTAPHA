
export interface Client {
  id: number;
  nom_complet: string;
  cin: string;
  telephone: string;
  adresse: string;
  email: string;
}

export interface Procedure {
  id: number;
  dossier_id: number;
  type: string; // مثال: مقال موضوع، حجز تحفظي، أمر بالأداء
  date_debut: string;
  statut: 'جارية' | 'منتهية' | 'متوقفة';
  juge_rapporteur?: string;
  numero_ordre?: string; // الرقم الترتيبي في المحكمة
}

export interface Dossier {
  id: number;
  numero_mahakim: string;
  titre_affaire: string;
  partie_adverse: string;
  type_affaire: 'Civil' | 'Penal' | 'Commercial' | 'Famille' | 'Administratif' | 'Social';
  statut: 'En cours' | 'Jugé' | 'Archivé';
  client_id: number;
  tribunal: string;
  date_ouverture: string;
  procedures?: Procedure[];
  montant_total?: number;
  avance?: number;
  reste?: number;
}

export interface Audience {
  id: number;
  dossier_id: number;
  procedure_id?: number; // الجلسة مرتبطة بمسطرة معينة
  date_audience: string;
  salle: string;
  juge_audience: string;
  decision_intermediaire: string;
  notes_audience: string;
}
