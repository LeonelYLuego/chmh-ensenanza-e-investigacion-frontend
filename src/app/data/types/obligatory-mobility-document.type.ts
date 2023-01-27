export type ObligatoryMobilityDocumentTypes =
  | 'presentationOfficeDocument'
  | 'evaluationDocument';

export const ObligatoryMobilityDocumentTypesArray: {
  title: string;
  type: ObligatoryMobilityDocumentTypes;
}[] = [
  { title: 'Oficio de Presentación', type: 'presentationOfficeDocument' },
  { title: 'Evaluación', type: 'evaluationDocument' },
];

export type AttachmentsObligatoryMobilityDocumentTypes =
  | 'solicitudeDocument'
  | 'acceptanceDocument';

export const AttachmentsObligatoryMobilityDocumentTypesArray: {
  title: string;
  type: AttachmentsObligatoryMobilityDocumentTypes;
}[] = [
  { title: 'Solicitud', type: 'solicitudeDocument' },
  { title: 'Aceptación', type: 'acceptanceDocument' },
];
