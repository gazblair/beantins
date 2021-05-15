import { loadFeatures, autoBindSteps } from 'jest-cucumber';

import { signupMemberSteps } from './signup-member.steps';

const features = loadFeatures('**/*.feature');
autoBindSteps(features, [ signupMemberSteps ]);