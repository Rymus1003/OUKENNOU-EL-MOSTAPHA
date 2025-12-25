
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
  type_affaire: 'Civil' | 'Penal' | 'Commercial' | 'Famille' | 'Administratif';
  statut: 'En cours' | 'Jugé' | 'Archivé';
  client_id: number;
  tribunal: string;
  date_ouverture: string;
  juge: string;
}

export interface Audience {
  id: number;
  dossier_id: number;
  date_audience: string;
  salle: string;
  juge: string;
  notes: string;
}
