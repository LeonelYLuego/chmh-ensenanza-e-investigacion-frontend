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