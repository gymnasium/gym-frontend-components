import { defineMessages } from '@edx/frontend-platform/i18n';

const messages = defineMessages({
  toAccess: {
    id: 'alert.enroll',
    defaultMessage: ' to access the full course.',
    description: 'Text instructing the learner to enroll in the course in order to see course content. The full string'
      + 'would say "Enroll now to access the full course", where "Enroll now" is a button.',
  },
  toAccessAlt: {
    id: 'alert.enroll',
    defaultMessage: 'To start the course, please complete your enrollment.',
    description: 'Text instructing the learner to enroll in the course in order to see course content. The full string would be followed by a button on the following line.',
  }
});

export default messages;
