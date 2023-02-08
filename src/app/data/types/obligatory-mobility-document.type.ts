/** @type Obligatory Mobility document types */
export type ObligatoryMobilityDocumentTypes =
  | 'presentationOfficeDocument'
  | 'evaluationDocument'
  | 'solicitudeDocument'
  | 'acceptanceDocument';

/** @type Obligatory Mobility document types array */
export const ObligatoryMobilityDocumentTypesArray: {
  title: string;
  type: ObligatoryMobilityDocumentTypes;
}[] = [
  { title: 'Oficio de Presentación', type: 'presentationOfficeDocument' },
  { title: 'Evaluación', type: 'evaluationDocument' },
  { title: 'Solicitud', type: 'solicitudeDocument' },
  { title: 'Aceptación', type: 'acceptanceDocument' },
];

/** Attachments Obligatory Mobility document types */
export type AttachmentsObligatoryMobilityDocumentTypes =
  | 'solicitudeDocument'
  | 'acceptanceDocument';

/** Attachments Obligatory Mobility document types array */
export const AttachmentsObligatoryMobilityDocumentTypesArray: {
  title: string;
  type: AttachmentsObligatoryMobilityDocumentTypes;
}[] = [
  { title: 'Solicitud', type: 'solicitudeDocument' },
  { title: 'Aceptación', type: 'acceptanceDocument' },
];
