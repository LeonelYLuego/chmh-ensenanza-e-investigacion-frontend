/** @type Incoming Student document types */
export type IncomingStudentDocumentTypes =
  | 'solicitudeDocument'
  | 'acceptanceDocument'
  | 'evaluationDocument';

/** @type Incoming Student document types array */
export const IncomingStudentDocumentTypesArray: {
  title: string;
  type: IncomingStudentDocumentTypes;
}[] = [
  { title: 'Solicitud', type: 'solicitudeDocument' },
  { title: 'Aceptación', type: 'acceptanceDocument' },
  { title: 'Evaluación', type: 'evaluationDocument' },
];
