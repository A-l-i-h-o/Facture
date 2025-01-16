import { Parent } from './Parent.model';
import { Enfant } from './Enfant.model';
import { Reduction } from './Reduction.model';

export interface Famille {
    listeParents: Parent[];
    listeEnfants: Enfant[];
    listeReductions: Reduction[];
}