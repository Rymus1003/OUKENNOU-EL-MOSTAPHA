
export interface Client {
  id: number;
  nom_complet: string;
  cin: string;
  telephone: string;
  adresse: string;
  email: string;
}

export interface Dossier {
  id: number;
  numero_mahakim: string;
  titre_affaire: string;
  partie_adverse: string;
  type_affaire: 'Civil' | 'Penal' | 'Commercial' | 'Famille' | 'Administratif';
  statut: 'En cours' | 'Jugé' | 'Archivé';
  client_id: number;
  tribunal: string;
  date_ouverture: string;
  juge: string;
  montant_total?: number;
  avance?: number;
  reste?: number;
}

export interface Audience {
  id: number;
  dossier_id: number;
  date_audience: string;
  salle: string;
  juge_audience: string;
  decision_intermediaire: string;
  notes_audience: string;
}
