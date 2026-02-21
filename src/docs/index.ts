import type { Doc } from '../types';
import { intro } from './intro';
import { customElementsDoc } from './custom-elements';
import { shadowDom } from './shadow-dom';
import { templates } from './templates';
import { lifecycle } from './lifecycle';
import { bestPractices } from './best-practices';

export const docs: Doc[] = [
  intro,
  customElementsDoc,
  shadowDom,
  templates,
  lifecycle,
  bestPractices,
];
