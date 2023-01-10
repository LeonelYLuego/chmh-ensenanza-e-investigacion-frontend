export type IncomingStudentDocumentTypes =
  | 'solicitudeDocument'
  | 'acceptanceDocument'
  | 'evaluationDocument';

export const IncomingStudentDocumentTypesArray: {
  title: string;
  type: IncomingStudentDocumentTypes;
}[] = [
  { title: 'Solicitud', type: 'solicitudeDocument' },
  { title: 'Aceptación', type: 'acceptanceDocument' },
  { title: 'Evaluación', type: 'evaluationDocument' },
];
